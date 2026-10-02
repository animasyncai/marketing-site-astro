import { classifyMailjetFailure, manageContact, readMembership, setContactProperties, unsubscribedAt } from './mailjet'
import { allowedOriginOf } from './origin'
import { PRIVACY_NOTICE_VERSION } from './privacy-notice'
import { callWaitlistConfirmationWebhook } from './waitlist-webhook'
import { readToken } from './waitlist-token'

// The confirmation page behind the emailed link. GET only shows a Confirm button (mail scanners prefetch links, so
// nothing changes on GET); the POST from that button lists the address, records consent and asks the api for its
// waitlist email — once, when the address joins. Every outcome renders the same page for every address.
export type ConfirmState = 'ready' | 'invalid' | 'done' | 'leftAfter' | 'error' | 'forbidden'
export type ConfirmResult = { state: ConfirmState; token?: string }

export const CONSENT_SOURCE = 'marketing-site:double-opt-in'

export async function handleConfirm(request: Request, url: URL): Promise<ConfirmResult> {
  if (request.method !== 'POST') {
    const token = url.searchParams.get('t') ?? ''
    return readToken('confirm', token) ? { state: 'ready', token } : { state: 'invalid' }
  }

  if (allowedOriginOf(request) === null) return { state: 'forbidden' }
  let token = ''
  try {
    const value = (await request.formData()).get('t')
    if (typeof value === 'string') token = value
  } catch {
    // not a form body
  }
  const data = readToken('confirm', token)
  if (!data) return { state: 'invalid' }

  try {
    const membership = await readMembership(data.email)
    if (membership === 'subscribed') {
      console.log('[confirm] outcome=already_listed')
      return { state: 'done' }
    }
    if (membership === 'unsubscribed') {
      // A link minted before the person left must never undo that; one minted after it is fresh consent.
      const leftAt = await unsubscribedAt(data.email)
      if (leftAt === null || data.issuedAt * 1000 <= leftAt) {
        console.log('[confirm] outcome=left_after_link')
        return { state: 'leftAfter' }
      }
    }
    await manageContact(data.email, 'addforce')
  } catch (error) {
    classifyMailjetFailure(error, 'confirm')
    return { state: 'error', token }
  }

  try {
    await setContactProperties(data.email, {
      waitlist_consent_at: new Date().toISOString(),
      waitlist_consent_source: CONSENT_SOURCE,
      waitlist_consent_notice: PRIVACY_NOTICE_VERSION,
    })
  } catch (error) {
    const statusCode = (error as { statusCode?: unknown } | null)?.statusCode
    console.error(`[consent] write failed status=${typeof statusCode === 'number' ? statusCode : 'error'}`)
  }
  await callWaitlistConfirmationWebhook(data.email)
  console.log('[confirm] outcome=added')
  return { state: 'done' }
}
