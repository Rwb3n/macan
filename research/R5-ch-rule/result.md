# R5: result (read 2026-10-24, after the method was committed in 9e4bd01)

Evidence: `evidence/counts.md` (every number) and `evidence/rules-a-d.sql`. Company names and numbers are in `D:/data/macan/r5/`.

## Findings
1. **Most CIEEM practices are on Companies House, and two-thirds file SIC 74901.**
   - 139 of 169 (82%) match an active company. The other 30 trade outside a company the register shows under that name: sole traders, partnerships, public bodies.
   - 67% carry SIC 74901 in some slot. The rest are spread over ~30 codes, including 74909, 82990, 81300, 71129 and property codes.
2. **R3's rule kept only 35% of them,** mainly because of its own filters:
   - 35% file micro-entity accounts, which R3 excluded;
   - 23 were incorporated after its February 2021 cut-off.

   The trade is small, young firms: exactly what R3 cut.
3. **No rule clears the bar:**
   - **SIC codes alone** reach 69% recall only by taking in 125,000 companies (74909 is a catch-all).
   - **The name word "ECOLOG"** gives a short list (1,012) but catches only 47%, and also catches gynaecology.
   - **In the short list's sample,** 8 of 30 sell planning surveys, 8 don't, and 14 couldn't be determined.
4. **Licences are a real routing key.** Among practices offering each survey, the share holding the matching licence:

   | Survey | Share with the licence |
   |---|---|
   | Great crested newts | 98% |
   | Bats | 95% |
   | Dormice | 80% |
   | Badgers | 61% |
   | Water voles | 32% |

   26 hold Natural England's Earned Recognition bat licence, and 63 the bat low-impact class licence: these are the firms that can license a loft-conversion roost faster.
5. **Several offices:** 21 practices appear at 2 to 10 office postcodes across 13 city searches. That is 24% of those seen, 12% of all 169.

## Decision rule
1. **Adopt a Companies House rule as a PR4 source: no.** The chosen rule C has held-out recall 47% (< 70%) and precision 27% (< 30%). Directory sources (CIEEM, then others) stay PR4's main route.
2. **R3's universe: replaced for future supply work.** Rule A's held-out recall is 30% (< 50%). By the rule, rule C (active companies named "ECOLOG…", 1,012) replaces it. Limits:
   - it covers ecology only;
   - it must exclude "GYNAECOLOG".

   R3's result is not edited.
3. **Q12 → some.** Licence holding varies by 66 points between surveys (98% vs 32%), which is above 20. Offices: 24% of practices seen, which passes 20% on that base, but only 12% of all 169.

## What this means for finding firms (for the principal)
- **Companies House is a checking tool, not a finding tool,** for this trade: it confirms a firm exists and is active. Finding firms works better from places where they describe their own services:
  - professional directories;
  - their websites (search terms from Part E: "ecological consultancy", "protected species surveys", "preliminary ecological appraisal", "bat survey" plus a place);
  - council lists of licensed bat surveyors, which the sub-agent met once, in Carmarthenshire.
- **A better Companies House rule may exist** (exploratory E: 69% recall at 12,542 companies). It was built after the read, so it needs a fresh answer key, such as a second directory, before anyone relies on it.

## Defects found after the read
1. **The step-4 match was too loose.** "Exactly one active company in the same postcode area" accepted wrong companies on short distinctive words (e.g. a two-letter prefix). 4 of 7 step-3/4 matches look wrong. A sensitivity run without them changes no conclusion (C 49%, A 31%).
2. **Bug fixed during the run:** names with "&" never reached the full-text search, because the code searched for "and". This was an implementation error against the method's own normalisation. It was fixed and rerun before any profile or rule was computed.
3. **"ECOLOG" matches "GYNAECOLOG".** The pre-registered word list did not foresee it: 4 of 30 sample hits.
4. **Ambiguous denominator for offices.** The method said "≥ 20% of practices". The result is 24% of those seen, 12% of all. Q12's move to some rests on licences alone, which is unambiguous.
5. **One API failure:** the directory's geocoder rejected LS1 1AA once, then accepted it.
6. **Sub-agent receipts:**
   - Row 18 is a Facebook page quoted from a search snippet, not scraped. Without it precision is 7/30 = 23%.
   - Some "unknown" rows had LinkedIn leads, which were left out by rule.
7. **The answer key is ecology only,** as stated before the read. Nothing here speaks for flood, noise, air, ground or tree firms.
8. **vein ends February 2026.** One sampled company has since dissolved (row 15).
9. **The "sells" bar was tightened after the read.** After row 10, an explicit survey offer was required. Row 4 moved from sells to unknown. Counted as sells, precision is 9/30 = 30%, exactly the bar. The decision does not change, because recall (47%) fails on its own.
