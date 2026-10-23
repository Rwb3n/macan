// Renders the views of the map. Views are generated, never edited by hand.
import { readFileSync } from "node:fs"
import {
  aims, alternatives, builds, channels, decisions, flows, objects, parties, processes, questions, stages, system, trace, useCases,
} from "./index"
import { LEAD_CHECKS } from "./how"
import type { BusinessObject, Status } from "./types"

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const mq = (s: string) => s.replace(/"/g, "'")
const sid = (s: string) => s.replace(/[^A-Za-z0-9_]/g, "_")
const name = (id: string) => (id === system.id ? system.name : parties.find((p) => p.id === id)?.name ?? id)
const fence = (body: string) => ["```mermaid", body, "```"].join("\n")
const table = (head: string[], rows: string[][]) =>
  [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, "/")).join(" | ")} |`)].join("\n")
const refs = (r: string[]) => (r.length ? r.join(", ") : "principal")
const g = (x: { guess?: boolean }) => (x.guess ? " *(guess)*" : "")

function contextMermaid(): string {
  return ["flowchart LR",
    `  ${sid(system.id)}(["${mq(system.name.toUpperCase())}"])`,
    ...parties.map((p) => `  ${sid(p.id)}["${mq(p.name)}${p.guess ? " (guess)" : ""}"]`),
    ...flows.map((f) => `  ${sid(f.from)} ${f.viaUs ? "--" : "-."} "${mq(f.name)}${f.kind ? ` · ${f.kind}` : ""}" ${f.viaUs ? "-->" : ".->"} ${sid(f.to)}`),
  ].join("\n")
}

function lifecycleMermaid(o: BusinessObject): string {
  return ["stateDiagram-v2", "  direction LR", `  [*] --> ${sid(o.initial)}`,
    ...o.transitions.map((t) => `  ${sid(t.from)} --> ${sid(t.to)}${t.by ? `: ${t.by}` : ""}`)].join("\n")
}

export function markdown(): string {
  return [
    "# The map (generated from `model/` by `npm run model:views`; do not edit)",
    "Read top-down: **why** (D) → **who** (P, CH, ALT) → **what** (U, ST) → **how** (PR, O) → code. Every line cites its D, R or Q.",
    "## Why: decisions", table(["id", "decision", "said", "rests on"], decisions.map((d) => [d.id, d.name, `"${d.said}" (${d.date})`, refs(d.refs)])),
    "Aims on the boundary: " + aims.map((a) => `${a.id} ${a.name}`).join("; ") + ".",
    "## Who: context", `System of interest: **${system.name}** (${system.inside.join(", ")}). ${system.reason}`, fence(contextMermaid()),
    "### Channels", table(["id", "party", "channel", "status", "receipt", "rests on"], channels.map((c) => [c.id, name(c.party), c.name + g(c), c.status, c.receipt ?? "none yet", refs(c.refs)])),
    "### Alternatives", table(["id", "alternative", "serves", "offer", "rests on"], alternatives.map((a) => [a.id, a.name + g(a), a.serves.join(", "), a.offer + (a.receipt ? ` Receipt: ${a.receipt}` : ""), refs(a.refs)])),
    "## What: use cases", table(["id", "party", "use case", "status", "rests on"], useCases.map((u) => [u.id, name(u.party), u.name + g(u), u.status, refs(u.refs)])),
    "### Stages", ...useCases.filter((u) => stages.some((s) => s.useCase === u.id)).flatMap((u) => [`**${u.id}** ${u.name}`,
      table(["id", "stage", "outcome", "status"], stages.filter((s) => s.useCase === u.id).map((s) => [s.id, s.name, s.outcome, s.status]))]),
    "## How: objects", ...objects.flatMap((o) => [`### ${o.id} ${o.name} (${o.status}; rests on ${refs(o.refs)})`, fence(lifecycleMermaid(o))]),
    "## How: processes", table(["id", "process", "realises", "steps", "status", "rests on"], processes.map((p) => [p.id, p.name, p.realises, p.steps.map((s) => `${name(s.actor)}: ${s.step} (${s.status})`).join("; "), p.status, refs(p.refs)])),
  ].join("\n\n") + "\n"
}

export function traceMarkdown(): string {
  const code = builds()
  return [
    "# Trace (generated; do not edit)",
    "Each decision, down to the use cases, processes and objects that rest on it, and the code that builds them.",
    table(["decision", "use cases", "processes", "objects", "code"], trace().map((t) => [
      `${t.decision} ${decisions.find((d) => d.id === t.decision)!.name}`,
      t.useCases.join(", ") || "-", t.processes.join(", ") || "-", t.objects.join(", ") || "-", t.code.join(", ") || "-"])),
    "## Code → map", table(["file", "builds"], code.map((c) => [c.file, c.ids.join(", ")])),
  ].join("\n\n") + "\n"
}

export function openMarkdown(): string {
  const leaning = (id: string) => [...useCases, ...channels, ...flows, ...parties, ...objects, ...processes].filter((e) => e.refs.includes(id)).map((e) => e.id)
  return [
    "# Open questions (generated; do not edit)",
    "Every guess the map rests on, and the test that would settle it.",
    table(["id", "state", "question", "test", "evidence so far", "what rests on it"], questions.map((q) => [q.id, q.state, q.name, q.test, `${refs(q.refs)}${q.note ? `: ${q.note}` : ""}`, leaning(q.id).join(", ") || "-"])),
  ].join("\n\n") + "\n"
}

const pill = (s: Status | string) => `<span class="pill ${s}">${s}</span>`
const td = (s: string) => `<td>${s}</td>`

