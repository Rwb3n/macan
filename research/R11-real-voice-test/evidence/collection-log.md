# R11 collection log

Collected 2026-10-24 by a sub-agent with Firecrawl search and scrape. Post text is in `D:/data/macan/r11/inputs.json`, not here.

## Depth (provisional; to be confirmed at the 5-post spot-check)
The method does not state how deep to read each search. Used: one Firecrawl search per source, `limit` 20, results taken in the returned order. Query form: `site:<host> <fixed search>`. Post text is stored only from `formats: ["markdown"]` scrapes. Firecrawl `query` (directQuote) answers were used only to read dates and OP text for exclusions.

## Source 1: Mumsnet, `site:mumsnet.com "bat survey" planning` (20 results)
| pos | URL | outcome |
|---|---|---|
| 1 | https://www.mumsnet.com/talk/am_i_being_unreasonable/4899413-to-think-bat-surveys-are-a-racket | taken, id 1 (18/09/2023) |
| 2 | https://www.mumsnet.com/talk/property/3952470-Nocturnal-bat-survey-results-are-we-being-taken-for-a-ride | taken, id 2 (28/06/2020). Flag: surveys largely done; OP asks about the report's further survey and licence requirements |
| 3 | https://www.mumsnet.com/talk/property/2042298-Bat-survey-for-planning-permission | excluded: before 2018 (01/04/2014) |
| 4 | https://www.mumsnet.com/talk/other_subjects/4981978-bat-surveys | excluded: not the poster's own need (housing association's survey; tenant asks if it is harassment) (10/01/2024) |
| 5 | https://www.mumsnet.com/talk/property/2160317-Tricky-planning-question | excluded: before 2018 (16/08/2014) |
| 6 | https://www.mumsnet.com/talk/property/861214-Bats-in-the-house-we-are-buying | excluded: before 2018 (14/11/2009) |
| 7 | https://www.mumsnet.com/talk/am_i_being_unreasonable/4785365-so-upset-planning-permission-granted?flipped=1&page=6 | excluded: hit is page 6, not the opening post; the thread's OP (15/04/2023) is a neighbour objecting, not a survey need |
| 8 | https://www.mumsnet.com/talk/_chat/5523238-to-extend-or-not-planning-fatigue | excluded: OP describes no survey need (bat survey only mentioned in a later OP reply) (29/04/2026) |
| 9 | https://www.mumsnet.com/talk/property/2849786-crested-newt-bat-otter-survey | excluded: before 2018 (08/02/2017) and under 25 words |
| 10 | https://www.mumsnet.com/talk/am_i_being_unreasonable/4797837-bats-in-house | excluded: no survey or planning need (bats indoors) (02/05/2023) |
| 11 | https://www.mumsnet.com/talk/am_i_being_unreasonable/5534586-aibu-if-i-disclose-to-the-estate-agents-what-is-living-in-the-houses-roof?page=2 | excluded: not the opening post; thread OP (26/05/2026) is a neighbour, not their own need |
| 12 | https://www.mumsnet.com/talk/_chat/5585953-would-bats-in-the-attic-bother-you?page=3 | excluded: not the opening post; thread OP (05/10/2026) is a seller asking about buyers, under 25 words, no survey need |
| 13 | https://www.mumsnet.com/talk/_chat/4891335-bats?flipped=1&page=1 | excluded: OP (08/09/2023) is about watching bats; no survey need |
| 14 | https://www.mumsnet.com/talk/property/5535299-mice-infestation-how-to-reflect-in-price-sale-negotiations?flipped=1&page=2 | excluded: not the opening post; thread OP (28/05/2026) is about mice, not a planning survey |
| 15 | https://www.mumsnet.com/talk/postnatal_clubs/712781-August-2008-Six-Month-Milestones-and-More?page=31 | excluded: page 31, not the opening post; postnatal club thread (title "August 2008"); not opened |
| 16 | https://www.mumsnet.com/talk/_chat/5585953-would-bats-in-the-attic-bother-you?flipped=1&page=2 | excluded: duplicate thread of pos 12 |
| 17 | https://www.mumsnet.com/talk/property/1298598-Listed-house-do-we-need-to-notify-planners | excluded: before 2018 (12/09/2011) |
| 18 | https://www.mumsnet.com/talk/am_i_being_unreasonable/4982274-who-is-bu-neighbours-heat-pump?flipped=1&page=4 | excluded: not the opening post; thread OP (10/01/2024) is about a neighbour's heat pump |
| 19 | https://www.mumsnet.com/talk/property/4553766-anyone-had-architect-design-completely-unrealistic?flipped=1&page=2 | excluded: not the opening post; thread OP (21/05/2022) is about build costs, no survey need |
| 20 | https://www.mumsnet.com/talk/property/4699273-have-you-had-historic-buildings-survey | taken, id 3 (16/12/2022) |

