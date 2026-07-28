import { DatabaseSync } from "node:sqlite";
import path from "node:path";

/**
 * Local dev-only entitlement store using Node's built-in SQLite (no native
 * build step, unlike better-sqlite3). Vercel's filesystem is ephemeral and
 * not shared across serverless instances, so this file will NOT persist in
 * production — swap this module for Supabase/Postgres before going live.
 * See README.md "Antes de cobrar en vivo".
 */
const dbPath = path.join(process.cwd(), ".data", "subscribers.sqlite");

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;

  const fs = require("node:fs") as typeof import("node:fs");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      email TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      stripe_customer_id TEXT,
      current_period_end INTEGER
    )
  `);
  return db;
}

export type Subscriber = {
  email: string;
  status: string;
  stripe_customer_id: string | null;
  current_period_end: number | null;
};

export function upsertSubscriber(sub: Subscriber): void {
  getDb()
    .prepare(
      `INSERT INTO subscribers (email, status, stripe_customer_id, current_period_end)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         status = excluded.status,
         stripe_customer_id = excluded.stripe_customer_id,
         current_period_end = excluded.current_period_end`
    )
    .run(sub.email, sub.status, sub.stripe_customer_id, sub.current_period_end);
}

export function isActiveSubscriber(email: string): boolean {
  // Vercel's serverless filesystem is read-only outside /tmp, so getDb() can
  // throw in production (can't create .data/). Fail closed instead of
  // bubbling a 500 up through the login route — "can't verify" must mean
  // "no access", never a crash that leaks a stack trace.
  let row: { status: string; current_period_end: number | null } | undefined;
  try {
    row = getDb()
      .prepare(`SELECT status, current_period_end FROM subscribers WHERE email = ?`)
      .get(email.toLowerCase().trim()) as
      | { status: string; current_period_end: number | null }
      | undefined;
  } catch (error) {
    console.error("isActiveSubscriber: db unavailable, denying access", error);
    return false;
  }

  if (!row) return false;
  if (row.status !== "active") return false;
  if (row.current_period_end && row.current_period_end * 1000 < Date.now()) return false;
  return true;
}
