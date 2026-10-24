# R12 Part B: firms' own quote and enquiry forms (reader B)

**Search:** "<survey name> quote UK" (Firecrawl web search, 2026-10-24, 10 results each). Firms were taken in search order where the site has a quote or enquiry form.
- **What counts as a form:** a form on the result page itself, or a quote page linked from it as "quote", "booking" or "enquiry" (for example "Get a quote", "REQUEST A FIXED QUOTE", "START QUOTE TODAY").
- **What does not count:** a generic "Contact us" page alone, phone or email only, non-firms (Facebook, Checkatrade, Reddit, council or gov.uk pages, Historic England).
- **Sample:** 15 distinct firms; each survey has at least 2 firms.
- **Nothing was entered, typed or submitted** in any form.

**How each form was read (the "read" column):**
- **static:** the form's HTML from a Firecrawl scrape.
- **DOM:** the rendered page in an isolated DevTools page (context `r12b`). A read-only script listed every input, select and textarea with its label, placeholder, required flag and options. Nothing was clicked except Bat Surveyor's step-1 "Continue", with its default radio button left as it was.
- **page code:** labels taken from the form's own HTML or script for steps after step 1.
- **(from page code, past gate)** or **(past gate; read from DOM, nothing entered):** the field comes after a step that asks for contact details or a real address. It was read without entering anything. Coordinator decision, 2026-10-24: these rows are kept, and the deviation goes in result.md.

**Search order per survey.** Each entry is position, site, then what was found; "taken" means the firm went into the sample.
- **Bat:**
  1. arbtech.co.uk: taken.
  2. facebook.com: not a firm.
  3. checkatrade.com: not a firm.
  4. westernecology.co.uk: no form; phone and email only.
  5. bat-surveyor.co.uk: taken.
- **Preliminary ecological appraisal (PEA):**
  1. chaseecology.co.uk: taken, through its linked /quote page.
  2. westernecology.co.uk: no form on the page; only a contact-us link.
  3. arbtech.co.uk: taken.
- **Great crested newt (GCN):**
  1. arbtech.co.uk: taken.
  2. astuteecology.co.uk: taken; an enquiry form on the page.
- **Flood risk assessment (FRA):**
  1. unda.co.uk: taken.
  2. arbtech.co.uk: taken.
  3. urban-water.co.uk: taken, to reach 15 firms.
- **Tree:**
  1. arbinnovators.co.uk: taken; an enquiry form on the page.
  2. arbtech.co.uk: taken.
  3. indigosurveys.co.uk: taken through "START QUOTE TODAY", to reach 15 firms.
- **Heritage:**
  1. amssurveys.co.uk: taken through its /instant-quote page, an embedded Surventrix form.
  2. get-planning.co.uk: taken through /get-a-quote/.
- **Noise:**
  1. harmil-environmental.co.uk: taken; an enquiry form on the page.
  2. enviropass.co.uk: taken; two forms on the page.
- **Land contamination:**
  1. contaminatedlandsurveys.com: taken.
  2. soilsuk.com: taken through "Get a quote"; the service is disposal of contaminated soil, not a site assessment (see notes).
  3. reddit.com: not a firm.
  4. stmenvironmental.co.uk: taken.

Every survey had at least 2 firms with a form in search order; none came up empty.

Arbtech uses one shared form (Gravity Forms id 17, 3 steps) on every service page. Survey-specific questions appear by condition: questions hidden on a page are listed as "hidden on this page" and are not counted for that survey.

## Table

