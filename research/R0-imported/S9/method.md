<!-- Imported unchanged from callsheet 98c5786, docs/screens/s9-env-supply/method.md. Read-only here: corrections go in a new study. -->

# S9: how many environmental consultancies sell planning surveys? (A5; pre-registered 2026-10-22, before any read)

S7 found buyer demand for planning-driven environmental surveys (bat, ecology, noise, flood, contamination). S5/S6 counted supply as SIC 74901's 1,664 substantive companies. A5 (log) guesses that only a minority of the class sells those surveys: S5's 10-company sample included wind-farm software, health and safety, certification and corporate sustainability firms. S9 measures the share, and sizes ecology firms filed under other codes.

## Part 1: share of 74901 that sells planning surveys

**Sample.**
- **Pool:** 50 companies from SIC 74901's S1 substantive companies (the same filter as S5's `sample.py`).
- **Order and draw:** ordered by `company_number`, then picked with `random.Random(20261023).sample`.
- **Storage:** written to `D:/data/vein/out/s9/sample.csv`, outside the repository.

**Per company:**
1. **Find the site:** one Firecrawl web search, exactly as S5 did: `"<name without LTD/LIMITED/LLP>" <post town>`, United Kingdom, limit 5. The S5 rule decides whether the company's own site was found (name or brand in the domain or the home-page title, not a directory).
2. **Read the site:** if an own site was found, one Firecrawl scrape of that site's home page (markdown).
3. **Class it from the home page only:**
   - **`seller`:** the page offers at least one planning-driven survey or assessment to clients. The qualifying services are ecology, bat, protected species, newt, preliminary ecological appraisal, biodiversity net gain, noise or acoustic, air quality, flood risk, land contamination or phase 1/2 site investigation, or environmental impact assessment.
   - **`non-seller`:** the page offers other things (software, health and safety, training, corporate sustainability or ESG, certification, water treatment, waste, and so on).
   - **`unclear`:** the page doesn't say enough.
   - **`no-site`:** no own site was found.

   Raw search results and scraped pages stay in `D:/data/vein/out/s9/`.

**Measure.**
- `seller share` = sellers ÷ (sellers + non-sellers + unclear), meaning companies with a site.
- **Also reported:** sellers ÷ 50 (lower bound) and the count in each class.

**Decision rule.** **A5 is refuted** if the seller share is ≥ 50%. **A5 is supported** if it is ≤ 30%. Between the two, A5 moves to `some`.

**Supply estimate.** Seller share × 1,664 × S5's site rate (0.7) gives an estimate of 74901 firms that sell surveys and have a website. It is reported with its rough range.

## Part 2: ecology firms outside 74901

From vein (read-only): count the substantive companies, with S1's filter but in any SIC, whose name contains `ECOLOG`, `ACOUSTIC`, `ARBORI` or `GEO-ENVIRONMENTAL`/`GEOENVIRONMENTAL`. Counts are reported by name stem and by primary SIC. These are counts only, not a classification.

## Known limits, stated before the read
- **Coarse sample:** 50 companies give roughly ±14 points on the share.
- **Home page only:** a firm whose home page doesn't list its services is classed `unclear`, not `seller`.
- **Site-finding errors:** the search inherits S5's miss rate. Companies trading under a different brand may be `no-site`.
- **Name stems are crude:** the Part 2 stems miss firms whose names don't say what they do.
- **Classifiers:** sub-agents with separate output files, given only the scraped page and this rule. They see no S5–S8 result.
- **Defects** found after the read go in `result.md`; this method is not changed.
