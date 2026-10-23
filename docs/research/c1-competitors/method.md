# C1: who already serves planning-survey buyers and firms? (pre-registered 2026-10-23, before any read)

Principal, 2026-10-23: "this is looking like a serious project. have we looked at competitors?"

**What is already known:** callsheet S4 checked one job-seeker phrase, "environmental consultant": 2 of the top 20 results were directories (Yell once). Nothing more.

C1 asks who already serves:
- **U2**, the buyer who needs a planning survey;
- **U4**, the firm that wants the enquiries it chooses (`model/usecases.ts`).

It also asks whether anyone already sells **M1** (pay per lead) in this trade.

## Part A: search results

**What is searched:**
- **Terms:** S7's 19 pre-registered terms (`callsheet/docs/screens/s7-env-buyer-demand/method.md`), plus `"<term> near me"` for the 4 terms in S7's top band (1K–10K): bat survey, flood risk assessment, environmental impact assessment, environmental consultancy. That is 23 searches, fixed now.
- **Tool:** Firecrawl web search, location United Kingdom, limit 10.

**Classes for each result:**

| Class | Meaning |
|---|---|
| **M** | Marketplace or lead site: takes a request and passes it to several firms, or sells leads (e.g. Bark, Checkatrade, MyBuilder) |
| **D** | Directory: lists firms; the buyer contacts them |
| **B** | Body or official: professional body, council, government, charity guidance |
| **F** | Firm: a provider selling its own surveys. Mark **F+** if the page shows national coverage plus an instant quote or published price |
| **O** | Other: news, forums, jobs, education |

**Measures:**
- **Intermediary share:** (M + D) ÷ results, across all 23 searches.
- **M at #1–3:** how many of the 23 searches have an M in positions 1–3.
- The domains that appear 3 times or more, with their class.

## Part B: who sells what

For every M or D domain seen in Part A, plus these named in advance:
- Bark, Checkatrade, MyBuilder, Rated People;
- CIEEM's "find a consultant" directory and the Bat Conservation Trust's;
- the Institute of Acoustics and Association of Noise Consultants member lists;
- Arbtech (as the F+ reference).

Read the domain's own pages (2 scrapes at most per domain). Record:
- who pays;
- what for, and the price where published;
- whether it covers planning surveys explicitly;
- signs of scale (firm counts, reviews, claims).

## Decision rule (it describes the field; the domain choice is already made, log 000071)

1. **Occupied** if an M sits at #1–3 on 8 or more of the 23 searches, *or* intermediaries take 30% or more of all results. Then the brief must name how we differ before any more build.
2. **Open** if M is at #1–3 on 3 or fewer searches *and* intermediaries take under 15%.
3. **Contested** otherwise.

**M1 evidence (reported separately):** any marketplace that charges *firms* per lead for planning surveys, with a published price. That is evidence firms already pay per lead in this trade. It moves A7 to `some`, and its price becomes the first anchor for M1 pricing.

## Known limits, stated before the read
- **Not a real Google page:** Firecrawl's UK search approximates a Google results page. It shows no ads, map pack or features.
- **Ten results is page one only.**
- **Classes are a judgement.** Each judgement is recorded with its domain so it can be checked.
- **Defects** found after the read go in `result.md`; this method is not changed.