| # | firm | survey | URL | field label (verbatim) | options (verbatim) | required? | read / notes |
|---|---|---|---|---|---|---|---|
| 1 | Arbtech | bat survey | https://arbtech.co.uk/protected-species/bat-surveys/ | Email address (under "Where shall we send your free quote to?"; step 1 of 3) | | yes (*) | static |
| 2 | Arbtech | bat survey | https://arbtech.co.uk/protected-species/bat-surveys/ | Address (under "Great. What is the address of the property you need a survey on?"; step 2) sub-fields: Address Line 1 / City / Post code | | yes (*) (from page code, past gate) | static |
| 3 | Arbtech | bat survey | https://arbtech.co.uk/protected-species/bat-surveys/ | Nearly finished! Please tell us about the survey you need. (placeholder "Please provide the type of survey you need and an overview of your project...") | | yes (*) (from page code, past gate) | static |
| 4 | Arbtech | bat survey | https://arbtech.co.uk/protected-species/bat-surveys/ | What is your full name? | | yes (*) (from page code, past gate) | static |
| 5 | Arbtech | bat survey | https://arbtech.co.uk/protected-species/bat-surveys/ | What is your telephone number? | | yes (*) (from page code, past gate) | static |
| 6 | Arbtech | bat survey | https://arbtech.co.uk/protected-species/bat-surveys/ | What is your survey for? (hidden on this page; shown on the FRA page, row 48) | Residential planning permission / Commercial planning permission / Property purchase / Insurance / Other / Not Sure | yes (*) when shown (from page code, past gate) | static; not counted for bat |
| 7 | Bat Surveyor | bat survey (PRA) | https://bat-surveyor.co.uk/ (embedded form https://booking-site-theta.vercel.app/book) | Who's this for? | I'm the property owner / I'm an agent/architect booking on behalf of a client | radio, one preselected | DOM (step 1, live) |
| 8 | Bat Surveyor | bat survey (PRA) | same | Where's the property? (map search "Search For a Place"), then "I confirm the pin is in the right place (drag to move it to the property)" and "Confirm the address (filled in from the map above — correct anything that's wrong)": House name or number / Street (if there is one) / Address line 2 (optional) / Town / city / County (optional) / Postcode | | pin checkbox, house name or number, town / city, postcode required | DOM (step 2 live); sub-labels from page code, past gate |
| 9 | Bat Surveyor | bat survey (PRA) | same | Would you like to secure a date for your client now? (agent only) "They can reschedule it later if it turns out not to suit them." | Yes — pick a day now / No — send me a quote first, with a link for my client to pick a date | yes for agents (from page code, past gate) | page code |
| 10 | Bat Surveyor | bat survey (PRA) | same | When would suit? (pick from listed days, "— arriving approximately" time) | list of available days | choose one (from page code, past gate) | page code |
| 11 | Bat Surveyor | bat survey (PRA) | same | Your details (agent: "Your details (the agent)" and "Your client's details"): Name / Email / Phone | | yes; client's details may be left blank in agent quote-first mode ("(leave blank if not known yet)") (from page code, past gate) | page code |
| 12 | Bat Surveyor | bat survey (PRA) | same | Property type (helper "e.g. house and detached garage, two stone barns, bungalow") | | yes, except agent quote-first mode (from page code, past gate) | page code |
| 13 | Bat Surveyor | bat survey (PRA) | same | Brief description of the project | | yes, except agent quote-first mode (from page code, past gate) | page code |
| 14 | Bat Surveyor | bat survey (PRA) | same | Will the invoice go to a different address than the property? then "Confirm the invoicing address ...": Address line 1 / Address line 2 (optional) / Town / city / County (optional) / Postcode | checkbox | address line 1, town / city, postcode required if ticked (from page code, past gate) | page code |
| 15 | Bat Surveyor | bat survey (PRA) | same | Known H&S issues (e.g. asbestos) | None known (checkbox); agent quote-first mode: "Known H&S issues (e.g. asbestos) — optional" | text required unless "None known" (from page code, past gate) | page code |
| 16 | Bat Surveyor | bat survey (PRA) | same | Anything else I should know? (optional) | | no (from page code, past gate) | page code |
| 17 | Bat Surveyor | bat survey (PRA) | same | I agree to my details being stored and used to carry out the survey and process the invoice. | checkbox | yes (from page code, past gate) | page code |
| 18 | Chase Ecology | PEA | https://chaseecology.co.uk/quote (linked "quote" from https://chaseecology.co.uk/ecology-services/preliminary-ecological-appraisals/) | Name (placeholder "E.g. John Smith") | | yes (*) | static |
| 19 | Chase Ecology | PEA | same | Email Address | | yes (*) | static |
| 20 | Chase Ecology | PEA | same | Phone Number | | no | static |
| 21 | Chase Ecology | PEA | same | What survey do you need? ("Please select which survey you require.") | Choose a Survey / Preliminary Ecological Appraisal / Bat Survey (inc. Roost Assessment) / Bat Survey (dusk/dawn only) / Newt Survey / Nesting Bird Survey / Reptile Survey / Other | no | static |
| 22 | Chase Ecology | PEA | same | Address of Development (placeholder "E.g. 4 Teal Road") / City / County / Postal Code | | no | static |
| 23 | Chase Ecology | PEA | same | About Your Development (placeholder "Please explain in as much detail possible about your development. Please upload a redline boundary and any supporting documents."; limit 0 / 500 words) | | no | static |
| 24 | Chase Ecology | PEA | same | Upload Your Red Line Boundary | file | no | static |
| 25 | Chase Ecology | PEA | same | Upload Any Other Supporting Documents | file | no | static |
| 26 | Arbtech | PEA | https://arbtech.co.uk/ecology-surveys/preliminary-ecological-appraisal/ | Email address | | yes (*) | static; same form 17 as rows 1-5 |
| 27 | Arbtech | PEA | same | Address: Address Line 1 / City / Post code | | yes (*) (from page code, past gate) | static |
| 28 | Arbtech | PEA | same | Nearly finished! Please tell us about the survey you need. (placeholder "Please provide the type of survey you need and an overview of your project...") | | yes (*) (from page code, past gate) | static |
| 29 | Arbtech | PEA | same | What is your full name? | | yes (*) (from page code, past gate) | static |
| 30 | Arbtech | PEA | same | What is your telephone number? | | yes (*) (from page code, past gate) | static |
| 31 | Arbtech | GCN | https://arbtech.co.uk/protected-species/newt-surveys/ | Email address | | yes (*) | static; same form 17 |
| 32 | Arbtech | GCN | same | Address: Address Line 1 / City / Post code | | yes (*) (from page code, past gate) | static |
| 33 | Arbtech | GCN | same | Nearly finished! Please tell us about the survey you need. (placeholder as row 28) | | yes (*) (from page code, past gate) | static |
| 34 | Arbtech | GCN | same | What is your full name? | | yes (*) (from page code, past gate) | static |
| 35 | Arbtech | GCN | same | What is your telephone number? | | yes (*) (from page code, past gate) | static |
| 36 | Astute Ecology | GCN | https://www.astuteecology.co.uk/copy-of-bat-surveys | Name * (placeholder) | | yes | static |
| 37 | Astute Ecology | GCN | same | Email * (placeholder) | | yes | static |
| 38 | Astute Ecology | GCN | same | Phone (placeholder) | | no | static |
| 39 | Astute Ecology | GCN | same | Subject (placeholder) | | no | static |
| 40 | Astute Ecology | GCN | same | Message (placeholder) | | no | static |
| 41 | Unda Consulting | FRA | https://www.unda.co.uk/flood-risk-assessments/ | Name | | yes (*) | static |
| 42 | Unda Consulting | FRA | same | Phone | | yes (*) | static; a second "Phone" field is a honeypot ("This field is for validation purposes and should be left unchanged."), not counted |
| 43 | Unda Consulting | FRA | same | Email | | yes (*) | static |
| 44 | Unda Consulting | FRA | same | Message | | yes (*) | static |
| 45 | Arbtech | FRA | https://arbtech.co.uk/flood-risk-assessment/ | Email address | | yes (*) | static; form 17 |
| 46 | Arbtech | FRA | same | Address: Address Line 1 / City / Post code | | yes (*) (from page code, past gate) | static |
| 47 | Arbtech | FRA | same | What type of survey do you need? | Flood risk survey / Drainage strategy / SuDS / Other / Not Sure | yes (*) (from page code, past gate) | static; shown by condition on this page |
| 48 | Arbtech | FRA | same | What is your survey for? | Residential planning permission / Commercial planning permission / Property purchase / Insurance / Other / Not Sure | yes (*) (from page code, past gate) | static; shown by condition on this page |
| 49 | Arbtech | FRA | same | Please tell us anything else you think we need to know about your project (placeholder "Please provide the type of survey you need and an overview of your project...") | | yes (*) (from page code, past gate) | static; on this page it replaces "Nearly finished! ..." |
| 50 | Arbtech | FRA | same | What is your full name? | | yes (*) (from page code, past gate) | static |
| 51 | Arbtech | FRA | same | What is your telephone number? | | yes (*) (from page code, past gate) | static |
| 52 | Urban Water | FRA | https://urban-water.co.uk/flood-risk-assessment-cost/ | First Name / Last Name | | no | DOM |
| 53 | Urban Water | FRA | same | Email | | yes | DOM |
| 54 | Urban Water | FRA | same | Telephone | | yes | DOM |
| 55 | Urban Water | FRA | same | Site Address | | no | DOM |
| 56 | Urban Water | FRA | same | File upload | file | no | DOM |
| 57 | Urban Water | FRA | same | Message | | no | DOM; the page also embeds a Zoho "ContactUs" iframe, not read |
| 58 | Arb Innovators | tree survey | https://www.arbinnovators.co.uk/tree-survey-cost | First name | | yes | static; heading "Say hello. We're waiting!" |
| 59 | Arb Innovators | tree survey | same | Last name | | no | static |
| 60 | Arb Innovators | tree survey | same | Email | | yes | static |
| 61 | Arb Innovators | tree survey | same | Phone Number | | yes | static |
| 62 | Arb Innovators | tree survey | same | Write a message | | no | static |
| 63 | Arbtech | tree survey | https://arbtech.co.uk/tree-surveys/ | Email address | | yes (*) | static; form 17 |
| 64 | Arbtech | tree survey | same | Address: Address Line 1 / City / Post code | | yes (*) (from page code, past gate) | static |
| 65 | Arbtech | tree survey | same | Nearly finished! Please tell us about the survey you need. (placeholder as row 28) | | yes (*) (from page code, past gate) | static |
| 66 | Arbtech | tree survey | same | What is your full name? | | yes (*) (from page code, past gate) | static |
| 67 | Arbtech | tree survey | same | What is your telephone number? | | yes (*) (from page code, past gate) | static |
| 68 | Indigo Surveys | tree survey | https://indigosurveys.co.uk/form/ (linked "START QUOTE TODAY" from https://indigosurveys.co.uk/tree-survey-cost/) | First Name / Last Name | | yes | DOM |
| 69 | Indigo Surveys | tree survey | same | Email Address | | yes | DOM |
| 70 | Indigo Surveys | tree survey | same | Phone Number | | yes | DOM |
| 71 | Indigo Surveys | tree survey | same | Survey Site Address / Postcode | | yes | DOM |
| 72 | Indigo Surveys | tree survey | same | What type of Survey do you require? | Domestic / Commercial | yes | DOM |
| 73 | Indigo Surveys | tree survey | same | Which Survey are you interested in? | Tree Survey / Ecology Survey / BS5837 Tree Survey / Measured Survey / Topographical Survey / Arboricultural Survey / Bat Survey | yes | DOM |
| 74 | AMS Surveys | heritage statement | https://2.surventrix.com/instant_quotes/new?token=f2f8915a26c2cb0311e7510b1110b78a (embedded in https://www.amssurveys.co.uk/instant-quote, linked "GET A HERITAGE STATEMENT QUOTE" from https://www.amssurveys.co.uk/heritage-statements) | Survey address ("Find the address..." search, or "Enter address manually": Survey address 1 / Survey address 2 / Survey address 3 / Survey city / Survey postcode) | | not marked | DOM; "Instant Quote / Get an instant quote in 2 easy steps...." |
| 75 | AMS Surveys | heritage statement | same | Property Designation | Residential / Commercial | not marked | DOM |
| 76 | AMS Surveys | heritage statement | same | Property type | Custom Text / Bungalow: Detached / Bungalow: Semi-detached / Bungalow: Terrace / Bungalow: Mid terrace / Bungalow: End terrace / Bungalow: Link Detached / Flat: Flat / Flat: Converted (Flats Only) / Flat: Purpose Built (Flats Only) / House: Detached / House: Semi-detached / House: Terrace / House: Mid terrace / House: End terrace / House: Link Detached / Maisonette: Detached / Maisonette: Semi-Detached / Maisonette: Terrace / Maisonette: Mid terrace / Maisonette: End terrace / Town house / Cottage | yes | DOM |
| 77 | AMS Surveys | heritage statement | same | Listed Building | Please Select / Yes / No / Not Known | yes | DOM |
| 78 | AMS Surveys | heritage statement | same | Estimated Value | number | yes | DOM |
| 79 | AMS Surveys | heritage statement | same | No. of Bedrooms | number | yes | DOM |
| 80 | AMS Surveys | heritage statement | same | Year Built | number | no | DOM |
| 81 | AMS Surveys | heritage statement | same | Client Concerns / Additional Comments: "Have you any concerns regarding the property and any issues which it may have, that you would like to highlight to the surveyor before their visit?" (then "Client Concerns Comment..") | Yes / No | no | DOM |
| 82 | AMS Surveys | heritage statement | same | Title / Name / Email / Contact Number | Title: Mr / Mrs / Miss / Dr / Mr & Mrs | name, email, contact number yes | DOM; step 2 |
| 83 | AMS Surveys | heritage statement | same | How did you hear about us? | Please Select / RICS Find a Surveyor / Web search / Friend/Family member / Facebook / Estate Agent / Mortgage Advisor / Solicitor / Returning client / Other | no | DOM; step 2 |
| 84 | AMS Surveys | heritage statement | same | Choose your survey type | (76 options after "Please select", counted from the DOM list, including) Heritage Statement / Heritage Statement - Commercial / Listed Building Consent & Heritage Statement / Historic Building Record Level 1 ... Level 4 / Heritage - Written Scheme of Investigation / General Enquiry or Unsure of Survey Type | yes | DOM; step 2; a general surveying-quote platform, not heritage-specific |
| 85 | Get Planning and Architecture | heritage statement | https://www.get-planning.co.uk/get-a-quote/ (linked "Get a quote" from https://www.get-planning.co.uk/planning-architecture/statements/heritage-statement/) | NAME*: First / Last | | yes | DOM; "Company" is a honeypot ("This field is for validation purposes ..."), not counted |
| 86 | Get Planning and Architecture | heritage statement | same | Mobile Phone Number* | | yes | DOM |
| 87 | Get Planning and Architecture | heritage statement | same | Email* | | yes | DOM |
| 88 | Get Planning and Architecture | heritage statement | same | Outline of Project ("Please describe your project in as much detail as you wish and what you would like to achieve."; placeholder "Information you give us here will help us understand how we can best help you.") | | no | DOM |
| 89 | Get Planning and Architecture | heritage statement | same | SERVICE REQUIRED | Planning Application / Building Regulations / Planning Appeal / Enforcement / Planning, Heritage or Design & Access Statement / Other (checkboxes) | no | DOM |
| 90 | Get Planning and Architecture | heritage statement | same | PROPERTY TYPE | House / Flat / Land / Commercial (Office/Retail/Restaurant etc) / Other (checkboxes) | no | DOM |
| 91 | Get Planning and Architecture | heritage statement | same | SITE ADDRESS*: Street Address / Post Code | | yes | DOM |
| 92 | Get Planning and Architecture | heritage statement | same | BILLING ADDRESS ("If different from the site address"): Street Address / Post Code | | no | DOM |
| 93 | Get Planning and Architecture | heritage statement | same | Relevant Files ("Please uplad here any any photos, documents or architectural drawings that would provide us with useful information about your project.") | file | no | DOM |
| 94 | Get Planning and Architecture | heritage statement | same | Other information ("Include here any other information that you think might be useful for us to know.") | | no | DOM |
| 95 | Get Planning and Architecture | heritage statement | same | CONSENT*: I agree to the privacy policy. | checkbox | yes | DOM |
| 96 | Harmil Environmental | noise impact assessment | https://www.harmil-environmental.co.uk/noise-impact-assessments | Name * (placeholder) | | yes | DOM |
| 97 | Harmil Environmental | noise impact assessment | same | Email * (placeholder) | | yes | DOM |
| 98 | Harmil Environmental | noise impact assessment | same | Subject (placeholder) | | no | DOM |
| 99 | Harmil Environmental | noise impact assessment | same | Message (placeholder) | | no | DOM |
| 100 | Enviropass | noise impact assessment | https://enviropass.co.uk/locations/noise-impact-assessment-in-london/ | Email address* (form "Your Free Quote", "Step 1 of 3 Where shall we email your quote?") | | yes | DOM |
| 101 | Enviropass | noise impact assessment | same | Address Line 1* / City* / Post code* | | yes (past gate; read from DOM, nothing entered) | DOM |
| 102 | Enviropass | noise impact assessment | same | Almost there! What survey do you need? (placeholder "Please provide the type of survey you need and an overview of your project...") | | yes (past gate; read from DOM, nothing entered) | DOM |
| 103 | Enviropass | noise impact assessment | same | What is your full name?* | | yes (past gate; read from DOM, nothing entered) | DOM |
| 104 | Enviropass | noise impact assessment | same | What is your telephone number?* | | yes (past gate; read from DOM, nothing entered) | DOM |
| 105 | Enviropass | noise impact assessment | same | Second form on the page ("where shall we your quote to? ... contact us"): Name* / Email* / Phone number / Site address / Message* | | Name, Email, Message yes | DOM; counted together with rows 100-104 as one firm |
| 106 | Contaminated Land Surveys | land contamination | https://contaminatedlandsurveys.com/ | Which email address shall we send your free quote to? | | yes | DOM |
| 107 | Contaminated Land Surveys | land contamination | same | What is the address of the property you need a survey on? Address*: Address Line 1 / City / Post code | | yes (past gate; read from DOM, nothing entered) | DOM |
| 108 | Contaminated Land Surveys | land contamination | same | Nearly finished! Please provide some details about your project...* (heading "Nearly finished! Please tell us about your project and the type of survey you have been asked for..."; placeholder "You can tell us about your project here...") | | yes (past gate; read from DOM, nothing entered) | DOM |
| 109 | Contaminated Land Surveys | land contamination | same | What is your first name?* / What is your surname?* | | yes (past gate; read from DOM, nothing entered) | DOM |
| 110 | Contaminated Land Surveys | land contamination | same | What is your telephone number?* | | yes (past gate; read from DOM, nothing entered) | DOM |
| 111 | Soils UK | land contamination | https://www.soilsuk.com/contaminated-soil-quotes (linked "Get a quote" from https://www.soilsuk.com/news/what-is-the-contaminated-land-law-in-the-uk) | CONTACT DETAILS: Name / Email / Company / Phone / Job title (placeholders) | | yes | DOM; service is disposal of contaminated soil, not a site assessment |
| 112 | Soils UK | land contamination | same | Brief site history | | yes | DOM |
| 113 | Soils UK | land contamination | same | Anticipated volume of surplus | | yes | DOM |
| 114 | Soils UK | land contamination | same | Timescales for disposal | | yes | DOM |
| 115 | Soils UK | land contamination | same | Attachments including reports, photos and data (.jpg, .pdf, .wordx) ("Upload File", "Max file size 10MB.") | file | no | DOM |
| 116 | STM Environmental | land contamination | https://stmenvironmental.co.uk/consultancy/geoenvironmental/contaminated-land-risk-assessments/ | Name * | | yes | DOM |
| 117 | STM Environmental | land contamination | same | Phone Number | | no | DOM |
| 118 | STM Environmental | land contamination | same | Email * | | yes | DOM |
| 119 | STM Environmental | land contamination | same | Company | | no | DOM |
| 120 | STM Environmental | land contamination | same | Location * | | yes | DOM |
| 121 | STM Environmental | land contamination | same | Enquiry Details | | no | DOM |
| 122 | STM Environmental | land contamination | same | File Upload | file | no | DOM |
| 123 | STM Environmental | land contamination | same | How did you hear about us? * then "Please say how you heard about us *" | Search engine (Google, Bing etc) / Social Media / Email / Word of Mouth / Referral / Other | yes | DOM |
| 124 | STM Environmental | land contamination | same | Keep in touch with me / Consent for storing submitted data * | checkboxes | consent yes | DOM |

