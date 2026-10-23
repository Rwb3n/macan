# M2: result (read 2026-10-23, after the method was committed in 04ccd04)

## Headline

- **About 76,000 planning applications a year in England** (householder, minor and major) file at least one of our surveys. The 95% interval is 51,000–105,000. These are M1's possible leads.
- **Bat, other ecology and flood risk alone come to about £51M a year** at published median prices (£26M–£94M).
- **M1 at £26 per lead, 5% capture: £99,417 a year.** That is on the £100k provisional line, not over it. At 20% capture: £397,669. Ceiling: £1.99M.
- **Reference points:**
  - one median UK full-time salary is **£40,911** (ONS ASHE, April 2026, provisional);
  - Arbtech alone turned over **£10.84M** (year to Sep 2024).

## Route A: demand

**A1. Volume.** England decided **291,861** applications in the year to June 2026 (MHCLG table P124A; `evidence/m2-a1.md`):

| Type | Decided |
|---|---|
| Major | 9,353 |
| Minor | 82,748 |
| Householder | 145,609 |
| Other | 54,151 |

**A2. Measured share.** Councils' public registers, ISO weeks 13, 17 and 50 of 2025:
- **Sample:** 280 of 300 applications sampled; 276 had a readable documents list.
- **Tags:** a survey tag counts only when backed by recorded document text. 2 unbacked tags were dropped.

| Type (n) | Any survey | Bat | Other ecology | Flood | Noise | Contam. | Trees |
|---|---|---|---|---|---|---|---|
| Householder (58) | 12 (21%) | 2 | 6 | 4 | 0 | 0 | 1 |
| Minor (66) | 31 (47%) | 7 | 19 | 6 | 5 | 3 | 4 |
| Major (5) | 4 (80%) | 0 | 2 | 4 | 3 | 1 | 1 |

**England buyers a year** = A1 × share. Point estimate, with a 95% interval from the share:

| Survey | Buyers a year |
|---|---|
| Bat | 13,797 (5,715–37,951) |
| Other ecology | 42,626 (24,077–71,091) |
| Flood | 25,047 (10,968–48,210) |
| Noise | 11,881 |
| Trees | 9,396 |
| Contaminated land | 5,632 |
| Air quality | 1,871 |
| **Any** | **76,475 (50,669–105,421)** |

**A3. Price.** Medians of 3 or more published prices (`../c2-gaps/evidence/gap-firms.md`):

| Survey | Median price | Annual spend |
|---|---|---|
| Bat (roost assessment) | £362 | £5.0M |
| Ecology (appraisal) | £725 | £30.9M |
| Flood risk | £599 | £15.0M |

Noise, air, contaminated land and trees have fewer than 3 published prices, so they are counted but not priced.

**Check against a receipt:** 13,800 bat-survey buyers a year in England sits beside Arbtech's filed "over 13,800 assessments and planning submissions" (UK, all survey types). Same order of magnitude.

## Route B: supply

**B1.** 2,238 companies:
- 1,664 substantive in SIC 74901 (the same count as S1);
- 574 matched by name stem.

**B2.** Bulk iXBRL accounts for October 2025 to September 2026 gave 1,972 files covering 1,840 companies:
- 25 filed turnover;
- 1,799 filed average headcount;
- 41 filed neither.

**B3.**
- **Revenue per employee:** £114,822 median (interquartile range £56,428–£146,899) across the 22 companies filing both.
- **Estimated turnover:**

  | Group | Estimate |
  |---|---|
  | 74901 × S9's 35% seller share | £169M–£362M (median £295M) |
  | Name-stem group | £195M–£400M (median £329M) |

## Do the routes agree? No, by about 6–12×. That is a finding, not a failure.

- **Route A** counts what planning applicants spend on these surveys.
- **Route B** counts the whole turnover of the companies near this trade, including:
  - corporate, ESG and consultancy work;
  - manufacturing (acoustic-panel makers matched on name);
  - firms whose turnover per head is £600k–£850k, which is not survey work.

It also *misses* firms like Arbtech, whose registered SIC is 02200 "Logging". So Route B is not a measure of planning-survey spend and cannot check Route A. **The figure that stands is Route A's,** with its interval.

## Decision rule

M1 at 5% capture is **£99,417**, against the **£100,000** provisional threshold. That is at the line, within rounding.

The rule says leads alone don't carry the business. So **U6 (intelligence for firms) has to earn too.** At the line, the threshold the principal sets now that the reference points exist decides it either way.

## Defects (found after the read; the method is unchanged)

1. **Agents and evidence.**
   - **Batch 2's tags were unbacked** until root intervened. Its first rows held tags with no matching text in the recorded document names. Root ordered `matched_text` for every tag and dropped the 2 tags still unbacked.
   - **Batch 1 is fully backed:** all 35 tags.
   - **Batch 2 was stopped by root before finishing.** East Suffolk has 10 of 30 rows (weeks 17 and 50 missing).
2. **The "other" type isn't comparable.** The sample's "other" (147 rows) mixes condition discharges, certificates, tree-works and prior approvals. P124A's "other" is listed building consent, change of use and adverts. So "other" is reported but not extrapolated, which leaves England totals conservative.
3. **Condition discharges.** About 25 sampled rows are condition-discharge applications, where a survey is filed after permission. Some may duplicate a survey already counted on the main application.
4. **Major applications: n = 5.** Their shares have very wide intervals.
5. **Applications, not surveys.** One application often needs several surveys, so survey purchases exceed applications. M1 per lead could also be higher if one lead is offered to more than one firm (not modelled).
6. **Registers.** Documents added after the decision are missed; 4 of 280 had no readable list.
7. **Route B's universe is crude.** This was stated before the read; the result shows how crude.
8. **England only.** Other nations: Scotland 17,644 local decisions (2024/25); Northern Ireland 8,774 (2025/26); Wales not found from an official source (`evidence/m2-a1.md`).
