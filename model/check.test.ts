// The loop's check: the map agrees with itself (balancing) and with the territory (the code).
import { describe, expect, it } from "vitest"
import { getTableConfig } from "drizzle-orm/sqlite-core"
import * as schema from "@/db/schema"
import { qualify } from "@/qualify"
import { aims, flows, parties, system } from "./context"
import { stages, useCases, requirementExplainedBy } from "./usecases"
import { LEAD_CHECKS, LEAD_GRADES, LEAD_REVIEWS, objects, processes } from "./objects"
import { html, markdown } from "./render"
import { alternatives } from "./alternatives"
import { readFileSync } from "node:fs"

const partyIds = new Set([...parties.map((p) => p.id), system.id])
const ids = (xs: { id: string }[]) => xs.map((x) => x.id)

describe("map: every element is sourced", () => {
  const all = [system, ...parties, ...flows, ...aims, ...useCases, ...stages, ...objects, ...processes, ...alternatives]
  it.each(all.map((e) => [e.id, e]))("%s has a source", (_id, e) => expect(e.source.trim()).not.toBe(""))
  it("ids are unique within each level", () => {
    for (const level of [parties, flows, useCases, stages, objects, processes]) {
      expect(new Set(ids(level)).size).toBe(level.length)
    }
  })
})

describe("map: levels balance (modelkit §5)", () => {
  it("flows connect known parties", () => {
    for (const f of flows) expect([f.id, partyIds.has(f.from) && partyIds.has(f.to)]).toEqual([f.id, true])
  })
  it("every use case's actor is a party on the context (W3)", () => {
    for (const u of useCases) expect([u.id, partyIds.has(u.party)]).toEqual([u.id, true])
  })
  it("the system of interest is never an actor of its own use cases", () => {
    expect(useCases.filter((u) => u.party === system.id)).toEqual([])
  })
  it("every context flow is explained by a use case (W4)", () => {
    const explained = new Set(useCases.flatMap((u) => u.flows))
    const unexplained = flows.filter((f) => !explained.has(f.id) && !(f.id === "requirement" && requirementExplainedBy))
    expect(unexplained.map((f) => f.id)).toEqual([])
  })
  it("use cases only cite flows that exist", () => {
    const known = new Set(ids(flows))
    expect(useCases.flatMap((u) => u.flows.filter((f) => !known.has(f)).map((f) => `${u.id}:${f}`))).toEqual([])
  })
  it("every stage belongs to a known use case, at most five per use case (W1)", () => {
    const known = new Set(ids(useCases))
    for (const s of stages) expect([s.id, known.has(s.useCase)]).toEqual([s.id, true])
    for (const u of useCases) expect(stages.filter((s) => s.useCase === u.id).length).toBeLessThanOrEqual(5)
  })
  it("at most five parties on the context, plus the system (W1)", () => expect(parties.length).toBeLessThanOrEqual(5))
  it("lifecycles only move between their own states, from a known initial state", () => {
    for (const o of objects) {
      expect([o.id, o.states.includes(o.initial)]).toEqual([o.id, true])
      const bad = o.transitions.filter((t) => !o.states.includes(t.from) || !o.states.includes(t.to))
      expect([o.id, bad]).toEqual([o.id, []])
    }
  })
  it("processes realise known use cases, with known actors", () => {
    const known = new Set(ids(useCases))
    for (const p of processes) {
      expect([p.id, known.has(p.realises)]).toEqual([p.id, true])
      for (const s of p.steps) expect([p.id, s.actor, partyIds.has(s.actor)]).toEqual([p.id, s.actor, true])
    }
  })
  it("alternatives serve known use cases", () => {
    const known = new Set(ids(useCases))
    expect(alternatives.flatMap((a) => a.serves.filter((u) => !known.has(u)).map((u) => `${a.id}:${u}`))).toEqual([])
  })
  it("a process is built only if all its steps are", () => {
    for (const p of processes.filter((p) => p.status === "built")) {
      expect([p.id, p.steps.every((s) => s.status === "built")]).toEqual([p.id, true])
    }
  })
})

describe("views are current", () => {
  it("model/views/ matches the map (run `npm run model:views`)", () => {
    expect(readFileSync(new URL("./views/model.md", import.meta.url), "utf8")).toBe(markdown())
    expect(readFileSync(new URL("./views/model.html", import.meta.url), "utf8")).toBe(html())
  })
})

describe("territory agrees with the map", () => {
  const lead = objects.find((o) => o.id === "lead")!
  it("every lead grade and review outcome is a state of the Lead lifecycle", () => {
    const states = new Set(lead.states)
    expect([...LEAD_GRADES, ...LEAD_REVIEWS.filter((r) => r !== "new")].filter((s) => !states.has(s))).toEqual([])
  })
  it("qualification reports exactly the map's four checks", () => {
    const q = qualify({ survey: "bat-survey", projectType: "loft", planningStage: "preparing", postcode: "OX1 2JD",
      details: "x".repeat(40), answer: "yes", deadline: null, emailConfirmed: true }, new Date(Date.UTC(2026, 5, 1)))
    expect(Object.keys(q.checks).sort()).toEqual([...LEAD_CHECKS].sort())
  })

  // Each object's table exists in code exactly when the map says it is at least partly built.
  const TABLE: Record<string, string> = { lead: "leads", brief: "briefs", listing: "firms", claim: "claim_requests", notice: "notices" }
  const tables = new Set(Object.values(schema).flatMap((t) => {
    try { return [getTableConfig(t as Parameters<typeof getTableConfig>[0]).name] } catch { return [] }
  }))
  it.each(objects.map((o) => [o.id, o]))("%s: table present iff not missing", (_id, o) => {
    const table = TABLE[o.id]
    expect(table, `map object ${o.id} has no table mapping`).toBeDefined()
    expect([o.id, o.status, tables.has(table!)]).toEqual([o.id, o.status, o.status !== "missing"])
  })
})
