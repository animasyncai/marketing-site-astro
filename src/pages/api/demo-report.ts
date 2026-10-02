/**
 * Internal trait-reflection demo: POST /api/demo-report { trait, locale, traitData }
 *
 * The generators and their copy run here, on the server, behind the internal-pages gate: a client-side import would
 * ship the whole report corpus as a public /_astro chunk that no gate can protect.
 */
export const prerender = false

import type { APIRoute } from 'astro'
import { hasValidGateCookie, PRIVATE_HEADERS } from '../../lib/internal-gate'
import { allowedOriginOf } from '../../lib/origin'
import {
  generateAttachmentReflection,
  generateLoveLanguageReflection,
  generateMindfulnessReflection,
  generateSelfAcceptanceReflection,
} from '../../trait-report-demo/index.js'

type Reflection = {
  userReport?: string
  behavioralProfile?: string
  detectedPatterns?: string[]
  missingCopy?: string[]
}

const GENERATORS: Record<string, (traitData: unknown, locale: string) => Reflection> = {
  attachment: generateAttachmentReflection,
  love_language: generateLoveLanguageReflection,
  mindfulness: generateMindfulnessReflection,
  self_acceptance: generateSelfAcceptanceReflection,
}
const LOCALES = new Set(['en', 'lt'])
const MAX_BODY_BYTES = 16 * 1024

const json = (status: number, body: Record<string, unknown>): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...PRIVATE_HEADERS } })

export const POST: APIRoute = async ({ request, cookies }) => {
  if (allowedOriginOf(request) === null) return json(403, { error: 'FORBIDDEN_ORIGIN' })
  if (!hasValidGateCookie(cookies)) return json(401, { error: 'UNAUTHORIZED' })

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: 'BODY_TOO_LARGE' })
  let body: { trait?: unknown; locale?: unknown; traitData?: unknown }
  try {
    body = JSON.parse(raw)
  } catch {
    return json(400, { error: 'INVALID_JSON' })
  }
  const generate = typeof body?.trait === 'string' ? GENERATORS[body.trait] : undefined
  if (!generate) return json(400, { error: 'UNKNOWN_TRAIT' })
  if (typeof body.locale !== 'string' || !LOCALES.has(body.locale)) return json(400, { error: 'UNKNOWN_LOCALE' })
  if (!body.traitData || typeof body.traitData !== 'object' || Array.isArray(body.traitData)) {
    return json(400, { error: 'INVALID_TRAIT_DATA' })
  }

  try {
    const result = generate(body.traitData, body.locale)
    return json(200, {
      userReport: result.userReport ?? '',
      behavioralProfile: result.behavioralProfile ?? '',
      detectedPatterns: result.detectedPatterns ?? [],
      missingCopy: result.missingCopy ?? [],
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    console.warn('[demo-report] generation failed', { trait: body.trait, message })
    return json(400, { error: 'GENERATION_FAILED', message: message.slice(0, 200) })
  }
}

export const ALL: APIRoute = () => json(405, { error: 'METHOD_NOT_ALLOWED' })
