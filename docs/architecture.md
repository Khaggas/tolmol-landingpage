# Architecture

## Stack

- **Next.js 15** (App Router, React 19) — UI, routing, RSC, API routes
- **TypeScript** (strict)
- **Tailwind 3** — utility CSS + a few custom classes in `app/globals.css`
- **Framer Motion** — entrance reveals, typewriter cycle, count-up
- **Lenis** — smooth scroll wheel handler
- **lucide-react** — icons
- **@opennextjs/cloudflare** — adapter that compiles the Next app into a Cloudflare Worker
- **Cloudflare D1** — SQLite-backed serverless DB for the waitlist
- **Cloudflare Web Analytics** — privacy-friendly pageview beacon (optional)

## Runtime model

Everything runs on **one Cloudflare Worker** in production:

```
Browser
  │
  ▼
Cloudflare edge (Worker)
  ├─ Static assets        (.open-next/assets) ──► served by ASSETS binding
  └─ Server function      (.open-next/worker.js)
        ├─ React Server Components for /
        └─ API routes: POST /api/waitlist ──► env.DB (D1)
```

There are no separate serverless functions, no Vercel, no Node origin. Cold starts are sub-50ms.

## Request flow — the waitlist form

1. User types email/product in `WaitlistSection` (`app/page.tsx`).
2. Submit triggers `fetch("/api/waitlist", { method: "POST", body })`.
3. The Worker routes to `app/api/waitlist/route.ts`.
4. The route validates email, drops bots via the honeypot field, then inserts into D1 via `getCloudflareContext().env.DB`.
5. UNIQUE constraint collisions are treated as success (idempotent re-signup).
6. UI flips to the success state.

See [waitlist.md](./waitlist.md) for the full API contract.

## File layout — what lives where

```
app/
  layout.tsx               Root <html>/<body>, font, metadata, CF analytics beacon
  page.tsx                 Single-page composition:
                             Header / Hero / 4 × StepSection /
                             WaitlistSection / Footer
                           Plus shared visuals (SearchVisual, ResultsVisual,
                           CompareVisual, BestVisual) and small hooks
                           (useTypewriterCycle, useCyclingTerm).
  globals.css              Tailwind layers, brand utilities (.simpleGrid,
                           .premiumButton, .secondaryButton, .typingText)
  icon.tsx                 Dynamic 32×32 favicon (ImageResponse)
  opengraph-image.tsx      Dynamic 1200×630 OG (ImageResponse)
  api/
    waitlist/route.ts      POST handler

migrations/
  0001_create_waitlist.sql Initial schema

tailwind.config.ts         Custom colors + boxShadow + font family
next.config.mjs            Calls initOpenNextCloudflareForDev() for HMR with bindings
open-next.config.ts        Minimal Cloudflare adapter config (no R2 cache for v1)
wrangler.jsonc             Worker name, compat flags, ASSETS + DB bindings
tsconfig.json              types: @cloudflare/workers-types (so D1Database is global)
```

## State management

There isn't much. One React context (`WaitlistContext` in `app/page.tsx`) shares the in-hero search query (`seed`) with the bottom form, so typing a product name in the hero pre-fills it below. Everything else is local component state.

## Why Workers + D1 (and not Vercel + Postgres / Supabase)

- Free tier covers our launch traffic comfortably (100k req/day, 5GB D1 storage).
- One platform, one bill, one dashboard for assets / DB / analytics.
- Edge-native means low latency for PK users without extra config.
- D1's SQLite dialect is enough for waitlist-shaped workloads.

If we ever need cross-region writes, full-text search, or multi-table joins under heavy load, we revisit.
