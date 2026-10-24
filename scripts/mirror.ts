// Builds: infra
// One-way mirror of the map's backlog to GitHub (D15): milestones are use cases; issues are the steps, stages and objects
// that are missing or part, and the open questions. The map is the source; edits on GitHub are overwritten on the next run.
// Usage: npm run mirror  (needs the gh CLI, logged in with repo and project scopes)
import { execFileSync } from "node:child_process"
import { decisions, objects, processes, questions, stages, useCases } from "../model/index"

const REPO = process.env.MIRROR_REPO ?? "Rwb3n/macan"
const OWNER = REPO.split("/")[0]!
const PROJECT_TITLE = "macan backlog (mirrored from the map)"
const MAP = "Generated from `model/` by `npm run mirror`. Change the map, not this issue; edits here are overwritten."

const gh = (...args: string[]) => execFileSync("gh", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })
const ghJson = <T,>(...args: string[]) => JSON.parse(gh(...args)) as T
const api = <T,>(method: string, path: string, fields: Record<string, string> = {}) =>
  ghJson<T>("api", "-X", method, path, ...Object.entries(fields).flatMap(([k, v]) => ["-f", `${k}=${v}`]))

type Item = { key: string; title: string; body: string; labels: string[]; milestone?: string; open: boolean }

const decision = (id: string) => decisions.find((d) => d.id === id)
const rests = (refs: string[]) => refs.map((r) => (decision(r) ? `${r} (${decision(r)!.name})` : r)).join("; ")
const ucTitle = (id: string) => { const u = useCases.find((x) => x.id === id); return u ? `${u.id}: ${u.name}` : undefined }

// What the map says is still to do.
function items(): Item[] {
  const out: Item[] = []
  for (const p of processes) p.steps.forEach((s, i) => {
    const key = `${p.id}.${i + 1}`
    const parked = /parked/i.test(s.step)
    out.push({
      key, title: `[${key}] ${s.step}`, open: s.status !== "built",
      labels: [`status:${s.status}`, "step", p.id, ...(parked ? ["parked"] : [])], milestone: ucTitle(p.realises),
      body: [`**Process ${p.id}:** ${p.name} (realises ${p.realises})`, `**Step:** ${s.step}`, `**Status:** ${s.status}`,
        p.note ? `**Note:** ${p.note}` : "", `**Rests on:** ${rests(p.refs)}`, "", MAP].filter(Boolean).join("\n\n"),
    })
  })
  for (const s of stages) out.push({
    key: s.id, title: `[${s.id}] ${s.name}`, open: s.status === "missing" || s.status === "part",
    labels: [`status:${s.status}`, "stage"], milestone: ucTitle(s.useCase),
    body: [`**Stage of ${s.useCase}:** ${s.name}`, `**Outcome:** ${s.outcome}`, `**Status:** ${s.status}`, s.note ? `**Note:** ${s.note}` : "",
      `**Rests on:** ${rests(s.refs)}`, "", MAP].filter(Boolean).join("\n\n"),
  })
  for (const o of objects) out.push({
    key: o.id, title: `[${o.id}] ${o.name}`, open: o.status === "missing" || o.status === "part",
    labels: [`status:${o.status}`, "object"],
    body: [`**Object:** ${o.name}`, `**Lifecycle:** ${o.states.join(" → ")}`, `**Status:** ${o.status}`, o.note ? `**Note:** ${o.note}` : "",
      `**Rests on:** ${rests(o.refs)}`, "", MAP].filter(Boolean).join("\n\n"),
  })
  for (const q of questions) {
    const leaning = [...useCases, ...processes, ...stages].filter((e) => e.refs.includes(q.id)).map((e) => e.id)
    const waitsOnPrincipal = /principal/i.test(q.test)
    out.push({
      key: q.id, title: `[${q.id}] ${q.name}`, open: q.state !== "answered",
      labels: ["question", `state:${q.state}`, ...(waitsOnPrincipal ? ["needs-principal"] : [])],
      body: [`**Open question:** ${q.name}`, `**State:** ${q.state}`, `**Test:** ${q.test}`, q.note ? `**Evidence so far:** ${q.note}` : "",
        `**Rests on:** ${rests(q.refs)}`, leaning.length ? `**What rests on it:** ${leaning.join(", ")}` : "", "", MAP].filter(Boolean).join("\n\n"),
    })
  }
  return out
}

