# C1: result (read 2026-10-23, after the method was committed in 829ca58)

Evidence: `evidence/c1-partA.md` (23 searches, 230 results classed) and `evidence/c1-partB.md` (intermediaries; every fact has a URL).

## Outcome: **open**

| Measure | Value | Rule |
|---|---|---|
| Searches with a marketplace (M) at #1–3 | **0 of 23** | open if ≤ 3; occupied if ≥ 8 |
| Intermediary share, (M + D) ÷ results | **4 of 230 = 1.7%** | open if < 15%; occupied if ≥ 30% |

**Sensitivity:** batsurveys.co.uk (#1 for "bat survey near me") is classed F+ provisionally. If it is really a lead-collection front (see defect 1), the counts become 1 of 23 and about 3%. That is still open.

**What the buyer sees instead:**
- **Firms:** 63% of results (F 125, F+ 20).
- **Official guidance:** 28% (gov.uk, CIEEM, RSPB).
- No marketplace and almost no directory.

## Who serves what today

### U2: buyer needs a survey
**The real competitor is a national firm, not a directory.**

**Arbtech** (F+) ranks in **14 of the 23 searches**. It has:
- published fixed prices:

  | Survey | Arbtech price |
  |---|---|
  | Bat roost assessment | £399 + VAT |
  | Bat emergence survey | £799 + VAT |
  | Ecology | £399 |
  | Trees | £299 |
  | Flood risk | £599 |
  | Air quality | £499 |
  | Contaminated land | £950 |
  | Biodiversity net gain | £489 |
- national coverage;
- a planning money-back guarantee;
- 160+ staff and 18,000 projects a year.

A buyer who finds Arbtech has little reason to look further.

**A second network** fronts three sites with one template and the line "Avoid Planning Delays":
- batsurveys.co.uk;
- ecologysurveys.uk;
- biodiversitynetgainplan.co.uk.

It shows "from £" prices, names no company, and uses "a large network of … subcontractors".

### U4: firm wants the enquiries it chooses
**Almost nothing serves this.**
- **Big marketplaces have no planning-survey category:** Bark (£1.80 per credit), Checkatrade (subscription), MyBuilder (from £7).
- **Rated People** has folded into Checkatrade.
- **The professional bodies run directories, not lead services:**
  - **CIEEM's Registered Practices Directory** is searchable by service and postcode. Firms pay £147–£368 + VAT a year. The Bat Conservation Trust sends buyers there.
  - **The Association of Noise Consultants** lists 105 firms.
- **Small brokers pass requests on, but their firm-side terms aren't published:** batsurveycost.co.uk (up to 3 ecologists per request), RenKap (instant multi-quote), Yell's "post your free enquiry".

## M1 evidence

**Worklanded** sells bat-survey and ecology leads to firms:
- **Price:** £26 per lead (UK search result; $35 on a non-UK fetch).
- **Terms:** "pay only for the leads you open"; one firm at a time.
- **Scale:** small, 11 enquiries in 90 days.

Under the method this moves **A7 to `some`** (callsheet log, 2026-10-23), and **£26 per lead is the first price anchor for M1**. It is thin: one small vendor.

## What this means (for the principal; not part of the rule)

1. **The directory and marketplace space is empty in search.** The field is open on the rule.
2. **The fight is with Arbtech-style national firms,** which already give buyers prices, coverage and a guarantee. Our case to buyers has to be one of these:
   - a local firm, often cheaper;
   - choice and comparison;
   - honest season and timing advice;
   - multiple surveys for one site (U3).

   This is the principal's choice. Once made, it goes into `model/` as a decision.
3. **Firms have no lead channel for this work,** and a few already sell leads at about £26. That supports M1 and gives a price to test on the calls.
4. **CIEEM's directory is the incumbent directory,** paid for by firms through membership. It is not a competitor for leads, but buyers referred by the Bat Conservation Trust land there.

## Defects (found after the read; the method is unchanged)

1. **The three-site network's operator is unproven.** Its privacy policy and terms (the pages that would name the company) weren't read within the scrape budget. Read `https://batsurveys.co.uk/privacy-policy/` and check the named company at Companies House to settle F+ or M.
2. **Part B overran its budget:** about 47 calls against about 35, because 5 domains were added mid-run (by root, after Part A). No domain had more than 2 scrapes.
3. **"phase 1 environmental assessment" returned mostly US firms.** They are classed F, which inflates F slightly. M and D are unaffected.
4. **Search-result descriptions only, in Part A.** Arbtech is marked F+ on all 14 results by its own pages, though not every description showed both price and coverage.
5. **Not a real Google page** (stated in the method): ads, the map pack and "People also ask" are absent. Paid competitors bidding on these terms are unmeasured.
6. **Search-only discovery missed a direct competitor.** Signed Off (signed-off.co.uk) runs a "which reports do I need" checker, a directory and quotes from up to 3, but ranks on none of the 23 terms. It was found by C2 (`../c2-gaps/`). The "open" result holds for search, but the field has at least one directory-plus-quotes rival.
7. **Defect 1 is settled.** The three "Avoid Planning Delays" sites are run by Arbtech Consulting Ltd (each privacy policy; C2). They are F+, Arbtech's own keyword sites, not a marketplace. So Arbtech also holds #1 for "bat survey near me".
