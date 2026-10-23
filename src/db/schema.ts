import { sqliteTable, text, integer, primaryKey, index } from "drizzle-orm/sqlite-core"

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

// A buyer's request for quotes. Holds personal data: kept only as long as the retention rule allows.
export const quoteRequests = sqliteTable("quote_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  survey: text("survey").notNull(),
  region: text("region").notNull(),
  postcode: text("postcode").notNull(),
  details: text("details").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  firmId: integer("firm_id").references(() => firms.id, { onDelete: "set null" }),
  createdAt: createdAt(),
})

export const claimRequests = sqliteTable("claim_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firmId: integer("firm_id").notNull().references(() => firms.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  createdAt: createdAt(),
})
