// R10 part 2: the side-by-side test the method fixes (research only; not product code).
// Same 20 synthetic inputs (evidence/inputs.json) through three line-ups:
//   A  Claude Haiku 5.5 alone: pills and draft, structured output
//   B  A, plus a decision model (OpenRouter Decisions API) that picks the survey and checks the draft is supported
//   C  Gemma 4 26B via OpenRouter chat: pills and draft, JSON schema
// Every draft is judged for invented facts by Claude Opus 5.5 against evidence/judge-checklist.md.
// Usage: npx tsx research/R10-drafter-models/run.ts   (keys from .env.local; writes evidence/part2-*.json)
import fs from "node:fs"
import path from "node:path"
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"
import { SURVEYS } from "../../src/catalog"

const DIR = "research/R10-drafter-models/evidence"
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]))
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
const OR_KEY = env.OPENROUTER_API_KEY!
const DECISION_MODEL = "typesafe/jev-1.14"
const GEMMA = "google/gemma-4-26b-a4b-it"
const inputs: { id: number; text: string }[] = JSON.parse(fs.readFileSync(path.join(DIR, "inputs.json"), "utf8"))
const checklist = fs.readFileSync(path.join(DIR, "judge-checklist.md"), "utf8")

const SLUGS = [...SURVEYS.map((s) => s.slug), "not_sure"] as const
const Draft = z.object({
  survey: z.enum(SLUGS as unknown as [string, ...string[]]),
  pills: z.array(z.object({ label: z.string(), value: z.string() })),
  draft: z.string(),
})
type DraftT = z.infer<typeof Draft>

const SYSTEM = [
  "You turn a UK homeowner's or developer's own description of a planning-survey need into (1) short fact 'pills' and (2) a request a survey firm will read.",
  "Rules: use ONLY facts in the buyer's text. Never add a building age, material, place, size, deadline, budget, species, price, timing promise, or legal claim the text does not give.",
  "If something a firm would need is missing, say plainly in the draft that it is not known yet. Never include names, phone numbers or email addresses.",
  "Pills: one per fact the buyer gave (label: 'Survey', 'Project', 'Building', 'Roof', 'Location', 'Deadline', 'Council', 'Budget', 'Other'), value in a few words from their text.",
  "survey: the catalogue slug the buyer needs, or 'not_sure' if the text doesn't make it clear. Catalogue: " + SURVEYS.map((s) => `${s.slug} (${s.name})`).join("; ") + ".",
  "draft: at most 110 words, plain British English, addressed to the firm, starting 'A buyer needs'.",
].join("\n")

const ms = (t0: number) => Math.round(performance.now() - t0)

async function lineA(text: string) {
  const t0 = performance.now()
  const r = await anthropic.messages.parse({
    model: "claude-haiku-5-5", max_tokens: 2000, system: SYSTEM,
    output_config: { effort: "low", format: zodOutputFormat(Draft) },
    messages: [{ role: "user", content: text }],
  })
  const out = r.parsed_output as DraftT | null
  const cost = (r.usage.input_tokens * 0.10 + r.usage.output_tokens * 0.50) / 1e6
  return { out, valid: Boolean(out && Draft.safeParse(out).success), ms: ms(t0), cost, usage: r.usage }
}

