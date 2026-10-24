// The loop's checks: every id resolves, nothing dangles, the code is traced, nothing is orphaned,
// the levels balance, the code agrees with the map, and the views are current.
import { describe, expect, it } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { getTableConfig } from "drizzle-orm/sqlite-core"
import * as schema from "@/db/schema"
import { qualify } from "@/qualify"
import {
  alternatives, builds, channels, decisions, elements, flows, ids, objects, pains, parties, processes, questions,
  researchFolder, researchIds, stages, system, useCases,
} from "./index"
import { BRIEF_STATES, LEAD_CHECKS, LEAD_GRADES, LEAD_REVIEWS } from "./how"
import { html, markdown, openMarkdown, traceMarkdown } from "./render"

const isResearch = (r: string) => /^R\d+$/.test(r) || /^R0\/.+$/.test(r)
const known = (r: string) => (isResearch(r) ? researchFolder(r) !== undefined : ids.has(r))
const partyIds = new Set([system.id, ...parties.map((p) => p.id)])
const pairs = <T extends { id: string }>(xs: T[]) => xs.map((x) => [x.id, x] as const)
const citing = [...elements, ...decisions, ...questions]

describe("1. every id resolves", () => {
  it("ids are unique across the map", () => {
    const all = citing.map((x) => x.id)
    expect(all.filter((x, i) => all.indexOf(x) !== i)).toEqual([])
  })
  it.each(pairs(citing))("%s: every ref resolves", (_id, e) => {
    expect(e.refs.filter((r) => !known(r))).toEqual([])
  })
  it.each(pairs(elements))("%s: rests on a decision, a study or an open question", (_id, e) => {
    expect(e.refs.some((r) => /^(D|Q)\d+$/.test(r) || isResearch(r))).toBe(true)
  })
  it.each(pairs(elements.filter((e) => e.guess)))("%s: a guess cites its open question", (_id, e) => {
    expect(e.refs.some((r) => /^Q\d+$/.test(r))).toBe(true)
  })
  it("every cited study has a result", () => {
    const cited = new Set(citing.flatMap((e) => e.refs).filter(isResearch))
    expect([...cited].filter((r) => !existsSync(join(researchFolder(r)!, "result.md")))).toEqual([])
  })
})

describe("2. nothing dangles", () => {
  it("flows connect known parties", () => {
    expect(flows.filter((f) => !partyIds.has(f.from) || !partyIds.has(f.to)).map((f) => f.id)).toEqual([])
  })
  it("every use case belongs to a party on the context (W3), never the system itself", () => {
    expect(useCases.filter((u) => !partyIds.has(u.party) || u.party === system.id).map((u) => u.id)).toEqual([])
  })
  it("every context flow is explained by a use case (W4)", () => {
    const explained = new Set(useCases.flatMap((u) => u.flows))
    expect(flows.filter((f) => !explained.has(f.id)).map((f) => f.id)).toEqual([])
  })
  it("use cases cite only flows that exist", () => {
    const f = new Set(flows.map((x) => x.id))
    expect(useCases.flatMap((u) => u.flows.filter((x) => !f.has(x)).map((x) => `${u.id}:${x}`))).toEqual([])
  })
  it("stages, processes and alternatives point at known use cases; process steps at known parties", () => {
    const u = new Set(useCases.map((x) => x.id))
    expect(stages.filter((s) => !u.has(s.useCase)).map((s) => s.id)).toEqual([])
    expect(processes.filter((p) => !u.has(p.realises)).map((p) => p.id)).toEqual([])
    expect(alternatives.flatMap((a) => a.serves.filter((s) => !u.has(s)).map((s) => `${a.id}:${s}`))).toEqual([])
    expect(processes.flatMap((p) => p.steps.filter((s) => !partyIds.has(s.actor)).map((s) => `${p.id}:${s.actor}`))).toEqual([])
  })
  it("channels belong to known parties and carry a receipt or a guess; every party with a use case has a channel", () => {
    expect(channels.filter((c) => !partyIds.has(c.party) || !(c.receipt || c.guess)).map((c) => c.id)).toEqual([])
    const reached = new Set(channels.map((c) => c.party))
    expect([...new Set(useCases.map((x) => x.party))].filter((p) => !reached.has(p))).toEqual([])
  })
  it("lifecycles move only between their own states", () => {
    for (const o of objects) {
      expect([o.id, o.states.includes(o.initial)]).toEqual([o.id, true])
      expect([o.id, o.transitions.filter((t) => !o.states.includes(t.from) || !o.states.includes(t.to))]).toEqual([o.id, []])
    }
  })
  it("a process is built only if all its steps are", () => {
    expect(processes.filter((p) => p.status === "built" && p.steps.some((s) => s.status !== "built")).map((p) => p.id)).toEqual([])
  })
  it("every buyer pain is answered by something on the map, or by the open question that would test an answer (D10)", () => {
    expect(pains.filter((p) => !partyIds.has(p.party) || !p.receipt || p.answeredBy.length === 0).map((p) => p.id)).toEqual([])
    expect(pains.flatMap((p) => p.answeredBy.filter((a) => !ids.has(a)).map((a) => `${p.id}:${a}`))).toEqual([])
  })
  it("three to five things per view (W1)", () => {
    expect(pains.length).toBeLessThanOrEqual(5)
    expect(parties.length).toBeLessThanOrEqual(5)
    for (const u of useCases) expect([u.id, stages.filter((s) => s.useCase === u.id).length <= 5]).toEqual([u.id, true])
  })
  it("every product decision is cited by something (working rules D3, D4, D7, D8, D15 are enforced by AGENTS.md and these checks)", () => {
    const cited = new Set([...elements, ...questions].flatMap((e) => e.refs))
    const rules = new Set(["D3", "D4", "D7", "D8", "D15"])
    expect(decisions.filter((d) => !rules.has(d.id) && !cited.has(d.id)).map((d) => d.id)).toEqual([])
  })
})

