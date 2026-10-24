"use client"

// Builds: U2, ST-U2.1, ST-U2.2, ST-U2.3, PN3
// The buyer's journey, drawn from the map's U2 stages (D14): what you give at each step, and who sees it.
// Colours are read from the site's CSS tokens at draw time, so a brand skin only changes globals.css.

import { useEffect, useId, useRef, useState } from "react"

export type JourneyStage = { id: string; name: string; outcome: string; status: string }

// What the buyer gives and who sees it, per stage. A stage the map adds without copy shows its outcome.
const SAYS: Record<string, string> = {
  "ST-U2.1": "Explain what you're planning and what the council has asked for, in your own words, and give us the postcode of the site. Only we see this.",
  "ST-U2.2": "We'll tell you straight away which survey you're likely to need, what time of year it can be done, roughly what it costs and how many firms work near you. It's free, and we don't ask for your name or contact details.",
  "ST-U2.3": "If you'd like quotes, give us your name and email address. We'll show your job to up to three local firms, but not who you are or exactly where the site is.",
  "ST-U2.4": "A firm that wants the job will be given your contact details and will get in touch. You decide which firm, if any, to book.",
  "ST-U2.5": "The firm carries out the survey and writes the report that you send to the council.",
}

type Colours = { fill: string; paper: string; line: string; ink: string; muted: string }

// Top to bottom on every screen: side by side, five boxes shrink the text until it can't be read.
function chart(stages: JourneyStage[], c: Colours): string {
  const esc = (s: string) => s.replace(/"/g, "'")
  const node = (s: JourneyStage, i: number) => `  s${i}["<b>${i + 1}. ${esc(s.name)}</b><br/><span>${esc(SAYS[s.id] ?? s.outcome)}</span>"]`
  return [
    "flowchart TD",
    ...stages.map(node),
    ...stages.slice(1).map((s, i) => `  s${i} ${s.status === "outside" ? "-.->" : "-->"} s${i + 1}`),
    `  classDef ours fill:${c.fill},stroke:${c.line},color:${c.ink}`,
    `  classDef theirs fill:${c.paper},stroke:${c.line},color:${c.muted},stroke-dasharray:4 3`,
    ...stages.map((s, i) => `  class s${i} ${s.status === "outside" ? "theirs" : "ours"}`),
  ].join("\n")
}

export function Journey({ stages }: { stages: JourneyStage[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId().replace(/[^a-zA-Z0-9]/g, "")
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    ;(async () => {
      try {
        const css = getComputedStyle(document.documentElement)
        const token = (n: string) => css.getPropertyValue(n).trim()
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false, securityLevel: "strict", theme: "base",
          themeVariables: { fontFamily: token("--font-sans"), fontSize: "15px", lineColor: token("--color-moss"), primaryTextColor: token("--color-ink") },
          flowchart: { htmlLabels: true, wrappingWidth: 300, useMaxWidth: true },
        })
        const colours = { fill: token("--color-leaf"), paper: token("--color-paper"), line: token("--color-moss"), ink: token("--color-ink"), muted: token("--color-muted") }
        const { svg } = await mermaid.render(`journey${id}`, chart(stages, colours))
        if (live && ref.current) ref.current.innerHTML = svg
      } catch {
        if (live) setFailed(true)
      }
    })()
    return () => { live = false }
  }, [stages, id])
  return (
    <figure className="journey mx-auto max-w-sm" aria-label="How it works">
      <div ref={ref} />
      {/* Always present for screen readers, and shown if the diagram can't draw. */}
      <ol className={failed ? "mt-2 space-y-2 text-sm" : "sr-only"}>
        {stages.map((s, i) => <li key={s.id}><b>{i + 1}. {s.name}.</b> {SAYS[s.id] ?? s.outcome}</li>)}
      </ol>
    </figure>
  )
}
