// What buyers and firms use today instead of us (docs/research/c1-competitors/result.md).
import type { Alternative } from "./types"

const C1 = "C1 result (docs/research/c1-competitors, 2026-10-23)"
const C2 = "C2 gaps (docs/research/c2-gaps, 2026-10-23)"

export const alternatives: Alternative[] = [
  { id: "arbtech", name: "Arbtech (national firm)", kind: "firm", serves: ["U1", "U2"], source: C1,
    offer: "Fixed published prices (bat roost £399+VAT), UK coverage, planning money-back guarantee; in 14 of 23 searches",
    receipt: "Arbtech Consulting Ltd (05678552) full accounts, year to 23 Sep 2024: turnover £10,841,715 (2023: £8,369,093), profit before tax £4,483,055, 113 staff, 'over 13,800' assessments and planning submissions; '60% acquired by private equity backed Celnor Group' (Companies House filing MzQ3MTUwNzU3MGFkaXF6a2N4)" },
  { id: "arbtech-fronts", name: "Arbtech's keyword sites (batsurveys.co.uk, ecologysurveys.uk, biodiversitynetgainplan.co.uk)", kind: "firm", serves: ["U2"], source: C2,
    offer: "Run by Arbtech Consulting Ltd (named in each privacy policy); #1 for 'bat survey near me'; 'from £' prices" },
  { id: "signed-off", name: "Signed Off (signed-off.co.uk)", kind: "directory", serves: ["U1", "U2", "U5"], source: C2,
    offer: "'Which reports do I need?' checker (no postcode or council step), directory (75 ecologists), quotes from up to 3; free and paid featured listings; operator incorporated Nov 2024" },
  { id: "planning-review", name: "The Planning Review", kind: "directory", serves: ["U2"], source: C2,
    offer: "Lists firms found on planning applications, with quotes; no checker; operator not named" },
  { id: "cieem", name: "CIEEM Registered Practices Directory", kind: "directory", serves: ["U2", "U5"], source: C1,
    offer: "Search by service and postcode; firms pay £147–£368+VAT a year through membership" },
  { id: "worklanded", name: "Worklanded", kind: "marketplace", serves: ["U4"], source: C1,
    offer: "Bat and ecology leads sold to firms at £26 each, one firm at a time; 11 enquiries in 90 days" },
  { id: "brokers", name: "Small brokers (batsurveycost.co.uk, RenKap, Yell enquiries)", kind: "broker", serves: ["U2"], source: C1,
    offer: "Pass one request to up to 3 firms; firm-side terms not published" },
]
