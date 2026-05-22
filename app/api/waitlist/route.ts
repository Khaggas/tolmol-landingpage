import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { email, product, source, hp } = (body ?? {}) as {
    email?: unknown;
    product?: unknown;
    source?: unknown;
    hp?: unknown;
  };

  if (typeof hp === "string" && hp.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const productStr =
    typeof product === "string" && product.trim().length > 0
      ? product.trim().slice(0, 200)
      : null;
  const sourceStr =
    typeof source === "string" && source.trim().length > 0
      ? source.trim().slice(0, 60)
      : null;

  const ua = request.headers.get("user-agent")?.slice(0, 300) ?? null;
  const now = Date.now();

  const { env } = getCloudflareContext();
  const db = (env as { DB?: D1Database }).DB;
  if (!db) {
    return NextResponse.json({ error: "db_unavailable" }, { status: 503 });
  }

  try {
    await db
      .prepare(
        "INSERT INTO waitlist (email, product, source, user_agent, created_at) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(email.toLowerCase(), productStr, sourceStr, ua, now)
      .run();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE/i.test(message)) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }
}
