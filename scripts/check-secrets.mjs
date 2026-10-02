#!/usr/bin/env node
// Fails when a tracked file assigns a secret-shaped literal to a *_KEY / *_SECRET / *_TOKEN / *_PASSWORD name,
// e.g. `MAILJET_API_KEY=405d…` in an env template. Usage: node scripts/check-secrets.mjs [repo-dir]
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const repo = process.argv[2] ?? process.cwd()
const ASSIGNMENT = /\b([A-Z][A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD)[A-Z0-9_]*)["']?\s*[:=]\s*["']?([A-Za-z0-9+/_=.-]{16,})/g
const PLACEHOLDER = /your|here|example|placeholder|changeme|xxx|<|\$\{/i
const SKIP = /(^|\/)package-lock\.json$|\.(png|jpe?g|webp|ico|woff2?|gif|pdf)$/

// A literal counts as a secret when it looks random: long, and mixes digits with letters.
const looksSecret = (value) => value.length >= 24 && /\d/.test(value) && /[a-z]/i.test(value) && !PLACEHOLDER.test(value)

const files = execFileSync('git', ['ls-files', '-z'], { cwd: repo, encoding: 'utf8' }).split('\0').filter(Boolean)
const hits = []
for (const file of files) {
  if (SKIP.test(file)) continue
  let text
  try {
    text = readFileSync(join(repo, file), 'utf8')
  } catch {
    continue
  }
  text.split('\n').forEach((line, i) => {
    for (const [, name, value] of line.matchAll(ASSIGNMENT)) {
      if (looksSecret(value)) hits.push(`${file}:${i + 1} ${name}=${value.slice(0, 4)}…(${value.length} chars)`)
    }
  })
}
if (hits.length > 0) {
  console.error(`check-secrets: ${hits.length} secret-shaped value(s) in tracked files:\n  ${hits.join('\n  ')}`)
  process.exit(1)
}
console.log(`check-secrets: ${files.length} tracked files, no secret-shaped values`)
