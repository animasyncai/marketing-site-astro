import { WAITLIST_WEBHOOK_TOKEN, WAITLIST_WEBHOOK_URL } from 'astro:env/server'

const TIMEOUT_MS = 4000

// Ask the api to send its waitlist email. Awaited, because a Vercel function may be frozen once it has responded, but
// bounded. A failure never undoes the listing; it is logged with a stable marker (`[waitlist-webhook] failed`) and
// without the address, so a log drain can alert on it.
export async function callWaitlistConfirmationWebhook(email: string): Promise<void> {
  try {
    const response = await fetch(WAITLIST_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WAITLIST_WEBHOOK_TOKEN}` },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    void response.body?.cancel().catch(() => {})
    if (!response.ok) console.error(`[waitlist-webhook] failed status=${response.status}`)
  } catch (error) {
    const name = (error as { name?: unknown } | null)?.name
    console.error(`[waitlist-webhook] failed status=${name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'error'}`)
  }
}
