import { beforeEach, describe, expect, it } from "vitest"
import { eq } from "drizzle-orm"
import { openDb, type Db } from "./db"
import { briefs, firmRegions, firmSurveys, firms, leads } from "./db/schema"
import { memoryMailer } from "./mailer"
import { briefByToken, decideBrief, lapseBriefs, leadRouting, matchFirms, routeLead, setPaused, type Deps } from "./routing"
import { ROUTING } from "@model/how"

let deps: Deps & { mailer: ReturnType<typeof memoryMailer> }
let clock: Date
const oct = new Date(Date.UTC(2026, 9, 24, 9))

// Synthetic firms only.
function firm(slug: string, o: { claimed?: boolean; email?: string | null; region?: string; survey?: string } = {}): number {
  const id = deps.db.insert(firms).values({
    slug, companyNumber: slug.toUpperCase(), name: `Firm ${slug}`, email: o.email === undefined ? `info@${slug}.test` : o.email,
    claimedAt: o.claimed === false ? null : oct, baseRegion: o.region ?? "south-east",
  }).returning({ id: firms.id }).get().id
  deps.db.insert(firmSurveys).values({ firmId: id, survey: o.survey ?? "bat-survey" }).run()
  deps.db.insert(firmRegions).values({ firmId: id, region: o.region ?? "south-east" }).run()
  return id
}

function lead(o: { review?: string; firmId?: number; details?: string } = {}): number {
  return deps.db.insert(leads).values({
    survey: "bat-survey", region: "south-east", postcode: "OX1 2JD", projectType: "loft", planningStage: "council-asked",
    deadline: "2027-07-01", details: o.details ?? "1930s semi, loft conversion with two dormers.", answer: "clay tiles",
    name: "Sam Buyer", email: "sam@example.com", phone: "07700 900123", firmId: o.firmId ?? null,
    tokenHash: `t${Math.random()}`, grade: "qualified", qualification: {} as never, review: o.review ?? "approved",
  }).returning({ id: leads.id }).get().id
}

const tokens = () => deps.mailer.sent.flatMap((m) => [...m.text.matchAll(/\/briefs\/([\w-]+)/g)].map((x) => x[1]!))

beforeEach(() => {
  clock = oct
  deps = { db: openDb(":memory:") as Db, mailer: memoryMailer(), now: () => clock, baseUrl: "http://test" }
})

describe("matchFirms", () => {
  it("takes firms for the survey and region with an inbox, not paused, claimed, at most firmsPerLead, the buyer's pick first", () => {
    const ids = ["a", "b", "c", "d"].map((s) => firm(s))
    firm("unclaimed", { claimed: false })
    firm("noinbox", { email: null })
    firm("elsewhere", { region: "wales" })
    firm("flood", { survey: "flood-risk-assessment" })
    const paused = firm("paused")
    setPaused(deps, paused, true)
    const l = deps.db.select().from(leads).where(eq(leads.id, lead({ firmId: ids[3] }))).get()!
    const got = matchFirms(deps.db, l).map((f) => f.slug)
    expect(got).toHaveLength(ROUTING.firmsPerLead)
    expect(got[0]).toBe("d")
    expect(got).not.toContain("unclaimed")
    expect(got).not.toContain("paused")
  })
})

describe("routeLead", () => {
  it("offers briefs with the contact hidden, and the lead is offered", async () => {
    firm("a"); firm("b")
    const id = lead({ details: "Loft job. Call me on 07700 900123 or sam@example.com" })
    expect(await routeLead(deps, id)).toEqual({ routing: "offered", offered: 2 })
    expect(leadRouting(deps.db, id)).toBe("offered")
    const mail = deps.mailer.sent[0]!
    expect(mail.subject).toContain("OX1")
    for (const leak of ["Sam Buyer", "sam@example.com", "07700 900123", "OX1 2JD"]) expect(mail.text).not.toContain(leak)
    const v = briefByToken(deps.db, tokens()[0]!)!
    expect(v.contact).toBeUndefined()
    expect(v.details).toContain("[phone hidden]")
    expect(v.details).toContain("[email hidden]")
  })
  it("routes only approved leads, and only once", async () => {
    firm("a")
    await expect(routeLead(deps, lead({ review: "new" }))).rejects.toThrow("only approved")
    const id = lead()
    await routeLead(deps, id)
    await expect(routeLead(deps, id)).rejects.toThrow("already been routed")
  })
  it("with no matching firm, the lead expires and the buyer is told", async () => {
    const id = lead()
    expect(await routeLead(deps, id)).toEqual({ routing: "expired", offered: 0 })
    expect(leadRouting(deps.db, id)).toBe("expired")
    expect(deps.mailer.sent[0]?.to).toBe("sam@example.com")
  })
})

describe("decideBrief", () => {
  it("unlock shows the contact, records the fee owed, tells the buyer the firm's name; the lead closes once none is deciding", async () => {
    firm("a"); firm("b")
    const id = lead()
    await routeLead(deps, id)
    const [t1, t2] = tokens()
    const v = await decideBrief(deps, t1!, "unlock")
    expect(v.contact?.email).toBe("sam@example.com")
    expect(deps.db.select().from(briefs).all().find((b) => b.state === "unlocked")?.feePence).toBe(ROUTING.unlockFeePence)
    expect(deps.mailer.sent.at(-1)?.subject).toContain("Firm a")
    expect(leadRouting(deps.db, id)).toBe("offered")
    await decideBrief(deps, t2!, "decline")
    expect(leadRouting(deps.db, id)).toBe("closed")
    await expect(decideBrief(deps, t1!, "decline")).rejects.toThrow("Brief is unlocked")
  })
  it("when every firm passes, the lead expires and the buyer hears once", async () => {
    firm("a"); firm("b")
    const id = lead()
    await routeLead(deps, id)
    const sentBefore = deps.mailer.sent.length
    for (const t of tokens()) await decideBrief(deps, t, "decline")
    expect(leadRouting(deps.db, id)).toBe("expired")
    expect(deps.mailer.sent.slice(sentBefore).filter((m) => m.to === "sam@example.com")).toHaveLength(1)
  })
  it("a brief past its time cannot be unlocked; it lapses", async () => {
    firm("a")
    await routeLead(deps, lead())
    clock = new Date(oct.getTime() + (ROUTING.replyHours + 1) * 3600_000)
    await expect(decideBrief(deps, tokens()[0]!, "unlock")).rejects.toThrow("lapsed")
    expect(deps.db.select().from(briefs).get()?.state).toBe("lapsed")
  })
})

describe("lapseBriefs", () => {
  it("lapses overdue briefs and tells the buyer when nothing was unlocked", async () => {
    firm("a"); firm("b")
    const id = lead()
    await routeLead(deps, id)
    expect(await lapseBriefs(deps)).toBe(0)
    clock = new Date(oct.getTime() + (ROUTING.replyHours + 1) * 3600_000)
    expect(await lapseBriefs(deps)).toBe(2)
    expect(leadRouting(deps.db, id)).toBe("expired")
    expect(deps.mailer.sent.at(-1)?.to).toBe("sam@example.com")
  })
})
