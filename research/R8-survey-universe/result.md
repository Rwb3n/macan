# R8: result (read 2026-10-24, after the method was committed in a81eccd)

## Evidence
- `evidence/rows-a.csv` and `evidence/rows-b.csv`: 526 rows, from the national list plus 10 councils. Every row carries its URL and the council's verbatim wording.
- `evidence/rows-a-superseded.csv`: a third-party copy of Cheshire West's older list, kept and not counted.
- `evidence/group.py`: the grouping table (patterns), which produces `evidence/types.csv` and `evidence/unmatched.txt`.

## What councils ask for: specialist reports, by how many of the 10 councils list them

| Report type | Who makes it | Councils (of 10) |
|---|---|---|
| Biodiversity net gain | specialist | 9 |
| Ecology and protected species (incl. bat) | specialist | 9 |
| Flood risk assessment | specialist | 9 |
| Drainage strategy (surface water, SuDS, foul) | specialist | 8 |
| Tree survey (arboricultural) | specialist | 8 |
| Land contamination | specialist | 8 |
| Noise impact assessment | specialist | 8 |
| Coal mining and ground stability | specialist | 7 |
| Transport assessment or statement | specialist | 7 |
| Ventilation and extraction | specialist | 7 |
| Air quality assessment | specialist | 7 |
| Heritage statement or impact assessment | specialist | 7 |
| Lighting assessment | specialist | 7 |
| Energy statement, carbon and BREEAM | specialist | 6 |
| Environmental impact assessment | specialist | 6 |
| Structural survey | specialist | 6 |
| Archaeology | specialist | 6 |
| Travel plan | specialist | 6 |
| Fire statement | specialist | 5 |
| Landscape and visual impact assessment | specialist | 5 |
| Viability assessment | specialist | 5 |
| Daylight and sunlight | specialist | 4 |
| Coastal erosion and stability | specialist | 3 |
| Habitats regulations / nutrient neutrality | specialist | 3 |
| Odour assessment | specialist | 3 |
| Wind and microclimate | specialist | 2 |
| Glint, glare and shadow flicker | specialist | 2 |
| Topographical survey | specialist | 1 |
| Basement impact assessment | specialist | 1 |
| Agricultural land classification | specialist | 1 |

**Not specialist by our judgement, so not listed:**
- Sustainable construction checklist (6 councils) and health impact assessment (5): **unclear.** Often a council form the applicant fills in.
- Retail and town centre impact (6): **unclear.** Usually a planning consultant's statement.
- Flood risk sequential and exception tests (5): **applicant.** A planning argument, not a survey.
- The other 230 distinct items are the applicant's own documents: forms, plans, design and planning statements, fees and heads of terms. A few are one-offs, such as a soils management plan or aerodrome safeguarding.

## Decision rule applied
1. **Into the catalogue (3 or more councils, specialist): 25 types.**
   - **Already covered (8):** ecology and protected species, biodiversity net gain, flood risk, trees, land contamination, noise, air quality, environmental impact assessment.
   - **Added (17):** drainage strategy, coal mining and ground stability, transport assessment, ventilation and extraction, heritage statement, lighting, energy statement and BREEAM, structural survey, archaeology, travel plan, fire statement, landscape and visual impact, viability, daylight and sunlight, coastal erosion, habitats regulations and nutrients, odour.

   The catalogue goes from 16 to 33 surveys. Each new entry's "when" paraphrases the councils' trigger wording.
2. **"Also asked for sometimes" (1 or 2 councils): 5,** listed on the surveys page: wind and microclimate, glint and glare, topographical survey, basement impact, agricultural land classification.
3. **Applicant documents:** not listed.
4. **Existing catalogue entries named by no council:**
   - **Not named:** the species surveys (great crested newt, badger, reptile, bird, water vole and otter, dormouse) and the preliminary ecological appraisal.
   - **Why:** councils ask for an "ecological assessment" or a "protected species survey", and the species surveys follow from what that finds.
   - **Treatment:** this is a finding, and they stay. They are what a buyer is told to get next (R2: the follow-on survey).

## Findings beyond the rule
- **Councils differ widely in how much they ask up front.** Cheshire West's own page says local information "is not automatically required" for householder work and similar, and lists only three things. Herefordshire's page names two checklists. Others list 70 to 80 items. Where the list is thin, the planning officer asks later, case by case. That is the "only to be told I needed a bat survey" moment (R2).
- **Triggers are local and specific:**
  - "within the Coal Authority's Coal Mining Referral Areas";
  - "Coastal Change Management Areas";
  - "13km RAMS Zone of Influence";
  - "Lindisfarne Nutrient Neutrality Catchment".

  A postcode-to-council check (Q6) could answer these for a buyer. The rows give each council's wording.
- **"Radiation":** no council lists a radiation survey. Telecoms applications need supporting information, which three councils list as telecoms information. It is the operator's declaration, so it counts as an applicant document.

## Defects
1. **North Yorkshire has seven former-district lists.** Only Harrogate's was read and stands for the county.
2. **Herefordshire's local list is almost empty.** It was recorded as found, not replaced: 2 items on the page and 10 from a linked 2021 guidance PDF that is mostly national requirements.
3. **Application types differ:**
   - Northumberland's single list includes listed-building-consent items, such as the structural survey and the archaeological building report. Without Northumberland, the structural survey has 5 councils and archaeology 5, so both still pass.
   - Southwark, Bath and North East Somerset and Cornwall publish lists by application type; the full planning list was used.
4. **Cornwall's "Validation updates" page** changes some items. It was not read.
5. **Grouping is a judgement.** `group.py` is the record. One pattern first caught "Street scene" under trees and a Gypsy and Traveller form under heritage. Both were corrected before counting.
6. **D7:** spot-checked after the first council for each reader. East Suffolk's air quality row matched the PDF word for word. Cheshire West's source was changed to the council's own page. The second reader also checked every row against its extracted text by script.
7. **Firecrawl credits ran out mid-study.** The readers switched to direct fetches and the browser.
8. **The 10 councils are English only.** Wales, Scotland and Northern Ireland are not sampled.
