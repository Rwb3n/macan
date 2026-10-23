# C1 Part B: who sells what (read 2026-10-23)

Method: `macan/docs/research/c1-competitors/method.md` Part B. Tool: Firecrawl (search UK, limit 6-10; scrape in "query" mode). About 33 calls. No other C1 output files were read. Only domains named in advance plus the extra broker searches are covered here. Part A M/D domains are not included because Part A was not run in this pass.

Classes: M = marketplace or lead seller; D = directory; B = body or official; F = firm; F+ = firm with national coverage plus an instant quote or a published price.

## Summary table

| Domain | Class | Who pays | For what / published price | Planning surveys explicitly covered? | Signs of scale |
|---|---|---|---|---|---|
| Bark (bark.com) | M | Professionals | Credits to contact a lead. £1.80 per credit, from Bark's own help centre [1]. Bark's own pages give no credits-per-lead figure for any planning-survey category. Third-party sites say leads take 5-20 credits, about £5-40 [2] | **No category found.** The likely URL `/en/gb/ecologists/` returns 404 [3]. A site search finds only seller profiles that mention FRAs or ecology [4], plus an "asbestos-removal-surveys" category [5] | Trustpilot 3.8 from 112k reviews [6]; "over 1000 categories" [7] |
| Checkatrade (checkatrade.com) | M (subscription directory with lead plans) | Trades | Free £0; Approved £30/mo; Growth "from £59/mo" (leads) [8] | **No category found.** It has a bat survey *cost guide* that says "Book a trusted and qualified bat surveyor on Checkatrade" [9]. Its CTA goes to the generic "post-a-job" [10]. A site search found no ecologist or bat surveyor category page [11]. One surveying firm's profile lists "Flood risk assessments" [11] | "48,000+ quality trades", "72 different trade industries" [8] |
| MyBuilder (mybuilder.com) | M | Trades | Shortlist (lead) fee, "from £7", per MyBuilder support as quoted by a third party [12]; no monthly fee | **Not found.** The site search returned no ecology, bat or FRA category [13]. The only bat-survey mention is a homeowner Q&A [14] | Trustpilot 4.3 (~57k), per a third party [12] |
| Rated People (ratedpeople.com) | M (now part of Checkatrade Group) | Trades (historically membership plus per-lead fee) | Homepage says "Rated People is now part of Checkatrade Group" [15]. A third party says it closed to trades on 16 Sep 2026 and jobs now go to Checkatrade members; it was £30-60/mo plus £15-40 per lead [16] | **No.** The full category list has Surveying, Asbestos Services, Tree Surgeon, Drone Surveying and EPC, but no ecology, bat, flood, noise or air quality category [15] | Trustpilot 3.8 (~20k), per a third party [16] |
| CIEEM (cieem.net) Registered Practices Directory | D (run by a B) | Firms. Registered Practice annual fee from £147 + VAT (1-2 staff); £368 for 3-5 staff; higher bands not captured [17] | Listing in the Registered Practices Directory | **Yes (ecology).** Buyers "search the Directory to find a Registered Practice based on the services you require and their location" [18]. BCT tells buyers to "choose bat surveys in the list of filters" [19]. There is also a separate Members' Directory, searchable by name and grade [20] | Number of entries: not found (scrapes of cieem.net pages returned no counts) [21][22] |
| Bat Conservation Trust (bats.org.uk) | B (refers buyers; no own directory found) | n/a | No directory of its own. It sends buyers to CIEEM's directory ("Add your post code and choose bat surveys in the list of filters") and recommends "getting quotes from several consultants" [19] | Yes (bats), through CIEEM | n/a |
| Association of Noise Consultants (association-of-noise-consultants.co.uk) | D (run by a B) | Member firms (membership fee: not found) | Members' Search: "find an accredited practice by service specialism, location, or company name" [23] | Partly: you can search by service specialism. Whether "planning noise" is one of the specialisms was not confirmed | "105 member companies, representing over 1000 consultants" [24] |
| Institute of Acoustics (ioa.org.uk) | B (member lookup, not a buyer directory) | Members (fee not checked) | Member Directory: "search for current members using their first or last name" [25] | No. It is a name lookup, with no service or area search found. The scrape returned no content [26] | Not found |
| Arbtech (arbtech.co.uk) | **F+** | Buyer pays the firm | Published "from" prices: Ecology £399, Protected species £299, Tree £299, BNG £489, Air quality £499, Flood/water/drainage £599, Invasive £599, Contaminated land £950 [27]. Bat PRA from £399+VAT; emergence/re-entry from £799+VAT [28]. PEA has no separate price on the bat page. Quote form; no instant online quote found [27][28] | Yes: ecology, bats, trees, BNG, flood, air quality, contaminated land (no noise) | "160+ Staff across the UK", "80,000+ Projects supported since 2005 (18,000+ Projects annually)" [27]; "Full UK coverage"; ">1000 5* reviews" (meta description) [28]; planning money-back guarantee [28] |

