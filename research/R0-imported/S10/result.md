<!-- Imported unchanged from callsheet 98c5786, docs/screens/s10-seed-factcheck/result.md. Read-only here: corrections go in a new study. -->

# S10: result (read 2026-10-23, after the method was committed in bf587fa)

Three verifier sub-agents checked the 25 H claims, each with a separate output file and no sight of the others' verdicts. Their verdicts, with a URL or filing for every source, are in `evidence/verdicts-v1.md` (4rfv), `evidence/verdicts-v2.md` (The Knowledge / MBI, market, willingness to pay) and `evidence/verdicts-v3.md` (buyers, timing, data). The claim texts are in `evidence/claims-inventory.md`. The 4rfv and ArtilleryIQ research passes are in `evidence/research-*.md`.

## Outcome

**Core premise: 4 of 9 are refuted or unverifiable (C1, C82, C83, C100), so the seed case stands in part.** The rule says 3 or fewer stands and 6 or more is not evidence.

What stands is the **incumbent's weakness**. What fails is the **size of the prize** and the **buyer behaviour** the model relies on. Re-establishing those is the work. Five claims must be re-established: market size (C82, C83), buyer behaviour (C100), the true listing count (C1) and the timing thesis (C110).

| id | core claim (short) | verdict | true picture |
|---|---|---|---|
| C1 | 4rfv has ~4,700 unique providers | **refuted** | The scrape (`reference/4rfv_directory.db`, 2025-03-09) took page 1 of each subcategory only. 4,700 is a floor, and the real count is unknown and higher. |
| C2 | 4rfv claims 12,500+ listings | confirmed | The figure is on the ad-rates page and its wording has not changed since 2014, so it is boilerplate, not a count. |
| C6 | 110k ABC-audited uniques | partly | ABC certificates exist for 2006–13 only. "Monthly" has no source. Similarweb estimates about 32k visits/month (Sep 2026). |
| C9 | Owner's financials | partly | Owner: Flagship Media Group, NI030646. It files small abridged accounts, not micro-entity accounts, and no turnover is filed. Net assets: £110,574 (Jun 2024), then **−£72,901 (Jun 2025)**. Total assets in 2021 were £1.66M, not £3M. |
| C21 | No enrichment, freshness, verification or analytics; nobody maintains it | partly | No dates and no verification. **About 24% of listed websites are dead**, or about 28% counting those that now point to another business. But news is posted daily and there is a "report bad link" feature. |
| C82 | UK directory market £15–20M/yr | **refuted** | The input was MBI's worldwide revenue across all products (£14.57M). Its UK revenue is £5.70M across everything, and its worldwide subscription revenue is £3.47M across all brands. |
| C83 | Serviceable market £3–5M | **unverifiable** | Built on C27, an agent estimate. Filings and tier counts point to well under £3M. |
| C100 | Buyers find crew and services through directories | **unverifiable** | No source measures directory use. On two case-study dramas, 61% of roles were filled through personal networks or previous contracts (Leeds/AHRC, 2026). ScreenSkills: word of mouth is the main way crew are found. |
| C110 | New entrants without networks (VP, AI, economics) | partly | Spend fell 32% in 2023, then recovered to £6.8bn in 2025. Film-production incorporations rose 16% from 2022 to 2025, many of them single-production vehicles. 68% of freelancers were out of work in Feb 2024. There is no evidence for the AI or VP link. |

## All 25 claims

| verdict | count | claims |
|---|---:|---|
| confirmed | 5 | C2, C11, C12, C16, C31 |
| partly | 11 | C5, C6, C9, C10, C19, C21, C26, C60, C101, C110, C170 |
| refuted | 3 | C1, C61, C82 |
| unverifiable | 6 | C27, C83, C93, C94, C99, C100 |

What the confirmed claims cover:
- **Prices:** 4rfv £120 and £395/yr; The Knowledge £495, £650 and £1,120/yr.
- **4rfv's sales process:** manual sales only, with no self-service upgrades.

Other findings that bear on the domain choice:
- **Paid uptake is low.** In 3 live categories of The Knowledge, 5 of 154 listings (about 3%) are paid (C93).
- **The free public directories were never analysed (C61 refuted).** Filming in England has 7,000+ crew and 1,000+ suppliers, with staff-assisted matching. The Film London Directory has 2,000 crew and 1,200 facilities. Both rank #1 on Google for "film crew hire uk" and "post production house london".
- **Larger sites were also left out.** Production Base gets about 78k visits/month, more than 4rfv (about 32k) and The Knowledge (about 20k). Shooting People closed in Oct 2025.
- **Exit values are modest.** The Knowledge plus a sister business sold for £1.6M in 2006. GlobalData bought all of MBI in 2022, when its turnover was £6.6M (2020); MBI and TS Lombard together cost £32.9M in cash.
- **The money in this trade sits on the intelligence side.** The Knowledge's owner also sells *Production Intelligence*, a subscription of leads on upcoming productions. US trackers sell the same thing at about $400–700/yr. ArtilleryIQ (a US AR/VR research firm) earns from readers' subscriptions first and sells supplier visibility second. This is an observation, not a verdict; no claim tested it.

## Defects (found after the read; the method is unchanged)
1. **C170 changed after the verifier ran.** The buyers/timing/data verifier said no scrape file exists and graded C170 *refuted*. It searched `archive/` only. The 4rfv verifier found `reference/4rfv_directory.db`. Root re-graded C170 as **partly**: a partial scrape exists, but licensing, extraction and the quality check never started (`archive/5-launch-readiness/LAUNCH-READINESS-TRACKER.md`). C170 is not in the core premise, so the outcome is unchanged.
2. **C2 is confirmed only as a quote.** The claim is what 4rfv *says*, so the verdict confirms the quote, not the count. Under the rule it counts as confirmed. Read with C1, nobody knows 4rfv's real listing count.
3. **Firecrawl ran out of credits mid-run.** Two verifiers worked from Companies House, the Wayback Machine and the live sites with plain fetches instead. The search-visibility positions come from Firecrawl's UK search, not an actual Google results page.
4. **Single samples are small.** The paid-uptake figure covers 3 categories of The Knowledge. The decay figure covers 131 listed websites from 60 subcategories. Neither was pre-registered as a sample; both are verifier method.
5. **C100 and C101 need people.** A buyer interview test (production managers: how did you find your last three suppliers?) is proposed, not run.
