// Builds: infra
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
  paused_at INTEGER,
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
DROP TABLE IF EXISTS quote_requests;
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  survey TEXT NOT NULL, region TEXT NOT NULL, postcode TEXT NOT NULL, council TEXT,
  project_type TEXT NOT NULL, planning_stage TEXT NOT NULL, council_ref TEXT, deadline TEXT,
  details TEXT NOT NULL, answer TEXT NOT NULL DEFAULT '', sheet TEXT NOT NULL DEFAULT '{}',
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
  firm_id INTEGER REFERENCES firms(id) ON DELETE SET NULL,
  token_hash TEXT NOT NULL UNIQUE,
  confirmed_at INTEGER,
  grade TEXT NOT NULL,
  qualification TEXT NOT NULL,
  review TEXT NOT NULL DEFAULT 'new',
  reviewed_at INTEGER,
  routed_at INTEGER,
  status_token TEXT UNIQUE,
  pool_size INTEGER NOT NULL DEFAULT 3,
  cancelled_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS leads_grade ON leads(grade, review);
CREATE TABLE IF NOT EXISTS briefs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  firm_id INTEGER NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'offered',
  token_hash TEXT NOT NULL UNIQUE,
  offered_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, decided_at INTEGER,
  chased_at INTEGER, chase_token_hash TEXT UNIQUE,
  fee_pence INTEGER
);
CREATE INDEX IF NOT EXISTS briefs_lead ON briefs(lead_id);
CREATE INDEX IF NOT EXISTS briefs_state ON briefs(state, expires_at);
CREATE TABLE IF NOT EXISTS claim_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firm_id INTEGER NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token_hash TEXT UNIQUE,
  confirmed_at INTEGER,
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
  // Databases made before routing (PR2) and claim confirmation (PR3): add their columns.
  const has = (table: string, col: string) => (sqlite.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).some((c) => c.name === col)
  if (!has("firms", "paused_at")) sqlite.exec("ALTER TABLE firms ADD COLUMN paused_at INTEGER")
  if (!has("leads", "routed_at")) sqlite.exec("ALTER TABLE leads ADD COLUMN routed_at INTEGER")
  if (!has("leads", "council")) sqlite.exec("ALTER TABLE leads ADD COLUMN council TEXT")
  if (!has("leads", "sheet")) sqlite.exec("ALTER TABLE leads ADD COLUMN sheet TEXT NOT NULL DEFAULT '{}'")
  if (!has("leads", "status_token")) {
    sqlite.exec("ALTER TABLE leads ADD COLUMN status_token TEXT; ALTER TABLE leads ADD COLUMN pool_size INTEGER NOT NULL DEFAULT 3; ALTER TABLE leads ADD COLUMN cancelled_at INTEGER")
    sqlite.exec("CREATE UNIQUE INDEX IF NOT EXISTS leads_status_token ON leads(status_token)")
  }
  if (!has("briefs", "chased_at")) {
    sqlite.exec("ALTER TABLE briefs ADD COLUMN chased_at INTEGER; ALTER TABLE briefs ADD COLUMN chase_token_hash TEXT")
    sqlite.exec("CREATE UNIQUE INDEX IF NOT EXISTS briefs_chase_token ON briefs(chase_token_hash)")
  }
  if (!has("claim_requests", "token_hash")) {
    sqlite.exec("ALTER TABLE claim_requests ADD COLUMN token_hash TEXT; ALTER TABLE claim_requests ADD COLUMN confirmed_at INTEGER")
    sqlite.exec("CREATE UNIQUE INDEX IF NOT EXISTS claim_requests_token ON claim_requests(token_hash)")
  }
  return drizzle(sqlite, { schema })
}

let shared: Db | undefined
export function db(): Db {
  shared ??= openDb(process.env.DATABASE_PATH ?? "data/macan.db")
  return shared
}
