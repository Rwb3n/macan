// R11: R10's line-ups on 20 real buyer posts (research only; not product code).
//   A1 Claude Haiku 5.5, R10 prompt (v1) · A2 Claude Haiku 5.5, prompt-v2.txt · C2 Gemma 4 26B via OpenRouter, prompt v2
//   P  Jev 1.14 decision model picking the survey alone (time to the first pill)
// Posts are real people's writing, so they're read from D:/data/macan/r11/inputs.json and never written into research/;
// results here carry post ids, model outputs and judgements only.
// Usage: npx tsx research/R11-real-voice-test/run.ts [n]
import fs from "node:fs"
import path from "node:path"
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"
import { SURVEYS } from "../../src/catalog"

const DIR = "research/R11-real-voice-test/evidence"
const INPUTS = "D:/data/macan/r11/inputs.json"
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]))
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
const OR_KEY = env.OPENROUTER_API_KEY!
const inputs: { id: number; text: string }[] = JSON.parse(fs.readFileSync(INPUTS, "utf8"))
const checklist = fs.readFileSync("research/R10-drafter-models/evidence/judge-checklist.md", "utf8")
const CATALOGUE = SURVEYS.map((s) => `${s.slug} (${s.name})`).join("; ")

// v1: R10's prompt, unchanged. v2: research/R11-real-voice-test/prompt-v2.txt, committed with the method.
const V1 = [
  "You turn a UK homeowner's or developer's own description of a planning-survey need into (1) short fact 'pills' and (2) a request a survey firm will read.",
  "Rules: use ONLY facts in the buyer's text. Never add a building age, material, place, size, deadline, budget, species, price, timing promise, or legal claim the text does not give.",
  "If something a firm would need is missing, say plainly in the draft that it is not known yet. Never include names, phone numbers or email addresses.",
  "Pills: one per fact the buyer gave (label: 'Survey', 'Project', 'Building', 'Roof', 'Location', 'Deadline', 'Council', 'Budget', 'Other'), value in a few words from their text.",
  "survey: the catalogue slug the buyer needs, or 'not_sure' if the text doesn't make it clear. Catalogue: " + CATALOGUE + ".",
  "draft: at most 110 words, plain British English, addressed to the firm, starting 'A buyer needs'.",
].join("\n")
const V2 = fs.readFileSync("research/R11-real-voice-test/prompt-v2.txt", "utf8").replace("{CATALOGUE}", CATALOGUE)

const SLUGS = [...SURVEYS.map((s) => s.slug), "not_sure"] as const
const Draft = z.object({ survey: z.enum(SLUGS as unknown as [string, ...string[]]), pills: z.array(z.object({ label: z.string(), value: z.string() })), draft: z.string() })
type DraftT = z.infer<typeof Draft>
const ms = (t0: number) => Math.round(performance.now() - t0)

async function haiku(system: string, text: string) {
  const t0 = performance.now()
  const r = await anthropic.messages.parse({
    model: "claude-haiku-5-5", max_tokens: 2000, system,
    output_config: { effort: "low", format: zodOutputFormat(Draft) },
    messages: [{ role: "user", content: text }],
  })
  const out = r.parsed_output as DraftT | null
  return { out, valid: Boolean(out && Draft.safeParse(out).success), ms: ms(t0), cost: (r.usage.input_tokens * 0.10 + r.usage.output_tokens * 0.50) / 1e6 }
}

async function gemma(system: string, text: string) {
  const t0 = performance.now()
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST", headers: { Authorization: `Bearer ${OR_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemma-4-26b-a4b-it", max_tokens: 1200,
      provider: { require_parameters: true, data_collection: "deny" },
      response_format: { type: "json_schema", json_schema: { name: "draft", strict: true, schema: z.toJSONSchema(Draft) } },
      messages: [{ role: "system", content: system }, { role: "user", content: text }],
      usage: { include: true },
    }),
  })
  const j = await res.json() as { choices?: { message: { content: string } }[]; usage?: { cost?: number }; provider?: string }
  if (!res.ok) throw new Error(`gemma ${res.status}: ${JSON.stringify(j).slice(0, 300)}`)
  let out: DraftT | null = null
  try { const p = Draft.safeParse(JSON.parse(j.choices?.[0]?.message.content ?? "")); out = p.success ? p.data : null } catch { out = null }
  return { out, valid: out !== null, ms: ms(t0), cost: j.usage?.cost ?? 0, provider: j.provider }
}

async function pick(text: string) {
  const t0 = performance.now()
  const res = await fetch("https://openrouter.ai/api/alpha/decisions", {
    method: "POST", headers: { Authorization: `Bearer ${OR_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "typesafe/jev-1.14", state: { buyer_text: text },
      questions: { survey: { type: "choice", instructions: "Which survey does the buyer in `buyer_text` say they need for their planning application?",
        criteria: Object.fromEntries([...SURVEYS.map((s) => [s.slug, `${s.name}: ${s.what}`]), ["not_sure", "The buyer does not clearly say which survey is needed."]]) } },
    }),
  })
  const j = await res.json() as { answers?: { survey?: { choice: string; confidence?: number } }; usage?: { cost?: number } }
  if (!res.ok) throw new Error(`decisions ${res.status}: ${JSON.stringify(j).slice(0, 300)}`)
  return { survey: j.answers?.survey?.choice ?? null, confidence: j.answers?.survey?.confidence ?? null, ms: ms(t0), cost: j.usage?.cost ?? 0 }
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
  return { invented: (r.parsed_output as { invented: string[] } | null)?.invented ?? ["(judge failed)"], cost: (r.usage.input_tokens * 4 + r.usage.output_tokens * 20) / 1e6 }
}

const settle = <T,>(p: Promise<T>) => p.catch((e) => ({ error: String(e) }) as const)

async function main() {
  const n = process.argv[2] ? Number(process.argv[2]) : inputs.length
  const rows = []
  let spend = 0
  for (const inp of inputs.slice(0, n)) {
    const [a1, a2, c2, p] = await Promise.all([settle(haiku(V1, inp.text)), settle(haiku(V2, inp.text)), settle(gemma(V2, inp.text)), settle(pick(inp.text))])
    const outOf = (x: unknown) => (x && typeof x === "object" && "out" in x ? (x as { out: DraftT | null }).out : null)
    const [j1, j2, jc] = await Promise.all([judge(inp.text, outOf(a1)), judge(inp.text, outOf(a2)), judge(inp.text, outOf(c2))])
    const cost = (x: unknown) => (x && typeof x === "object" && "cost" in x ? (x as { cost: number }).cost : 0)
    spend += cost(a1) + cost(a2) + cost(c2) + cost(p) + j1.cost + j2.cost + jc.cost
    rows.push({ id: inp.id, A1: { ...a1, invented: j1.invented }, A2: { ...a2, invented: j2.invented }, C2: { ...c2, invented: jc.invented }, P: p })
    console.log(JSON.stringify({ id: inp.id, inv: [j1.invented.length, j2.invented.length, jc.invented.length], ms: ["ms" in a1 ? a1.ms : "err", "ms" in a2 ? a2.ms : "err", "ms" in c2 ? c2.ms : "err", "ms" in p ? p.ms : "err"], spend: spend.toFixed(3) }))
  }
  fs.writeFileSync(path.join(DIR, `results${n < inputs.length ? `-first${n}` : ""}.json`), JSON.stringify(rows, null, 2))
}

main()
