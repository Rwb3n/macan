import { beforeEach, describe, expect, it } from "vitest"
import { openDb, type Db } from "./db"
import { firms, firmRegions, firmSurveys, claimRequests } from "./db/schema"
import { findFirms, firmBySlug, surveyCounts } from "./directory"
import { submitClaim } from "./requests"

let db: Db

function addFirm(slug: string, o: { surveys: string[]; regions: string[]; base?: string; website?: string }) {
  const row = db.insert(firms).values({ slug, companyNumber: slug.padEnd(8, "0").slice(0, 8).toUpperCase(), name: slug, baseRegion: o.base ?? null, website: o.website ?? null })
    .returning({ id: firms.id }).get()
  if (o.surveys.length) db.insert(firmSurveys).values(o.surveys.map((survey) => ({ firmId: row.id, survey }))).run()
  if (o.regions.length) db.insert(firmRegions).values(o.regions.map((region) => ({ firmId: row.id, region }))).run()
}

beforeEach(() => {
  db = openDb(":memory:")
  addFirm("bats-north", { surveys: ["bat-survey"], regions: ["north-west"], base: "north-west", website: "https://www.batsnorth.co.uk" })
  addFirm("everywhere", { surveys: ["bat-survey", "flood-risk-assessment"], regions: ["uk-wide", "south-east"], base: "south-east" })
  addFirm("flood-only", { surveys: ["flood-risk-assessment"], regions: ["north-west"], base: "north-west" })
})

describe("findFirms", () => {
  it("filters by survey", () => {
    expect(findFirms(db, { survey: "bat-survey" }).map((f) => f.slug).sort()).toEqual(["bats-north", "everywhere"])
  })
  it("includes uk-wide firms in every region, local firms first", () => {
    expect(findFirms(db, { survey: "bat-survey", region: "north-west" }).map((f) => f.slug)).toEqual(["bats-north", "everywhere"])
  })
  it("excludes firms outside the region", () => {
    expect(findFirms(db, { survey: "flood-risk-assessment", region: "scotland" }).map((f) => f.slug)).toEqual(["everywhere"])
  })
  it("returns tags", () => {
    expect(firmBySlug(db, "everywhere")?.surveys.sort()).toEqual(["bat-survey", "flood-risk-assessment"])
  })
  it("counts firms per survey", () => {
    expect(surveyCounts(db).get("bat-survey")).toBe(2)
  })
})

describe("submitClaim", () => {
  it("accepts an address on the firm's domain", () => {
    expect(submitClaim(db, { firm: "bats-north", email: "Info@BatsNorth.co.uk" })).toEqual({ ok: true })
    expect(db.select().from(claimRequests).get()?.email).toBe("info@batsnorth.co.uk")
  })
  it("refuses another domain and stores nothing", () => {
    expect(submitClaim(db, { firm: "bats-north", email: "me@gmail.com" }).ok).toBe(false)
    expect(db.select().from(claimRequests).all()).toHaveLength(0)
  })
  it("refuses a firm with no website", () => {
    expect(submitClaim(db, { firm: "flood-only", email: "me@flood-only.co.uk" }).ok).toBe(false)
  })
})
