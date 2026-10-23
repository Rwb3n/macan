import { describe, expect, it } from "vitest"
import { checkTimely, nextWindowStart, qualify, type LeadFacts } from "./qualify"

const oct = new Date(Date.UTC(2026, 9, 23))
const june = new Date(Date.UTC(2026, 5, 10))
const bats = [5, 6, 7, 8, 9]

const good: LeadFacts = {
  survey: "bat-survey", projectType: "loft", planningStage: "council-asked", postcode: "OX1 2JD",
  details: "1930s semi, loft conversion with two dormers; council validation asked for a bat survey.",
  answer: "1930s, clay tiles, yes the roof", deadline: "2027-07-01", emailConfirmed: true,
}

describe("nextWindowStart", () => {
  it("is today inside the window", () => expect(nextWindowStart(bats, june)).toEqual(june))
  it("rolls into next year", () => expect(nextWindowStart(bats, oct)?.toISOString().slice(0, 10)).toBe("2027-05-01"))
  it("finds a later month this year", () => expect(nextWindowStart([11], oct)?.toISOString().slice(0, 10)).toBe("2026-11-01"))
})

describe("checkTimely", () => {
  it("passes surveys with no season", () => expect(checkTimely("2026-11-01", undefined, oct).pass).toBe(true))
  it("flags a deadline before the season opens", () => {
    const c = checkTimely("2027-03-01", bats, oct)
    expect(c.pass).toBe(false)
    expect(c.note).toContain("May 2027")
  })
  it("passes a deadline after the season opens, with a note", () => {
    const c = checkTimely("2027-07-01", bats, oct)
    expect(c).toEqual({ pass: true, note: "Fieldwork can't start until May 2027" })
  })
  it("passes in season", () => expect(checkTimely("2026-06-20", bats, june)).toEqual({ pass: true }))
})

describe("qualify", () => {
  it("grades a complete, confirmed, planning lead as qualified", () => {
    expect(qualify(good, oct).grade).toBe("qualified")
  })
  it("still qualifies when the season is missed, with the flag", () => {
    const q = qualify({ ...good, deadline: "2027-02-01" }, oct)
    expect(q.grade).toBe("qualified")
    expect(q.checks.timely.pass).toBe(false)
  })
  it("waits for email confirmation", () => {
    expect(qualify({ ...good, emailConfirmed: false }, oct).grade).toBe("awaiting-confirmation")
  })
  it("asks for missing details, naming each", () => {
    const q = qualify({ ...good, postcode: "OX1", answer: "", details: "loft" }, oct)
    expect(q.grade).toBe("needs-info")
    expect(q.missing).toHaveLength(3)
  })
  it("asks for a future deadline", () => {
    expect(qualify({ ...good, deadline: "2026-01-01" }, oct).missing).toContain("a deadline in the future")
  })
  it("is not a fit without a planning application", () => {
    expect(qualify({ ...good, planningStage: "no-application" }, oct).grade).toBe("not-a-fit")
  })
  it("is not a fit for an unknown survey", () => {
    expect(qualify({ ...good, survey: "asbestos" }, oct).grade).toBe("not-a-fit")
  })
  it("does not ask a survey-specific question where there is none", () => {
    expect(qualify({ ...good, survey: "environmental-impact-assessment", answer: "" }, oct).grade).toBe("qualified")
  })
})
