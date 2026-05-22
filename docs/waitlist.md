# Waitlist — API + DB

The waitlist captures `(email, optional product)` pairs in Cloudflare D1. It's the only persistent data the site stores.

## Endpoint

`POST /api/waitlist`

### Request body

```json
{
  "email": "user@example.com",
  "product": "RTX 4070",
  "source": "landing",
  "hp": ""
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `email` | string | yes | Validated against `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, max 254 chars, lowercased before insert |
| `product` | string | no | Trimmed, max 200 chars, `""` → stored as `NULL` |
| `source` | string | no | Free-form tag for where the signup came from (e.g. `landing`, `step-4-cta`). Max 60 chars |
| `hp` | string | no | **Honeypot.** If non-empty, request silently returns 200 without an insert |

### Responses

| Code | Body | Meaning |
| --- | --- | --- |
| `200` | `{ "ok": true }` | Inserted |
| `200` | `{ "ok": true, "duplicate": true }` | Already on the list — same `(email, product)` exists. Treated as success on the frontend |
| `200` | `{ "ok": true }` (honeypot tripped) | Bot suspected, silently dropped |
| `400` | `{ "error": "invalid_email" }` | Email failed validation |
| `400` | `{ "error": "invalid_json" }` | Body wasn't JSON |
| `503` | `{ "error": "db_unavailable" }` | D1 binding missing — config issue |
| `500` | `{ "error": "insert_failed" }` | D1 raised a non-UNIQUE error |

The frontend handler in `app/page.tsx` collapses 200+409-style outcomes into "you're on the list" and shows `"That email doesn't look right."` on 400.

## Database

### Schema (`migrations/0001_create_waitlist.sql`)

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  product TEXT,
  source TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL    -- epoch ms
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_product_unique
  ON waitlist (email, COALESCE(product, ''));

CREATE INDEX IF NOT EXISTS waitlist_created_at_idx
  ON waitlist (created_at);
```

The `COALESCE(product, '')` in the unique index lets one email subscribe with multiple products **and** lets one email subscribe with no product at all, while still blocking exact duplicates.

### Migrations workflow

- New migrations live in `migrations/` named `NNNN_short_description.sql`, monotonically increasing.
- Migrations are append-only. Never edit one that has been applied to remote — write a follow-up that alters/fixes.
- Apply order: `npm run d1:apply:local` first (to validate), then `npm run d1:apply:remote` once it merges to main.
- Wrangler tracks applied migrations in a `d1_migrations` table inside the D1 itself, so re-running is a no-op.

### Useful queries

Count signups:
```bash
npx wrangler d1 execute tolmol-waitlist --remote --command "SELECT COUNT(*) FROM waitlist"
```

Recent 20 with product:
```bash
npx wrangler d1 execute tolmol-waitlist --remote --command \
  "SELECT datetime(created_at/1000,'unixepoch') AS ts, email, product, source FROM waitlist ORDER BY id DESC LIMIT 20"
```

Top watched products:
```bash
npx wrangler d1 execute tolmol-waitlist --remote --command \
  "SELECT LOWER(product) AS p, COUNT(*) c FROM waitlist WHERE product IS NOT NULL GROUP BY LOWER(product) ORDER BY c DESC LIMIT 20"
```

Export to CSV:
```bash
npx wrangler d1 export tolmol-waitlist --remote --output waitlist.sql
```

## Security & abuse

- **Honeypot** — invisible `hp` field; bots that fill every input get silently accepted (returning a clean 200 so they don't retry).
- **Email length cap** at 254 chars (RFC 5321) prevents pathological payloads.
- **No PII beyond email + product** — we deliberately don't store IP. `user_agent` is stored truncated to 300 chars for basic abuse triage.
- **Rate limiting** — not implemented at the app layer. If we get abused, add a Cloudflare Rate Limiting rule on `/api/waitlist`. Free plan includes one rule.

## When to add a new field

If marketing wants something new (e.g. `referrer`, `utm_source`), the flow is:

1. Add migration `migrations/NNNN_add_<field>.sql` with `ALTER TABLE waitlist ADD COLUMN <field> TEXT;`
2. Update `app/api/waitlist/route.ts` to read it off the body and pass to `bind(...)`.
3. Update `WaitlistSection` in `app/page.tsx` to send it.
4. Update this doc.
