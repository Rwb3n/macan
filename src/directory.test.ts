import { beforeEach, describe, expect, it } from "vitest"
import { openDb, type Db } from "./db"
import { firms, firmRegions, firmSurveys, claimRequests } from "./db/schema"
import { coverageCounts, findFirms, firmBySlug, surveyCounts } from "./directory"
import { claimByToken, confirmClaim, submitClaim } from "./requests"
import { memoryMailer } from "./mailer"

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

describe("coverageCounts", () => {
  it("counts firms per survey and region, uk-wide firms in every region", () => {
    const c = coverageCounts(db)
    expect(c["bat-survey"]?.["north-west"]).toBe(2)
    expect(c["bat-survey"]?.["scotland"]).toBe(1)
    expect(c["flood-risk-assessment"]?.["north-west"]).toBe(2)
    expect(c["flood-risk-assessment"]?.["south-east"]).toBe(1)
  })
})

describe("submitClaim and confirmClaim", () => {
  const deps = () => ({ db, mailer, now: () => new Date(Date.UTC(2026, 9, 24)), baseUrl: "http://test" })
  let mailer: ReturnType<typeof memoryMailer>
  beforeEach(() => { mailer = memoryMailer() })
  const token = () => mailer.sent.at(-1)!.text.match(/\/claims\/confirm\/([\w-]+)/)![1]!

  it("accepts an address on the firm's domain and emails it a link; the listing stays unclaimed", async () => {
    expect(await submitClaim(deps(), { firm: "bats-north", email: "Info@BatsNorth.co.uk" })).toEqual({ ok: true })
    const claim = db.select().from(claimRequests).get()!
    expect(claim.email).toBe("info@batsnorth.co.uk")
    expect(mailer.sent[0]?.to).toBe("info@batsnorth.co.uk")
    expect(claim.tokenHash).not.toContain(token())
    expect(firmBySlug(db, "bats-north")?.claimedAt).toBeNull()
  })
  it("pressing the link's button confirms the claim and claims the listing, once", async () => {
    await submitClaim(deps(), { firm: "bats-north", email: "info@batsnorth.co.uk" })
    const t = token()
    expect(claimByToken(db, t)?.firm.slug).toBe("bats-north")
    expect(confirmClaim(deps(), t)).toBe(true)
    const claimedAt = firmBySlug(db, "bats-north")?.claimedAt
    expect(claimedAt).toBeInstanceOf(Date)
    expect(confirmClaim({ db, now: () => new Date(Date.UTC(2027, 0, 1)) }, t)).toBe(true)
    expect(firmBySlug(db, "bats-north")?.claimedAt).toEqual(claimedAt)
    expect(confirmClaim(deps(), "nope")).toBe(false)
  })
  it("refuses another domain and stores and sends nothing", async () => {
    expect((await submitClaim(deps(), { firm: "bats-north", email: "me@gmail.com" })).ok).toBe(false)
    expect(db.select().from(claimRequests).all()).toHaveLength(0)
    expect(mailer.sent).toHaveLength(0)
  })
  it("refuses a firm with no website", async () => {
    expect((await submitClaim(deps(), { firm: "flood-only", email: "me@flood-only.co.uk" })).ok).toBe(false)
  })
})
