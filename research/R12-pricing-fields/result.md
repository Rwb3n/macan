# R12: result (read 2026-10-24, after the method was committed in f3002ef)

Evidence:
- `evidence/a-standards.md`: 93 rows from each survey's standard or guidance, each with a URL, section and verbatim wording;
- `evidence/b-forms.md`: 124 rows from 15 firms' own quote forms, each with a URL and the verbatim field.

## What firms ask before quoting (B)
- **Contact details:** every firm asks name and email.
- **Free text:** 13 of 15 have a free-text box that is always shown.
- **Site address or location:** 10 of 15 ask for it.
- **Nothing more:** 4 forms ask nothing beyond contact details and a message (Astute, Unda, Arb Innovators, Harmil).
- **Survey-specific questions are rare:**
  - **Bat Surveyor:** property type, known health and safety issues.
  - **Arbtech's flood page:** survey type and purpose.
  - **AMS:** listed building.
  - **Chase:** red-line boundary upload.
  - **Indigo:** domestic or commercial.
  - **Soils UK:** site history.

**Reading:** firms gather the specifics after first contact (inference: by phone or email; the forms show only what is asked up front).

## What the standards say a surveyor must know (A)
| Survey | Standard | What the surveyor needs from the client and site |
|---|---|---|
| Bat | BCT Good Practice Guidelines, 4th ed. (2023, amended 2024) | site boundary; what the works do to structures (demolition or modification); type and scale of works; project stage; previous surveys; access and safety (structural condition, H&S); season May–September; application date |
| Preliminary ecological appraisal | CIEEM PEA guidelines, 2nd ed. (2017), quoting BS 42020 | proposed development; site and surroundings; access and ownership; timing and deadline; status of the design; consent route |
| Great crested newt | Natural England standing advice (2025); English Nature mitigation guidelines (2001) | ponds within 250 m and 500 m; barriers; existing records and surveys (no older than 4 seasons); development area and phasing; season mid-March to mid-June; programme |
| Flood risk assessment | Planning Practice Guidance para 080 checklist; EA guidance (2026) | location; current use; flood zone; proposed development and change of use; site area; major or minor extension (250 m² or less); within 20 m of a main river; drainage strategy needed |
| Tree survey | BS 5837:2012 (scope page), Leeds City Council restatement | number of trees, including overhanging; tree preservation orders; proposed layout and construction access; demolition; levels; planning stage |
| Heritage statement | Historic England Advice Note 12 (2019) | consent sought; nature of works; listed or locally listed; curtilage; conservation area; setting; archaeological potential; planning history |
| Noise impact assessment | ProPG (2017); BS 4142 (scope page) | proposed use; noise sources nearby (transport, industrial, commercial); nearest homes; gardens and balconies; character of the area; planning stage |
| Land contamination | EA LCRM Stage 1 (2025); BS 10175:2026 (BSI article) | why it's commissioned (planning condition, valuation); previous and current use; proposed use (residential or commercial); site size and plans; previous reports; access |

## The rule applied: core = in the standard and asked by 2 or more firms
| | Fields |
|---|---|
| **Core, every survey** | **where the site is** (address or postcode); **what work is planned** (description of the proposal) |
| **Core for some** | heritage: property type (2 of 2 firms, and the standard's nature of the building) |
| **Useful, common to most standards** (the buyer can answer) | project stage (applied, about to apply, condition); deadline; previous surveys or reports on the site; access and safety issues; plans or photos (asked by 4 firms as an upload) |
| **Useful, per survey** (standard only, easy for a buyer) | **bat:** does the work touch the roof, loft or walls, or demolish; building type and age · **newt:** any ponds nearby · **flood:** flood zone if known, current use, extension under or over 250 m², near a river · **tree:** trees on or next to the site, any with a preservation order · **heritage:** listed or locally listed, conservation area · **noise:** what's proposed and what noise is nearby · **contamination:** past and current use, proposed use |
| **Not for the buyer** (the surveyor establishes them) | season and number of visits; Environment Agency data requests; levels; measurement periods |

## What this means for the job sheet (D27)
The job sheet asks for the two core fields, plus the useful fields a buyer can answer, chosen per survey from the table above. These are the specifics firms otherwise chase after first contact. Fields the surveyor establishes stay off it.

The buyer's free text stays, trimmed, as the excerpt (D27). Firms' own forms show they expect a free-text description.

## Defects
1. **Gated forms:** fields read from page code or the page past a contact or address gate (Arbtech, Bat Surveyor, Enviropass, Contaminated Land Surveys) deviate from the method's "read up to that point only". Nothing was entered or submitted. Accepted by Claude and tagged per row.
2. **Paywalled standards:** BS 5837, BS 4142 and BS 10175 were read from BSI public pages only. The tree detail comes from a council's restatement of BS 5837.
3. **Newt guidelines:** read from a copy hosted by National Grid, through model extraction; the C9 timing is corroborated by a snippet.
4. **Firms and forms that don't fit cleanly:**
   - Arbtech fills 5 survey slots as one firm;
   - AMS's form is a general home-survey platform;
   - Soils UK quotes for soil disposal, not assessment.
5. **The counting rule** for what counts as a form was set after reading the bat search.
6. **Grouping** fields into types is the readers' and Claude's judgement.
7. **Spot-checks:**
   - A: the bat guidelines' 2.2.10 matched the PDF word for word.
   - B: Arbtech's "What is your survey for?" with its options, placeholder and phone field matched the page HTML.