Source 1 yield: 3 of 20.

## Source 2: Mumsnet, `site:mumsnet.com "planning" "survey" council "do I need"` (20 results)
| pos | URL | outcome |
|---|---|---|
| 1 | https://www.mumsnet.com/talk/property/1536416-OK-I-officially-give-up-trying-to-apply-for-planning-permission?flipped=1&page=2 | excluded: not the opening post (page 2); thread OP before 2018 (08/08/2012) |
| 2 | https://www.mumsnet.com/talk/_chat/5185622-can-my-new-neighbours-get-planning-permission-for-this?page=2 | excluded: not the opening post; thread OP (12/10/2024) is a neighbour considering objecting |
| 3 | https://www.mumsnet.com/talk/property/4444648-planning-permission | excluded: asks whether planning permission is needed; no survey or report need (04/01/2022) |
| 4 | https://www.mumsnet.com/talk/property/2758185-do-i-need-an-architect-and-if-so-how-do-i-find-one | excluded: before 2018 (17/10/2016); no survey need |
| 5 | https://www.mumsnet.com/talk/property/5583164-retrospective-planning-permission-for-a-garden-fence-with-netting | excluded: asks about drawings for retrospective application; no survey or report need (27/09/2026) |
| 6 | https://www.mumsnet.com/talk/property/4338123-are-there-really-no-ramifications-for-not-obtaining-planning-permission | excluded: buyer asking about unpermitted works; no survey need for an application (01/09/2021) |
| 7 | https://www.mumsnet.com/talk/property/2917677-Planning-permission-building-regs-uncompleted-works | excluded: before 2018 (01/05/2017) |
| 8 | https://www.mumsnet.com/talk/property/2138046-Questions-to-ask-viewing-flat-with-no-planning-permission-loft-conversion?flipped=1&page=2 | excluded: not the opening post; thread OP before 2018 (20/07/2014) |
| 9 | https://www.mumsnet.com/talk/property/5455901-buying-a-house-with-an-occasional-room-and-no-br?flipped=1&page=4 | excluded: not the opening post; thread OP (06/12/2025) is a buyer's level 2 survey, not for planning |
| 10 | https://www.mumsnet.com/talk/property/4126029-Agent-has-said-i-need-to-exchange-by-Friday-before-the-damp-proof-survey-and-other-assessments?flipped=1&page=1 | excluded: buyer's damp survey, not for planning (04/01/2021) |
| 11 | https://www.mumsnet.com/talk/money-matters/731537-Do-I-need-Build-regs-to-change-a-flat-to | excluded: before 2018 (31/03/2009) |
| 12 | https://www.mumsnet.com/talk/property/5591629-party-wall-agreement-loft-conversion-already-started | excluded: neighbour's party wall question; no survey need for an application (22/10/2026) |
| 13 | https://www.mumsnet.com/talk/property/5455901-buying-a-house-with-an-occasional-room-and-no-br | excluded: duplicate thread of pos 9 |
| 14 | https://www.mumsnet.com/talk/am_i_being_unreasonable/2587373-Viewing-a-house-tomorrow-what-do-I-need-to-look-out-for?flipped=1&page=1 | excluded: before 2018 (07/03/2016) |
| 15 | https://www.mumsnet.com/Talk/property/3438530-advice-re-neighbours-planned-extension | excluded: neighbour's application, not own need (30/11/2018) |
| 16 | https://www.mumsnet.com/talk/property/4829054-did-loft-extension-years-ago-how-do-i-get-plans-of-house-updated-and-all-paperwork-in-order | excluded: paperwork for past works; no survey need for an application (16/06/2023) |
| 17 | https://www.mumsnet.com/talk/property/5570606-pull-out-after-survey | excluded: buyer's level 3 survey, not for planning (24/08/2026) |
| 18 | https://www.mumsnet.com/talk/property/4787776-survey-now-worried-about-extension-loft-conversion-paperwork?page=3 | excluded: not the opening post; thread OP (18/04/2023) is a buyer's structural survey |
| 19 | https://www.mumsnet.com/talk/property/5288772-advice-needed-landlord-is-selling | excluded: buyer in Ireland asking about a structural survey; not for planning (06/03/2025) |
| 20 | https://www.mumsnet.com/talk/property/2138046-Questions-to-ask-viewing-flat-with-no-planning-permission-loft-conversion?page=2 | excluded: duplicate thread of pos 8 |

