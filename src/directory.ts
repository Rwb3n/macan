// Builds: U2, ST-U2.2, O-listing
import { and, asc, eq, inArray, sql } from "drizzle-orm"
import type { Db } from "./db"
import { firms, firmRegions, firmSurveys } from "./db/schema"
import { REGION_SLUGS, UK_WIDE } from "./catalog"

export type FirmCard = typeof firms.$inferSelect & { surveys: string[]; regions: string[] }

// Firms offering a survey (if given) that work in a region (if given; uk-wide firms always match).
// Local firms first, then claimed, then by name.
export function findFirms(db: Db, filter: { survey?: string; region?: string } = {}): FirmCard[] {
  const conditions = []
  if (filter.survey) {
    conditions.push(inArray(firms.id, db.select({ id: firmSurveys.firmId }).from(firmSurveys).where(eq(firmSurveys.survey, filter.survey))))
  }
  if (filter.region) {
    conditions.push(inArray(firms.id, db.select({ id: firmRegions.firmId }).from(firmRegions).where(inArray(firmRegions.region, [filter.region, UK_WIDE]))))
  }
  const rows = db.select().from(firms).where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...[
      ...(filter.region ? [sql`case when ${firms.baseRegion} = ${filter.region} then 0 else 1 end`] : []),
      sql`case when ${firms.claimedAt} is null then 1 else 0 end`,
      asc(firms.name),
    ]).all()
  return withTags(db, rows)
}

export function firmBySlug(db: Db, slug: string): FirmCard | undefined {
  const row = db.select().from(firms).where(eq(firms.slug, slug)).get()
  return row ? withTags(db, [row])[0] : undefined
}

// Number of firms per survey slug.
export function surveyCounts(db: Db): Map<string, number> {
  const rows = db.select({ survey: firmSurveys.survey, n: sql<number>`count(*)` }).from(firmSurveys).groupBy(firmSurveys.survey).all()
  return new Map(rows.map((r) => [r.survey, r.n]))
}

function withTags(db: Db, rows: (typeof firms.$inferSelect)[]): FirmCard[] {
  if (rows.length === 0) return []
  const ids = rows.map((r) => r.id)
  const surveys = db.select().from(firmSurveys).where(inArray(firmSurveys.firmId, ids)).all()
  const regions = db.select().from(firmRegions).where(inArray(firmRegions.firmId, ids)).all()
  return rows.map((r) => ({
    ...r,
    surveys: surveys.filter((s) => s.firmId === r.id).map((s) => s.survey),
    regions: regions.filter((g) => g.firmId === r.id).map((g) => g.region),
  }))
}

// Firms per survey and region (uk-wide firms count in every region), for the buyer's instant answer (ST-U2.2).
export function coverageCounts(db: Db): Record<string, Record<string, number>> {
  const rows = db.select({ survey: firmSurveys.survey, region: firmRegions.region, firmId: firms.id }).from(firms)
    .innerJoin(firmSurveys, eq(firmSurveys.firmId, firms.id)).innerJoin(firmRegions, eq(firmRegions.firmId, firms.id)).all()
  const seen: Record<string, Record<string, Set<number>>> = {}
  for (const r of rows) {
    const regions = r.region === UK_WIDE ? REGION_SLUGS : [r.region]
    for (const g of regions) ((seen[r.survey] ??= {})[g] ??= new Set()).add(r.firmId)
  }
  return Object.fromEntries(Object.entries(seen).map(([s, byRegion]) => [s, Object.fromEntries(Object.entries(byRegion).map(([g, ids]) => [g, ids.size]))]))
}
