<!-- Imported unchanged from callsheet 98c5786, docs/screens/s9-env-supply/result.md. Read-only here: corrections go in a new study. -->

# S9: result (2026-10-22)

Run as `method.md` (committed c309cc1 before any read). Company-level data is in `D:/data/vein/out/s9/`, outside the repository. Integrity: 50 rows, each sampled company exactly once, nothing foreign.

## Part 1: share of SIC 74901 selling planning surveys

| Class | Count |
|---|--:|
| seller | 7 |
| non-seller | 13 |
| unclear | 0 |
| no-site | 30 |

- **Seller share: 7 of 20 with a site, 35%** (about ±21 points at n = 20). Lower bound: 7 of 50 (14%).
- **A5 moves to `some`.** 35% sits between the method's thresholds (refuted at ≥ 50%, supported at ≤ 30%). It is boundary-sensitive: one borderline call (below) would make it 30%, which supports A5.
- **What the sellers offer** (from home pages): flood risk and drainage, geo-environmental and contaminated land, environmental impact assessment, acoustics with ecology and biodiversity net gain, planning-led ecology, offshore permitting with environmental assessment, and one asbestos firm.
- **What the non-sellers offer:** home energy and retrofit, solar PV, building compliance testing (EPCs, airtightness), health and safety, asbestos, radon, tree surveys, utilities management consulting, planning PR, offshore decommissioning compliance, and an NGO.

**Supply estimate (method):** 0.35 × 1,664 × 0.7 (S5's site rate) ≈ **410** survey-selling firms with a website.
- **Sensitivity (not the method):** with S9's own site rate (20 of 50, 0.4), it is about 230. The plausible range is roughly 150 to 600.

## Part 2: firms named for the trade, outside 74901

Substantive companies, any SIC, by name stem:

| Stem | Total | In 74901 | Largest other codes |
|---|--:|--:|---|
| ECOLOG | 260 | 128 | 86220 (38), 82990 (19), 74909 (12), 86900 (7) |
| ACOUSTIC | 222 | 12 | 71122 (24), 43999 (18), 74909 (17), 82990 (10), 32990 (10) |
| ARBORI | 85 | 3 | 02400 (23), 81300 (20), 02100 (19) |
| GEO(-)ENVIRONMENTAL | 10 | 3 | spread |

**Reading:**
- Ecology firms are mostly inside 74901.
- Acoustic firms mostly sit outside it, in engineering (71122) and building trades.
- Tree firms are forestry and landscaping, which S7's list excludes.

## Defects

- **The stem matched the wrong trade.** "ECOLOG" also matches "gynaECOLOGy", so 86220/86900 (medical practice; 45 companies) are almost certainly gynaecology clinics, not ecology firms. True ecology firms outside 74901 are therefore fewer than the table suggests.
- **One borderline seller:** an asbestos firm was counted because its home page offers testing of contaminated soil and land. A second asbestos firm, without that line, was counted `non-seller`. Excluding the first gives 6 of 20 (30%).
- **The no-site rate is twice S5's.** 30 of 50 (60%) had no site found, against 3 of 10 in S5's 74901 sample. Either S5's 10 were lucky or this draw differs; the supply estimate is sensitive to it (see above).
- **Home page only:** firms whose home pages don't list services could be misclassed. None came out `unclear`.
- **Excerpts trimmed:** one checker condensed its page excerpts; class decisions are unaffected.

## What it means

The S6 and S7 supply figure of 1,664 overstates the firms that sell what buyers search for: a third or fewer of the class does. The real supply is a few hundred firms, roughly 230 to 410 with a website. Their acoustic peers mostly sit in engineering codes that this screen did not count. With demand of about 14,800 searches a month (S7), that is roughly 36 to 64 searches a month per survey-selling firm. Demand per firm is higher than S6 assumed, but the pool of firms to sign up is smaller.

The domain choice is the principal's (#78).
