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
  { id: "D12", date: "2026-10-24", name: "Build the product now on the placeholder terms; the calls come later",
    said: "calls later. we build the product regardless. its not rocket science what we're building.", refs: ["R6", "Q15", "Q16"] },
  { id: "D13", date: "2026-10-24", name: "M1 at £99,417 a year (5% capture) is acceptable",
    said: "99,417 is acceptable", refs: ["R3", "D9", "Q10"] },
  { id: "D14", date: "2026-10-24", name: "Show the journey on the site; problem first; answer before asking; say why for every detail; Mermaid now, brand skin later",
    said: "the user journey should be illustrated on the site. one annoyance from my point of view as a buyer is i dont know wtf im filling information for. they ask me for my name, why? my email and phone number, why?, address, why? what comes after? why cant i know now? why cant i say what my problem is first? its all annoying and backwardsa and breadcrumbed like im being tricked into a trap. can we like, use mermaid and later on stick on a visual skin tuned to our branding? (then, on the requirements read back: yes)",
    refs: ["D10", "Q17"] },
  { id: "D15", date: "2026-10-24", name: "Work management must survive sessions: nothing pending lives only in a chat; mirror the map to GitHub at the end of this session",
    said: "well do it at the end of this session. im concernw with our work management being lost and collapsing as sessions progress.", refs: ["D3", "D8"] },
  { id: "D16", date: "2026-10-24", name: "Product first: park the legal work (privacy notice, listing notice, removal) until the loop is solid",
    said: "lets focus on the product. park all the legalese bullshit for after we got a solid loop", refs: ["A3"] },
  { id: "D17", date: "2026-10-24", name: "A piece is done when a layman can use it without help; only the brand skin comes later. The buyer side is not there yet",
    said: "okay. FYI the buyer side is sorely lacking. it looks like coding genius that has no idea what another living person thinks about when going on online didit", refs: ["D10", "D14"] },
]

// The buyer's pains today, synthesised from R2's sources (counted independently). Front and centre (D10).
export const pains: Pain[] = [
  { id: "PN1", party: "P-buyer", sources: 14, name: "A cheap first survey led to a large or doubtful follow-on bill", refs: ["D10", "R2"],
    receipt: "£1,306.80 first survey, then a £28,726.80 follow-on quote; an independent did it for £3,924 (R2)",
    note: "About 10 of the 14 are one national firm's reviews", answeredBy: ["Q4"] },
  { id: "PN2", party: "P-buyer", sources: 8, name: "The season cost me months, or a year", refs: ["D10", "R2"],
    receipt: "'wait a year'; the 12-month wait used as a sales lever (R2)", answeredBy: ["U1", "ST-U2.2", "Q5"] },
  { id: "PN3", party: "P-buyer", sources: 9, name: "I can't find or hear back from a surveyor, or tell why they want my details and what happens next", refs: ["D10", "D14", "R2", "R4"],
    receipt: "'the planning officer doesn't recommend anyone, so I'm at the mercy of Google' (R2); the professional body's directory leaves the buyer to contact practices one by one (R4); 'they ask me for my name, why? ... what comes after?' (the principal as a buyer, D14)",
    note: "The details-and-next-step half has one source, the principal; Q17 tests it", answeredBy: ["ST-U2.1", "ST-U2.2", "ST-U2.3", "PR2", "Q7", "Q11", "Q17"] },
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
