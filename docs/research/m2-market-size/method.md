# M2: how much money flows from planning applicants to survey firms, and how many buyers a year? (pre-registered 2026-10-23, before any read)

Principal, 2026-10-23: "GO."

Two independent routes, each built only from receipts (`AGENTS.md`):
- **They agree within 2×:** the figure stands.
- **They don't:** the gap is reported as a finding.

England first.

## Route A: demand (planning applications)

**A1. Volume.** Applications decided per year in England, by type (major, minor, householder, other), for the latest 12 months published. Source: MHCLG planning application statistics (live tables), cited by table and URL.

**A2. Share needing each survey, measured.**
- **Councils (fixed now, one per English region):**
  1. Cheshire West and Chester (North West)
  2. North Yorkshire (Yorkshire and the Humber)
  3. Northumberland (North East)
  4. Leicester (East Midlands)
  5. Herefordshire (West Midlands)
  6. East Suffolk (East of England)
  7. Southwark (London)
  8. Wealden (South East)
  9. Bath and North East Somerset (South West)
  10. Cornwall (South West, rural)

  **Fallback:** if a council's public register can't be read by the tool, the next council in that region by population replaces it. The replacement is recorded.
- **Sample:**
  - **Frame:** the weekly lists of decided applications for 3 weeks of 2025, picked by `random.Random(20261023)` from weeks 1–52. The same 3 weeks are used for every council.
  - **Draw:** from each council-week list, up to 10 applications, chosen with the same generator after sorting by reference.
  - **Size:** 300 at most.
- **Recorded per application:**
  - its type (major, minor, householder, other: from the register, else from the description);
  - its decision;
  - which survey reports are on its documents list. Matching is on document names for each catalogue survey (`src/catalog.ts`), e.g. "bat", "roost", "ecolog", "PEA", "flood risk", "FRA", "noise", "acoustic", "air quality", "contaminat", "phase 1", "arboricult", "tree survey", "BNG", "biodiversity".
- **Result:** share of applications with each survey, by type, with a 95% interval.

**A3. Price per survey.** The published prices in `../c2-gaps/evidence/gap-firms.md` (each with its URL). Report the median and the range per survey. A survey with fewer than 3 published prices is reported but not priced.

**Route A totals:**
- buyers a year per survey = volume × share;
- pounds a year = buyers × median price, with a range from the price range and the share interval.

## Route B: supply (filed accounts)

**B1. The trade.** From vein (read-only), the S1-substantive companies that are:
- **(a)** in SIC 74901, multiplied by S9's measured seller share (35%) for the estimate; or
- **(b)** in any SIC, with a name stem from S9 Part 2: `ECOLOG`, `ACOUSTIC`, `ARBORI`, `GEO-ENVIRONMENTAL`/`GEOENVIRONMENTAL`, plus `FLOOD` and `NOISE`, added now.

Report the counts per group.

**B2. Turnover and headcount.**
- **Source:** Companies House's free monthly accounts bulk data (iXBRL), covering the 12 latest monthly files.
- **Fields per company:**
  - the latest turnover (`TurnoverRevenue` or equivalent tag), where filed;
  - the average number of employees (`AverageNumberEmployeesDuringPeriod`).
- **Storage:** the bulk files and company-level figures stay in `D:/data/macan/m2/`, outside every repo.

**B3. Sum.**
- **Firms with turnover filed:** their turnover is summed (a floor).
- **Firms with headcount only:** headcount × median revenue per employee, from firms that file both. Reported with the interquartile range.
- **Firms with neither:** counted, not valued.

## Outputs

- **Buyers:** buyers a year by survey type. These are M1's possible leads.
- **Money:** pounds a year, route A against route B.
- **M1 at £26 a lead:** leads × £26 = the ceiling. Also at 5% and 20% capture.
- **Top firms:** the 10 largest firms by turnover, as company numbers and turnover only.
- **Reference points, each with a receipt:**
  - the median UK full-time gross annual pay (ONS earnings survey, latest);
  - Arbtech's filed turnover (£10,841,715, year to 23 Sep 2024).

## Decision rule

**Threshold, provisional:** if M1 revenue at 5% capture is under £100,000 a year, leads alone don't carry the business, and U6 (intelligence for firms) must be the main earner.

Principal, 2026-10-23: "threshold, yeah i guess. i dont know I DONT HAVE A FUCKING POINT OF REFERENCE YET DO I?"

So £100k is provisional. The principal may reset it after seeing the reference points, and that reset is recorded as a decision, with the result shown against both thresholds.

## Known limits, stated before the read

- **Small sample of councils:** 10 of about 300 English councils. The intervals are reported.
- **A report on file is not a fresh purchase.** It may be reused or updated; refused or withdrawn applications may never have been surveyed.
- **Register scope:**
  - documents uploaded after the decision are missed;
  - some councils hide documents for older applications.
- **iXBRL coverage:**
  - firms filing PDF-only accounts are missed;
  - sole traders and partnerships aren't in Companies House.
- **SIC and name stems are crude** (S9). Route B mixes survey work with other work the firms do.
- **Defects** found after the read go in `result.md`; this method is not changed.
