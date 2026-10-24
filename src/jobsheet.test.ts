import { describe, expect, it } from "vitest"
import { SURVEYS } from "./catalog"
import { FIELDS, NOT_SURE, cleanFacts, fieldsFor, inText, jobSheet, spotFacts, trimExcerpt } from "./jobsheet"
import { checkFacts, extractFacts } from "./extract"

describe("fieldsFor", () => {
  it("asks the bat survey's questions from its standard, then the common ones (R12)", () => {
    expect(fieldsFor("bat-survey").map((f) => f.id)).toEqual(["works", "building", "access", "previous", "drawings"])
  })
  it("gives every catalogue survey at least the common questions, each a known field", () => {
    for (const s of SURVEYS) {
      const ids = fieldsFor(s.slug).map((f) => f.id)
      expect(ids.slice(-2)).toEqual(["previous", "drawings"])
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
  it("lets surveys R12 didn't read inherit from their group (Q28)", () => {
    expect(fieldsFor("badger-survey").map((f) => f.id)).toEqual(fieldsFor("preliminary-ecological-appraisal").map((f) => f.id))
    expect(fieldsFor("travel-plan").map((f) => f.id)).toEqual(["previous", "drawings"])
  })
  it("gives every field a question and a reason", () => {
    expect(FIELDS.filter((f) => !f.ask.endsWith("?") || f.why.length < 10)).toEqual([])
  })
})

describe("cleanFacts", () => {
  it("keeps listed answers, not sure and text for this survey's questions only", () => {
    expect(cleanFacts("bat-survey", {
      works: { value: "roof", quote: "loft" }, building: { value: "old barn" }, access: { value: NOT_SURE },
      previous: { value: "perhaps" }, ponds: { value: "none" },
    })).toEqual({ works: { value: "roof", quote: "loft" }, building: { value: "old barn" }, access: { value: NOT_SURE } })
  })
  it("survives junk", () => {
    expect(cleanFacts("bat-survey", "nonsense")).toEqual({})
    expect(cleanFacts("nope", { works: { value: "roof" } })).toEqual({})
  })
})

describe("reading the buyer's words", () => {
  it("spots plain facts with the words they came from", () => {
    expect(spotFacts("We're converting our loft. The house is in a conservation area but not listed.")).toEqual({
      works: { value: "roof", quote: "loft" }, conservation: { value: "yes", quote: "conservation area" }, listed: { value: "no", quote: "not listed" },
    })
    expect(spotFacts("Site is flood zone 3 apparently")).toEqual({ floodZone: { value: "3", quote: "flood zone 3" } })
  })
  it("drops any fact whose quote isn't in the buyer's text, or whose answer isn't listed", () => {
    const text = "Converting the  loft of our Victorian terrace, there's a pond at the end of the garden"
    expect(checkFacts(text, [
      { field: "works", value: "roof", quote: "loft" },
      { field: "building", value: "Victorian terrace house", quote: "victorian terrace" },
      { field: "ponds", value: "nearby", quote: "a pond within 500m" }, // not their words
      { field: "listed", value: "maybe", quote: "Victorian" }, // not a listed answer
      { field: "made-up", value: "x", quote: "loft" },
    ])).toEqual({ works: { value: "roof", quote: "loft" }, building: { value: "victorian terrace", quote: "victorian terrace" } })
  })
  it("matches quotes ignoring case, spacing and end punctuation", () => {
    expect(inText("The council  said\nBAT survey.", "said bat survey.")).toBe(true)
    expect(inText("short", "s")).toBe(false)
  })
  it("uses the plain rules when there's no key", async () => {
    expect(await extractFacts("We're knocking down the old garage", "")).toEqual({ facts: { works: { value: "demolish", quote: "knocking down" } }, by: "rules" })
  })
})

describe("trimExcerpt", () => {
  it("leaves out prices, other firms' quotes, contact details and sign-offs (D27, Q27)", () => {
    const r = trimExcerpt("Hi there. We're converting the loft. Another firm quoted £950 which seems a lot. Call me on 07700 900123. The council wants a bat survey before validation. Thanks, Sam")
    expect(r.excerpt).toBe("We're converting the loft. The council wants a bat survey before validation.")
    expect(r.dropped).toBe(2) // the price and the phone number; greetings and sign-offs aren't counted
  })
  it("cuts a greeting but keeps the sentence it starts", () => {
    expect(trimExcerpt("hi we want to do a loft conversion, council said we need a bat survey. another company quoted 950 which seems mad. thanks").excerpt)
      .toBe("we want to do a loft conversion, council said we need a bat survey.")
  })
  it("cuts long text at a sentence end", () => {
    const r = trimExcerpt(Array.from({ length: 30 }, (_, i) => `Sentence number ${i} is here.`).join(" "))
    expect(r.excerpt.length).toBeLessThan(420)
    expect(r.excerpt.endsWith("here. …")).toBe(true)
  })
})

describe("jobSheet", () => {
  it("lists the planned work, the answers, what's not known, and the excerpt", () => {
    const s = jobSheet({
      survey: "bat-survey", projectType: "loft", planningStage: "council-asked", councilRef: "26/AP/1", deadline: null,
      details: "Loft conversion with dormers. Quoted £400 elsewhere.", sheet: { works: { value: "roof", quote: "Loft" }, building: { value: NOT_SURE }, previous: { value: "no" } },
    })
    expect(s.rows).toEqual([
      { label: "Project", value: "Loft or roof conversion" },
      { label: "Planning", value: "Applied; the council has asked for this survey (council ref 26/AP/1)" },
      { label: "Needed by", value: "No date given" },
      { label: "Roof, loft or walls", value: "Yes, the roof or loft", fromWords: true },
      { label: "Earlier surveys", value: "No", fromWords: false },
    ])
    expect(s.unknown).toEqual(["Building", "Access", "Drawings"])
    expect(s.excerpt).toBe("Loft conversion with dormers.")
  })
})
