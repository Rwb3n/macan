// Why: the principal's decisions (word for word) and the business's own aims.
import type { Aim, Decision } from "./types"

export const decisions: Decision[] = [
  { id: "D1", date: "2026-10-23", name: "Domain: a UK directory of planning-survey firms, built lean in its own repo",
    said: "callsheet is huge. like a cathedral. i want a porsche macan with snow treads baby (chose: New lean repo; All planning surveys)",
    refs: ["R0/S7", "R0/S9", "R0/S10"] },
  { id: "D2", date: "2026-10-23", name: "Business model M1: firms pay per brief they unlock; every lead is qualified first",
    said: "yeah fuck it M1. we'll take in leads and qualify them. we'll build a qualification system.", refs: ["R0/S10"] },
  { id: "D3", date: "2026-10-23", name: "We work from models: map first, territory follows, map updated",
    said: "models are the map. we build the territory, and the maps are updated to reflect. it's a tight, closed, loop.", refs: [] },
  { id: "D4", date: "2026-10-23", name: "Claims need receipts; a map is not evidence",
    said: "you have a bad habit of believing the the maps say i want cold hard receipts.", refs: [] },
  { id: "D5", date: "2026-10-23", name: "Sell firms intelligence on where and when demand is coming",
    said: "4. okay, GOOD! LETS DO THAT TOO", refs: ["R2"] },
  { id: "D6", date: "2026-10-23", name: "Firms can pay in kind with spare survey capacity",
    said: "5. GOOOD LETS DO THAT TOO", refs: ["R2"] },
  { id: "D7", date: "2026-10-23", name: "Delegation demands evidence up front",
    said: "who the FUCK sends out their asisstants to do something and NOT ASK FOR EVIDENCE?", refs: ["R3"] },
  { id: "D8", date: "2026-10-23", name: "A clear, traceable, business-driven information architecture; no bloat",
    said: "we need a clear hiearchal information architecture. traceable. clean, not stupid. business driven. i dont want it to bloat like the old callsheet.", refs: [] },
  { id: "D9", date: "2026-10-23", name: "Threshold for M1, provisional: £100k a year at 5% capture",
    said: "threshold, yeah i guess. i dont know I DONT HAVE A FUCKING POINT OF REFERENCE YET DO I?", refs: ["R3", "Q10"] },
]

export const aims: Aim[] = [
  { id: "A1", name: "Earn money from firms (M1, plus intelligence and in-kind)", refs: ["D2", "D5", "D6"] },
  { id: "A2", name: "Grow and keep a correct list of firms", refs: ["D1", "R0/S9"] },
  { id: "A3", name: "Stay lawful: listing notices, removal, retention", refs: ["D1"] },
]
