// Builds: PR1
// Lead qualification (map: PR1; checks from model/how.ts). Pure: no I/O, `today` passed in.
import { LEAD_CHECKS, LEAD_GRADES } from "@model/how"
import { surveyBySlug } from "./catalog"

export const PROJECT_TYPES = [
  ["extension", "Extension"],
  ["loft", "Loft or roof conversion"],
  ["barn-conversion", "Barn or agricultural conversion"],
  ["new-build", "New build"],
  ["demolition", "Demolition"],
  ["change-of-use", "Change of use"],
  ["other", "Something else"],
] as const
export type ProjectType = (typeof PROJECT_TYPES)[number][0]

export const PLANNING_STAGES = [
  ["council-asked", "I've applied, and the council has asked for this survey"],
  ["preparing", "I'm getting ready to apply for planning permission"],
  ["pre-app", "I asked the council for early advice, and they said I'll need it"],
  ["not-sure", "I'm not sure yet"],
  ["no-application", "It's not for planning permission"],
] as const
export type PlanningStage = (typeof PLANNING_STAGES)[number][0]

// Grades and checks are the map's (model/objects.ts); the code keeps no copy.
export const GRADES = LEAD_GRADES
export type Grade = (typeof LEAD_GRADES)[number]
type CheckName = (typeof LEAD_CHECKS)[number]

export type LeadFacts = {
  survey: string
  projectType: string
  planningStage: string
  postcode: string
  details: string
  deadline: string | null // YYYY-MM-DD
  emailConfirmed: boolean
}

export type Check = { pass: boolean; note?: string }
export type Qualification = {
  grade: Grade
  checks: Record<CheckName, Check>
  missing: string[]
}

const FULL_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i
const MIN_DETAILS = 30

export function qualify(lead: LeadFacts, today: Date): Qualification {
  const survey = surveyBySlug(lead.survey)
  const real = checkReal(lead, survey !== undefined)
  const serious: Check = lead.emailConfirmed ? { pass: true } : { pass: false, note: "Email not confirmed yet" }
  const missing = missingDetails(lead, today)
  const complete: Check = missing.length ? { pass: false, note: `Missing: ${missing.join("; ")}` } : { pass: true }
  const timely = checkTimely(lead.deadline, survey?.window, today)
  const grade: Grade = !real.pass ? "not-a-fit" : !complete.pass ? "needs-info" : !serious.pass ? "awaiting-confirmation" : "qualified"
  return { grade, checks: { real, serious, timely, complete }, missing }
}

function checkReal(lead: LeadFacts, knownSurvey: boolean): Check {
  if (!knownSurvey) return { pass: false, note: "Not a survey we list" }
  if (lead.planningStage === "no-application") return { pass: false, note: "No planning application" }
  if (!PLANNING_STAGES.some(([v]) => v === lead.planningStage)) return { pass: false, note: "Planning stage not given" }
  if (!PROJECT_TYPES.some(([v]) => v === lead.projectType)) return { pass: false, note: "Project not described" }
  return lead.planningStage === "not-sure" ? { pass: true, note: "Buyer not sure a survey is needed" } : { pass: true }
}

// Only the core fields every survey needs are required: where the site is and what work is planned (R12).
// The survey's own questions are asked, but "not sure" is a fair answer; unknowns are listed on the job sheet (D27).
function missingDetails(lead: LeadFacts, today: Date): string[] {
  const out: string[] = []
  if (!FULL_POSTCODE.test(lead.postcode.trim())) out.push("the full site postcode")
  if (lead.details.trim().length < MIN_DETAILS) out.push("a description of the site and the work")
  if (lead.deadline && lead.deadline < isoDate(today)) out.push("a deadline in the future")
  return out
}

// Never blocks a lead: a missed season is told to the buyer and flagged to the firm.
export function checkTimely(deadline: string | null, window: readonly number[] | undefined, today: Date): Check {
  if (!window) return { pass: true }
  const start = nextWindowStart(window, today)
  if (!start) return { pass: true }
  const startIso = isoDate(start)
  const when = start.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
  if (startIso <= isoDate(today)) return { pass: true }
  if (!deadline) return { pass: true, note: `Fieldwork can't start until ${when}` }
  return deadline < startIso
    ? { pass: false, note: `Deadline is before the season opens: fieldwork can't start until ${when}` }
    : { pass: true, note: `Fieldwork can't start until ${when}` }
}

// First day of the next month in the window, or today if today is inside it.
export function nextWindowStart(window: readonly number[], today: Date): Date | undefined {
  if (window.length === 0) return undefined
  const y = today.getUTCFullYear()
  const m = today.getUTCMonth() + 1
  if (window.includes(m)) return today
  for (let k = 1; k <= 12; k++) {
    const month = ((m - 1 + k) % 12) + 1
    if (window.includes(month)) return new Date(Date.UTC(y + Math.floor((m - 1 + k) / 12), month - 1, 1))
  }
  return undefined
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}
