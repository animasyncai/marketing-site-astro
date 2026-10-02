/**
 * Waitlist sign-up: POST /api/signup { email }
 *
 * Adds the address to the Mailjet waitlist (MAILJET_LIST_ID) and asks the api to send the confirmation e-mail.
 * Contract: same-origin JSON only (403 FORBIDDEN_ORIGIN / 415 UNSUPPORTED_MEDIA_TYPE); every syntactically valid,
 * non-disposable address gets the same `200 {"success":true}` whether it was added now, was already listed or had
 * unsubscribed; failures answer `{"success":false,"error":"<CODE>"}` and the form maps the code to its own language.
 */

// Ensure this route is not prerendered
export const prerender = false

import type { APIRoute } from 'astro'
import Mailjet from 'node-mailjet'
import {
  MAILJET_API_KEY,
  MAILJET_API_SECRET,
  MAILJET_LIST_ID,
  WAITLIST_WEBHOOK_TOKEN,
  WAITLIST_WEBHOOK_URL,
} from 'astro:env/server'
import { allowedOriginOf } from '../../lib/origin'

// Best-effort rate limit: in-memory, per server instance (empty after a cold start, not shared between instances).
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5 // Max 5 signups per IP per window

function isJsonRequest(request: Request): boolean {
  const mediaType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase()
  return mediaType === 'application/json'
}

function jsonResponse(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new rate limit entry
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return { allowed: true }
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      resetTime: userLimit.resetTime,
    }
  }

  // Increment count
  userLimit.count++
  return { allowed: true }
}

const MAILJET_TIMEOUT_MS = 5000
const WEBHOOK_TIMEOUT_MS = 4000
const RETRY_AFTER_SECONDS = '30'

