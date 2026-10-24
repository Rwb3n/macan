import { describe, expect, it } from "vitest"
import { SURVEY_SLUGS, suggestSurvey } from "./catalog"

describe("suggestSurvey", () => {
  it.each([
    ["The council said I need a bat survey for my loft", "bat-survey"],
    ["There's a pond next door and they mentioned newts", "great-crested-newt-survey"],
    ["Site is in flood zone 3", "flood-risk-assessment"],
    ["We need a tree survey for the oak with a TPO", "arboricultural-survey"],
    ["Planning officer asked for an ecology report", "preliminary-ecological-appraisal"],
    ["Pub garden next to houses, they want a noise report", "noise-impact-assessment"],
    ["Our barn is in a conservation area", "heritage-statement"],
    ["The site is over old coal mine workings", "coal-mining-risk-assessment"],
    ["We'll use a septic tank, not the sewer", "drainage-strategy"],
    ["A new takeaway with a commercial kitchen", "ventilation-extraction"],
    ["Bats found in the loft of a listed building", "bat-survey"],
  ])("%s → %s", (text, slug) => expect(suggestSurvey(text)).toBe(slug))
  it("returns nothing when it can't tell", () => expect(suggestSurvey("I want to build an extension")).toBeUndefined())
  it("only suggests surveys in the catalogue", () => expect(SURVEY_SLUGS).toContain(suggestSurvey("bats")))
})
