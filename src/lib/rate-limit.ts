// Best-effort fixed-window limiter: in memory, per server instance (empty after a cold start, not shared between
// Vercel instances). It slows a single source down; it is not a hard cap.
export function createLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const entries = new Map<string, { count: number; resetTime: number }>()
  return (key: string): { allowed: true } | { allowed: false; retryAfterSeconds: number } => {
    const now = Date.now()
    if (entries.size > 10_000) {
      for (const [k, entry] of entries) if (now > entry.resetTime) entries.delete(k)
    }
    const entry = entries.get(key)
    if (!entry || now > entry.resetTime) {
      entries.set(key, { count: 1, resetTime: now + windowMs })
      return { allowed: true }
    }
    if (entry.count >= max) return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetTime - now) / 1000) }
    entry.count++
    return { allowed: true }
  }
}
