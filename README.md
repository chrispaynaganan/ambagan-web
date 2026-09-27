# ambagan-web

Frontend foundation for Ambagan: auth, layout, and a typed API client. This is
deliberately minimal — one login page and one protected dashboard page — built
to prove the loop against `ambagan-api` before donor-side and Katiwala-side
UI gets layered on top.

## Setup

1. Place this folder as a sibling of `ambagan-api`.
2. `npm install`
3. `cp .env.local.example .env.local` and confirm `NEXT_PUBLIC_API_URL` matches
   where `ambagan-api` actually runs.
4. Make sure `ambagan-api`'s CORS allowlist includes this app's origin. By
   default this app runs on **port 3001** (see `dev` script in
   `package.json`), which matches `ambagan-api`'s default
   `CORS_ALLOWED_ORIGINS` fallback — so this should work with no env changes
   on the backend. If you run this app on a different port, add it to
   `CORS_ALLOWED_ORIGINS` in `ambagan-api`'s `.env`.
5. `npm run dev`, then visit `http://localhost:3001`.

## Assumptions to verify against the real backend

I don't have visibility into the actual `auth` module's route shapes, only
that it exists and passes its tests. Two files isolate every assumption so
there's a single place to fix things if they're wrong:

- **`lib/api/auth.ts`** — assumes `POST /auth/login` takes `{ email,
  password }` and returns `{ accessToken, user }`, and that `GET /auth/me`
  returns the current user given a bearer token. If the real routes differ
  (different path, a refresh-token pair, a different field name), this is
  the only file to change.
- **`lib/auth/auth-context.tsx`** — assumes bearer-token auth stored in
  `localStorage`, not an httpOnly cookie. This is the standard trade-off for
  a first pass: simple to build, but it means no server-side auth yet (a
  logged-in page will briefly render its "loading" state on refresh before
  the client resolves the session), and the token is readable by any script
  on the page. Fine for local development against a sandbox backend; revisit
  before handling real PayMongo-linked sessions.

## Design direction

Palette and type were chosen to fit what this product actually is — an
accountability platform built on identity verification and proof-of-delivery
— rather than defaulting to a generic SaaS look:

- **Color**: warm paper background (`#FAF8F3`), deep teal as the primary
  accent (`#1F5F5B`, trust/verification), a muted gold as a secondary accent
  (`#D9A441`, used sparingly — see the rule above the login card), ink
  (`#1C1B18`) for text, and a warm neutral line color (`#DED7C8`) for
  borders instead of drop shadows.
- **Type**: Source Serif 4 for headings (a formal, document-like register —
  this is a platform about verified records), IBM Plex Sans for UI and body
  text, IBM Plex Mono reserved specifically for reference numbers, IDs, and
  ledger-style data — not used decoratively.
- **Layout**: flat, bordered, hairline-rule structure rather than rounded
  "card kit" styling — closer to an official document or ledger than a
  typical dashboard. All tokens live in `tailwind.config.ts`; extend that
  file rather than hardcoding new colors as pages get added.

## Upgrade paths (not needed yet, worth knowing about)

- **Server-side auth**: move the token into an httpOnly cookie (set via a
  Next.js route handler that proxies `/auth/login`) and add
  `middleware.ts` to gate routes before render. Removes the loading flash
  and the XSS exposure of a readable token.
- **Role-aware UI**: `AuthUser` in `lib/api/auth.ts` is intentionally loose
  (`[key: string]: unknown`) until the real `/auth/me` shape — including
  roles/permissions from `identity-access` — is confirmed. Tighten it once
  that's known, then use it to show/hide Katiwala vs. staff vs. donor
  affordances in `Header`.
