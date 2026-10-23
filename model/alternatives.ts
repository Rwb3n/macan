// What buyers and firms use today instead of us (docs/research/c1-competitors/result.md).
import type { Alternative } from "./types"

const C1 = "C1 result (docs/research/c1-competitors, 2026-10-23)"

export const alternatives: Alternative[] = [
  { id: "arbtech", name: "Arbtech (national firm)", kind: "firm", serves: ["U1", "U2"], source: C1,
    offer: "Fixed published prices (bat roost £399+VAT), UK coverage, planning money-back guarantee; in 14 of 23 searches" },
  { id: "apd-network", name: "'Avoid Planning Delays' sites (batsurveys.co.uk and two others)", kind: "firm", serves: ["U2"], source: C1, guess: true,
    offer: "'From £' prices, subcontractor network, operator unnamed; #1 for 'bat survey near me'" },
  { id: "cieem", name: "CIEEM Registered Practices Directory", kind: "directory", serves: ["U2", "U5"], source: C1,
    offer: "Search by service and postcode; firms pay £147–£368+VAT a year through membership" },
  { id: "worklanded", name: "Worklanded", kind: "marketplace", serves: ["U4"], source: C1,
    offer: "Bat and ecology leads sold to firms at £26 each, one firm at a time; 11 enquiries in 90 days" },
  { id: "brokers", name: "Small brokers (batsurveycost.co.uk, RenKap, Yell enquiries)", kind: "broker", serves: ["U2"], source: C1,
    offer: "Pass one request to up to 3 firms; firm-side terms not published" },
]
