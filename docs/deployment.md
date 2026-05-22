# Deployment

We deploy as a single Cloudflare Worker via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). D1 is bound directly to the Worker. No Vercel, no Pages, no Node origin.

## One-time Cloudflare setup

Do this once per account/environment.

```bash
# 1. Auth
npx wrangler login

# 2. Create the D1 database. Copy the database_id from the output.
npx wrangler d1 create tolmol-waitlist

# 3. Paste the id into wrangler.jsonc, replacing
#    "REPLACE_WITH_DB_ID_FROM_WRANGLER_D1_CREATE"

# 4. Apply migrations to remote D1
npm run d1:apply:remote

# 5. (Optional) Create a Cloudflare Web Analytics site in the dashboard
#    (Analytics & Logs → Web Analytics). Copy the token.
```

## Configuring env vars before deploy

`NEXT_PUBLIC_*` vars are baked into the client bundle at **build time**, so they must be set in the shell when you run `npm run deploy`.

```bash
# Either inline:
NEXT_PUBLIC_SITE_URL=https://tolmol.pk \
NEXT_PUBLIC_CF_BEACON_TOKEN=xxxxxxxxxxxx \
npm run deploy

# Or use a .env.production file (Next.js picks this up automatically):
echo "NEXT_PUBLIC_SITE_URL=https://tolmol.pk" >> .env.production
echo "NEXT_PUBLIC_CF_BEACON_TOKEN=xxxxxxxxxxxx" >> .env.production
npm run deploy
```

> `.env.production` is gitignored. If you commit env vars, do it via your CI's secret store, not the repo.

## Deploying

```bash
# Smoke test against the Worker bundle locally first
npm run preview
# ↑ runs at http://localhost:8787 with the local D1

# When happy:
npm run deploy
```

`npm run deploy` does:
1. `next build`
2. `opennextjs-cloudflare build` → produces `.open-next/worker.js` + `.open-next/assets/`
3. `wrangler deploy` → ships the Worker

You'll get back a `*.workers.dev` URL. To hook up the real domain, add a custom domain to the Worker in the Cloudflare dashboard, or set `routes` in `wrangler.jsonc`.

## Adding the custom domain

Two ways. Pick one:

### Dashboard (easier)

Workers & Pages → `tolmol-landing` → Settings → Triggers → Custom Domains → **Add Custom Domain** → `tolmol.pk`. Cloudflare handles DNS + cert.

### `wrangler.jsonc`

```jsonc
"routes": [
  { "pattern": "tolmol.pk", "custom_domain": true },
  { "pattern": "www.tolmol.pk", "custom_domain": true }
]
```

Then `npm run deploy` again.

## Secrets (if we ever add server-side ones)

`NEXT_PUBLIC_*` are public by definition. For anything secret (API keys, webhook URLs), use Wrangler secrets:

```bash
npx wrangler secret put RESEND_API_KEY
# enter value at prompt
```

Read them in the route via `getCloudflareContext().env.RESEND_API_KEY`. They are **not** baked into the client bundle.

## Rollback

Workers keep previous versions automatically.

```bash
npx wrangler deployments list
npx wrangler rollback <deployment-id>
```

D1 has no automatic snapshot. If we ever do a destructive migration, take a manual export first:

```bash
npx wrangler d1 export tolmol-waitlist --remote --output backup-$(date +%Y%m%d).sql
```

## Observability

- **Logs:** Cloudflare dashboard → Workers → `tolmol-landing` → Logs (real-time) or `npx wrangler tail`.
- **Errors:** `observability.enabled` is on in `wrangler.jsonc`, so errors surface in the dashboard automatically.
- **Pageviews:** Cloudflare Web Analytics dashboard (if the beacon token is set).
- **Waitlist signups:** see the SQL snippets in [waitlist.md](./waitlist.md).

## CI/CD — Cloudflare Workers Builds

Production deploys are wired through **Cloudflare Workers Builds** (Cloudflare's native GitHub integration). Push to `main` → Cloudflare runs the build → ships to the same `tolmol-landing` Worker → the custom domain stays attached.

### One-time setup (in the Cloudflare dashboard)

1. **Workers & Pages → `tolmol-landing` → Settings → Builds → Connect**
2. Pick the GitHub account / repo, branch = `main`.
3. **Build configuration:**
   - **Root directory:** `/`
   - **Build command:** `npm run build:ci`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
4. **Build variables and secrets** — add the env vars that need to exist at *build time*:

   | Name | Value | Notes |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://tolmol.pk` | Marked as plaintext |
   | `NEXT_PUBLIC_CF_BEACON_TOKEN` | `<token>` | Optional, omit to disable analytics |

   Workers Builds auto-injects `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, so `wrangler` is already authed inside the build.

5. Save. The first build triggers immediately.

### What the build / deploy commands do

The **build** step (`npm run build:ci`) runs:

```
wrangler d1 migrations apply tolmol-waitlist --remote   # apply pending migrations
  && opennextjs-cloudflare build                         # next build + OpenNext bundling
```

Then the **deploy** step (`npx opennextjs-cloudflare deploy`) ships `.open-next/worker.js` via `wrangler deploy`.

Migrations live in the build step on purpose: if a migration fails, the build fails, the deploy never runs, and the live Worker stays on the previous version. Migrations are tracked in D1's internal `d1_migrations` table, so re-running is a no-op when nothing changed.

For manual all-in-one deploys from a dev machine, `npm run deploy:ci` does build+migrations+deploy in one shot.

### PR previews

Workers Builds creates a preview deployment for non-`main` branches automatically. Caveats for our setup:

- Previews **share the same remote D1** as production. For our v1 (additive-only schema, low-traffic waitlist) that's fine. If we ever do a destructive migration, switch to a separate preview D1 or pause previews first.
- Preview URLs look like `<hash>-tolmol-landing.<acct>.workers.dev`.

### Watching a deploy

- Dashboard → Workers & Pages → `tolmol-landing` → **Builds** tab — full log, status, rebuild button.
- A failed migration step fails the build *before* the Worker is replaced, so a bad SQL change can't take the site down.

### Rolling back

Two layers:

```bash
# Code rollback
npx wrangler deployments list
npx wrangler rollback <deployment-id>
```

Or in the dashboard: **Deployments → ⋯ → Rollback**. Note this does **not** roll back D1 — migrations are forward-only. For a destructive change, take an export first:

```bash
npx wrangler d1 export tolmol-waitlist --remote --output backup-$(date +%Y%m%d).sql
```

### Manual deploy still works

`npm run deploy` from a dev machine still ships straight to the same Worker — useful for hotfixes when CI is slow. It does **not** apply migrations; run `npm run d1:apply:remote` first if your change includes one.