// Mailjet's messages quote the address (e.g. MJ18); logs get e-mail-shaped text replaced.
function redactEmails(text: string): string {
  return text.replace(/[^\s"'<>@]+@[^\s"'<>@]+/g, '<email>')
}

// Ask the api to send the waitlist confirmation e-mail. Awaited, because a Vercel function may be frozen once it has
// responded, but bounded. A failure never fails the sign-up (the person is listed); it is logged with a stable marker
// and without the address.
async function callWaitlistConfirmationWebhook(email: string): Promise<void> {
  try {
    const response = await fetch(WAITLIST_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WAITLIST_WEBHOOK_TOKEN}`,
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    })
    void response.body?.cancel().catch(() => {})
    if (!response.ok) {
      console.error(`[waitlist-webhook] failed status=${response.status}`)
    }
  } catch (error) {
    const name = (error as { name?: unknown } | null)?.name
    console.error(
      `[waitlist-webhook] failed status=${name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'error'}`,
    )
  }
}

type ListOutcome = 'added' | 'already_listed' | 'unsubscribed'

type MailjetFailure = {
  statusCode?: unknown
  code?: unknown
  ErrorIdentifier?: unknown
  ErrorMessage?: unknown
  originalMessage?: unknown
}

const statusCodeOf = (error: unknown): number | null => {
  const statusCode = (error as MailjetFailure | null)?.statusCode
  return typeof statusCode === 'number' ? statusCode : null
}

const isTrue = (value: unknown): boolean => value === true || value === 'true'

// The address as a Mailjet path segment: percent-encoded, so '#', '?' or '/' in an address cannot reach another
// resource; '@' stays literal, as Mailjet documents it (GET /contact/{ID or email}/getcontactslists).
const contactPathId = (email: string): string => encodeURIComponent(email).replace(/%40/g, '@')

// Put the address on the waitlist. Membership is read from the list itself, never inferred from the contact existing
// in the account: that contact store is shared with the api's transactional contacts.
async function ensureOnList(email: string): Promise<ListOutcome> {
  const listId = MAILJET_LIST_ID
  const mailjet = new Mailjet({
    apiKey: MAILJET_API_KEY,
    apiSecret: MAILJET_API_SECRET,
    options: { timeout: MAILJET_TIMEOUT_MS },
  })

  // 1. Is the address on the list? 404 = Mailjet does not know the contact, so it is not listed.
  let lists: Array<{ ListID?: unknown; IsUnsub?: unknown }> = []
  try {
    const response = await mailjet
      .get('contact', { version: 'v3' })
      .id(contactPathId(email))
      .action('getcontactslists')
      .request()
    const data = (response.body as { Data?: unknown } | undefined)?.Data
    lists = Array.isArray(data) ? data : []
  } catch (error) {
    if (statusCodeOf(error) !== 404) throw error
  }
  const membership = lists.find((entry) => String(entry?.ListID) === String(listId))
  if (membership) {
    // Someone who unsubscribed stays unsubscribed: no re-add and no mail (decision D29).
    return isTrue(membership.IsUnsub) ? 'unsubscribed' : 'already_listed'
  }

  // 2. Add. managecontact creates the contact when needed and is idempotent; addnoforce never re-subscribes.
  await mailjet
    .post('contactslist', { version: 'v3' })
    .id(listId)
    .action('managecontact')
    .request({ Email: email, Action: 'addnoforce' })
  return 'added'
}

// Map a Mailjet failure on its status or transport code only (the message text quotes the address).
function mailjetFailureResponse(error: unknown): Response {
  const failure = (error ?? {}) as MailjetFailure
  const statusCode = statusCodeOf(error)
  const code = typeof failure.code === 'string' ? failure.code : null
  console.error('[mailjet] list check/add failed', {
    status: statusCode ?? code ?? 'unknown',
    errorIdentifier: typeof failure.ErrorIdentifier === 'string' ? failure.ErrorIdentifier : undefined,
    errorMessage: redactEmails(String(failure.ErrorMessage ?? failure.originalMessage ?? '')),
  })
  if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
    return jsonResponse(503, { success: false, error: 'EMAIL_SERVICE_TIMEOUT' }, { 'Retry-After': RETRY_AFTER_SECONDS })
  }
  if (statusCode === 400) {
    return jsonResponse(400, { success: false, error: 'INVALID_EMAIL' })
  }
  return jsonResponse(502, { success: false, error: 'EMAIL_SERVICE_ERROR' })
}

const DISPOSABLE_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'getnada.com',
  'maildrop.cc',
  'yopmail.com',
  'trashmail.com',
]

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const startTime = Date.now()

  // Same-origin JSON only, checked before anything else (no rate-limit budget, no Mailjet call, no webhook).
  // There is deliberately no CORS: no OPTIONS handler and no Access-Control-Allow-* header on any response.
  if (allowedOriginOf(request) === null) {
    return jsonResponse(403, { success: false, error: 'FORBIDDEN_ORIGIN' })
  }
  if (!isJsonRequest(request)) {
    return jsonResponse(415, { success: false, error: 'UNSUPPORTED_MEDIA_TYPE' })
  }

  try {
    // Get client IP for rate limiting. It is used only in memory: the log lines below carry outcome codes and
    // timings, never the visitor's IP or address (the privacy notice says so).
    const clientIP =
      clientAddress ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Check rate limit
    const rateCheck = checkRateLimit(clientIP)
    if (!rateCheck.allowed) {
      console.log('[signup] outcome=rate_limited')

      const retryAfter = Math.ceil((rateCheck.resetTime! - Date.now()) / 1000)

      return jsonResponse(
        429,
        { success: false, error: 'RATE_LIMIT_EXCEEDED' },
        { 'Retry-After': retryAfter.toString() },
      )
    }

    // Parse the body. The parser's error text quotes the input, so it is not logged.
    let body: unknown
    try {
      body = JSON.parse(await request.text())
    } catch {
      console.warn('[signup] invalid JSON body')
      return jsonResponse(400, { success: false, error: 'INVALID_JSON' })
    }
    if (!body || typeof body !== 'object') {
      return jsonResponse(400, { success: false, error: 'INVALID_JSON' })
    }

    const { email } = body as { email?: unknown }

    if (!email || typeof email !== 'string') {
      return jsonResponse(400, { success: false, error: 'MISSING_EMAIL' })
    }

    const trimmedEmail = email.trim().toLowerCase()

    if (!isValidEmail(trimmedEmail)) {
      return jsonResponse(400, { success: false, error: 'INVALID_EMAIL' })
    }

    const emailDomain = trimmedEmail.split('@')[1]?.toLowerCase()
    if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
      return jsonResponse(400, { success: false, error: 'DISPOSABLE_EMAIL' })
    }

    let outcome: ListOutcome
    try {
      outcome = await ensureOnList(trimmedEmail)
    } catch (error) {
      return mailjetFailureResponse(error)
    }

    // The confirmation e-mail goes to an address this request put on the list.
    if (outcome === 'added') {
      await callWaitlistConfirmationWebhook(trimmedEmail)
    }

    console.log(`Signup processed in ${Date.now() - startTime}ms - outcome=${outcome}`)

    // One answer for every valid address — added now, already listed or unsubscribed — so the endpoint says nothing
    // about who is on the list or in the Mailjet account.
    return jsonResponse(200, { success: true })
  } catch (error) {
    const failure = error as { name?: unknown; message?: unknown } | null
    console.error(`[signup] unexpected error after ${Date.now() - startTime}ms`, {
      name: String(failure?.name ?? 'unknown'),
      message: redactEmails(String(failure?.message ?? '')),
    })
    return jsonResponse(500, { success: false, error: 'INTERNAL_ERROR' })
  }
}

// Handle other HTTP methods
export const GET: APIRoute = async () => {
  return jsonResponse(405, { success: false, error: 'METHOD_NOT_ALLOWED' })
}
