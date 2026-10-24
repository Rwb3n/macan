// Builds: PR1, PN3
// Pills: the job-sheet facts read from the buyer's own words (D23, D27). Claude Haiku when a key is set (the model is
// still open: Q26); otherwise, or on any failure, the plain rules in jobsheet.ts. Every fact must quote the buyer's
// words and use a listed answer, or it is dropped: the model may miss a fact, never add one (R10, R11; Q29).
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"
import { FIELDS, inText, spotFacts, stripContact, type Facts } from "./jobsheet"
import { PLANNING_STAGES, PROJECT_TYPES } from "./qualify"

const MODEL = "claude-haiku-5-5"
const TIMEOUT_MS = 10_000

// Access, earlier surveys and drawings are always asked: in testing, the model filled them from unrelated words.
const ALWAYS_ASKED = new Set(["access", "previous", "drawings"])
// The work and the planning stage are read too, to pre-fill their questions; the buyer still confirms them.
const READ = [
  { id: "projectType", ask: "What kind of work is planned?", options: PROJECT_TYPES.filter(([k]) => k !== "other") },
  { id: "planningStage", ask: "How far has the buyer got with planning permission? Only if they say which: 'council-asked' needs words saying an application has been made (applied, submitted, validation); the council merely mentioning or wanting a survey is not enough, so leave this out.",
    options: PLANNING_STAGES.filter(([k]) => k !== "not-sure") },
  ...FIELDS.filter((f) => !ALWAYS_ASKED.has(f.id)),
]

const Out = z.object({
  facts: z.array(z.object({
    field: z.enum(READ.map((f) => f.id) as [string, ...string[]]),
    value: z.string(),
    quote: z.string(),
  })),
})

const SYSTEM = [
  "You read a UK homeowner's or developer's description of the building work they're planning, and pick out facts a survey firm needs.",
  "Report a fact ONLY if the text states it. Never guess, infer from typical cases, or fill in what is usual. A missed fact is fine; an invented one is not.",
  "For each fact give: field, value, and quote, the exact words from the text that state it (copied character for character, a few words).",
  "The quote must itself say the fact plainly. Words that only hint at it, or are about something else, don't count: 'no idea where to start' says nothing about drawings.",
  "building is the building that is there now, never what is going to be built.",
  "Choice fields: value must be one of the listed codes. Text fields: value repeats the quote.",
  "Fields:",
  ...READ.map((f) => `- ${f.id}: ${f.ask}${f.options ? ` Codes: ${f.options.map(([k, l]) => `${k} (${l})`).join(", ")}.` : " Free text."}`),
].join("\n")

export type Extraction = { facts: Facts; by: "model" | "rules" }

export async function extractFacts(text: string, apiKey = process.env.ANTHROPIC_API_KEY): Promise<Extraction> {
  const clean = stripContact(text).slice(0, 2000)
  if (!apiKey || clean.trim().length < 10) return { facts: spotFacts(clean), by: "rules" }
  try {
    const client = new Anthropic({ apiKey })
    const r = await client.messages.parse({
      model: MODEL, max_tokens: 1000, system: SYSTEM,
      output_config: { effort: "low", format: zodOutputFormat(Out) },
      messages: [{ role: "user", content: clean }],
    }, { timeout: TIMEOUT_MS, maxRetries: 0 })
    return { facts: checkFacts(clean, (r.parsed_output as z.infer<typeof Out> | null)?.facts ?? []), by: "model" }
  } catch {
    return { facts: spotFacts(clean), by: "rules" }
  }
}

// The guard: a listed answer for choice fields, and a quote found in the buyer's text. First fact per field wins.
export function checkFacts(text: string, facts: { field: string; value: string; quote: string }[]): Facts {
  const out: Facts = {}
  for (const f of facts) {
    const field = READ.find((x) => x.id === f.field)
    if (!field || out[f.field] || !inText(text, f.quote)) continue
    if (field.options ? !field.options.some(([k]) => k === f.value) : !f.value.trim()) continue
    // A text answer is the buyer's quoted words themselves, so nothing is reworded.
    const quote = f.quote.trim().slice(0, 300)
    out[f.field] = { value: field.options ? f.value : quote, quote }
  }
  return out
}
