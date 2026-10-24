// Builds: PR1, PR2, O-brief, ST-U2.3, PN3
// The firm's job sheet and the buyer's questions (D27): per survey, the facts its standard says a surveyor needs and a
// buyer can answer (R12, research/R12-pricing-fields/result.md), plus a trimmed excerpt of the buyer's own words.
// Pure: no I/O. Safe in the browser.
import { surveyBySlug, type SurveyGroup } from "./catalog"
import { PLANNING_STAGES, PROJECT_TYPES } from "./qualify"

export const NOT_SURE = "not-sure"

export type SheetField = {
  id: string
  // The row label on the firm's sheet.
  sheet: string
  // The question the buyer sees, and why we ask it (D17).
  ask: string
  why: string
  // A choice field lists its answers; a text field has a placeholder. Every field also takes "not sure".
  options?: readonly (readonly [string, string])[]
  placeholder?: string
}

const YES_NO = [["yes", "Yes"], ["no", "No"]] as const

// The R12 standard each field rests on is named in its comment.
export const FIELDS: readonly SheetField[] = [
  // BCT guidelines: demolition or modification of a structure; type and scale of works.
  { id: "works", sheet: "Roof, loft or walls", ask: "Will the work touch the roof, loft or walls, or knock anything down?",
    why: "Bats live in roofs, lofts and walls, so this decides how much the survey involves.",
    options: [["roof", "Yes, the roof or loft"], ["walls", "Yes, the walls"], ["demolish", "Yes, a building is being knocked down"], ["none", "No"]] },
  // BCT: building type; Historic England AN12: the nature of the building (core for heritage in R12).
  { id: "building", sheet: "Building", ask: "What kind of building is it, and roughly how old?",
    why: "Firms use this to judge how much work the survey or report needs.", placeholder: "For example: a 1930s semi-detached house, or an old stone barn" },
  // BCT: access permission, safe access and structural condition, the client's health and safety requirements.
  { id: "access", sheet: "Access", ask: "Is there anything a surveyor should know about getting in?",
    why: "Surveyors need safe access to every part they inspect.", placeholder: "For example: no loft hatch, a locked barn, asbestos" },
  // CIEEM PEA: site and surroundings; PPG flood checklist and EA LCRM: current use.
  { id: "siteNow", sheet: "On the site now", ask: "What's on the site now?",
    why: "The surveyor uses this to plan the first visit.", placeholder: "For example: a house and garden, a field with hedges, an empty yard" },
  // Natural England standing advice: ponds within 250 m and 500 m.
  { id: "ponds", sheet: "Ponds", ask: "Are there any ponds on the site or nearby?",
    why: "Great crested newts live in ponds and the land around them, so the survey looks at ponds up to about 500 metres away.",
    options: [["on-site", "Yes, on the site"], ["nearby", "Yes, within about 500 metres"], ["none", "No"]] },
  // PPG para 080 checklist: flood zone.
  { id: "floodZone", sheet: "Flood zone", ask: "Do you know which flood zone the site is in?",
    why: "It's shown on the government's flood map for planning. If you don't know, the firm will check.",
    options: [["1", "Flood zone 1"], ["2", "Flood zone 2"], ["3", "Flood zone 3"]] },
  // PPG checklist and EA guidance: minor extensions are 250 m² or less.
  { id: "size", sheet: "Size", ask: "Will the new building or extension have more than 250 square metres of floor?",
    why: "The government's flood guidance treats extensions of 250 square metres or less as minor, which needs less work.",
    options: [["small", "250 square metres or less"], ["large", "More than 250 square metres"]] },
  // PPG checklist: within 20 m of a main river.
  { id: "river", sheet: "Within 20 m of a river", ask: "Is the site within about 20 metres of a river?",
    why: "The government's flood checklist asks about work close to a main river.", options: YES_NO },
  // BS 5837 (council restatement): number of trees, including overhanging.
  { id: "trees", sheet: "Trees", ask: "Are there trees on the site, or hanging over it from next door?",
    why: "The survey covers every tree the work could affect, including the neighbours'.",
    options: [["none", "No trees"], ["few", "Yes, a few (1 to 5)"], ["many", "Yes, more than 5"]] },
  // BS 5837 (council restatement): tree preservation orders.
  { id: "tpo", sheet: "Preservation order", ask: "Do any of the trees have a tree preservation order?",
    why: "Protected trees need extra care in the report. Your council can tell you if you're not sure.", options: YES_NO },
  // Historic England AN12: listed or locally listed.
  { id: "listed", sheet: "Listed", ask: "Is the building listed?",
    why: "Work to a listed building needs more detail in the statement.",
    options: [["listed", "Yes, it's listed"], ["local", "It's locally listed"], ["no", "No"]] },
  // Historic England AN12: conservation area.
  { id: "conservation", sheet: "Conservation area", ask: "Is the site in a conservation area?",
    why: "Your council's website has a map of its conservation areas.", options: YES_NO },
  // ProPG: proposed use; EA LCRM: proposed use (residential or commercial).
  { id: "useAfter", sheet: "Used for afterwards", ask: "What will the building or site be used for afterwards?",
    why: "The assessment depends on who will live or work there.", placeholder: "For example: homes, a café, a workshop" },
  // ProPG and BS 4142: noise sources nearby.
  { id: "noise", sheet: "Noise nearby", ask: "What noise is there nearby?",
    why: "The firm measures the noise that matters most for your site.", placeholder: "For example: a main road, a railway, a pub, factory units" },
  // EA LCRM Stage 1: previous use.
  { id: "pastUse", sheet: "Past use", ask: "What was the site used for in the past, if you know?",
    why: "Some past uses, like garages or factories, can leave chemicals in the ground.", placeholder: "For example: a garage, a farmyard, always a garden" },
  // Common to most standards in R12: previous surveys or reports.
  { id: "previous", sheet: "Earlier surveys", ask: "Has anyone done a survey or report on this site before?",
    why: "Recent reports can save time and money.", options: YES_NO },
  // Asked as an upload by 4 firms in R12; uploads come later, so we ask whether they exist.
  { id: "drawings", sheet: "Drawings", ask: "Do you have drawings or plans of the work?",
    why: "Firms can price more accurately from drawings. You can send them to the firm that takes your job on.",
    options: [["yes", "Yes"], ["soon", "Not yet, they're being drawn"], ["no", "No"]] },
]

