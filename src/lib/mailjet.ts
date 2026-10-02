import Mailjet from 'node-mailjet'
import { MAILJET_API_KEY, MAILJET_API_SECRET, MAILJET_LIST_ID } from 'astro:env/server'

// Every Mailjet call the waitlist makes. The contact store is shared with the api's transactional contacts, so list
// membership is always read from the list itself, never inferred from the contact existing.

const TIMEOUT_MS = 5000
export const SENDER = { Email: 'accounts@withinly.app', Name: 'Withinly' }

const client = () =>
  new Mailjet({ apiKey: MAILJET_API_KEY, apiSecret: MAILJET_API_SECRET, options: { timeout: TIMEOUT_MS } })

// The address as a Mailjet path segment: percent-encoded, so nothing in it can reach another resource; '@' stays
// literal, as Mailjet documents it (GET /contact/{ID or email}/...).
const contactPathId = (email: string): string => encodeURIComponent(email).replace(/%40/g, '@')

type MailjetFailure = { statusCode?: unknown; code?: unknown; ErrorIdentifier?: unknown; ErrorMessage?: unknown; originalMessage?: unknown }
const statusCodeOf = (error: unknown): number | null => {
  const statusCode = (error as MailjetFailure | null)?.statusCode
  return typeof statusCode === 'number' ? statusCode : null
}
const isTrue = (value: unknown): boolean => value === true || value === 'true'

export type Membership = 'none' | 'subscribed' | 'unsubscribed'

export async function readMembership(email: string): Promise<Membership> {
  let lists: Array<{ ListID?: unknown; IsUnsub?: unknown }> = []
  try {
    const response = await client().get('contact', { version: 'v3' }).id(contactPathId(email)).action('getcontactslists').request()
    const data = (response.body as { Data?: unknown } | undefined)?.Data
    lists = Array.isArray(data) ? data : []
  } catch (error) {
    if (statusCodeOf(error) !== 404) throw error // 404: Mailjet does not know the contact
  }
  const entry = lists.find((item) => String(item?.ListID) === String(MAILJET_LIST_ID))
  if (!entry) return 'none'
  return isTrue(entry.IsUnsub) ? 'unsubscribed' : 'subscribed'
}

// When the address left the list (ms since epoch), or null when Mailjet does not say.
export async function unsubscribedAt(email: string): Promise<number | null> {
  const response = await client()
    .get('listrecipient', { version: 'v3' })
    .request({}, { ContactsList: MAILJET_LIST_ID, ContactEmail: email })
  const data = (response.body as { Data?: Array<{ UnsubscribedAt?: unknown }> } | undefined)?.Data
  const value = Array.isArray(data) ? data[0]?.UnsubscribedAt : undefined
  const time = typeof value === 'string' && value ? Date.parse(value) : NaN
  return Number.isFinite(time) ? time : null
}

export async function manageContact(email: string, action: 'addforce' | 'unsub'): Promise<void> {
  await client()
    .post('contactslist', { version: 'v3' })
    .id(MAILJET_LIST_ID)
    .action('managecontact')
    .request({ Email: email, Action: action })
}

export async function setContactProperties(email: string, properties: Record<string, string>): Promise<void> {
  await client()
    .put('contactdata', { version: 'v3' })
    .id(contactPathId(email))
    .request({ Data: Object.entries(properties).map(([Name, Value]) => ({ Name, Value })) })
}

export async function sendEmail(to: string, message: { subject: string; text: string; html: string }): Promise<void> {
  await client()
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [{ From: SENDER, To: [{ Email: to }], Subject: message.subject, TextPart: message.text, HTMLPart: message.html }],
    })
}

// Mailjet's messages quote the address (e.g. MJ18); logs get e-mail-shaped text replaced.
export const redactEmails = (text: string): string => text.replace(/[^\s"'<>@]+@[^\s"'<>@]+/g, '<email>')

// Send v3.1 reports per-message errors (e.g. send-0003 unauthorised sender) in the response body; codes only.
function sendErrorCodesOf(error: unknown): string[] | undefined {
  const data = (error as { response?: { data?: unknown } } | null)?.response?.data as
    | { Messages?: Array<{ Errors?: Array<{ ErrorCode?: unknown }> }> }
    | undefined
  const codes = (data?.Messages ?? []).flatMap((m) => (m.Errors ?? []).map((e) => String(e.ErrorCode ?? '')))
  return codes.length > 0 ? codes : undefined
}

// A failed call as an outcome code, logged on its status / transport code only.
export function classifyMailjetFailure(
  error: unknown,
  operation: string,
  { badRequestMeansInvalidEmail = true } = {},
): { status: number; code: string } {
  const failure = (error ?? {}) as MailjetFailure
  const statusCode = statusCodeOf(error)
  const code = typeof failure.code === 'string' ? failure.code : null
  console.error(`[mailjet] ${operation} failed`, {
    status: statusCode ?? code ?? 'unknown',
    errorIdentifier: typeof failure.ErrorIdentifier === 'string' ? failure.ErrorIdentifier : undefined,
    errorMessage: redactEmails(String(failure.ErrorMessage ?? failure.originalMessage ?? '')),
    sendErrorCodes: sendErrorCodesOf(error),
  })
  if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') return { status: 503, code: 'EMAIL_SERVICE_TIMEOUT' }
  if (statusCode === 400 && badRequestMeansInvalidEmail) return { status: 400, code: 'INVALID_EMAIL' }
  return { status: 502, code: 'EMAIL_SERVICE_ERROR' }
}
