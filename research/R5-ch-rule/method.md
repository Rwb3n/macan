# R5: what rule finds survey firms on Companies House, learned from the firms CIEEM lists? (pre-registered 2026-10-24, before any read)

Principal, 2026-10-24: "the firms listed there may reveal how to find others from companies house based on how they represent themselves (and from elsewhere)". Then: "r5 yep good test too", and on Q12: "first we think about our business model then we design around it for humans".

**What is already known (seen before this method):**
- **R4:** 7 of 30 sampled CIEEM practices are in R3's universe. 21 of the other 23 are registered companies. Two company pages show SIC 74909 and 81300.
- **R3's rule** (`research/R3-market-size/m2_universe.py`) was:
  - active private companies or LLPs, incorporated by 28 February 2021;
  - not dormant, and **not micro-entity** accounts;
  - SIC 74901, or a name containing ECOLOG, ACOUSTIC, ARBORI, GEO-ENVIRONMENTAL, GEOENVIRONMENTAL, FLOOD or NOISE.

  So the age and micro-entity filters may explain part of the miss. That is a suspicion, not yet a measure.

**The answer key:** the 169 real practices from R4's whole-UK pull (`D:/data/macan/r4/uk-all.json`). **Companies House:** vein, read-only (`D:/data/vein/vein.db`, table `companies`: 5.68M rows, newest incorporation 2026-02-28).

## Part A: match the 169 to Companies House (offline, no web)
In this order, stopping at the first that works:
1. **Exact name:** after lowercasing, `&` → `and`, and dropping punctuation and "ltd", "limited", "llp", "plc", "the", "cic", "uk". Status Active first; if only a dissolved company matches, it is recorded as dissolved.
2. **Previous name:** the same comparison against `previous_names`.
3. **Trading style:** where the CIEEM name contains "a trading style of", "t/a" or brackets, the inner or outer name.
4. **Postcode area:** a full-text search on the name's distinctive words (every word not in the drop list above, nor "ecology", "ecological", "environmental", "consultants", "consultancy", "services", "associates"). Accept only if exactly one active candidate shares the CIEEM address's postcode area.

Anything else is **unmatched** (a sole trader, partnership, public body or non-UK company, or a name too unlike the register). Each match records its step.

## Part B: describe the matched companies
- **SIC codes** (all four slots).
- **Name words** (share of names containing each word).
- **Incorporation year** and **accounts category** (share micro-entity, share dormant).
- **R3's filters:** the share passing each of R3's filters separately (age, accounts, SIC/stem), to explain R3's miss.

## Part C: derive a rule, test it on firms it has not seen
- **Split:** the matched companies, sorted by company number, are split in half by `random.Random(20261024)`. The rule is derived on the first half only.
- **Candidate rules** (fixed now; each also requires status Active and type private limited company or LLP, with no age or accounts filter):
  - **A, R3's rule as it was** (baseline).
  - **B, SIC set:** the smallest set of SIC codes (any slot) that covers ≥ 80% of the derivation half.
  - **C, name words:** trade words in ≥ 5% of derivation names. The word list is recorded before scoring.
  - **D, B and C combined:** B or C.
- **Measures per rule:**
  - **recall** on the held-out half (share of held-out matched companies the rule catches);
  - **size:** active companies in vein the rule returns.
- **Precision, for the chosen rule only.** The chosen rule is the one with the highest held-out recall whose size is ≤ 20,000; ties go to the smaller. Draw 30 random hits not in CIEEM (`random.Random(20261024)`). Each is classed as **sells planning surveys / does not / unknown** from its website or a search, with a URL per row as the receipt. This is done by a sub-agent under D7: URL per row, spot-checked after the first 10 rows before the rest.

## Part D: Q12, offices and licences (from CIEEM's own data)
- **Licences:** among practices listing each catalogue survey, the share holding the matching licence (bats → "Bats" or the bat low-impact class licence; newts → "Great crested newts" or the newt low-impact licence; badgers; dormice; water voles).
- **Offices:** re-run R4's 13 postcode searches (with R4's two replacements) at 25 miles, saving every record. A practice seen at 2+ different postcodes has 2+ offices; this is a lower bound. Budget: 20 calls.

## Part E: how they describe themselves (exploration, no rule)
The most frequent words and two-word phrases in the practices' directory copy and service names. These are the search terms for finding firms elsewhere than Companies House (web search, other directories). They are listed, not tested.

## Decision rule
1. **Adopt the rule as a PR4 source** (Companies House → candidates) if held-out recall ≥ 70%, size ≤ 20,000, and ≥ 30% of the 30-hit sample sell planning surveys. Otherwise report it and keep directory sources (CIEEM and others) as PR4's main route.
2. **R3's universe:** if A's held-out recall is under 50%, R3's supply universe is replaced, for future work, by the chosen rule. R3's result is not edited.
3. **Q12 → some** if ≥ 20% of practices show 2+ offices, or licence holding varies by more than 20 points between surveys. Otherwise Q12 stays open with the counts.

## Known limits, stated before the read
- **CIEEM practices are not the whole trade.** They are ecology firms that pay a body, so the rule learns ecology. Flood, noise, air, ground and tree firms are out of the answer key.
- **vein's snapshot ends 2026-02-28.** Companies incorporated since cannot match.
- **Matching by name** can attach the wrong company. Step 4 needs the postcode area to agree, and each match records its step.
- **Offices are seen only within 25 miles of 15 points**, so the office count is a floor.
- **Company-level data** (names, numbers) stays in `D:/data/macan/r5/`. `research/` holds counts and rules.
- **Defects** found after the read go in `result.md`; this method is not changed.