async function decide(text: string, draft: string) {
  const t0 = performance.now()
  const res = await fetch("https://openrouter.ai/api/alpha/decisions", {
    method: "POST", headers: { Authorization: `Bearer ${OR_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: DECISION_MODEL,
      state: { buyer_text: text, draft },
      questions: {
        supported: {
          type: "noul",
          instructions: "Is every fact in `draft` about the buyer's job (survey, building, place, size, dates, budget, history) stated in `buyer_text`? Restating in other words, or saying something is not known yet, counts as supported.",
          criteria: { true: "Every fact in the draft is stated in the buyer text.", false: "The draft states at least one fact about the job that the buyer text does not give." },
        },
        survey: {
          type: "choice",
          instructions: "Which survey does the buyer in `buyer_text` need for their planning application?",
          criteria: Object.fromEntries([...SURVEYS.map((s) => [s.slug, `${s.name}: ${s.what}`]), ["not_sure", "The text does not make clear which survey is needed."]]),
        },
      },
    }),
  })
  const j = await res.json() as { model?: string; answers?: { supported?: { noul: number }; survey?: { choice: string; confidence?: number } }; usage?: { cost?: number }; error?: unknown }
  if (!res.ok) throw new Error(`decisions ${res.status}: ${JSON.stringify(j).slice(0, 300)}`)
  return { supported: j.answers?.supported?.noul ?? null, survey: j.answers?.survey?.choice ?? null, surveyConfidence: j.answers?.survey?.confidence ?? null, model: j.model, cost: j.usage?.cost ?? 0, ms: ms(t0) }
}

async function lineC(text: string) {
  const t0 = performance.now()
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST", headers: { Authorization: `Bearer ${OR_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: GEMMA, max_tokens: 1200,
      provider: { require_parameters: true, data_collection: "deny" },
      response_format: { type: "json_schema", json_schema: { name: "draft", strict: true, schema: z.toJSONSchema(Draft) } },
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: text }],
      usage: { include: true },
    }),
  })
  const j = await res.json() as { choices?: { message: { content: string } }[]; usage?: { cost?: number }; provider?: string; error?: unknown }
  if (!res.ok) throw new Error(`gemma ${res.status}: ${JSON.stringify(j).slice(0, 300)}`)
  let out: DraftT | null = null
  try { const p = Draft.safeParse(JSON.parse(j.choices?.[0]?.message.content ?? "")); out = p.success ? p.data : null } catch { out = null }
  return { out, valid: out !== null, ms: ms(t0), cost: j.usage?.cost ?? 0, provider: j.provider }
}

const Judgement = z.object({ invented: z.array(z.string()) })
async function judge(text: string, d: DraftT | null) {
  if (!d) return { invented: ["(no valid output)"], cost: 0 }
  const r = await anthropic.messages.parse({
    model: "claude-opus-5-5", max_tokens: 4000,
    output_config: { effort: "medium", format: zodOutputFormat(Judgement) },
    system: "You grade a drafted survey request against the buyer's own text, using this checklist exactly:\n\n" + checklist + "\n\nReturn every invented fact as the exact phrase from the draft or a pill, or an empty list.",
    messages: [{ role: "user", content: `BUYER TEXT:\n${text}\n\nPILLS:\n${d.pills.map((p) => `${p.label}: ${p.value}`).join("\n")}\n\nDRAFT:\n${d.draft}` }],
  })
  const cost = (r.usage.input_tokens * 4 + r.usage.output_tokens * 20) / 1e6
  return { invented: (r.parsed_output as { invented: string[] } | null)?.invented ?? ["(judge failed)"], cost }
}

async function main() {
  const only = process.argv[2] ? Number(process.argv[2]) : inputs.length
  const rows = []
  let spend = 0
  for (const inp of inputs.slice(0, only)) {
    const a = await lineA(inp.text).catch((e) => ({ error: String(e) }))
    const aOut = "out" in a ? a.out : null
    const b = aOut ? await decide(inp.text, aOut.draft).catch((e) => ({ error: String(e) })) : { error: "no draft from A" }
    const c = await lineC(inp.text).catch((e) => ({ error: String(e) }))
    const ja = await judge(inp.text, aOut)
    const jc = await judge(inp.text, "out" in c ? c.out : null)
    spend += ("cost" in a ? a.cost : 0) + ("cost" in b ? b.cost : 0) + ("cost" in c ? c.cost : 0) + ja.cost + jc.cost
    rows.push({ id: inp.id, A: { ...a, invented: ja.invented }, B: b, C: { ...c, invented: jc.invented } })
    console.log(JSON.stringify({ id: inp.id, A: "ms" in a ? a.ms : a, B: "ms" in b ? { ms: b.ms, supported: b.supported, survey: b.survey } : b, C: "ms" in c ? c.ms : c, inventedA: ja.invented.length, inventedC: jc.invented.length, spend: spend.toFixed(4) }))
  }
  fs.writeFileSync(path.join(DIR, `part2-results${only < inputs.length ? `-first${only}` : ""}.json`), JSON.stringify(rows, null, 2))
}

main()
