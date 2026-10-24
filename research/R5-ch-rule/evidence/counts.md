# R5 evidence: counts (no company names; those are in D:/data/macan/r5/)

**Sources:**
- **Answer key:** `D:/data/macan/r4/uk-all.json` (169 real practices, R4).
- **Companies House:** vein, `D:/data/vein/vein.db`, read-only (5,677,276 companies; newest incorporation 2026-02-28).
- **Scripts:** r5a (match), r5b (profile), r5c1 (split and derive), r5c2 (score). They were run from the session scratchpad and their outputs are in `D:/data/macan/r5/`.
- **Rule SQL:** `rules-a-d.sql`.

## Part A: matching
- **By step:** step 1 (exact name) 132; step 3 (trading style or brackets) 4; step 4 (postcode area) 3; unmatched 30. **139 matched (82%)**, all Active.
- **Check against R4's Companies House lookups:** all 19 of R4's numbers that R5 matched agree. 1 is unmatched by R5: a name in brackets with the words in a different order.
- **Doubtful step 3/4 matches (judged after the read):** 4 of 7. Their registered names or postcode districts do not fit the practice.

## Part B: profile of the 139

| | count |
|---|---|
| SIC 74901 in any slot | 93 (67%) |
| SIC 74909 | 13 |
| SIC 82990 | 8 |
| SIC 81300 | 6 |
| SIC 71129 | 4 |
| other SICs | ~25, each held by 1-3 companies |
| micro-entity accounts | 49 (35%) |
| dormant | 5 |
| incorporated after 2021-02-28 | 23 |
| pass R3's age filter | 116 |
| pass R3's accounts filter | 82 |
| pass R3's SIC/stem filter | 102 |
| **pass all of R3's filters** | **48 (35%)** |

Name words in ≥ 5% of names: limited, ecology (65), ltd, environmental (11), ecological (9), the, consultants, consulting.

## Part C: rules (split by `random.Random(20261024)`: derive 69, hold out 70)
- **Derived SIC set (greedy cover ≥ 80%):** 74901, 71129, 74909 (covers 56 of 69).
- **Derived name words (≥ 5%, trade words only):** ecology and ecological, searched as "ECOLOG". Fixed before scoring. "consulting" was excluded as generic.

| rule | held-out recall | sensitivity (4 doubtful removed) | size in vein |
|---|---|---|---|
| A, R3 as it was | 21/70 = 30% | 21/67 = 31% | 2,238 (= R3's count) |
| B, SIC set | 48/70 = 69% | 48/67 = 72% | 125,428 |
| C, "ECOLOG" | 33/70 = 47% | 33/67 = 49% | 1,012 |
| D, B or C | 51/70 = 73% | 51/67 = 76% | 125,861 |

**Chosen (best recall at size ≤ 20,000): C.**

**Precision of C:** 30 random hits not in CIEEM, classed by a sub-agent:
- **sells planning surveys:** 8;
- **does not:** 8, of which 4 are gynaecology companies that "ECOLOG" also matches;
- **unknown:** 14.

So **8/30 = 27%** sell planning surveys, or 8/16 = 50% of those that could be classed. The D7 spot-check after row 10 verified 2 quotes word for word on the live pages.

**Exploratory, built after the read (not used for any decision):** E = SIC 74901 in any slot, or "ECOLOG" but not "GYNAECOLOG", with no age or accounts filter. Held-out recall 48/70 = 69%, size 12,542; SIC 74901 in any slot alone is 12,258. Its recall is optimistic, because E was built after seeing the held-out half.

## Part D: Q12

**Licences:** practices offering each survey that hold the matching licence.

| survey | offer it | hold the licence | share |
|---|---|---|---|
| bats | 134 | 127 | 95% |
| great crested newts | 125 | 122 | 98% |
| dormice | 95 | 76 | 80% |
| badgers | 129 | 79 | 61% |
| water voles | 126 | 40 | 32% |

Also held: bat low-impact class licence 63; Natural England "Earned Recognition Bat Consultant" 26.

**Offices:** 13 postcode searches at 25 miles. LS1 1AA failed once ("not a valid address for geocode search") and succeeded on retry with the same 17 results as R4.
- **Practices seen:** 89.
- **Seen at 2+ postcodes:** 21. That is 24% of those seen, 12% of all 169.
- **Most postcodes for one practice:** 10.

## Part E: how practices describe themselves (directory copy, 169)
- **Top words:** ecological, ecology, surveys, consultancy, planning, species, environmental, assessments, protected, biodiversity, development, habitat, impact, mitigation, conservation, independent, specialist, pragmatic.
- **Top phrases:** ecological consultancy (40), protected species (40), biodiversity (net) gain (23), species surveys (21), ecological impact (20), preliminary ecological (16), ecological appraisals (15), independent ecological (12), planning applications (8).
