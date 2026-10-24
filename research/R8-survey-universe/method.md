# R8: which surveys and reports do councils ask for with a planning application? (pre-registered 2026-10-24, before any read)

Principal, 2026-10-24: "there are a multitude of surveys right? things like radiation even..." Then: "go ahead".

**Why:** D1 says "all planning surveys", and Q13 (one place for all of them) needs the full list. The catalogue (`src/catalog.ts`) has 16, chosen from S7's search terms, not from what councils ask for.

**What is known before the read:** nothing measured. Claude's unchecked list (named in the conversation, not evidence):
- ground: coal mining risk, ground investigation;
- heritage and archaeology;
- light, air and wind: daylight and sunlight, lighting, odour, wind microclimate;
- transport;
- land and buildings: topographical survey, landscape and visual impact;
- drainage, energy;
- telecoms: an ICNIRP declaration for masts.

## Sources, fixed now
1. **The national requirements:** the gov.uk guidance on making an application and validation (the national list every council uses). One page, with its URL.
2. **Local validation lists of the same 10 councils R3 sampled, one per English region:**
   1. Cheshire West and Chester
   2. North Yorkshire
   3. Northumberland
   4. Leicester
   5. Herefordshire
   6. East Suffolk
   7. Southwark
   8. Wealden
   9. Bath and North East Somerset
   10. Cornwall

   **Fallback:** if a council's local list can't be found or read, the next council in that region by population replaces it, and the replacement is recorded.

## What is recorded, one row per report a council lists
| column | content |
|---|---|
| council | as above |
| url | the exact page or PDF read |
| item | the report's name, verbatim |
| trigger | when it is required, verbatim (e.g. "within a Coal Mining High Risk Area") |
| where | page number or section heading |

Company-level data: none (councils are public bodies). Rows go to `evidence/rows.csv`.

## Sorting, after the rows are in (each judgement recorded with its reason)
- **Same report, different names:** grouped under one name. The grouping is a table in `result.md`.
- **Who makes it:**
  - **specialist:** normally bought from a qualified firm (ecologist, engineer, archaeologist, acoustician, transport consultant, arboriculturist, heritage consultant, surveyor);
  - **applicant:** forms, plans, design and access statement, planning statement, fees;
  - **unclear:** for anything else.

## Decision rule
1. **Into the catalogue:** a specialist report asked for by **3 or more of the 10 councils** goes in, with:
   - what it is;
   - when it is asked for (from the councils' trigger wording);
   - its group.
2. **"Also asked for sometimes":** a specialist report asked for by 1 or 2 councils is listed there on the site, so a buyer can still find it.
3. **Not listed as a survey:** applicant documents.
4. **The 16 already in the catalogue:** each one asked for by none of the 10 is reported as a finding, not removed.

## Delegation (D7)
- **Two sub-agents, five councils each.** Every row carries its URL and verbatim wording.
- **Spot-check:** each stops after its first council (or 10 rows, whichever comes first), and Claude spot-checks 3 rows against the source before the rest.
- **Rows without a URL and verbatim item are dropped as defects.**

## Limits, stated before the read
- **Ten English councils.** Wales, Scotland and Northern Ireland have their own systems and are not sampled.
- **Local lists age,** and some councils update them every few years. The date shown on each list is recorded where it has one.
- **A council asking for a report is not the same as how often applicants need it.** This measures breadth, not volume. R3 measured volume for a few surveys.
- **Defects** found after the read go in `result.md`; this method is not changed.
