import crypto from 'node:crypto'
import { SIGNUP_TOKEN_SECRET } from 'astro:env/server'

// Links mailed to a waitlist address: `confirm` (double opt-in, 48 h) and `leave` (one year, so the link in the
// confirmation email keeps working). AES-256-GCM, so the token is opaque (the address never appears in a URL or a
// request log) and cannot be forged or altered. Each purpose has its own key, so one purpose's token never passes as
// the other. Changing SIGNUP_TOKEN_SECRET invalidates every outstanding link.

export type TokenPurpose = 'confirm' | 'leave'
export type Locale = 'en' | 'lt'
export type WaitlistToken = { purpose: TokenPurpose; email: string; locale: Locale; issuedAt: number }

const TTL_SECONDS: Record<TokenPurpose, number> = { confirm: 48 * 60 * 60, leave: 365 * 24 * 60 * 60 }
const IV_BYTES = 12
const TAG_BYTES = 16
const MAX_TOKEN_LENGTH = 2048

const keyFor = (purpose: TokenPurpose): Buffer =>
  Buffer.from(crypto.hkdfSync('sha256', SIGNUP_TOKEN_SECRET, 'withinly-waitlist', `token:v1:${purpose}`, 32))
const nowSeconds = (): number => Math.floor(Date.now() / 1000)

export function mintToken(purpose: TokenPurpose, email: string, locale: Locale): string {
  const issuedAt = nowSeconds()
  const payload = JSON.stringify({ v: 1, p: purpose, e: email, l: locale, iat: issuedAt, x: issuedAt + TTL_SECONDS[purpose] })
  const iv = crypto.randomBytes(IV_BYTES)
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFor(purpose), iv)
  const ciphertext = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64url')
}

// The token's contents when it is authentic, of this purpose and not expired; otherwise null.
export function readToken(purpose: TokenPurpose, token: unknown): WaitlistToken | null {
  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) return null
  if (!/^[A-Za-z0-9_-]+$/.test(token)) return null
  const raw = Buffer.from(token, 'base64url')
  if (raw.length <= IV_BYTES + TAG_BYTES) return null
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyFor(purpose), raw.subarray(0, IV_BYTES))
    decipher.setAuthTag(raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES))
    const plain = Buffer.concat([decipher.update(raw.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]).toString('utf8')
    const data = JSON.parse(plain) as { v?: unknown; p?: unknown; e?: unknown; l?: unknown; iat?: unknown; x?: unknown }
    const now = nowSeconds()
    if (data.v !== 1 || data.p !== purpose || typeof data.e !== 'string') return null
    if (data.l !== 'en' && data.l !== 'lt') return null
    if (typeof data.iat !== 'number' || typeof data.x !== 'number' || data.x <= now || data.iat > now + 60) return null
    return { purpose, email: data.e, locale: data.l, issuedAt: data.iat }
  } catch {
    return null
  }
}
