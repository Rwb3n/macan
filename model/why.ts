// Why: the principal's decisions (word for word) and the business's own aims.
import type { Aim, Decision, Pain } from "./types"

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
  { id: "D10", date: "2026-10-24", name: "Buyer pain points front and centre, synthesised, in design and in the model",
    said: "1. and on that note we need to hold those buyer pain points front and centre. but synthesized. add that to our design plans and model ideas.", refs: ["R2", "R4"] },
  { id: "D11", date: "2026-10-24", name: "Business model first, then design around it for humans",
    said: "q12 yep - first we think about our business model then we design around it for humans.", refs: ["R4"] },
]

// The buyer's pains today, synthesised from R2's sources (counted independently). Front and centre (D10).
export const pains: Pain[] = [
  { id: "PN1", party: "P-buyer", sources: 14, name: "A cheap first survey led to a large or doubtful follow-on bill", refs: ["D10", "R2"],
    receipt: "£1,306.80 first survey, then a £28,726.80 follow-on quote; an independent did it for £3,924 (R2)",
    note: "About 10 of the 14 are one national firm's reviews", answeredBy: ["Q4"] },
  { id: "PN2", party: "P-buyer", sources: 8, name: "The season cost me months, or a year", refs: ["D10", "R2"],
    receipt: "'wait a year'; the 12-month wait used as a sales lever (R2)", answeredBy: ["U1", "ST-U2.1", "Q5"] },
  { id: "PN3", party: "P-buyer", sources: 8, name: "I couldn't find, book or hear back from a surveyor", refs: ["D10", "R2", "R4"],
    receipt: "'the planning officer doesn't recommend anyone, so I'm at the mercy of Google' (R2); the professional body's directory leaves the buyer to contact practices one by one (R4)",
    answeredBy: ["ST-U2.3", "PR2", "Q7", "Q11"] },
  { id: "PN4", party: "P-buyer", sources: 7, name: "I found out at validation that I needed a survey", refs: ["D10", "R2"],
    receipt: "'Only to be told I needed a bat survey' (R2)", answeredBy: ["U1", "CH-validation", "Q6"] },
  { id: "PN5", party: "P-buyer", sources: 4, name: "I didn't know whose report the council would accept", refs: ["D10", "R2"],
    receipt: "'ask the council who they accept surveys from' (R2)", answeredBy: ["Q14"] },
]

export const aims: Aim[] = [
  { id: "A1", name: "Earn money from firms (M1, plus intelligence and in-kind)", refs: ["D2", "D5", "D6"] },
  { id: "A2", name: "Grow and keep a correct list of firms", refs: ["D1", "R0/S9"] },
  { id: "A3", name: "Stay lawful: listing notices, removal, retention", refs: ["D1"] },
]
