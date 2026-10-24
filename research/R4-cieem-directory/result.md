# R4: result (read 2026-10-24, after the method was committed in 5f6d279)

Evidence: `evidence/counts.md`. It holds every count, the API endpoint and the request bodies. Company names, contacts and the results screenshot are in `D:/data/macan/r4/`.

## Answers

1. **Scale.**
   - **Size:** 169 Registered Practices in the UK. The API returned 170 records, one of them a placeholder with no address.
   - **Catalogue coverage:** 145 offer at least one survey in our catalogue: 138 preliminary ecological appraisal, 134 bat surveys, 125 great crested newt surveys, 64 biodiversity net gain.
   - **Outside ecology:** nothing. The directory has no service for flood, noise, air quality, contaminated land or arboriculture.
   - **Within 25 miles:**

     | City | Practices |
     |---|---|
     | Bristol | 22 |
     | Birmingham | 19 |
     | London | 18 |
     | Leeds | 17 |
     | Manchester | 14 |
     | Cambridge | 14 |
     | Glasgow | 12 |
     | Nottingham | 10 |
     | Cardiff | 9 |
     | Newcastle | 8 |
     | Brighton | 8 |
     | Edinburgh | 7 |
     | Belfast | 1 (a national consultancy's Belfast office) |

2. **Listing.** A buyer sees the name, website, email, telephone and a free-text description. Behind each record the API also holds address, services, habitats, species and licences. In the 10-listing sample (bat surveys near EC1), all 10 have website, phone and services, 9 have an email, and 8 have a description. Across all 169: phone 169, email 161, website 157.
3. **Buyer.**
   - **Search:** by area, postcode and distance (10/25/50/100/100+ miles). After a search, filter boxes appear for 64 services, habitats, species and licences, including bat and newt low-impact class licences.
   - **Missing:** there is **no enquiry form and no way to send one request to several practices**. No prices, availability or season are shown.
4. **Overlap.** **7 of 30** sampled practices are in R3's trade universe.
   - Of the other 23, 21 are registered companies found by name on Companies House, and 2 are ambiguous.
   - No company number from that lookup is in the universe.
   - The two company pages spot-checked carry SIC 74909 and 81300, not R3's 74901.
5. **Fee.** CIEEM's page (https://cieem.net/i-am/registered-practices/cost-of-registered-practice/, modified 2026-02-12) gives the annual fee, excluding VAT, by employees and contractors:

   | Employees | Fee a year |
   |---|---|
   | 1–2 | £147 |
   | 3–5 | £368 |
   | 6–10 | £725 |
   | 11–20 | £1,392 |
   | 21–40 | £2,520 |
   | 41+ | £3,140 |

   R1's "£147–£368 + VAT" was the first two rows of a cut-off snippet.

## Decision rule
1. **Firm source (PR4): yes.** 145 practices offer a catalogue survey (≥ 50), and every record carries a contact. The directory becomes a PR4 source.
2. **Rival (ALT-cieem): no, R1's verdict stands.** A buyer cannot send one request that reaches several practices. They search, filter and contact firms one by one. How we differ, with this receipt:
   - we take one request and qualify it;
   - we say which survey is needed and when it can be done;
   - we cover the non-ecology surveys CIEEM does not list.
3. **Q9 → some.** Within 25 miles of Belfast there is 1 practice (≤ 5): a national consultancy's office. Scotland is not thin by this rule (Glasgow 12, Edinburgh 7), and not 20+ either, so that half of the guess is neither confirmed nor reversed.
4. **R3 defect: yes.** 7 of 30 is 23%, under 50%. R3's supply universe (SIC 74901 plus name stems) missed most CIEEM ecology practices. Those sampled are registered under other SIC codes or names. This affects R3's route B only, which R3 already reported as not comparable. Route A, the demand side behind the M1 figure, is untouched. R3's result is not edited.

## Defects found after the read
1. **No default radius.** The directory requires a distance and has no default. 25 miles was used for every postcode search.
2. **Two invalid postcodes.** G1 1AA and M1 1AA failed ("not a valid address for geocode search"). They were replaced by G2 1DU and M2 5DB.
3. **One office per practice.** The API returns each practice once, with its office nearest the search point. So nation counts from one whole-UK pull lean towards the search point. The 25-mile searches are the per-nation measure.
4. **"Default order" read as the API's order** for the whole-UK search from B1 1AA, which is by distance from Birmingham. The overlap sample is therefore Midlands-heavy.
5. **Services were counted from the API's fields,** not by ticking each filter on the page. The page's filters use the same lists.
6. **D7 spot-check came late.** The Companies House lookups were delegated. The sub-agent returned a URL and verbatim name and number per row. It did not pause after 10 rows; I spot-checked 2 company pages after all 23 were back, and both held.
7. **Budget:** about 25 calls to the directory and its API (limit 40). Companies House was 23 searches by the sub-agent plus 2 spot-checks, outside that limit, which named the directory only.
8. **Personal data.** A screenshot of results first landed in `research/`. It shows named individuals' emails, so it was moved to `D:/data/macan/r4/` before commit.
