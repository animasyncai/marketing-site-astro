// A waitlist address, lower-cased, or null. It becomes a Mailjet URL path segment and an email recipient, so it is
// validated strictly and rejected (never repaired): no `/ \ % ? # " < >`, no whitespace or control characters, no
// leading, trailing or doubled dot in the local part, and a domain of letter/digit/hyphen labels with a letter TLD.
const LOCAL_PART = /^[a-z0-9!$&'*+=^_`{|}~-]+(?:\.[a-z0-9!$&'*+=^_`{|}~-]+)*$/
const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const email = raw.trim().toLowerCase()
  if (email.length > 254) return null
  const at = email.lastIndexOf('@')
  if (at <= 0 || at !== email.indexOf('@')) return null
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (local.length > 64 || domain.length > 253) return null
  return LOCAL_PART.test(local) && DOMAIN.test(domain) ? email : null
}
