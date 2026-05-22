# Tolmol landing — team docs

Onboarding docs for anyone working on the Tolmol marketing site. Read top-to-bottom on day one.

## Contents

| Doc | What's in it |
| --- | --- |
| [setup.md](./setup.md) | Get the project running locally in ~5 minutes |
| [architecture.md](./architecture.md) | Stack overview, request flow, where files live |
| [waitlist.md](./waitlist.md) | The `/api/waitlist` contract + D1 schema + migrations |
| [frontend.md](./frontend.md) | Theme tokens, page anatomy, animation conventions |
| [deployment.md](./deployment.md) | Cloudflare Workers + D1 deploy flow, secrets, analytics |

## Repo at a glance

```
app/                       # Next.js App Router
  layout.tsx               # Root layout, metadata, analytics beacon
  page.tsx                 # Hero + 4 step sections + waitlist + footer
  globals.css              # Tailwind layers + a few utilities
  icon.tsx                 # Dynamic favicon via next/og
  opengraph-image.tsx      # Dynamic OG image via next/og
  api/waitlist/route.ts    # POST → D1 insert
migrations/                # D1 SQL migrations, applied via wrangler
docs/                      # ← you are here
wrangler.jsonc             # Workers config + D1 binding
open-next.config.ts        # OpenNext Cloudflare adapter config
next.config.mjs            # Hooks initOpenNextCloudflareForDev
tailwind.config.ts         # Theme tokens (ink, cyanline, mist, etc.)
```

## Ground rules

- **Monochromatic discipline.** The theme is ink (`#030712`), white, slate, and one accent (`cyanline` = `#2563eb`). Don't introduce new hues. If you need contrast, reach for slate shades and weight changes, not color.
- **No silent failure on the form.** The waitlist is the whole point of the page. Anything that breaks `/api/waitlist` is a P0.
- **Don't add a runtime dep without a reason.** The bundle is small and we want to keep it that way.
- **Migrations are append-only.** Never edit a migration that has been applied to remote. Add a new one.