export function html(): string {
  const style = readFileSync(new URL("./views.css", import.meta.url), "utf8")
  const row = (cells: string[]) => `<tr>${cells.map(td).join("")}</tr>`
  const tbl = (head: string[], rows: string[][]) =>
    `<div class="tablewrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(row).join("")}</tbody></table></div>`
  const id = (x: string) => `<span class="id">${esc(x)}</span>`
  const r = (xs: string[]) => `<span class="muted">${esc(refs(xs))}</span>`
  const stageGrid = (uc: string) => `<div class="stages">${stages.filter((s) => s.useCase === uc).map((s, i) =>
    `<div class="stage${s.status === "outside" ? " out" : ""}"><span class="n">${i + 1}</span><b>${esc(s.name)}</b><p>${esc(s.outcome)}</p>${pill(s.status)}</div>`).join("")}</div>`
  const section = (sid: string, tag: string, title: string, q: string, body: string) =>
    `<section id="${sid}"><div class="lvl"><span class="tag">${tag}</span><h2>${title}</h2></div>${q ? `<p class="q">${q}</p>` : ""}${body}</section>`
  return `<title>Survey Finder Models</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${style}</style>
<div class="wrap">
<header class="top">
  <div class="kicker">The map · generated from macan/model/</div>
  <h1>Survey Finder, from the outside in</h1>
  <p class="lede">Why → who → what → how → code. Every line cites the decision (D), study (R) or open question (Q) it rests on; the test suite fails when anything doesn't resolve, dangles, or disagrees with the code.</p>
  <nav class="ladder" aria-label="Levels"><a href="#why">Why</a><a href="#who">Who</a><a href="#what">What</a><a href="#how">How</a><a href="#trace">Trace</a><a href="#open">Open</a></nav>
</header>
${section("why", "Why", "Decisions", "What the principal decided, word for word.",
    tbl(["Id", "Decision", "Said", "Rests on"], decisions.map((d) => [id(d.id), esc(d.name), `<span class="muted">"${esc(d.said)}" · ${d.date}</span>`, r(d.refs)])) +
    `<p class="lede">Aims on the boundary: ${aims.map((a) => `${id(a.id)} ${esc(a.name)}`).join(" · ")}</p>` +
    `<h3>Qualification checks on every lead</h3><div class="checks">${LEAD_CHECKS.map((c) => `<div class="check"><span class="k">${c}</span></div>`).join("")}</div>`)}
${section("who", "Who", "Context, channels, alternatives", "Who does the business deal with, how do they reach us, and what do they use instead?",
    `<div class="frame"><pre class="mermaid">${esc(contextMermaid())}</pre></div>` +
    `<h3>Channels</h3>` + tbl(["Id", "Party", "Channel", "Status", "Receipt"], channels.map((c) => [id(c.id), esc(name(c.party)), esc(c.name) + (c.guess ? " <em>(guess)</em>" : ""), pill(c.status), `<span class="muted">${esc(c.receipt ?? "none yet")}</span>`])) +
    `<h3>Alternatives</h3>` + tbl(["Id", "Alternative", "Serves", "Offer"], alternatives.map((a) => [id(a.id), esc(a.name), id(a.serves.join(", ")), esc(a.offer) + (a.receipt ? `<br><span class="muted">Receipt: ${esc(a.receipt)}</span>` : "")])))}
${section("what", "What", "Use cases and stages", "What does each party come to us for, and what do they go through?",
    tbl(["Id", "Party", "Comes to us to…", "Status", "Rests on"], useCases.map((u) => [id(u.id), esc(name(u.party)), esc(u.name) + (u.guess ? " <em>(guess)</em>" : ""), pill(u.status), r(u.refs)])) +
    useCases.filter((u) => stages.some((s) => s.useCase === u.id)).map((u) => `<h3>${u.id} · ${esc(u.name)}</h3>${stageGrid(u.id)}`).join(""))}
${section("how", "How", "Objects and processes", "What do we track, and what moves it?",
    objects.map((o) => `<h3>${id(o.id)} ${esc(o.name)} ${pill(o.status)}</h3>${o.note ? `<p class="lede">${esc(o.note)}</p>` : ""}<div class="frame"><pre class="mermaid">${esc(lifecycleMermaid(o))}</pre></div>`).join("") +
    tbl(["Id", "Process", "Realises", "Steps", "Status"], processes.map((p) => [id(p.id), esc(p.name) + (p.note ? `<br><span class="muted">${esc(p.note)}</span>` : ""), id(p.realises), p.steps.map((s) => `${esc(name(s.actor))}: ${esc(s.step)} ${pill(s.status)}`).join("<br>"), pill(p.status)])))}
${section("trace", "Trace", "Decision → use case → process / object → code", "Follow any decision down to the code it produced.",
    tbl(["Decision", "Use cases", "Processes", "Objects", "Code"], trace().map((t) => [`${id(t.decision)} ${esc(decisions.find((d) => d.id === t.decision)!.name)}`, id(t.useCases.join(", ") || "-"), id(t.processes.join(", ") || "-"), id(t.objects.join(", ") || "-"), `<span class="muted">${esc(t.code.join(", ") || "-")}</span>`])))}
${section("open", "Open", "Open questions", "Every guess the map rests on, and the test that would settle it.",
    tbl(["Id", "State", "Question", "Test"], questions.map((q) => [id(q.id), pill(q.state), esc(q.name) + (q.note ? `<br><span class="muted">${esc(q.note)}</span>` : ""), esc(q.test)])))}
<footer>Generated by <code>npm run model:views</code> from <code>macan/model/</code>. Edit the model, not this page.</footer>
</div>
`
}
