import { beforeEach, describe, expect, it } from "vitest"
import { openDb, type Db } from "./db"
import { leads } from "./db/schema"
import { confirmLead, leadByToken, listLeads, reviewLead, submitLead, type Deps } from "./leads"
import { memoryMailer } from "./mailer"

let deps: Deps & { mailer: ReturnType<typeof memoryMailer> }
const oct = new Date(Date.UTC(2026, 9, 23))

const form = {
  survey: "bat-survey", region: "south-east", projectType: "loft", planningStage: "council-asked",
  postcode: "ox1 2jd", councilRef: "", deadline: "2027-07-01",
  details: "1930s semi, loft conversion with two dormers; council validation asked for a bat survey.",
  sheet: JSON.stringify({ works: { value: "roof", quote: "loft conversion" }, building: { value: "1930s semi", quote: "1930s semi" }, ponds: { value: "none" }, previous: { value: "maybe" } }),
  name: "Sam Buyer", email: "sam@example.com", phone: "",
}

function tokenFromMail(): string {
  const m = deps.mailer.sent.at(-1)?.text.match(/\/leads\/confirm\/([\w-]+)/)
  if (!m?.[1]) throw new Error("no token in mail")
  return m[1]
}

beforeEach(() => {
  deps = { db: openDb(":memory:") as Db, mailer: memoryMailer(), now: () => oct, baseUrl: "http://test" }
})

describe("submitLead", () => {
  it("stores the lead awaiting confirmation and emails a link", async () => {
    const r = await submitLead(deps, form)
    expect(r.ok && r.qualification.grade).toBe("awaiting-confirmation")
    const row = deps.db.select().from(leads).get()
    expect(row?.postcode).toBe("OX1 2JD")
    expect(row?.councilRef).toBeNull()
    expect(deps.mailer.sent[0]?.to).toBe("sam@example.com")
    expect(row?.tokenHash).not.toContain(tokenFromMail())
  })
  it("asks for a description when the work is 'something else'", async () => {
    const r = await submitLead(deps, { ...form, projectType: "other" })
    expect(!r.ok && r.errors.projectOther).toBe("Tell us what you're planning")
    await submitLead(deps, { ...form, projectType: "other", projectOther: "A garden room" })
    expect(deps.db.select().from(leads).get()?.projectOther).toBe("A garden room")
  })
  it("keeps only this survey's well-formed job-sheet answers", async () => {
    await submitLead(deps, form)
    // ponds isn't asked for a bat survey; "maybe" isn't an answer to a yes/no question.
    expect(deps.db.select().from(leads).get()?.sheet).toEqual({ works: { value: "roof", quote: "loft conversion" }, building: { value: "1930s semi", quote: "1930s semi" } })
  })
  it("tells the buyer at once when the deadline misses the season", async () => {
    const r = await submitLead(deps, { ...form, deadline: "2027-03-01" })
    expect(r.ok && r.qualification.checks.timely.note).toContain("May 2027")
  })
  it("rejects malformed input without storing or mailing", async () => {
    const r = await submitLead(deps, { ...form, projectType: "spaceship", email: "nope" })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "projectType"])
    expect(deps.db.select().from(leads).all()).toHaveLength(0)
    expect(deps.mailer.sent).toHaveLength(0)
  })
})

describe("confirmLead", () => {
  it("confirms by token and re-grades to qualified", async () => {
    await submitLead(deps, form)
    const q = confirmLead(deps, tokenFromMail())
    expect(q?.grade).toBe("qualified")
    expect(leadByToken(deps.db, tokenFromMail())?.confirmedAt).not.toBeNull()
  })
  it("ignores an unknown token", () => expect(confirmLead(deps, "nope")).toBeUndefined())
  it("keeps needs-info after confirming an incomplete lead", async () => {
    await submitLead(deps, { ...form, postcode: "OX1" })
    expect(confirmLead(deps, tokenFromMail())?.grade).toBe("needs-info")
  })
})

describe("reviewLead", () => {
  it("approves only qualified leads", async () => {
    await submitLead(deps, form)
    const id = listLeads(deps.db)[0]!.id
    expect(() => reviewLead(deps, id, "approved")).toThrow(/only qualified/)
    confirmLead(deps, tokenFromMail())
    reviewLead(deps, id, "approved")
    expect(listLeads(deps.db)[0]?.review).toBe("approved")
  })
  it("can reject anything", async () => {
    await submitLead(deps, form)
    const id = listLeads(deps.db)[0]!.id
    reviewLead(deps, id, "rejected")
    expect(listLeads(deps.db)[0]?.review).toBe("rejected")
  })
})