const COMMON = ["previous", "drawings"]
// The 8 surveys R12 read.
const BY_SURVEY: Record<string, string[]> = {
  "bat-survey": ["works", "building", "access"],
  "preliminary-ecological-appraisal": ["siteNow"],
  "great-crested-newt-survey": ["ponds"],
  "flood-risk-assessment": ["floodZone", "siteNow", "size", "river"],
  "arboricultural-survey": ["trees", "tpo"],
  "heritage-statement": ["building", "listed", "conservation"],
  "noise-impact-assessment": ["useAfter", "noise"],
  "contaminated-land-assessment": ["pastUse", "siteNow", "useAfter"],
}
// The rest inherit from the survey R12 read in their group (a guess: Q28).
const BY_GROUP: Partial<Record<SurveyGroup, string>> = {
  Ecology: "preliminary-ecological-appraisal", "Water and flooding": "flood-risk-assessment", "Noise and air": "noise-impact-assessment",
  Ground: "contaminated-land-assessment", Trees: "arboricultural-survey", Heritage: "heritage-statement",
}

export function fieldById(id: string): SheetField | undefined {
  return FIELDS.find((f) => f.id === id)
}

// The questions for a survey, in the order they're asked.
export function fieldsFor(survey: string): SheetField[] {
  const s = surveyBySlug(survey)
  if (!s) return []
  const own = BY_SURVEY[survey] ?? BY_SURVEY[BY_GROUP[s.group] ?? ""] ?? []
  return [...own, ...COMMON].map((id) => fieldById(id)!)
}

// One answer. `quote` is set when it was read from the buyer's own words (a pill), and holds those words.
export type Fact = { value: string; quote?: string }
export type Facts = Record<string, Fact>

// Keeps only answers to this survey's questions that are well formed: a listed choice, "not sure", or short text.
export function cleanFacts(survey: string, raw: unknown): Facts {
  const out: Facts = {}
  if (!raw || typeof raw !== "object") return out
  for (const f of fieldsFor(survey)) {
    const x = (raw as Record<string, unknown>)[f.id]
    if (!x || typeof x !== "object") continue
    const value = String((x as Fact).value ?? "").trim().slice(0, 300)
    const quote = typeof (x as Fact).quote === "string" ? (x as Fact).quote!.trim().slice(0, 300) : undefined
    if (!value) continue
    if (value !== NOT_SURE && f.options && !f.options.some(([k]) => k === value)) continue
    out[f.id] = quote ? { value, quote } : { value }
  }
  return out
}

export function answerLabel(f: SheetField, value: string): string {
  if (value === NOT_SURE) return "Not sure"
  return f.options?.find(([k]) => k === value)?.[1] ?? value
}

// A first reading of the buyer's words with a few plain rules, used when no model is available (D23, Q26).
// Each fact carries the words it came from. Deliberately cautious: a missed fact is asked; a wrong one misleads a firm.
const RULES: readonly [string, RegExp, string][] = [
  ["works", /\b(?:demolish\w*|demolition|knock(?:ing)? down)\b/i, "demolish"],
  ["works", /\b(?:loft|roof|dormers?)\b/i, "roof"],
  ["listed", /\blocally listed\b/i, "local"],
  ["listed", /\bnot listed\b/i, "no"],
  ["listed", /\b(?:grade (?:i{1,2}\*?|1|2)(?: listed)?|listed building|is listed)\b/i, "listed"],
  ["conservation", /\bnot in (?:a |the )?conservation area\b/i, "no"],
  ["conservation", /\bconservation area\b/i, "yes"],
  ["tpo", /\b(?:tpo|tree preservation order|preservation order)s?\b/i, "yes"],
  ["floodZone", /\bflood ?zone ?(?:1|one)\b/i, "1"],
  ["floodZone", /\bflood ?zone ?(?:2|two)\b/i, "2"],
  ["floodZone", /\bflood ?zone ?(?:3a?b?|three)\b/i, "3"],
]
export function spotFacts(text: string): Facts {
  const out: Facts = {}
  for (const [id, re, value] of RULES) {
    if (out[id]) continue
    const m = text.match(re)
    if (m) out[id] = { value, quote: m[0] }
  }
  return out
}