## Distinct fields per survey (count = number of firms asking)

Fields are grouped into types, which is reader B's grouping and an inference. The rows each count rests on are given in brackets. Contact fields (name, email, phone) are listed once per survey.

**Bat survey (2 firms: Arbtech, Bat Surveyor)**
- Site address or postcode: 2 [2, 8]
- Description of the project or survey needed (free text): 2 [3, 13]
- Name: 2; email: 2; phone: 2 [1, 4, 5, 11]
- Client type (owner or agent/architect): 1 [7]
- Pin on map confirmed: 1 [8]
- Preferred date (from available days): 1 [10]
- Agent: book a date now or quote first: 1 [9]
- Property type (e.g. house and detached garage, stone barns, bungalow): 1 [12]
- Invoice address if different: 1 [14]
- Known H&S issues (e.g. asbestos): 1 [15]
- Anything else: 1 [16]
- Data consent: 1 [17]

**PEA (2 firms: Chase Ecology, Arbtech)**
- Site address: 2 [22, 27]
- Description of the development or survey (free text): 2 [23, 28]
- Name: 2; email: 2; phone: 2 (Chase: optional) [18-20, 26, 29, 30]
- Survey type (select): 1 [21]
- Red line boundary upload: 1 [24]
- Other supporting documents upload: 1 [25]

