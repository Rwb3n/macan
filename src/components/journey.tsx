"use client"

// Builds: U2, ST-U2.1, ST-U2.2, ST-U2.3, PN3
// The buyer's journey, drawn from the map's U2 stages (D14): what you give at each step, and who sees it.
// Colours are read from the site's CSS tokens at draw time, so a brand skin only changes globals.css.

import { useEffect, useId, useRef, useState } from "react"

export type JourneyStage = { id: string; name: string; outcome: string; status: string }

// What the buyer gives and who sees it, per stage. A stage the map adds without copy shows its outcome.
const SAYS: Record<string, string> = {
  "ST-U2.1": "You tell us what's going on and the postcode. Nobody else sees it.",
  "ST-U2.2": "We tell you the survey, its season, a typical price and how many firms cover your area. Free; no details asked.",
  "ST-U2.3": "Only if you choose: your name and email. Up to 3 local firms see the job and the area, not you.",
  "ST-U2.4": "A firm that takes it gets your contact and gets in touch. You choose who to book.",
  "ST-U2.5": "The firm does the survey and writes the report for the council.",
}

type Colours = { fill: string; paper: string; line: string; ink: string; muted: string }

function chart(stages: JourneyStage[], vertical: boolean, c: Colours): string {
  const esc = (s: string) => s.replace(/"/g, "'")
  const node = (s: JourneyStage, i: number) => `  s${i}["<b>${i + 1}. ${esc(s.name)}</b><br/><span>${esc(SAYS[s.id] ?? s.outcome)}</span>"]`
  return [
    `flowchart ${vertical ? "TD" : "LR"}`,
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
          themeVariables: { fontFamily: token("--font-sans"), lineColor: token("--color-moss"), primaryTextColor: token("--color-ink") },
          flowchart: { htmlLabels: true, wrappingWidth: 220 },
        })
        const vertical = window.matchMedia("(max-width: 640px)").matches
        const colours = { fill: token("--color-leaf"), paper: token("--color-paper"), line: token("--color-moss"), ink: token("--color-ink"), muted: token("--color-muted") }
        const { svg } = await mermaid.render(`journey${id}`, chart(stages, vertical, colours))
        if (live && ref.current) ref.current.innerHTML = svg
      } catch {
        if (live) setFailed(true)
      }
    })()
    return () => { live = false }
  }, [stages, id])
  return (
    <figure className="journey" aria-label="How it works">
      <div ref={ref} />
      {/* Always present for screen readers, and shown if the diagram can't draw. */}
      <ol className={failed ? "mt-2 space-y-2 text-sm" : "sr-only"}>
        {stages.map((s, i) => <li key={s.id}><b>{i + 1}. {s.name}.</b> {SAYS[s.id] ?? s.outcome}</li>)}
      </ol>
    </figure>
  )
}
