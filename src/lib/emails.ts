import en from '../data/translations/en.json'
import lt from '../data/translations/lt.json'
import { escapeHtml } from '../utils/escape-html.js'
import type { Locale } from './waitlist-token'

const STRINGS = { en: en.waitlistEmail, lt: lt.waitlistEmail }

// The double opt-in email: a plain text part and a minimal HTML part, every value escaped.
export function confirmationEmail(locale: Locale, links: { confirm: string; leave: string; privacy: string }) {
  const s = STRINGS[locale]
  const text = [
    s.confirmIntro,
    '',
    `${s.confirmAction}: ${links.confirm}`,
    s.confirmExpiry,
    '',
    s.confirmIgnore,
    '',
    `${s.leaveLine} ${links.leave}`,
    `${s.privacyLine} ${links.privacy}`,
    '',
    s.signature,
  ].join('\n')
  const html = `<!doctype html><html lang="${locale}"><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.5">
<p>${escapeHtml(s.confirmIntro)}</p>
<p><a href="${escapeHtml(links.confirm)}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">${escapeHtml(s.confirmAction)}</a></p>
<p style="color:#475569;font-size:14px">${escapeHtml(s.confirmExpiry)}</p>
<p style="color:#475569;font-size:14px">${escapeHtml(s.confirmIgnore)}</p>
<p style="color:#475569;font-size:13px">${escapeHtml(s.leaveLine)} <a href="${escapeHtml(links.leave)}">${escapeHtml(links.leave)}</a><br>${escapeHtml(s.privacyLine)} <a href="${escapeHtml(links.privacy)}">${escapeHtml(links.privacy)}</a></p>
<p>${escapeHtml(s.signature)}</p>
</body></html>`
  return { subject: s.confirmSubject, text, html }
}