**Great crested newt (2 firms: Arbtech, Astute Ecology)**
- Name: 2; email: 2; phone: 2 (Astute: optional) [31, 34-38]
- Free-text description or message: 2 [33, 40]
- Site address: 1 [32]
- Subject: 1 [39]

**Flood risk assessment (3 firms: Unda, Arbtech, Urban Water)**
- Name: 3; email: 3; phone: 3 [41-43, 45, 50-54]
- Free-text message or project details: 3 [44, 49, 57]
- Site address: 2 [46, 55]
- Survey type (Flood risk survey / Drainage strategy / SuDS / Other): 1 [47]
- Purpose (residential planning / commercial planning / property purchase / insurance / other): 1 [48]
- File upload: 1 [56]

**Tree survey (3 firms: Arb Innovators, Arbtech, Indigo Surveys)**
- Name: 3; email: 3; phone: 3 [58-61, 63, 66-70]
- Site address or postcode: 2 [64, 71]
- Free-text message or survey needed: 2 [62, 65]
- Domestic or commercial: 1 [72]
- Which survey (Tree / BS5837 / Arboricultural / ...): 1 [73]

**Heritage statement (2 firms: AMS Surveys, Get Planning and Architecture)**
- Site address and postcode: 2 [74, 91]
- Property type: 2 (AMS: a select list of dwelling types; Get Planning: House / Flat / Land / Commercial / Other) [76, 90]
- Service or survey type: 2 [84, 89]
- Name: 2; email: 2; phone: 2 [82, 85-87]
- Residential or commercial: 1 [75]
- Listed building (Yes / No / Not Known): 1 [77]
- Estimated value: 1 [78]
- Number of bedrooms: 1 [79]
- Year built: 1 [80]
- Concerns about the property: 1 [81]
- Free-text project outline: 1 [88]
- Other information: 1 [94]
- Billing address if different: 1 [92]
- Files (photos, documents, drawings): 1 [93]
- How did you hear about us: 1 [83]
- Privacy consent: 1 [95]

