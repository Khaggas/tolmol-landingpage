CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  product TEXT,
  source TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_product_unique
  ON waitlist (email, COALESCE(product, ''));

CREATE INDEX IF NOT EXISTS waitlist_created_at_idx
  ON waitlist (created_at);
