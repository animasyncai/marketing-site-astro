import crypto from 'node:crypto'
import { SIGNUP_TOKEN_SECRET } from 'astro:env/server'
import { createLimiter } from './rate-limit'

// Shared by sign-up and leave, so one budget covers both.
export const perIp = createLimiter({ windowMs: 15 * 60 * 1000, max: 5 })

// At most 3 waitlist emails per address per hour (per instance), keyed by an HMAC so the address is not held.
const perAddressLimiter = createLimiter({ windowMs: 60 * 60 * 1000, max: 3 })
export const allowMailTo = (email: string): boolean =>
  perAddressLimiter(crypto.createHmac('sha256', SIGNUP_TOKEN_SECRET).update(`limit:${email}`).digest('hex')).allowed

const DISPOSABLE_DOMAINS = new Set([
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
])
export const isDisposable = (email: string): boolean => DISPOSABLE_DOMAINS.has(email.slice(email.indexOf('@') + 1))

// Only a bot fills the hidden `website` field.
export const isHoneypotFilled = (value: unknown): boolean => typeof value === 'string' && value.trim() !== ''