### Extra sites found by the broker searches

| Domain | Class | Who pays | What / price | Planning surveys? | Scale |
|---|---|---|---|---|---|
| **Worklanded (worklanded.com)** | **M (lead seller)** | **Firms** | **"Bat surveys & ecology reports leads: £26 per lead, no contract"** (UK search snippet) [29]. The live scrape (non-UK location) shows "$35 per lead", probably the same price in another currency. Leads go "one firm at a time; it only moves on if you pass"; "Pay only for the leads you open; no contract, no subscription" [30] | **Yes**: bat surveys and ecology reports. Flood, noise and arb categories were not listed on that page [30] | "11 enquiries in this trade in the last 90 days" [30] |
| batsurveycost.co.uk | M (lead broker) | Buyer free; firm side not stated | "Send my contact details to up to three relevant ecologists, chosen by Bat Survey Cost"; "Free, no obligation". No firm-side price shown [31] | Yes (bat surveys for planning) | "licensed ecologists covering your area"; a "Bat Survey Price Index" from 13 sources [31] |
| RenKap (renkap.com) | M (instant multi-quote marketplace) | Buyer pays the surveyor through RenKap; free to upload and get quotes. Firm-side fee or commission: not found | Surveyors pre-load pricing; buyer gets "multiple instant quotes"; "The initial survey can costs as little as £400" [32] | Yes: ecology (PEA), bat / PRA. Flood and noise not mentioned [32] | Calls itself "the first-of-its-kind Site Survey Marketplace"; no counts [32] |
| ecologysurveys.uk, batsurveys.co.uk | See the addendum below | | | | |
| Subito (subitos.co.uk) | Unclassified (not scraped) | n/a | "Get your quote in minutes ... Enter your ..." on a bat survey guide [35] | Yes (bats) | Not checked |

Queries used for the broker sweep (Firecrawl search, UK, limit 10):
1. `compare ecology survey quotes`
2. `get quotes bat survey`
3. `planning survey quotes UK` (all results were house-buyer / RICS survey comparison sites, such as Reallymoving, RightSurvey, Surveyors Compared and MoneySuperMarket; none covers planning surveys)
4. `ecologists leads join network receive bat survey enquiries pay per lead`
5. `"flood risk assessment" OR "noise assessment" quotes from multiple consultants planning application compare` (firms only; no broker found)

## Addendum (coordinator request): Part A unclassed domains and two D domains

### The "Avoid Planning Delays" template sites

| Domain | Class | Operator | Prices shown | Own surveys or passes requests on? |
|---|---|---|---|---|
| batsurveys.co.uk | **F+** (provisional) | **Not found.** The homepage and /contact/ show no company name, number or address [36][37] | PRA "from £299+VAT"; Bat Emergence Surveys "from £799+VAT" [36] | Says it does the surveys itself: "our bat consultants worked on 1982 projects last year alone"; "If you hire one of our friendly licensed bat ecologists"; "We have directed employed staff across England and Wales, as well as a large network of time-served subcontractors" [36] |
| ecologysurveys.uk | **F+** (provisional) | **Not found** (homepage and /contact/) [38][39] | "Ecology Surveys from just £399"; PEA "generally starts at £599"; EcIA "starts at £799"; Ecological Walkover "starts at £399" [38] | Says it does the surveys itself: "Our ecological consultants are placed all over the UK"; "A qualified ecological consultant ... will then get in touch with you" [38]. That second sentence is also how a lead-gen site would describe a hand-off, so the wording does not settle it |
| biodiversitynetgainplan.co.uk | **F+** (provisional) | **Not found** (homepage and /contact/) [40][41] | "RAPID Biodiversity Assessments and Net Gain Plans from £589+VAT" [40] | Says it does the work itself: "Our ecologists worked on over a thousand ecological appraisals last year"; "We have over 30 ecological consultants spread throughout England and Wales, from Kent to Kendal" [40]. Trustpilot shows 1 review (3.7) [42] |