// True when `quote` is the buyer's own words: found in their text, ignoring case, spacing and punctuation at the ends.
export function inText(text: string, quote: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim()
  const q = norm(quote).replace(/^[\s"'.,;:!?…-]+|[\s"'.,;:!?…-]+$/g, "")
  return q.length >= 2 && norm(text).includes(q)
}

// Emails and phone numbers out of the buyer's words, before they go anywhere.
export function stripContact(s: string): string {
  return s.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]").replace(/(?:\+44\s?|0)(?:\d[\s-]?){9,10}/g, "[phone]")
}

// The excerpt firms read (D27): the buyer's sentences, minus prices and other firms' quotes (Q27), contact details,
// greetings and sign-offs, cut to about 400 characters at a sentence end.
const DROP = /£|\d+\s?k\b|\bquot\w*|\bprices?\b|\bpriced\b|\bcharg\w*|\bcost\w*|\bpaid\b|\bpay\b|@|\[email|\[phone|\bwww\.|https?:/i
// A greeting is cut from the start of a sentence; a sign-off of a few words is dropped whole.
const GREETING = /^(?:hi|hello|hiya|hey|dear|good (?:morning|afternoon|evening))\b(?: (?:there|all|everyone|sir|madam))?[\s,!.:-]*/i
const SIGN_OFF = /^(?:thanks|thank you|many thanks|cheers|regards|kind regards|best wishes|ta)\b/i
export const EXCERPT_CHARS = 400
export function trimExcerpt(text: string): { excerpt: string; dropped: number } {
  const sentences = stripContact(text).replace(/\s+/g, " ").trim().match(/[^.!?\n]+[.!?]*/g)?.map((s) => s.trim().replace(GREETING, "")).filter(Boolean) ?? []
  const kept = sentences.filter((s) => !DROP.test(s) && !(SIGN_OFF.test(s) && s.split(" ").length <= 6))
  // Counted for the buyer: sentences left out for prices, quotes or contact details (not sign-offs).
  const dropped = sentences.filter((s) => DROP.test(s)).length
  let excerpt = ""
  for (const s of kept) {
    if (excerpt && excerpt.length + s.length + 1 > EXCERPT_CHARS) return { excerpt: `${excerpt} …`, dropped }
    excerpt = excerpt ? `${excerpt} ${s}` : s.length > EXCERPT_CHARS ? `${s.slice(0, EXCERPT_CHARS).replace(/\s\S*$/, "")} …` : s
  }
  return { excerpt, dropped }
}

export type JobSheet = { rows: { label: string; value: string; fromWords?: boolean }[]; unknown: string[]; excerpt: string }

type SheetLead = { survey: string; projectType: string; planningStage: string; councilRef: string | null; deadline: string | null; details: string; sheet: unknown }

// The buyer's planning stage, said to the firm rather than by the buyer.
export const FIRM_STAGE: Record<string, string> = {
  "council-asked": "Applied; the council has asked for this survey",
  preparing: "Getting ready to apply",
  "pre-app": "Pre-application advice says it's needed",
  "not-sure": "The buyer isn't sure yet",
}

// The sheet a firm receives: the planned work, each survey question answered, what's not known, and the excerpt.
export function jobSheet(lead: SheetLead): JobSheet {
  const label = (pairs: readonly (readonly [string, string])[], v: string) => pairs.find(([k]) => k === v)?.[1] ?? v
  const facts = cleanFacts(lead.survey, lead.sheet)
  const rows: JobSheet["rows"] = [
    { label: "Project", value: label(PROJECT_TYPES, lead.projectType) },
    { label: "Planning", value: `${FIRM_STAGE[lead.planningStage] ?? label(PLANNING_STAGES, lead.planningStage)}${lead.councilRef ? ` (council ref ${lead.councilRef})` : ""}` },
    { label: "Needed by", value: lead.deadline ? new Date(lead.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "No date given" },
  ]
  const unknown: string[] = []
  for (const f of fieldsFor(lead.survey)) {
    const fact = facts[f.id]
    if (!fact || fact.value === NOT_SURE) unknown.push(f.sheet)
    else rows.push({ label: f.sheet, value: answerLabel(f, fact.value), fromWords: Boolean(fact.quote) })
  }
  return { rows, unknown, excerpt: trimExcerpt(lead.details).excerpt }
}
