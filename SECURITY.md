# Security notes — withinly.app marketing site

Decisions a reviewer cannot read off the code. Keep this file in step with `src/middleware.js` (headers),
`vercel.json` (static-file headers) and `src/layouts/DefaultLayout.astro` (third-party tags).

## Response headers

Every response the server function produces carries one site-wide policy (`src/middleware.js`):

| Header | Value / purpose |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'`; scripts from `'self'` and `cdn.usefathom.com` only — no inline script, no hashes, no nonces; styles from `'self'`, inline styles and `fonts.googleapis.com`; fonts from `'self'` and `fonts.gstatic.com`; `connect-src`/`img-src` add `cdn.usefathom.com`; `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'` |
| `X-Frame-Options` | `DENY` (clickjacking, for browsers without `frame-ancestors`) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` (emailed waitlist links carry a token; other sites only ever see the origin) |

The policy is one value for the whole site because `<ViewTransitions />` keeps the first page's policy across soft
navigations, so per-page hashes or nonces cannot work. To keep `script-src` free of `'unsafe-inline'`, Astro is told
never to inline a processed script (`vite.build.assetsInlineLimit: 0`), and no component may use an `is:inline`
executable script or an inline event handler (`onclick=…`). Inline `<script type="application/json">` /
`application/ld+json` blocks are data, not script, and are written with `safeJsonForScript` so content cannot end
them early.

Static files (`/_astro/*`, `/fonts/*`, images, icons) are served by Vercel's CDN without the function; `vercel.json`
gives them `X-Content-Type-Options: nosniff`. HSTS is added by Vercel.

## Third parties that run in, or receive data from, this origin

| Party | What it does here | What it receives | Integrity |
| --- | --- | --- | --- |
| Fathom (`cdn.usefathom.com/script.js`) | Cookieless visit statistics on every page except `/waitlist/*` | Page path, referrer, browser/device type, country (IP not stored by Fathom) | **Unpinned** — see below |
| Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | Chivo and David Libre web fonts | The visitor's IP and user agent, as for any request | **Unpinned** — see below |
| Mailjet (server side) | Waitlist contact list, confirmation and leave emails | Email address, consent fields | n/a (server API, key in env) |
| Withinly api (server side) | `POST /api/webhook/waitlist-confirmation-email` once per address that joins | Email address | n/a (Bearer token in env) |

**Decision (web-client §7.2): Fathom and Google Fonts can run or inject code in this origin at any time.**
Subresource Integrity is not possible for either: Fathom's script is a deliberately mutable vendor URL, and the
Google Fonts stylesheet differs per browser. We accept that, and bound it with the CSP: a compromised script can
only talk to `'self'` and `cdn.usefathom.com`, cannot frame the site, and cannot load scripts from anywhere else.
Fathom is not loaded on the token-bearing `/waitlist/*` pages. Removing this risk entirely means self-hosting the
fonts and a pinned copy of the Fathom script.

## Logs

The server logs outcome codes and timings only: no email address, IP address, token, Mailjet key or raw provider
error (`[signup]`, `[confirm]`, `[leave]`, `[mailjet]`, `[consent]`, `[waitlist-webhook]` markers). Vercel keeps
runtime logs for the plan's window (Hobby: 1 hour) and there is no log drain, so no copy is kept elsewhere. A failed
api webhook is logged as `[waitlist-webhook] failed status=…`; alerting on it needs a log drain (not set up).

## Secrets

All secrets are server env vars read at runtime through `astro:env` (`astro.config.mjs`, `.env.example`); a missing
required one fails the build. `npm run check:secrets` (also a GitHub workflow) refuses secret-shaped literals in
tracked files.
