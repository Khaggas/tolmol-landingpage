# Local setup

## Prereqs

- Node 20+ (Workers runtime parity)
- npm
- A Cloudflare account if you plan to run `preview`/`deploy` (free tier is fine)

## First-time

```bash
git clone <repo-url>
cd tolmol-landingpage
npm install
cp .env.example .env.local      # optional, only needed if you want analytics/site-url overrides
npm run dev
```

Open <http://localhost:3000>. HMR works out of the box.

## Environment variables

All public env vars are baked into the client bundle at build time, so you must set them **before** `npm run build` or `npm run deploy`.

| Var | Where used | Required? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `app/layout.tsx` for canonical URL / OG / metadataBase | No (defaults to `https://tolmol.pk`) |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | `app/layout.tsx` analytics beacon | No (beacon omitted if empty) |

Local-only: drop into `.env.local`. Production: set in your shell or a CI `.env.production` before `npm run deploy`.

## Running against a real D1 locally

The form will POST to `/api/waitlist`. The route reads `env.DB` via `getCloudflareContext()` from `@opennextjs/cloudflare`. Two ways to run it:

### Option A — `npm run dev` (recommended for UI work)

`initOpenNextCloudflareForDev()` in `next.config.mjs` wires a local D1 (SQLite-backed) into the dev server. First time, apply migrations to the local DB:

```bash
npm run d1:apply:local
```

The local DB lives under `.wrangler/state/v3/d1/`. Safe to delete and re-apply if you want a clean slate.

### Option B — `npm run preview` (closer to prod)

Builds the Worker bundle and runs `wrangler dev` against it. Use this when you want to validate the full Worker request path before deploying.

```bash
npm run d1:apply:local   # if not done already
npm run preview
```

## Common scripts

| Command | What |
| --- | --- |
| `npm run dev` | Next dev server |
| `npm run build` | Next production build (no Worker bundle) |
| `npm run preview` | Worker build + `wrangler dev` |
| `npm run deploy` | Worker build + `wrangler deploy` |
| `npm run d1:apply:local` | Apply migrations to local D1 |
| `npm run d1:apply:remote` | Apply migrations to remote (prod) D1 |
| `npm run lint` | Next ESLint |

## Troubleshooting

- **`env.DB is undefined` locally** — you didn't run `npm run d1:apply:local`, or your `wrangler.jsonc` is missing the `d1_databases` block.
- **`Invalid background image` building OG** — satori is strict. Use `backgroundColor` + `backgroundImage` separately, never the `background` shorthand mixing color + gradient.
- **Form just spins** — open devtools network tab; a 503 means the D1 binding isn't reaching the route (check `wrangler.jsonc` and that you applied migrations).