Source 2 yield: 0 of 20.

## Source 3: MoneySavingExpert, `site:forums.moneysavingexpert.com "bat survey" planning` (14 results returned for limit 20)
| pos | URL | outcome |
|---|---|---|
| 1 | https://forums.moneysavingexpert.com/discussion/4782510/planning-permission-and-bat-surveys | excluded: before 2018 (3 October 2013) |
| 2 | https://forums.moneysavingexpert.com/discussion/6451071/phase-2-bat-emergence-survey-so-expensive-any-thoughts | taken, id 4 (5 June 2023). Handling: the forum renders the poster's emoji as an image; kept as its alt text `:open_mouth:` |
| 3 | https://forums.moneysavingexpert.com/discussion/5608014/bats-in-the-belfry | excluded: before 2018 (23 February 2017) |
| 4 | https://forums.moneysavingexpert.com/discussion/6528673/survey-results-rewiring-and-new-boiler-and-heating-system-required/p2 | excluded: page 2, not the opening post; thread OP (16 May 2024) is a buyer's level 3 survey |
| 5 | https://forums.moneysavingexpert.com/discussion/532440/planning-permission | excluded: before 2018 (20 August 2007) |
| 6 | https://forums.moneysavingexpert.com/discussion/6495556/watty-039-s-awakening/p384 | excluded: page 384, not the opening post; thread OP (1 January 2024) is a money diary |
| 7 | https://forums.moneysavingexpert.com/discussion/5681214/5-os-pleasures-in-your-day-today-part-3/p343 | excluded: not the opening post; thread OP before 2018 (18 July 2017), chat thread |
| 8 | https://forums.moneysavingexpert.com/discussion/6197328/awful-weather-typical-brits-talk/p555 | excluded: not the opening post; thread OP (3 October 2020) is about weather |
| 9 | https://forums.moneysavingexpert.com/discussion/6495556/wattys-awakening/p360 | excluded: duplicate thread of pos 6 |
| 10 | https://forums.moneysavingexpert.com/discussion/6197328/awful-weather-typical-brits-talk/p442 | excluded: duplicate thread of pos 8 |
| 11 | https://forums.moneysavingexpert.com/discussion/5681214/5-os-pleasures-in-your-day-today-part-3/p1765 | excluded: duplicate thread of pos 7 |
| 12 | https://forums.moneysavingexpert.com/discussion/6495556/wattys-awakening/p342 | excluded: duplicate thread of pos 6 |
| 13 | https://forums.moneysavingexpert.com/discussion/5681214/5-os-pleasures-in-your-day-today-part-3/p1863 | excluded: duplicate thread of pos 7 |
| 14 | https://forums.moneysavingexpert.com/discussion/6482581/deemed-contract-injustice/p2 | excluded: page 2, not the opening post; thread OP (1 November 2023) is an energy billing dispute |

Source 3 yield: 1 of 14.

## Source 4: MoneySavingExpert, `site:forums.moneysavingexpert.com "flood risk assessment" OR "ecology survey" planning` (18 results returned for limit 20; read to pos 2 so far)
| pos | URL | outcome |
|---|---|---|
| 1 | https://forums.moneysavingexpert.com/discussion/6378913/flood-risk-report-to-buy-or-not-to-buy | excluded: buyer's flood report, not for a planning application (12 August 2022) |
| 2 | https://forums.moneysavingexpert.com/discussion/6605060/planning-permission-rejected-advice-needed-on-next-steps-appeal-or-resubmit | taken, id 5 (3 May 2025) |