describe("3. the code is traced", () => {
  const b = builds()
  it.each(b.map((x) => [x.file, x] as const))("%s names what it builds", (_f, x) => {
    expect(x.ids.length).toBeGreaterThan(0)
    expect(x.ids.filter((i) => i !== "infra" && !ids.has(i))).toEqual([])
  })
  it("every built or partly built use case, process and object is built by some code", () => {
    const covered = new Set(b.flatMap((x) => x.ids))
    const due = [...useCases, ...processes, ...objects].filter((e) => e.status === "built" || e.status === "part").map((e) => e.id)
    expect(due.filter((i) => !covered.has(i))).toEqual([])
  })
})

describe("4. no orphans", () => {
  it("every research study is cited by the map", () => {
    const cited = new Set(citing.flatMap((e) => e.refs))
    expect(researchIds().filter((r) => !cited.has(r))).toEqual([])
  })
  it("every study folder has a method and a result", () => {
    const missing = researchIds().filter((r) => !existsSync(join(researchFolder(r)!, "method.md")) || !existsSync(join(researchFolder(r)!, "result.md")))
    expect(missing).toEqual([])
  })
})

describe("5. the code agrees with the map", () => {
  const lead = objects.find((o) => o.id === "O-lead")!
  it("every lead grade and review outcome is a state of the Lead lifecycle", () => {
    expect([...LEAD_GRADES, ...LEAD_REVIEWS.filter((r) => r !== "new")].filter((s) => !lead.states.includes(s))).toEqual([])
  })
  it("the brief states in code are exactly the Brief lifecycle's", () => {
    expect([...BRIEF_STATES].sort()).toEqual([...objects.find((o) => o.id === "O-brief")!.states].sort())
  })
  it("qualification reports exactly the map's four checks", () => {
    const q = qualify({ survey: "bat-survey", projectType: "loft", planningStage: "preparing", postcode: "OX1 2JD",
      details: "x".repeat(40), answer: "yes", deadline: null, emailConfirmed: true }, new Date(Date.UTC(2026, 5, 1)))
    expect(Object.keys(q.checks).sort()).toEqual([...LEAD_CHECKS].sort())
  })
  const tables = new Set(Object.values(schema).flatMap((t) => {
    try { return [getTableConfig(t as Parameters<typeof getTableConfig>[0]).name] } catch { return [] }
  }))
  it.each(pairs(objects))("%s: its table exists exactly when the map says it is at least partly built", (_id, o) => {
    expect(o.table, `${o.id} names no table`).toBeDefined()
    expect([o.id, o.status, tables.has(o.table!)]).toEqual([o.id, o.status, o.status !== "missing"])
  })
})

describe("6. views are current (run `npm run model:views`)", () => {
  const v = (f: string) => readFileSync(new URL(`./views/${f}`, import.meta.url), "utf8")
  it("map.md", () => expect(v("map.md")).toBe(markdown()))
  it("trace.md", () => expect(v("trace.md")).toBe(traceMarkdown()))
  it("open.md", () => expect(v("open.md")).toBe(openMarkdown()))
  it("map.html", () => expect(v("map.html")).toBe(html()))
})
