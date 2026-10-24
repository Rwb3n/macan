// Builds: O-lead, O-listing, O-claim, O-brief
import { sqliteTable, text, integer, primaryKey, index } from "drizzle-orm/sqlite-core"
import type { Qualification } from "../qualify"
import type { Facts } from "../jobsheet"

const createdAt = () => integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date())

export const firms = sqliteTable("firms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  companyNumber: text("company_number").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary").notNull().default(""),
  website: text("website"),
  phone: text("phone"),
  // Generic business inbox only (info@, enquiries@). Never a named person's address.
  email: text("email"),
  town: text("town"),
  county: text("county"),
  baseRegion: text("base_region"),
  accreditations: text("accreditations", { mode: "json" }).$type<string[]>().notNull().default([]),
  claimedAt: integer("claimed_at", { mode: "timestamp" }),
  // Set by the firm when booked up (O-listing: paused). Paused firms are offered no briefs.
  pausedAt: integer("paused_at", { mode: "timestamp" }),
  createdAt: createdAt(),
})

export const firmSurveys = sqliteTable("firm_surveys", {
  firmId: integer("firm_id").notNull().references(() => firms.id, { onDelete: "cascade" }),
  survey: text("survey").notNull(),
}, (t) => [primaryKey({ columns: [t.firmId, t.survey] }), index("firm_surveys_survey").on(t.survey)])

// "uk-wide" or a region slug from the catalogue.
export const firmRegions = sqliteTable("firm_regions", {
  firmId: integer("firm_id").notNull().references(() => firms.id, { onDelete: "cascade" }),
  region: text("region").notNull(),
}, (t) => [primaryKey({ columns: [t.firmId, t.region] }), index("firm_regions_region").on(t.region)])

// A buyer's lead: one site, one survey. Holds personal data (name, email, phone): kept only as long as the retention rule allows.
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  survey: text("survey").notNull(),
  region: text("region").notNull(),
  postcode: text("postcode").notNull(),
  // The local council for the site, looked up from the postcode (PR1); null if the lookup failed.
  council: text("council"),
  projectType: text("project_type").notNull(),
  planningStage: text("planning_stage").notNull(),
  councilRef: text("council_ref"),
  deadline: text("deadline"),
  details: text("details").notNull(),
  // The one free-text answer asked before job sheets (D27); kept for older leads.
  answer: text("answer").notNull().default(""),
  // The job-sheet answers (D27, R12): field id → { value, quote when read from the buyer's words }.
  sheet: text("sheet", { mode: "json" }).$type<Facts>().notNull().default({}),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  firmId: integer("firm_id").references(() => firms.id, { onDelete: "set null" }),
  // sha256 of the emailed confirmation token; the token itself is never stored.
  tokenHash: text("token_hash").notNull().unique(),
  confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
  grade: text("grade").notNull(),
  qualification: text("qualification", { mode: "json" }).$type<Qualification>().notNull(),
  // new → approved / rejected by the operator.
  review: text("review").notNull().default("new"),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  // When the operator routed it to firms (PR2); its routing state is read from its briefs.
  routedAt: integer("routed_at", { mode: "timestamp" }),
  // The buyer's private status link (D22). Kept as issued, not hashed, so later emails can repeat it; it shows only
  // this request, which already holds the buyer's own details in this row.
  statusToken: text("status_token").unique(),
  // How many firms see it: 3 by default, or the buyer's choice of 5, 10 or 0 = every firm covering the area (D24).
  poolSize: integer("pool_size").notNull().default(3),
  cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
  createdAt: createdAt(),
}, (t) => [index("leads_grade").on(t.grade, t.review)])

// One lead offered to one firm (O-brief). The buyer's contact is shown only once the brief is unlocked.
export const briefs = sqliteTable("briefs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  firmId: integer("firm_id").notNull().references(() => firms.id, { onDelete: "cascade" }),
  state: text("state").notNull().default("offered"),
  // sha256 of the token in the firm's link; the token itself is never stored.
  tokenHash: text("token_hash").notNull().unique(),
  offeredAt: integer("offered_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  decidedAt: integer("decided_at", { mode: "timestamp" }),
  // One reminder, halfway through the firm's time; it carries a second link to the same brief.
  chasedAt: integer("chased_at", { mode: "timestamp" }),
  chaseTokenHash: text("chase_token_hash").unique(),
  // Owed on unlock (M1); how it is settled is open (Q16).
  feePence: integer("fee_pence"),
}, (t) => [index("briefs_lead").on(t.leadId), index("briefs_state").on(t.state, t.expiresAt)])

export const claimRequests = sqliteTable("claim_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firmId: integer("firm_id").notNull().references(() => firms.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  // sha256 of the emailed confirmation token; the token itself is never stored. Null on claims made before PR3 step 2.
  tokenHash: text("token_hash").unique(),
  confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
  createdAt: createdAt(),
})
