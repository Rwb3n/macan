# R4: what is in CIEEM's Registered Practice Directory, and what is it to us? (pre-registered 2026-10-24, before any read)

Principal, 2026-10-24: "im curious. we've done all this work, but i just come across this site https://events.cieem.net/Registered-Practice-Directory/ did we research this site?" Then: "do the CIEEM study first".

**What is already known:**
- R1 cites this URL only as a search snippet (c1-partB.md, ref 18). It was never opened.
- The fee, £147–£368 + VAT a year, also comes from a snippet (ref 17), not from the page.
- The Bat Conservation Trust sends buyers to this directory: "add your post code and choose bat surveys" (R1).
- The map holds it as `ALT-cieem` (serves U2, U5) and `CH-body` (status outside).

## Questions
1. **Scale.** How many practices are listed in total? How many offer at least one survey in our catalogue (`src/catalog.ts`)? How are they spread by region, including Northern Ireland and Scotland?
2. **Listing.** What does each listing show: services, area, website, phone or email, an enquiry form?
3. **Buyer.** What can a buyer do there? Search by postcode and service only, or also send one request to several firms? Does it show prices, availability or season?
4. **Overlap.** For a sample of listed practices, what share is in R3's trade universe (2,238 companies, `D:/data/macan/m2/universe.csv`)?
5. **Fee.** Does CIEEM's own page confirm the £147–£368 + VAT fee?

## How
- **Tool:** Firecrawl scrape (`maxAge: 0`). Where results sit behind a search form, use Chrome DevTools on the live page.
- **Budget:** 40 page loads at most.
- **Scale:** read the total from the directory itself (its own count, or every result page). Count by service filter for each catalogue survey the directory offers, and by region filter (or by one postcode per UK nation and English region where only postcode search exists; postcodes fixed in advance: Belfast BT1, Glasgow G1, Edinburgh EH1, Cardiff CF10, Newcastle NE1, Leeds LS1, Manchester M1, Birmingham B1, Nottingham NG1, Cambridge CB1, London EC1, Brighton BN1, Bristol BS1). Postcode counts at the directory's default radius.
- **Listings:** record the fields on 10 listings. The first 10 bat-survey results for London EC1 are the sample, or the first 10 results on the first page if that search is not possible.
- **Overlap:** the first 30 practices in the directory's default order. Match on name, after lowercasing and dropping "ltd", "limited", "llp", "the" and punctuation. Unmatched names are checked once by hand against Companies House search; a match there that is not in the universe counts as "outside the universe".
- **Receipt per claim:** each count and each field claim cites the URL that shows it, plus a capture saved in `evidence/` (the page text or a screenshot).
- **Company data:** practice names and contacts are company-level data, so they go to `D:/data/macan/r4/`. `research/` holds counts, fields and URLs only.

## Decision rule
1. **Firm source (PR4):** if 50 or more listed practices offer at least one catalogue survey, *and* listings carry a website or contact, the directory becomes a PR4 source ("Take candidates from …"). Fewer than 50, or no contacts, and it is noted but not used.
2. **Rival (ALT-cieem):** if a buyer can send one request that reaches several practices, ALT-cieem is a rival for ST-U2.3 (Ask once), and the map says how we differ. If it is search and contact only, it stays a directory the buyer works through alone, and R1's verdict ("not a competitor for leads") stands with this receipt.
3. **Q9:** the counts for Northern Ireland and Scotland are recorded against Q9. Q9 moves to `some` if either count is 5 or fewer (thinly served, as R2 guessed), and the guess is reversed in the note if both are 20 or more.
4. **Universe:** if under 50% of the overlap sample is in R3's universe, R3's supply route missed a large share of the trade; that is reported as a defect of R3 (its result is not edited).

## Known limits, stated before the read
- **Registered Practices are a subset.** Only firms that pay CIEEM are listed; absence is not evidence that a firm does not exist.
- **Postcode counts depend on the radius** the directory uses, and overlap between neighbouring postcodes is not removed.
- **The page may block the tool.** If so, that is recorded, and Chrome DevTools is used; if that fails too, the study stops and says so.
- **Defects** found after the read go in `result.md`; this method is not changed.
