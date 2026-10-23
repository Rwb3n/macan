// Renders the views of the map. Pure apart from reading the page stylesheet. Views are generated, never edited by hand.
import { readFileSync } from "node:fs"
import { aims, flows, parties, system } from "./context"
import { stages, useCases } from "./usecases"
import { LEAD_CHECKS, decisions, objects, processes } from "./objects"
import type { BusinessObject, Status } from "./types"

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const mq = (s: string) => s.replace(/"/g, "'")
const name = (id: string) => (id === system.id ? system.name : parties.find((p) => p.id === id)?.name ?? id)

function contextMermaid(): string {
  const nodes = [
    `  ${system.id}(["${mq(system.name.toUpperCase())}"])`,
    ...parties.map((p) => `  ${p.id}["${mq(p.name)}${p.guess ? " (guess)" : ""}"]`),
  ]
  const edges = flows.map((f) => `  ${f.from} ${f.viaUs ? "--" : "-."} "${mq(f.name)}${f.kind ? ` · ${f.kind}` : ""}" ${f.viaUs ? "-->" : ".->"} ${f.to}`)
  return ["flowchart LR", ...nodes, ...edges].join("\n")
}

function lifecycleMermaid(o: BusinessObject): string {
  const sid = (s: string) => s.replace(/-/g, "_")
  return ["stateDiagram-v2", "  direction LR", `  [*] --> ${sid(o.initial)}`,
    ...o.transitions.map((t) => `  ${sid(t.from)} --> ${sid(t.to)}${t.by ? `: ${t.by}` : ""}`)].join("\n")
}

function processMermaid(): string {
  const lines = ["flowchart TD"]
  for (const p of processes) {
    lines.push(`  subgraph ${p.id}["${p.id} ${mq(p.name)} · ${p.status}"]`)
    p.steps.forEach((s, i) => lines.push(`    ${p.id}_${i}["${mq(name(s.actor))}: ${mq(s.step)}"]:::${s.status}`))
    p.steps.slice(1).forEach((_, i) => lines.push(`    ${p.id}_${i} --> ${p.id}_${i + 1}`))
    lines.push("  end")
  }
  lines.push("  classDef built fill:#e3eee7,stroke:#2f5d46", "  classDef part fill:#f7eedd,stroke:#9a6512",
    "  classDef missing fill:#f6e3df,stroke:#a23b2a", "  classDef outside fill:none,stroke-dasharray:4 3")
  return lines.join("\n")
}

const fence = (body: string) => ["```mermaid", body, "```"].join("\n")

export function markdown(): string {
  const table = (head: string[], rows: string[][]) => [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n")
  return [
    "# The map (generated from `model/` by `npm run model:views`; do not edit)",
    "## Decisions", ...decisions.map((d) => `- **${d.id}** (${d.date}): ${d.name}. *"${d.said}"*`),
    "## Level 0: context", `System of interest: **${system.name}**: ${system.reason}`, fence(contextMermaid()),
    "Aims on the boundary: " + aims.map((a) => a.name).join("; ") + ".",
    "## Level 1: use cases", table(["id", "party", "use case", "status"], useCases.map((u) => [u.id, name(u.party), u.name + (u.guess ? " *(guess)*" : ""), u.status])),
    "## Level 2: stages", ...useCases.filter((u) => stages.some((s) => s.useCase === u.id)).flatMap((u) => [`### ${u.id} ${u.name}`,
      table(["stage", "outcome", "status"], stages.filter((s) => s.useCase === u.id).map((s) => [`${s.id} ${s.name}`, s.outcome, s.status]))]),
    "## Objects", ...objects.flatMap((o) => [`### ${o.name} (${o.status})`, fence(lifecycleMermaid(o))]),
    "## Level 3: processes", fence(processMermaid()),
  ].join("\n\n") + "\n"
}

const pill = (s: Status) => `<span class="pill ${s}">${s}</span>`

export function html(): string {
  const style = readFileSync(new URL("./views.css", import.meta.url), "utf8")
  const stageGrid = (uc: string) => `<div class="stages">${stages.filter((s) => s.useCase === uc).map((s, i) =>
    `<div class="stage${s.status === "outside" ? " out" : ""}"><span class="n">${i + 1}</span><b>${esc(s.name)}</b><p>${esc(s.outcome)}</p>${pill(s.status)}</div>`).join("")}</div>`
  return `<title>Survey Finder Models</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>${style}</style>
<div class="wrap">
<header class="top">
  <div class="kicker">The map · generated from model/</div>
  <h1>Survey Finder, from the outside in</h1>
  <p class="lede">Models are the map; the product is the territory. This page is generated from <code>macan/model/</code>; the test suite fails when the code and the map disagree.</p>
  <nav class="ladder" aria-label="Levels"><a href="#decisions">Decisions</a><a href="#context">0 · Context</a><a href="#usecases">1 · Use cases</a><a href="#stages">2 · Stages</a><a href="#objects">Objects</a><a href="#processes">3 · Processes</a></nav>
</header>
<section id="decisions"><div class="lvl"><span class="tag">Decided</span><h2>Decisions</h2></div>
${decisions.map((d) => `<div class="decision"><p><b>${esc(d.name)}</b></p><p class="who">${esc(d.source)}, ${esc(d.date)}: "${esc(d.said)}"</p></div>`).join("")}
<h3>Qualification checks on every lead</h3><div class="checks">${LEAD_CHECKS.map((c) => `<div class="check"><span class="k">${c}</span></div>`).join("")}</div></section>
<section id="context"><div class="lvl"><span class="tag">Level 0</span><h2>Context</h2></div>
<p class="q">Who does the business deal with, and what passes between them?</p>
<p>System of interest: <b>${esc(system.name)}</b> (${esc(system.inside.join(", "))}). ${esc(system.reason)} Solid arrows pass through us; dotted ones don't.</p>
<div class="frame"><pre class="mermaid">${esc(contextMermaid())}</pre></div>
<p class="lede">Aims on the boundary: ${aims.map((a) => esc(a.name)).join(" · ")}</p></section>
<section id="usecases"><div class="lvl"><span class="tag">Level 1</span><h2>Business use cases</h2></div>
<div class="tablewrap"><table><thead><tr><th>ID</th><th>Party</th><th>Comes to us to…</th><th>Status</th></tr></thead><tbody>
${useCases.map((u) => `<tr><td class="id">${u.id}</td><td>${esc(name(u.party))}</td><td>${esc(u.name)}${u.guess ? " <em>(guess)</em>" : ""}</td><td>${pill(u.status)}</td></tr>`).join("")}
</tbody></table></div></section>
<section id="stages"><div class="lvl"><span class="tag">Level 2</span><h2>Stages</h2></div>
${useCases.filter((u) => stages.some((s) => s.useCase === u.id)).map((u) => `<h3>${u.id} · ${esc(name(u.party))}: ${esc(u.name)}</h3>${stageGrid(u.id)}`).join("")}</section>
<section id="objects"><div class="lvl"><span class="tag">Objects</span><h2>Things we track, and their lifecycles</h2></div>
${objects.map((o) => `<h3>${esc(o.name)} ${pill(o.status)}</h3>${o.note ? `<p class="lede">${esc(o.note)}</p>` : ""}<div class="frame"><pre class="mermaid">${esc(lifecycleMermaid(o))}</pre></div>`).join("")}</section>
<section id="processes"><div class="lvl"><span class="tag">Level 3</span><h2>Processes</h2></div>
<div class="tablewrap"><table><thead><tr><th>#</th><th>Process</th><th>Realises</th><th>Steps</th><th>Status</th></tr></thead><tbody>
${processes.map((p) => `<tr><td class="id">${p.id}</td><td>${esc(p.name)}${p.note ? `<br><span class="muted">${esc(p.note)}</span>` : ""}</td><td class="id">${p.realises}</td><td>${p.steps.map((s) => `${esc(name(s.actor))}: ${esc(s.step)} ${pill(s.status)}`).join("<br>")}</td><td>${pill(p.status)}</td></tr>`).join("")}
</tbody></table></div></section>
<footer>Generated by <code>npm run model:views</code> from <code>macan/model/</code>. Edit the model, not this page.</footer>
</div>
`
}

