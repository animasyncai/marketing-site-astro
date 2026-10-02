/**
 * Waitlist sign-up: POST /api/signup { email, locale?, website? }
 *
 * Double opt-in: the request only mails a confirmation link to the address; the address joins the Mailjet list when
 * its owner follows that link (/waitlist/confirm). The endpoint never reads or writes the list, so every valid
 * address costs the same single email and gets the same `200 {"success":true}` — whether it is new, already listed or
 * unsubscribed (uniform on purpose: the answer must not say who is on the list).
 * Contract: same-origin JSON only (403 FORBIDDEN_ORIGIN / 415 UNSUPPORTED_MEDIA_TYPE); failures answer
 * `{"success":false,"error":"<CODE>"}` and the form maps the code to its own language.
 */
export const prerender = false

import type { APIRoute } from 'astro'
import { normalizeEmail } from '../../lib/email-address'
import { confirmationEmail } from '../../lib/emails'
import { classifyMailjetFailure, redactEmails, sendEmail } from '../../lib/mailjet'
import { allowedOriginOf } from '../../lib/origin'
import { allowMailTo, isDisposable, isHoneypotFilled, perIp } from '../../lib/waitlist-guards'
import { mintToken, type Locale } from '../../lib/waitlist-token'

const MAX_BODY_BYTES = 4 * 1024
const RETRY_AFTER_SECONDS = '30'

function jsonResponse(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })
}
const accepted = () => jsonResponse(200, { success: true })

function isJsonRequest(request: Request): boolean {
  const mediaType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase()
  return mediaType === 'application/json'
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const startTime = Date.now()

  // Same-origin JSON only, checked before anything else. There is deliberately no CORS.
  const origin = allowedOriginOf(request)
  if (origin === null) return jsonResponse(403, { success: false, error: 'FORBIDDEN_ORIGIN' })
  if (!isJsonRequest(request)) return jsonResponse(415, { success: false, error: 'UNSUPPORTED_MEDIA_TYPE' })

  try {
    // The IP is used only in memory for the limit; no log line carries it or the address.
    const ipCheck = perIp(clientAddress || 'unknown')
    if (!ipCheck.allowed) {
      console.log('[signup] outcome=rate_limited')
      return jsonResponse(429, { success: false, error: 'RATE_LIMIT_EXCEEDED' }, { 'Retry-After': String(ipCheck.retryAfterSeconds) })
    }

    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) return jsonResponse(413, { success: false, error: 'INVALID_JSON' })
    let body: unknown
    try {
      body = JSON.parse(raw) // the parser's error text quotes the input, so it is not logged
    } catch {
      return jsonResponse(400, { success: false, error: 'INVALID_JSON' })
    }
    if (!body || typeof body !== 'object') return jsonResponse(400, { success: false, error: 'INVALID_JSON' })
    const { email: rawEmail, locale: rawLocale, website } = body as { email?: unknown; locale?: unknown; website?: unknown }

    if (!rawEmail || typeof rawEmail !== 'string') return jsonResponse(400, { success: false, error: 'MISSING_EMAIL' })
    const email = normalizeEmail(rawEmail)
    if (!email) return jsonResponse(400, { success: false, error: 'INVALID_EMAIL' })
    if (isDisposable(email)) {
      return jsonResponse(400, { success: false, error: 'DISPOSABLE_EMAIL' })
    }

    // Only a bot fills the hidden field: it gets the normal answer and nothing is sent.
    if (isHoneypotFilled(website)) {
      console.log('[signup] outcome=honeypot')
      return accepted()
    }
    if (!allowMailTo(email)) {
      console.log('[signup] outcome=address_limited')
      return accepted()
    }

    const locale: Locale = rawLocale === 'lt' ? 'lt' : 'en'
    const prefix = locale === 'lt' ? '/lt' : ''
    const message = confirmationEmail(locale, {
      confirm: `${origin}${prefix}/waitlist/confirm?t=${mintToken('confirm', email, locale)}`,
      leave: `${origin}${prefix}/waitlist/leave?t=${mintToken('leave', email, locale)}`,
      privacy: `${origin}/privacy`,
    })
    try {
      await sendEmail(email, message)
    } catch (error) {
      const failure = classifyMailjetFailure(error, 'send confirmation')
      return jsonResponse(
        failure.status,
        { success: false, error: failure.code },
        failure.status === 503 ? { 'Retry-After': RETRY_AFTER_SECONDS } : {},
      )
    }

    console.log(`[signup] outcome=confirmation_sent in ${Date.now() - startTime}ms`)
    return accepted()
  } catch (error) {
    const failure = error as { name?: unknown; message?: unknown } | null
    console.error(`[signup] unexpected error after ${Date.now() - startTime}ms`, {
      name: String(failure?.name ?? 'unknown'),
      message: redactEmails(String(failure?.message ?? '')),
    })
    return jsonResponse(500, { success: false, error: 'INTERNAL_ERROR' })
  }
}

export const GET: APIRoute = async () => jsonResponse(405, { success: false, error: 'METHOD_NOT_ALLOWED' })