**Noise impact assessment (2 firms: Harmil, Enviropass)**
- Name: 2; email: 2 [96, 97, 100, 103, 105]
- Free-text message or survey needed: 2 [99, 102, 105]
- Phone: 1 [104, 105]
- Site address: 1 [101, 105]
- Subject: 1 [98]

**Land contamination (3 firms: Contaminated Land Surveys, Soils UK, STM)**
- Name: 3; email: 3; phone: 3 (STM: optional) [106, 109-111, 116-118]
- Site address or location: 2 [107, 120]
- Free-text project or enquiry details: 2 [108, 121]
- File upload (reports, photos, data): 2 [115, 122]
- Company: 2 [111, 119]
- Job title: 1 [111]
- Brief site history: 1 [112]
- Anticipated volume of surplus: 1 [113]
- Timescales for disposal: 1 [114]
- How did you hear about us: 1 [123]
- Consent and marketing opt-in: 1 [124]

**Across all 15 firms:**
- Every firm asks for name and email.
- 13 of 15 have a free-text box that is always shown. Indigo has none; AMS's only free text appears after answering "Yes" to concerns.
- 10 of 15 ask for the site address or location (not Astute, Unda, Arb Innovators, Harmil, Soils UK).
- Few ask anything survey-specific. The exceptions:
  - Bat Surveyor: property type, H&S issues, date.
  - AMS: property type, listed building, year built, value, bedrooms.
  - Get Planning: service, property type.
  - Arbtech FRA page: purpose, FRA or SuDS.
  - Chase: red line boundary.
  - Indigo: domestic or commercial.
  - Soils UK: site history, volume, timescales.
- 4 of the 15 forms ask nothing beyond contact details and a message (name, email, phone, subject, message): Astute, Unda, Arb Innovators, Harmil. Urban Water and STM add a site address or location and a file upload.

## Defects and notes
- **Rows past a gate:** read from page code after a contact or address step (Arbtech, Bat Surveyor, Enviropass, Contaminated Land Surveys), kept on the coordinator's decision. For Contaminated Land Surveys, the form appears multi-step with email first, but the step boundaries were not checked.
- **"What counts as a form":** the rule in the header was fixed after the bat search was read, not before.
- **Soils UK** sells disposal of contaminated soil, not a land contamination assessment. It was kept because it came up in search order with a quote form. Excluding it leaves 2 land contamination firms.
- **AMS** uses a general surveying-quote platform (Surventrix). Its property fields (value, bedrooms) serve home surveys and are not specific to heritage.
- **Field grouping** in the per-survey lists is reader B's.
- **Arbtech counts once as a firm** but appears for 5 surveys. It sits high in search order for bat, PEA, GCN, FRA and tree.
