// Builds: PR4, O-listing
// Loads firms from a JSON file (kept outside git: company data is not committed) into the SQLite database.
// Usage: npm run db:seed [-- path/to/firms.json]. Idempotent on company number.
import { readFileSync, mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { openDb } from "../src/db"
import { firms, firmRegions, firmSurveys } from "../src/db/schema"
import { REGION_SLUGS, SURVEY_SLUGS, UK_WIDE } from "../src/catalog"

const Firm = z.object({
  companyNumber: z.string().regex(/^[A-Z0-9]{8}$/),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  website: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  town: z.string().default(""),
  county: z.string().default(""),
  baseRegion: z.string().default(""),
  regions: z.array(z.string()).default([]),
  surveys: z.array(z.string()).default([]),
  summary: z.string().max(200).default(""),
  accreditations: z.array(z.string()).default([]),
})

const source = process.argv[2] ?? "data/seed/firms.json"
const dbPath = process.env.DATABASE_PATH ?? "data/macan.db"
const rows = z.array(Firm).parse(JSON.parse(readFileSync(source, "utf8")))

const unknown = rows.flatMap((f) => [
  ...f.surveys.filter((s) => !SURVEY_SLUGS.includes(s)).map((s) => `${f.slug}: survey ${s}`),
  ...[...f.regions, f.baseRegion].filter((r) => r && r !== UK_WIDE && !REGION_SLUGS.includes(r)).map((r) => `${f.slug}: region ${r}`),
])
if (unknown.length) throw new Error(`Unknown catalogue values:\n${unknown.join("\n")}`)

mkdirSync(dirname(dbPath), { recursive: true })
const db = openDb(dbPath, { create: true })
let loaded = 0
const skipped: string[] = []
for (const f of rows) {
  if (f.surveys.length === 0) { skipped.push(`${f.name} (no planning surveys)`); continue }
  db.transaction((tx) => {
    const values = {
      slug: f.slug, companyNumber: f.companyNumber, name: f.name, summary: f.summary,
      website: f.website || null, phone: f.phone || null, email: f.email || null,
      town: f.town || null, county: f.county || null, baseRegion: f.baseRegion || null,
      accreditations: f.accreditations,
    }
    const row = tx.insert(firms).values(values)
      .onConflictDoUpdate({ target: firms.companyNumber, set: values }).returning({ id: firms.id }).get()
    tx.delete(firmSurveys).where(eq(firmSurveys.firmId, row.id)).run()
    tx.delete(firmRegions).where(eq(firmRegions.firmId, row.id)).run()
    tx.insert(firmSurveys).values(f.surveys.map((survey) => ({ firmId: row.id, survey }))).run()
    const regions = [...new Set([...f.regions, f.baseRegion].filter(Boolean))]
    if (regions.length) tx.insert(firmRegions).values(regions.map((region) => ({ firmId: row.id, region }))).run()
  })
  loaded++
}
console.log(`Loaded ${loaded} firms into ${dbPath}.${skipped.length ? ` Skipped: ${skipped.join("; ")}.` : ""}`)
