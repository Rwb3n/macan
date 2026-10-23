// Channels: where each party is when it needs us, and how we reach it. Receipts where we have them; guesses marked.
import type { Channel } from "./types"

const P = 'Principal, 2026-10-23: "well LETS FUCKING MODEL IT"'

export const channels: Channel[] = [
  { id: "ch-search", party: "buyer", kind: "search", name: "Searches the survey the council asked for", status: "part", source: P,
    receipt: "S7: 'bat survey', 'flood risk assessment', 'environmental impact assessment' each 1K-10K UK searches/month (Keyword Planner, callsheet docs/screens/s7-env-buyer-demand/result.md)",
    note: "Arbtech holds 14 of 23 searches plus #1 'bat survey near me' (C1, C2)" },
  { id: "ch-validation", party: "buyer", kind: "moment", name: "Told by the council at validation that a survey is missing", status: "missing", source: P,
    receipt: "C2 buyer quotes: 'Only to be told I needed a bat survey'; 'the planning officer doesn't recommend anyone, so I'm at the mercy of Google' (docs/research/c2-gaps/evidence/gap-buyer.md)",
    note: "The moment of need: no one stands there today" },
  { id: "ch-agent", party: "agent", kind: "referral", name: "Architects and planning consultants pick or recommend the firm", status: "missing", source: P, guess: true,
    note: "Partial receipt: a firm is hiring sales staff to phone architects (C2 gap-firms.md); no panel evidence found" },
  { id: "ch-outbound", party: "firm", kind: "outbound", name: "We find and contact firms from Companies House and their sites", status: "part", source: P,
    receipt: "S9: ~230-410 survey sellers with a website in SIC 74901; 15 called-list firms checked live (vein, D:/data/vein/out/s8/ch-check.json)" },
  { id: "ch-body", party: "firm", kind: "body", name: "Professional bodies' directories (CIEEM, ANC)", status: "outside", source: P,
    receipt: "CIEEM Registered Practices Directory, firms pay £147-£368+VAT a year (C1 evidence/c1-partB.md)" },
  { id: "ch-peers", party: "firm", kind: "community", name: "Firms pass overflow work to each other", status: "missing", source: P, guess: true,
    note: "Informal subcontracting seen (C2); whether firms would pay a referral fee is untested" },
]