const marker = (key: string) => `<!-- map:${key} -->`

function main() {
  const want = items()
  // Labels
  const haveLabels = new Set(ghJson<{ name: string }[]>("label", "list", "--repo", REPO, "--limit", "500", "--json", "name").map((l) => l.name))
  for (const l of new Set(want.flatMap((i) => i.labels))) if (!haveLabels.has(l)) gh("label", "create", l, "--repo", REPO, "--force", "--color", color(l))
  // Milestones (use cases)
  const ms = api<{ title: string; number: number }[]>("GET", `repos/${REPO}/milestones?state=all&per_page=100`)
  const msByTitle = new Map(ms.map((m) => [m.title, m.number]))
  for (const u of useCases) {
    const t = ucTitle(u.id)!
    if (!msByTitle.has(t)) msByTitle.set(t, api<{ number: number }>("POST", `repos/${REPO}/milestones`, { title: t, description: `Use case for ${u.party}; status ${u.status}. ${MAP}` }).number)
  }
  // Issues: create, update, close or reopen to match the map
  const existing = ghJson<{ number: number; body: string; state: string }[]>("issue", "list", "--repo", REPO, "--state", "all", "--limit", "1000", "--json", "number,body,state")
  const byKey = new Map(existing.map((e) => [e.body.match(/<!-- map:([^ ]+) -->/)?.[1], e]).filter((x): x is [string, (typeof existing)[number]] => Boolean(x[0])))
  const project = ensureProject()
  let created = 0, updated = 0, closed = 0
  for (const it of want) {
    const body = `${it.body}\n\n${marker(it.key)}`
    const ex = byKey.get(it.key)
    if (!ex && !it.open) continue
    const msArgs = it.milestone ? ["--milestone", it.milestone] : []
    let number = ex?.number
    if (!ex) {
      const url = gh("issue", "create", "--repo", REPO, "--title", it.title, "--body", body, ...it.labels.flatMap((l) => ["--label", l]), ...msArgs).trim()
      number = Number(url.split("/").pop()); created++
    } else {
      const current = ghJson<{ labels: { name: string }[] }>("issue", "view", String(ex.number), "--repo", REPO, "--json", "labels").labels.map((l) => l.name)
      const drop = current.filter((l) => !it.labels.includes(l))
      gh("issue", "edit", String(ex.number), "--repo", REPO, "--title", it.title, "--body", body, ...it.labels.flatMap((l) => ["--add-label", l]),
        ...drop.flatMap((l) => ["--remove-label", l]), ...msArgs)
      updated++
      if (ex.state === "OPEN" && !it.open) { gh("issue", "close", String(ex.number), "--repo", REPO, "--comment", "Built or answered, according to the map."); closed++ }
      if (ex.state === "CLOSED" && it.open) gh("issue", "reopen", String(ex.number), "--repo", REPO)
    }
    if (project && it.open) { try { gh("project", "item-add", String(project), "--owner", OWNER, "--url", `https://github.com/${REPO}/issues/${number}`) } catch { /* already on the board */ } }
  }
  console.log(JSON.stringify({ event: "mirror", repo: REPO, project, items: want.length, open: want.filter((i) => i.open).length, created, updated, closed }))
}

function ensureProject(): number | undefined {
  try {
    const list = ghJson<{ projects: { number: number; title: string }[] }>("project", "list", "--owner", OWNER, "--format", "json")
    const found = list.projects.find((p) => p.title === PROJECT_TITLE)
    if (found) return found.number
    return ghJson<{ number: number }>("project", "create", "--owner", OWNER, "--title", PROJECT_TITLE, "--format", "json").number
  } catch { return undefined }
}

function color(label: string): string {
  if (label === "status:missing") return "d73a4a"
  if (label === "status:part") return "fbca04"
  if (label === "parked") return "bfbfbf"
  if (label === "needs-principal") return "5319e7"
  if (label === "question" || label.startsWith("state:")) return "0075ca"
  return "c2e0c6"
}

main()
