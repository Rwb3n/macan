<!-- Imported unchanged from callsheet 98c5786, docs/screens/s7-env-buyer-demand/method.md. Read-only here: corrections go in a new study. -->

# S7: buyer demand for environmental consultancy (pre-registered 2026-10-22, before any read)

S6 (`docs/screens/s6-geography/result.md`) left environmental consultancy (SIC 74901) as the only industry that passes every measured screen with the cell's label agreeing. But its S4 term, "environmental consultant", draws job seekers: a careers page ranks first on Google. A4 (log) guesses that one-phrase terms misread buyer intent.

The guess under test: buyers search for the **service** they need, often one that planning or regulation requires ("bat survey", "phase 1 desk study"), not for "environmental consultant". Principal, 2026-10-22: "are you saying we got a shot getting environmental agencies to value being on our platform?" S7 measures the buyer side only. Whether firms value enquiries is not measured here.

## Terms (fixed before any volume is seen)

**Rule for inclusion:** a service that UK planning or environmental regulation commonly requires, and that environmental consultancies sell, plus two generic buyer phrasings. Excluded: job titles, courses, and services usually sold by other trades (asbestos, trees, drainage design).

1. bat survey
2. ecology survey
3. ecological survey
4. preliminary ecological appraisal
5. protected species survey
6. great crested newt survey
7. biodiversity net gain assessment
8. phase 1 desk study
9. phase 1 environmental assessment
10. contaminated land survey
11. land contamination assessment
12. noise impact assessment
13. noise survey for planning
14. air quality assessment
15. flood risk assessment
16. environmental impact assessment
17. environmental permit application
18. environmental consultancy
19. environmental consultants

## Procedure
- **Tool:** Keyword Planner, *Get search volume and forecasts*, run in the principal's Google Ads account via Browser MCP.
- **Settings:** the 19 terms exactly as above; United Kingdom; Google; last 12 months.
- **Recorded:** each term's average monthly searches, as Keyword Planner shows them (a range or a number). They are saved to `result.csv` with the screenshot or export, and nothing else is read.
- **Midpoints:** volumes are converted to S4's midpoints (`docs/screens/s4-full-funnel/method.md`: 0–10 → 3.2, 10–100 → 32, 100–1K → 316, 1K–10K → 3,162, 10K–100K → 31,623, …). No data counts as 0.
- **Buyer demand** is the sum of the 19 midpoints.

## Decision rule
- **Passes** if buyer demand ≥ **3,478 a month**, the figure S4 credited to "environmental consultant" including job seekers. That is, real buyer demand is at least as large as the contaminated figure the screens relied on.
- **Reported alongside:** buyer demand ÷ S1 supply (1,664), and the three largest terms.
- **A4:** a pass moves it to `some` evidence for this industry; a fail moves it to `evidence`. Either way the result is published.
- **The domain choice stays the principal's** (#78).

## Known limits, stated before the read
- Keyword Planner's bands are coarse (×10 steps), so a single term can swing the sum.
- Some listed services are also sold by engineering firms (flood risk, noise) under other SICs. The demand is shared with them, not exclusive to 74901.
- A homeowner needing one survey for planning and a developer commissioning many both count the same.
- The list is root's, drafted without volume data but not blind to the hypothesis.
- Defects found after the read go in `result.md`; this method is not changed.