Stopped at 5 qualifying posts for the D7 spot-check. Word counts: whitespace split of the stored text (one script for all rows).

## Spot-check and decisions (coordinator, 2026-10-24)
- Spot-check of the first 5 passed (post 4 checked verbatim against the MSE page).
- Depth gap in method; set to 50 for all sources by Claude on 2026-10-24 after seeing only the first 20 results of sources 1-4; recorded as a defect. Sources 1-3: re-run at limit 50; only URLs beyond the first 20 (not already listed above) are considered, in returned order.
- Posts 1 and 2 count (listed building consent is within the planning system; post 2 describes surveys required by planning).
- If under 20 after all sources at depth 50: stop and report the shortfall; no added sources, no loosened rule.

## Source 4 continued (re-run at limit 50; positions 1-18 identical to the first run)
| pos | URL | outcome |
|---|---|---|
| 3 | https://forums.moneysavingexpert.com/discussion/6499820/declined-mortgage-twice-due-to-flood-risk-but-im-not-even-close-to-a-river-or-flood-plain/p2 | excluded: page 2, not the opening post; thread OP (19 January 2024) is a mortgage refusal |
| 4 | https://forums.moneysavingexpert.com/discussion/411920/flood-risk | excluded: before 2018 (27 March 2007) |
| 5 | https://forums.moneysavingexpert.com/discussion/6028654/flood-risk-assessments-environment-agency | excluded: insurance and EA flood map dispute; no survey need for a planning application (23 July 2019) |
| 6 | https://forums.moneysavingexpert.com/discussion/6622273/planning-objection-help | excluded: objecting to another party's application (6 August 2025) |
| 7 | https://forums.moneysavingexpert.com/discussion/6552659/on-site-flood-risk-appraisal | excluded: buyer's flood appraisal, not for a planning application (6 September 2024) |
| 8 | https://forums.moneysavingexpert.com/discussion/6495556/watty-039-s-awakening/p384 | excluded: duplicate of source 3 pos 6 (money diary; not the opening post) |
| 9 | https://forums.moneysavingexpert.com/discussion/4805942/architect-for-two-storey-extension | excluded: before 2018 (29 October 2013) |
| 10 | https://forums.moneysavingexpert.com/discussion/5829178/regulatory-services-objecting-to-my-extension | excluded: own application (16 April 2018) but the OP names no survey or report, only an objection on flooding grounds. Borderline; flagged |
| 11 | https://forums.moneysavingexpert.com/discussion/6119493/searches-significant-flood-risk | excluded: buyer's search report, not for planning (25 March 2020) |
| 12 | https://forums.moneysavingexpert.com/discussion/3298522/property-is-with-50m-of-potential-flood-risk | excluded: before 2018 (15 June 2011) |
| 13 | https://forums.moneysavingexpert.com/discussion/5902861/garden-land-dispute/p5 | excluded: page 5, not the opening post; thread OP (1 October 2018) is a land dispute |
| 14 | https://forums.moneysavingexpert.com/discussion/234419/flood-insurance | excluded: before 2018 (27 July 2006) |
| 15 | https://forums.moneysavingexpert.com/discussion/5813989/searches-came-back-with-flood-risk-need-advice | excluded: buyer's environmental search and insurance (20 March 2018) |
| 16 | https://forums.moneysavingexpert.com/discussion/5854932/planning-and-building-regs-for-recent-purchase | excluded: asks about architects' fees; OP names no survey or report (11 June 2018) |
| 17 | https://forums.moneysavingexpert.com/discussion/6573672/home-blighted-by-environment-agency | excluded: challenging EA flood map to sell; not for a planning application (8 December 2024) |
| 18 | https://forums.moneysavingexpert.com/discussion/6495556/wattys-awakening/p445 | excluded: duplicate thread of pos 8 |
| 19-39, 41-50 | (pubmed, journals, scribd, youtube, linkedin, facebook, wsdot, govdelivery) | excluded: not the MoneySavingExpert forum (search returned off-site results despite site: filter) |
| 40 | https://forums.moneysavingexpert.com/discussion/6575591/aviva-home-insurance-new-flood-exclusions | excluded: insurance exclusions; no planning survey need (17 December 2024) |

