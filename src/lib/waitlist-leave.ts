import { normalizeEmail } from './email-address'
import { leaveEmail } from './emails'
import { classifyMailjetFailure, manageContact, readMembership, sendEmail, setContactProperties } from './mailjet'
import { allowedOriginOf } from './origin'
import { allowMailTo, isDisposable, isHoneypotFilled, perIp } from './waitlist-guards'
import { mintToken, readToken, type Locale } from './waitlist-token'

// /waitlist/leave, the in-band way off the list (the mirror of the one-request sign-up):
//   GET            -> the address form, or a Leave button when the URL carries a valid leave token
//   POST email     -> mails a leave link; the same "check your inbox" answer for every address
//   POST t         -> takes the address off the list (unsub keeps a do-not-email record) and clears its consent
// Nothing changes on GET, because mail scanners prefetch links.
export type LeaveState = 'form' | 'sent' | 'ready' | 'done' | 'invalid' | 'emailInvalid' | 'limited' | 'error' | 'forbidden'
export type LeaveResult = { state: LeaveState; token?: string }

const CLEARED_CONSENT = { waitlist_consent_at: '', waitlist_consent_source: '', waitlist_consent_notice: '' }

export async function handleLeave(request: Request, url: URL, clientAddress: string, locale: Locale): Promise<LeaveResult> {
  if (request.method !== 'POST') {
    if (!url.searchParams.has('t')) return { state: 'form' }
    const token = url.searchParams.get('t') ?? ''
    return readToken('leave', token) ? { state: 'ready', token } : { state: 'invalid' }
  }

  const origin = allowedOriginOf(request)
  if (origin === null) return { state: 'forbidden' }
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return { state: 'invalid' }
  }

  const token = form.get('t')
  if (typeof token === 'string') {
    const data = readToken('leave', token)
    if (!data) return { state: 'invalid' }
    try {
      // An address that is not on the list is left alone: managecontact would create a contact for it.
      if ((await readMembership(data.email)) === 'subscribed') {
        await manageContact(data.email, 'unsub')
        try {
          await setContactProperties(data.email, CLEARED_CONSENT)
        } catch {
          console.error('[leave] consent clear failed')
        }
        console.log('[leave] outcome=unsubscribed')
      } else {
        console.log('[leave] outcome=not_listed')
      }
      return { state: 'done' }
    } catch (error) {
      classifyMailjetFailure(error, 'leave')
      return { state: 'error', token }
    }
  }

  const email = normalizeEmail(form.get('email'))
  if (!email) return { state: 'emailInvalid' }
  if (!perIp(clientAddress || 'unknown').allowed) return { state: 'limited' }
  if (isHoneypotFilled(form.get('website')) || isDisposable(email) || !allowMailTo(email)) return { state: 'sent' }

  const prefix = locale === 'lt' ? '/lt' : ''
  try {
    await sendEmail(
      email,
      leaveEmail(locale, { leave: `${origin}${prefix}/waitlist/leave?t=${mintToken('leave', email, locale)}`, privacy: `${origin}/privacy` }),
    )
  } catch (error) {
    classifyMailjetFailure(error, 'send leave link', { badRequestMeansInvalidEmail: false })
    return { state: 'error' }
  }
  console.log('[leave] outcome=link_sent')
  return { state: 'sent' }
}
