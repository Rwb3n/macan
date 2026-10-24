# R4 evidence: counts from CIEEM's directory API (no company names; those are in D:/data/macan/r4/)

**Source:** the directory page https://events.cieem.net/Registered-Practice-Directory/ calls `POST https://cieemapi.azurewebsites.net/api/RegisteredPractices` with body `{area, postcode, distance}`; UK area = `300000000`; distance `100+` = `0`. The calls below were made from the live page in Chrome on 2026-10-24 (first fetch 2026-10-24T10:39:54.231Z).

## Postcode searches, 25 miles (UK)

| postcode | practices |
|---|---|
| BT1 1AA | 1 (a national multi-disciplinary consultancy's Belfast office; no other practice within 25 miles) |
| G1 1AA | invalid for geocode search |
| G2 1DU (replacement) | 12 |
| EH1 1AA | 7 |
| CF10 1AA | 9 |
| NE1 1AA | 8 |
| LS1 1AA | 17 |
| M1 1AA | invalid for geocode search |
| M2 5DB (replacement) | 14 |
| B1 1AA | 19 |
| NG1 1AA | 10 |
| CB1 1AA | 14 |
| EC1A 1BB | 18 |
| BN1 1AA | 8 |
| BS1 1AA | 22 |

## Whole UK (distance 100+)

- From B1 1AA: 170 records. From BT1 5GS: 170 records, largest distance 3,787.5 miles. So 100+ returns the whole UK list.
- One record is a placeholder (name 'Registered Practice with Species', no address): **169 real practices**.

## Fields per record (API)

practiceId, practiceName, practiceLogoURL, practiceWebsite, practiceTelephone, practiceEmailAddress, practiceDirectoryCopy, accountID, accountName, address1_Line1, address1_Line2, address1_Line3, address1_City, address1_County, address1_PostalCode, latitude, longtitude, distance, practiceAddress, habitats, services, species, licences

**Shown to a buyer on the page:** name, Website, Email, Telephone, Practice Directory Copy. After a search, filter checkboxes appear for services (64), habitats, species and licences. No enquiry form, price, availability or season field is on the page.

## Contact fields (169 real)

- telephone 169, email 161, website 157, directory copy 113
- services listed: 146; none listed: 23
- at least one catalogue survey (src/catalog.ts ecology surveys: Badgers Survey, Bats Survey, Biodiversity Net Gain, Birds Survey, Dormice Survey, Ecological Impact Assessment, Great-crested Newts Survey, Otter Survey, Preliminary Ecological Appraisal, Reptile Survey, Water Vole Survey): **145**
- the directory has no service for flood, noise, air quality, contaminated land, arboriculture or EIA as such (its list has 'Strategic Environmental Assessment' only)

## Services (practices listing each, of 169)

| service | n |
|---|---|
| Ecological Survey and Assessment | 140 |
| Preliminary Ecological Appraisal | 138 |
| Bats Survey | 134 |
| Extended Phase 1 Habitat Survey | 134 |
| Ecological Impact Assessment | 133 |
| Protected Species Survey | 133 |
| Phase 1 Habitat Survey | 132 |
| Reptile Survey | 130 |
| Badgers Survey | 129 |
| Water Vole Survey | 126 |
| Ecological Clerk of Works | 125 |
| Great-crested Newts Survey | 125 |
| Otter Survey | 125 |
| Botanical Survey | 117 |
| Birds Survey | 113 |
| Habitat Creation and Restoration | 105 |
| Habitat Management | 104 |
| Habitats Regulations Assessment | 96 |
| Dormice Survey | 95 |
| Habitat Management Planning | 92 |
| National Vegetation Classification (NVC) | 92 |
| Project Management | 91 |
| GIS / Digital Mapping | 91 |
| BREEAM / Code for Sustainable Homes | 87 |
| Appropriate Assessment | 82 |
| Landscape Ecology | 69 |
| Biodiversity Net Gain | 64 |
| Green Infrastructure Planning | 62 |
| Invasive Species Management | 61 |
| Tree climbing | 60 |
| Expert Witness | 58 |
| Other Survey | 51 |
| Invertebrate Survey | 50 |
| Renewable Energy | 48 |
| Stakeholder Engagement | 48 |
| Freshwater Survey | 46 |
| Aquatic Survey | 40 |
| Environmental Education | 38 |
| Strategic Environmental Assessment | 32 |
| Environmental Auditing | 31 |
| River condition assessments | 31 |
| MoRPh accredited surveys | 27 |
| Spatial Planning | 25 |
| Photography | 24 |
| Agri-environment advice | 22 |
| National/Regional Policy Review | 21 |
| Marine Survey | 8 |
| Toolbox Talks | 4 |
| Work in confined spaces | 2 |
| Working at height | 2 |
| Landscaping and planting | 1 |
| Auditing and monitoring | 1 |
| Soil management | 1 |

## By office postcode (169), from the whole-UK pull searched from B1 1AA

**Caution:** the API returns one office per practice, the one nearest the search point. Searched from BT1 1AA, a national consultancy comes back with a BT1 2BE office; searched from B1 1AA, the same practice shows a London address. So this table places multi-office practices in their office nearest Birmingham and undercounts Scotland, Wales and Northern Ireland. The 25-mile postcode searches above are the measure per nation.

| nation | practices |
|---|---|
| England | 147 |
| Scotland | 15 |
| Wales postcode areas (CF, LL, NP, SA, LD, SY; LD/SY straddle England) | 7 |

## Overlap with R3's universe (first 30 of the whole-UK pull, in the API's order)

- **In R3's universe:** 7 of 30 (6 exact after normalising; 1 more after fixing spacing in a name).
- **Not in the universe:** 23. Searched on Companies House (`https://find-and-update.company-information.service.gov.uk/search/companies?q=<name>`):
  - 21 match a registered company by name;
  - 2 are ambiguous (two candidates, or no clear match).
- **No returned company number is in `universe.csv`.**
- **Spot-checked company pages:** two, both active. One is SIC 74909, the other SIC 81300. R3 took SIC 74901 plus name stems.
- **Names and numbers:** `D:/data/macan/r4/ch-check.md` (company-level data).