Source 4 yield: 1 of 50.

## Source 1 continued (re-run at limit 50: 36 results returned; positions 1-20 identical to the first run)
| pos | URL | outcome |
|---|---|---|
| 21 | https://www.mumsnet.com/talk/general_health/5483933-the-great-cancer-recovery-part-5?page=10 | excluded: page 10, not the opening post; thread OP (31/01/2026) is a cancer recovery support thread |
| 22 | https://www.mumsnet.com/talk/property/4280815-Land-with-restrictive-covenant-and-contaminated | excluded: prospective land buyer; OP names no survey or report need (26/06/2021) |
| 23 | https://www.mumsnet.com/talk/_chat/5131563-bat-bite | excluded: about a possible bat bite (31/07/2024) |
| 24 | https://www.mumsnet.com/talk/other_subjects/222287-what-should-i-call-my-new-house | excluded: before 2018 (03/10/2006) |
| 25 | https://www.mumsnet.com/talk/property/4177541-Buying-a-listed-building?page=2 | excluded: page 2, not the opening post; thread OP (26/02/2021) is a buyer asking about listed buildings, no survey need |
| 26 | https://www.mumsnet.com/talk/property/5393957-how-do-you-buy-a-house-thats-currently-2-flats | excluded: mortgage question; no survey or report need (18/08/2025) |
| 27 | https://www.mumsnet.com/talk/pregnancy/4570441-minsters-9th-side-car-who-runs-the-world-girls-where-are-all-the-boys?page=11 | excluded: page 11, not the opening post; pregnancy group thread (2022) |
| 28 | https://www.mumsnet.com/talk/property/4941581-tell-me-the-worst-bits-and-best-bits-of-living-in-an-18th-century-grade-ii-listed-house?page=2 | excluded: page 2, not the opening post; thread OP (13/11/2023) asks about living in a listed house, no survey need |
| 29 | https://www.mumsnet.com/talk/am_i_being_unreasonable/2562803-To-think-gumtree-is-now-as-bad-as-freecycle-for-loons?flipped=1&page=2 | excluded: not the opening post; thread OP before 2018 (02/02/2016) |
| 30 | https://www.mumsnet.com/talk/am_i_being_unreasonable/4275497-Neighbour-has-built-a-bar?page=10 | excluded: page 10, not the opening post; thread OP (20/06/2021) is a neighbour dispute |
| 31 | https://www.mumsnet.com/talk/property/4553766-anyone-had-architect-design-completely-unrealistic | excluded: duplicate thread of pos 19 |
| 32 | https://www.mumsnet.com/talk/property/5246924-demolition-and-neighbours | excluded: permission already granted; asbestos and party-wall surveys for demolition, not for a planning application (07/01/2025) |
| 33 | https://www.mumsnet.com/talk/property/4941581-tell-me-the-worst-bits-and-best-bits-of-living-in-an-18th-century-grade-ii-listed-house?flipped=1&page=1 | excluded: duplicate thread of pos 28 |
| 34 | https://www.mumsnet.com/talk/general_health/5483933-the-great-cancer-recovery-part-5?flipped=1&page=5 | excluded: duplicate thread of pos 21 |
| 35 | https://www.mumsnet.com/talk/property/4153887-Delisting-a-property | excluded: asks about delisting; under 25 words; no survey need (02/02/2021) |
| 36 | https://www.mumsnet.com/talk/general_health/5483933-the-great-cancer-recovery-part-5?page=11 | excluded: duplicate thread of pos 21 |

Source 1 yield: 3 of 36.

