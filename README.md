# Tolmol — Landing Page

Marketing page for Tolmol, a cross-store price comparison product (Pakistan, PKR). Single-page Next.js app with a 4-step narrative, animated hero, and waitlist capture backed by Cloudflare D1.

## Stack

- **Next.js 15** (App Router, React 19)
- **TypeScript** + **Tailwind CSS 3**
- **Framer Motion** — entrance reveals, typewriter cycle, count-up animations
- **Lenis** — smooth scroll
- **lucide-react** — icons
- **Cloudflare Workers** (via `@opennextjs/cloudflare`) + **D1** for the waitlist
- **Cloudflare Web Analytics** (optional, env-gated)

## Run locally

```bash
npm install
cp .env.example .env.local   # optional, set NEXT_PUBLIC_* values
npm run dev
```

Open <http://localhost:3000>. The dev server hits the local D1 binding via the OpenNext dev hook in `next.config.mjs`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server with HMR |
| `npm run build` | Production Next build |
| `npm run preview` | Build for Workers and run `wrangler dev` against the bundle |
| `npm run deploy` | Build for Workers and deploy via `wrangler deploy` (manual hotfix) |
| `npm run build:ci` | Migrations + build — used as the Workers Builds **build command** |
| `npm run deploy:ci` | Migrations + build + deploy — manual all-in-one |
| `npm run d1:apply:local` | Apply migrations to the local D1 |
| `npm run d1:apply:remote` | Apply migrations to the remote D1 |

## Deploys

Production deploys run automatically on push to `main` via **Cloudflare Workers Builds**. The Worker name `tolmol-landing` stays the same across deploys, so the custom domain only needs to be attached once. See [docs/deployment.md](./docs/deployment.md) for the full setup + env vars.

## First-time Cloudflare setup

1. `npx wrangler login`
2. `npx wrangler d1 create tolmol-waitlist` → copy the `database_id`
3. Paste it into `wrangler.jsonc` (replace `REPLACE_WITH_DB_ID_FROM_WRANGLER_D1_CREATE`)
4. `npm run d1:apply:local` (for `npm run preview`)
5. `npm run d1:apply:remote` (for production)
6. (Optional) Cloudflare dashboard → Web Analytics → create a site → copy the token → set `NEXT_PUBLIC_CF_BEACON_TOKEN` in `.env.production` before `npm run deploy`
7. `npm run deploy`

## Structure

```
app/
  layout.tsx              # Root layout, metadata, fonts, analytics beacon
  page.tsx                # Hero, 4 step sections, waitlist form, footer
  globals.css             # Tailwind layers + utilities
  icon.tsx                # Dynamic favicon (next/og)
  opengraph-image.tsx     # Dynamic OG image (next/og)
  api/waitlist/route.ts   # POST → D1 insert
migrations/
  0001_create_waitlist.sql
wrangler.jsonc            # Workers config + D1 binding
open-next.config.ts       # OpenNext Cloudflare config
```
