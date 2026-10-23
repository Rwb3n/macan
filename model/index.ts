// The whole map in one place, plus the id registry and the trace (D → U → PR/O → code).
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { aims, decisions } from "./why"
import { alternatives, channels, flows, parties, system } from "./who"
import { stages, useCases } from "./what"
import { objects, processes } from "./how"
import { questions } from "./open"

export { aims, decisions, alternatives, channels, flows, parties, system, stages, useCases, objects, processes, questions }

const ROOT = join(import.meta.dirname, "..")

// Every model element that can be cited, by id.
export const elements = [system, ...parties, ...flows, ...channels, ...alternatives, ...aims, ...useCases, ...stages, ...objects, ...processes]
export const ids = new Set<string>([...decisions.map((d) => d.id), ...questions.map((q) => q.id), ...elements.map((e) => e.id)])

// Research ids: R<n> → research/R<n>-*/ ; R0/<S> → research/R0-imported/<S>/
export function researchFolder(id: string): string | undefined {
  const dirs = readdirSync(join(ROOT, "research"))
  const sub = id.match(/^R0\/(.+)$/)
  if (sub) return dirs.includes("R0-imported") ? join(ROOT, "research", "R0-imported", sub[1]!) : undefined
  const d = dirs.find((x) => x.startsWith(`${id}-`))
  return d ? join(ROOT, "research", d) : undefined
}
export const researchIds = (): string[] => {
  const out: string[] = []
  for (const d of readdirSync(join(ROOT, "research"))) {
    if (d === "R0-imported") for (const s of readdirSync(join(ROOT, "research", d))) out.push(`R0/${s}`)
    else { const m = d.match(/^(R\d+)-/); if (m) out.push(m[1]!) }
  }
  return out
}

// Code traceability (src/ and scripts/): each module's first comment line reads "// Builds: U2, PR1, O-lead" (or "// Builds: infra").
export type Built = { file: string; ids: string[] }
export function builds(): Built[] {
  const out: Built[] = []
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(ts|tsx)$/.test(f) && !/\.test\.ts$/.test(f)) {
        const m = readFileSync(p, "utf8").match(/^\s*\/\/ Builds: (.+)$/m)
        out.push({ file: relative(ROOT, p).replace(/\\/g, "/"), ids: m ? m[1]!.split(",").map((s) => s.trim()).filter(Boolean) : [] })
      }
    }
  }
  walk(join(ROOT, "src"))
  walk(join(ROOT, "scripts"))
  return out.sort((a, b) => a.file.localeCompare(b.file))
}

// The trace: for each decision, the use cases, processes and objects that rest on it, and the code that builds them.
export type TraceRow = { decision: string; useCases: string[]; processes: string[]; objects: string[]; code: string[] }
export function trace(): TraceRow[] {
  const code = builds()
  const citing = (id: string, xs: { id: string; refs: string[] }[]) => xs.filter((x) => x.refs.includes(id)).map((x) => x.id)
  return decisions.map((d) => {
    const us = citing(d.id, useCases)
    const prs = [...new Set([...citing(d.id, processes), ...processes.filter((p) => us.includes(p.realises)).map((p) => p.id)])]
    const os = citing(d.id, objects)
    const all = new Set([...us, ...prs, ...os])
    return { decision: d.id, useCases: us, processes: prs, objects: os, code: code.filter((c) => c.ids.some((i) => all.has(i))).map((c) => c.file) }
  })
}