## Source 2 continued (re-run at limit 50: 50 results; positions 1-20 identical to the first run)
Opened and checked:
| pos | URL | outcome |
|---|---|---|
| 21 | https://www.mumsnet.com/talk/property/3981175-Extension-with-no-planning-and-now-subsiding | excluded: old unpermitted extension and subsidence; no survey need for an application (29/07/2020) |
| 23 | https://www.mumsnet.com/talk/property/2903126-are-we-nightmare-buyers?flipped=1&page=1 | excluded: before 2018 (14/04/2017); buyer |
| 25 | https://www.mumsnet.com/talk/property/4238365-perfect-property-has-massive-oak-tree-in-front-garden | excluded: buyer's survey question, not for a planning application |
| 28 | https://www.mumsnet.com/talk/property/2933877-installing-skylights-what-do-I-need-to-consider | excluded: before 2018 (19/05/2017) |
| 33 | https://www.mumsnet.com/talk/property/5524108-what-works-does-this-house-need | excluded: prospective buyer asking about works; no survey need for an application (01/05/2026) |
| 34 | https://www.mumsnet.com/talk/property/4155631-Illegal-drain | excluded: drainage repair; no planning application (03/02/2021) |
| 41 | https://www.mumsnet.com/talk/property/5583164-retrospective-planning-permission-for-a-garden-fence-with-netting | excluded: duplicate of pos 5 |
| 48 | https://www.mumsnet.com/talk/property/4238365-perfect-property-has-massive-oak-tree-in-front-garden | excluded: duplicate of pos 25 |
| 49 | https://www.mumsnet.com/talk/home_ed/5480508-when-do-i-need-to-start-making-a-plan-to-home-ed?flipped=1&page=2 | excluded: duplicate of pos 35 |
| 50 | https://www.mumsnet.com/talk/property/1482404-What-do-I-need-to-do-to-rent-my-house-out | excluded: duplicate of pos 40 |

Not opened (title and search snippet show a topic unrelated to a survey for one's own planning application; recorded so the reader can check): 22 zoo licence (thread id 805501, pre-2018 range), 24 secondary school admissions (page 3), 26 solicitor for mis-sold property, 27 buying a house without building regs for a wet room, 29 childminding self-employment, 30 viewing Victorian houses (buyer), 31 first-time buyer moving checklist, 32 how much to live on (2006), 35 home education (page 2), 36 FENSA certificate (page 3), 37 buyers/sellers waiting room (page 3), 38 budget hedging (page 6), 39 breastfeeding, 40 renting out a house, 42 dog bereavement, 43 16-year-old moving out, 44 air traffic control videos, 45 protein goals, 46 pulling out of a purchase after survey, 47 Universal Credit. URLs as returned by the search (id 01a16ec4-2ead-76b8-aa2e-c4f7dc59d954). Defect: these were judged on title and snippet, not the opening post.

Source 2 yield: 0 of 50.

## Source 3 continued (re-run at limit 50: the same 14 results returned; nothing beyond position 14)
Source 3 yield: 1 of 14.

## Source 5: Reddit r/HousingUK or r/DIYUK, `planning survey council (site:reddit.com/r/HousingUK OR site:reddit.com/r/DIYUK)` (50 results, all r/HousingUK)
Skipped: cannot be read in full. Tried on the first relevant thread (https://www.reddit.com/r/HousingUK/comments/1cazu0m/when_is_a_bat_survey_needed_for_planning/):
- Firecrawl scrape of the `.json` URL: refused ("we do not support this site").
- Direct fetch of `https://www.reddit.com/.../.json`: HTTP 403.
- Direct fetch of `https://old.reddit.com/.../.json`: HTTP 302 (redirect, no JSON).
No Reddit post was read, so none is taken. Search result list kept in the search response (id 01a16ec5-193d-771b-9e01-f7ee27ff3c9a).

## Final
- Qualifying posts: 5 of the 20 required. Shortfall: 15. Per the coordinator, no sources added and no rule loosened.
- Per source: 1 Mumsnet "bat survey" 3 of 36; 2 Mumsnet "do I need" 0 of 50; 3 MSE "bat survey" 1 of 14; 4 MSE flood/ecology 1 of 50; 5 Reddit skipped (unreadable).
- Defects: depth gap in the method (set to 50 after seeing the first 20); 20 source-2 results judged on title and snippet rather than the opening post; one borderline exclusion (source 4 pos 10, own application with a flooding objection but no survey named); post 4's emoji kept as its alt text; Firecrawl `query` answers were used to read dates and OPs for exclusions (model-mediated, not verbatim receipts).