**Are they one operator?** Very likely, but not proven. All three load the same WordPress theme, `/wp-content/themes/batsurveys23/` (in each favicon path) [36][38][40]. They also share the same CookieYes banner, the same 3-step "Get a Quick Quote" form and the same headline pattern. None of the pages read names a legal entity.

**Classification caveat:** the provisional F+ rests on first-person claims ("our ecologists", employed staff plus a subcontractor network) together with national coverage and published prices. No page read shows the sites passing requests to *other independent firms*. But the pattern looks like a network of single-service, ad-driven brands: anonymous operator, Google Ads traffic (`gad_source` links quoted on Facebook [43]), and "a large network of ... subcontractors". The next read to settle it would be the privacy policy at https://batsurveys.co.uk/privacy-policy/ and the terms at https://ecologysurveys.uk/terms/ (both found by search [44]). They were not scraped because each domain's 2-scrape budget was spent on the homepage and contact page. A Companies House lookup of the name in the privacy policy would then confirm or rule out one operator. Search snippets of the privacy policy show only "this website, batsurveys.co.uk ('Our Site')" [44].

### D domains

| Domain | Class | Who pays | Planning surveys covered? | Notes |
|---|---|---|---|---|
| yell.com | D, with an M feature | Firms pay for advertising (Yell's price not checked; nothing published was found in this pass) | Partly. It has an "Environmental Consultants" category with local pages; listed firms include ecology consultancies (e.g. Total Ecology Ltd, Ecology Wales, Hopkirk & Russ Ecology). No bat-survey, FRA or noise category was seen [45] | The category pages are titled "Yell Marketplace" and say "Search for local environmental consultants or post your free enquiry on Yell to get tailored responses". So buyers can post one request to several firms, which is M behaviour. Rating 4.7 from 300 shown on the category pages [45] |
| environmentjob.co.uk/directory | D (jobs-board directory; aimed at job seekers, not service buyers) | Not found. The listing appears tied to employers who post jobs; no listing price found [46] | Not as a service. It is a "Directory of environmental organisations - 1351 found" covering conservation, ecology, sustainability etc. One sector filter returns 48 organisations, consultancies among them (e.g. Atlantic58) [46][47] | Page is `noindex, nofollow` [46]; meta reads "The UK's most interesting environmental jobs. Find careers in ..." [46] |

## M1 evidence

**One marketplace found that charges firms per lead for planning surveys, with a published price:**

- **Worklanded**, category "Bat surveys & ecology reports". It shows **£26 per lead** on the UK-indexed page title and description [29] and **$35 per lead** on the live page fetched from a non-UK location [30]. It says: "Pay only for the leads you open; no contract, no subscription". Each lead goes to one firm at a time and moves on only if that firm passes. It is small: "11 enquiries in this trade in the last 90 days" [30]. It does not say where its leads come from, and the page does not say it is UK-only. It does quote UK job values (£300-£3,000).

The generalist marketplaces give no M1 evidence for planning surveys:
- **Bark** charges firms per lead (£1.80 per credit [1]), but no ecology, bat, flood or noise category was found [3][4].
- **MyBuilder** charges per shortlist ("from £7") [12], but no planning-survey category was found [13].
- **Checkatrade** runs subscriptions (£30 / from £59 per month) [8]. It has a bat-survey cost guide with a "book a bat surveyor" claim [9], but no category page.
- **Rated People** is now part of Checkatrade Group and has no planning-survey category [15].

**Brokers without a published firm-side price:** batsurveycost.co.uk (passes requests to up to 3 ecologists) [31] and RenKap (instant multi-quote marketplace) [32]. Both broker planning-survey requests, but neither page publishes what firms pay. That counts as M-type presence, not M1 price evidence.

**Effect under the method:** Worklanded is a marketplace that charges firms per lead for planning surveys (bats and ecology), with a published price, so it meets the M1-evidence definition. That moves A7 to `some`, and **£26 per lead (about $35)** is the first M1 price anchor. The evidence is thin: one small vendor, 11 enquiries in 90 days, and its lead source and UK focus are not stated.

## Sources

1. https://help.bark.com/hc/en-gb/articles/13346288068892-What-is-a-credit-and-how-much-does-it-cost (search snippet: "Current credit price: £1.80 per credit")
2. https://localsearchnorth.uk/blog/is-bark-worth-it/ ; https://nobleleads.uk/blog/how-much-do-bark-credits-cost (third party)
3. https://www.bark.com/en/gb/ecologists/ (HTTP 404)
4. Search `site:bark.com/en/gb "ecological" OR "bat surveys" OR "environmental consultants" OR "flood risk"`, e.g. https://www.bark.com/en/gb/b/creative-prototyping-unit-limited/DjBoM3/
5. https://www.bark.com/en/gb/asbestos-removal-surveys/lancashire/
6. Trustpilot result in a bark.com-restricted search (link redirect via links.bark.com)
7. https://www.bark.com/en/gb/how-it-works/customers/ (snippet)
8. https://join.checkatrade.com/pricing/
9. https://www.checkatrade.com/blog/cost-guides/bat-survey-cost/ (search snippet)
10. Same page, scraped: CTA "get a local tradesperson to quote now" leads to https://www.checkatrade.com/post-a-job
11. Searches `site:checkatrade.com ecologist OR ...` and checkatrade.com-restricted search; https://www.checkatrade.com/trades/evolvepicltd
12. https://localadder.co.uk/uk-trade-lead-cost-tracker/ (quotes https://support.mybuilder.com/s/article/How-are-lead-fees-calculated)
13. Search `site:mybuilder.com OR site:ratedpeople.com ecologist OR ...` (no on-domain results)
14. https://www.mybuilder.com/questions/v/59581/bats-found-prior-to-work-commencing
15. https://www.ratedpeople.com/
16. https://localadder.co.uk/blog/checkatrade-review/ ; https://localadder.co.uk/uk-trade-lead-cost-tracker/ (third party)
17. https://cieem.net/i-am/registered-practices/cost-of-registered-practice/ (search snippet)
18. https://events.cieem.net/registered-practice-directory/ (search snippet)
19. https://www.bats.org.uk/advice/im-working-on-a-building-with-bats/getting-personalised-advice/contacting-an-ecological-consultant
20. https://cieem.net/i-need/about-our-members/members-directory/ (snippet)
21. https://cieem.net/i-need/finding-a-consultant/ (scrape: no counts)
22. https://cieem.net/i-am/registered-practices/ (scrape: no counts or fees)
23. https://association-of-noise-consultants.co.uk/member-services/members-search/
24. https://www.association-of-noise-consultants.co.uk/ (search snippet)
25. https://www.ioa.org.uk/member-search (search snippet)
26. Same page, scraped: "Information not on the page"
27. https://arbtech.co.uk/
28. https://arbtech.co.uk/protected-species/bat-surveys/
29. Search `ecologists leads join network receive bat survey enquiries pay per lead` (UK), result title for https://worklanded.com/leads/bat-surveys
30. https://worklanded.com/leads/bat-surveys (scrape)
31. https://batsurveycost.co.uk/bat-survey-for-planning-permission/
32. https://renkap.com/the-6-best-ecology-surveyors-in-the-uk-for-2024/
33. https://ecologysurveys.uk/ (snippet)
34. https://batsurveys.co.uk/ (snippet)
35. https://subitos.co.uk/news/what-bat-survey-involves/ (snippet)
36. https://batsurveys.co.uk/ (scrape; favicon path /wp-content/themes/batsurveys23/)
37. https://batsurveys.co.uk/contact/ (scrape: no company details)
38. https://ecologysurveys.uk/ (scrape; same theme path)
39. https://ecologysurveys.uk/contact/ (scrape: no company details)
40. https://biodiversitynetgainplan.co.uk/ (scrape; same theme path)
41. https://biodiversitynetgainplan.co.uk/contact/ (scrape: no company details)
42. https://uk.trustpilot.com/review/biodiversitynetgainplan.co.uk (snippet)
43. https://www.facebook.com/groups/dengienaturenetwork/posts/1591959498853142/ (snippet with gad_source link)
44. Searches for privacy/terms on the three domains: https://batsurveys.co.uk/privacy-policy/ ; https://ecologysurveys.uk/terms/ (not scraped)
45. yell.com-restricted search, e.g. https://www.yell.com/s/environmental+consultants-fernhurst.html ; https://www.yell.com/biz/total-ecology-ltd-corbridge-7195519/
46. https://environmentjob.co.uk/directory (scrape: meta only)
47. https://environmentjob.co.uk/directory?sector=56 (search snippet)

Call count: about 47 in total, over the ~35 budget because of the addendum. No domain had more than 2 scrapes.
