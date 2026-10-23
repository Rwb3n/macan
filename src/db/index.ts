import Database from "better-sqlite3"
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3"
import { existsSync } from "node:fs"
import * as schema from "./schema"

export type Db = BetterSQLite3Database<typeof schema>

export const DDL = `
CREATE TABLE IF NOT EXISTS firms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  company_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  website TEXT, phone TEXT, email TEXT, town TEXT, county TEXT, base_region TEXT,
  accreditations TEXT NOT NULL DEFAULT '[]',
  claimed_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS firm_surveys (
  firm_id INTEGER NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  survey TEXT NOT NULL,
  PRIMARY KEY (firm_id, survey)
);
CREATE INDEX IF NOT EXISTS firm_surveys_survey ON firm_surveys(survey);
CREATE TABLE IF NOT EXISTS firm_regions (
  firm_id INTEGER NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  PRIMARY KEY (firm_id, region)
);
CREATE INDEX IF NOT EXISTS firm_regions_region ON firm_regions(region);
CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  survey TEXT NOT NULL, region TEXT NOT NULL, postcode TEXT NOT NULL, details TEXT NOT NULL,
  name TEXT NOT NULL, email TEXT NOT NULL,
  firm_id INTEGER REFERENCES firms(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS claim_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firm_id INTEGER NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
`

export function openDb(path: string, { create = false } = {}): Db {
  if (!create && path !== ":memory:" && !existsSync(path)) {
    throw new Error(`Database not found at ${path}. Run \`npm run db:seed\` first.`)
  }
  const sqlite = new Database(path)
  sqlite.pragma("journal_mode = WAL")
  sqlite.pragma("foreign_keys = ON")
  sqlite.exec(DDL)
  return drizzle(sqlite, { schema })
}

let shared: Db | undefined
export function db(): Db {
  shared ??= openDb(process.env.DATABASE_PATH ?? "data/macan.db")
  return shared
}
