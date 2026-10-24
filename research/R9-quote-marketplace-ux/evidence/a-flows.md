# R9 A: customer request-for-quote flows, screen by screen

Reader A, walked 2026-10-24 in a clean isolated browser context, stopping at the first screen that asks for contact details. Nothing was submitted. Postcode used: OX1 2JD (UK), 10001 (US). Quotes are verbatim, 30 words or fewer.

## 1. MyBuilder

Job: no survey category exists. Typing "survey" in the home search returned only: "Damp Proofing, Architectural Services, Roofing, Loft Conversion, Restoration & Refurbishment, Insulation, New Build, Groundwork & Foundations, Bricklaying & Repointing, Chimney & Fireplace". Used **Loft Conversion** instead.

Form shape: one page. Each answered step stays visible above, with a "Go back" link, and the next step appears below it. The URL does not change between steps. Progress is shown as a percentage plus a progress bar out of 125.

| step | url | question/heading (verbatim) | answer type | reason given | progress shown | shown before committing | promises/next (verbatim) |
|---|---|---|---|---|---|---|---|
| 0 | https://www.mybuilder.com/ | "The reliable way to hire a tradesperson" / "What is your job?" | free-text autocomplete (combobox) mapping to a category | none | none | "Rated Great. 4.2 out of 5 on Trustpilot"; "295,340 tradespeople"; "40+ trade categories"; "2,876,911 reviews"; "STEP 1 Post your job for free / STEP 2 Tradespeople respond / STEP 3 Review profiles and choose" | "Post your job for free and receive responses from tradespeople eager to take it on." |
| 1 | https://www.mybuilder.com/post-a-job/loft-conversion | "Post a Loft Conversion job" / "Step 1 What would you like to have done?" | dropdown (37 categories), already filled with "Loft Conversion" | subhead: "Get responses from MyBuilder's screened and reviewed tradespeople near you" | "10%" (shown together with step 2) | none | none |
| 2 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 2 What type of loft conversion do you want?" | single choice (4), each with a one-line explanation, e.g. "Requires a change to the roof structure, e.g. dormers, hip-to-gable, etc." | none | "10%" | none | none |
| 3 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 3 What type of house is the loft conversion for?" | single choice (6: Detached … Bungalow, Other), plus free text when Other is picked | none | "20%" | none | none |
| 4 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 4 Do you own the property?" | single choice: "Yes" / "I will - purchase in progress" / "No" | none | "30%" | none | none |
| 5 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 5 Have you had any plans drawn up?" | single choice: "Yes I have plans" / "Plans are being drawn up" / "No plans have been drawn up" | none | "40%" | none | none |
| 6 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 6 Add a description to your job" | free text, required; placeholder "Include any details you think the tradesperson should know (approx. loft size, timeframe, etc.)" | none (the placeholder prompts for content) | "48%"; bar "60 / 125" | none | none |
| 7 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 7 Give your job a headline" | short free text, required; placeholder "E.g. New dormer loft conversion" | "More tradespeople express interest in jobs that have a descriptive name." | "54%" | none | none |
| 8 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 8 Would you like to add any photos or plans? (Optional)" | single choice: "Yes" / "No, maybe later" | "Photos give tradespeople more context and details to understand the job and provide a more accurate quote." | "60%"; bar "75 / 125" | none | none |
| 9 | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 9 Postcode for the job" | postcode text; looked up inline and shown as "Oxford" | "To find loft conversion specialists near you we need to know where the job is." | "80%"; bar "100 / 125" | none (no count of tradespeople nearby, no price) | none |
| 10 (contact; stopped) | https://www.mybuilder.com/post-a-job/loft-conversion | "Step 10 Get responses from tradespeople near you" | email (required). Later contact fields not seen. | none | "88%"; bar "110 / 125" | none | "We will only share your contact details with tradespeople you choose to talk to." What happens next, from https://www.mybuilder.com/how-it-works: "After you post a job, our matching system identifies and alerts relevant tradespeople, who can then express interest in your job." No time frame is stated on either page. |

Screens before contact details: 10 (the home search plus funnel steps 1 to 9; steps 1 and 2 first appear together). Total questions: 10 (the home job search plus steps 1 to 9; step 1 was already filled in from the search; 1 optional, step 8). Reasons given: 3 of 10 (steps 7, 8, 9).

**After the request (MyBuilder's own pages):**
- **Pros per job:** "Remember, you can invite up to 10 tradespeople to respond to your job." (support search excerpt: https://support.mybuilder.com/s/article/How-can-I-get-more-tradespeople-to-respond-to-my-job). Tradespeople "express interest" (https://www.mybuilder.com/how-it-works).
- **Response speed:** none stated.
- **Phone shared:** only on shortlisting. "Contact details are shared only when you say so." (https://www.mybuilder.com/how-it-works). "Shortlisting allows you to exchange contact details with tradespeople who have shown interest in your job." (https://support.mybuilder.com/s/article/What-is-shortlisting-and-how-do-I-get-in-contact-with-tradespeople)
- **Guarantee:** none seen. Vetting claim only: "Tradespeople on MyBuilder undergo checks at registration - such as ID documents, company details, certifications for regulated jobs and skill assessments" (https://www.mybuilder.com/).

## 2. Checkatrade

Job: **Building Surveyors**. The AI-powered search "building survey" offered "Surveying, Building Surveyors, Land Surveyors, Quantity Surveyor, Chartered Surveyor, …". The route walked is the multi-quote "Request quotes" from the results list. Each firm card also has "Request a quote" and "Show phone number".

| step | url | question/heading (verbatim) | answer type | reason given | progress shown | shown before committing | promises/next (verbatim) |
|---|---|---|---|---|---|---|---|
| 0 | https://www.checkatrade.com/ | "Find a tradesperson ready to help you" → modal "Describe your project or problem" / "Be as descriptive as you'd like" | free text, AI-matched to a category list ("Powered by AI") | none | none | "Checked trades"; "6M+ real reviews"; "£1,000 guarantee*"; "Every trade passes up to 12 checks and is continually rechecked"; also "Skip the search and call … we'll connect you to available trades" | none |
| 1 | https://www.checkatrade.com/ (modal) | "What's your postcode?" | postcode text | "We use this to make sure the tradesperson operates in your area." | none | none | none |
| 2 | https://www.checkatrade.com/Search?categoryId=1815&location=OX1+2JD | "Building Surveyors in OX1 2JD (8)" / "Describe your job" / "Receive multiple quotes for your job from reviewed and trusted tradespeople" | results list; button "Request quotes" | none | none | **pro count** "(8)"; each card shows a score and review count (e.g. "9.89 (181)"), "Serves OX1 2JD", services, a review snippet, "Request a quote", "Show phone number". No prices. | "Receive multiple quotes for your job from reviewed and trusted tradespeople" |
| 3 | https://www.checkatrade.com/jobs/raq-message?preferredStart=Flexible&categoryId=1815&location=OX1+2JD&from=search | modal "Request A Quote" / "Describe your job" | free text, required; "Min characters: 10", "0/500" | none | none | none | none |
| 4 (contact; stopped) | https://www.checkatrade.com/message/contact-information | "Final step!" / "Add your contact details" | First Name, Last Name, Email, Phone, address postcode lookup; "What's your preferred way of being contacted?" (default "No preference"); "When are you available?" (default "I'm flexible on the start date"); marketing Email/Push/SMS boxes **pre-ticked**; button "Request a quote" | "Provide your details so our tradespeople can contact you." | "Final step!" (text only) | none | "Some trades may have paid more to receive your job details - they still match your criteria." "We won't share your address until you tell us to." "If you're new to Checkatrade, we'll set up an account for you with your email above." |

Screens before contact details: 4 (search modal, postcode modal, results, description). Total questions: 3 (service, postcode, description); the start date and contact preference sit on the contact screen. Reasons given: 1 of 3.

**After the request (Checkatrade's own pages):**
- **Pros per job:** "The number of quote requests sent out varies depending on the complexity of the job; for more complex, expensive jobs, we send out the request to more trades" (https://www.checkatrade.com/support/trade/trade-jobs/request-a-quote)
- **Response speed:** none stated.
- **Phone shared:** with matched trades when the request is sent. "Provide your details so our tradespeople can contact you." (contact screen). The address is held back: "We won't share your address until you tell us to."
- **Guarantee:** "Every Checkatrade job is backed by our £1,000 guarantee *Eligibility & T&C's" (https://www.checkatrade.com/)

## 3. Rated People

Job: **Building Surveyors**. Rated People has no surveyor trade in its list; the free-text description was matched to it. Note: the site banner reads "Rated People is now part of Checkatrade Group". Its trade FAQ says "leads submitted through the platform will now be routed to Checkatrade tradespeople" (https://www.ratedpeople.com/help/tradesperson, search excerpt).

| step | url | question/heading (verbatim) | answer type | reason given | progress shown | shown before committing | promises/next (verbatim) |
|---|---|---|---|---|---|---|---|
| 0 | https://www.ratedpeople.com/ | "Trusted by homeowners. Rated for a reason." / "Tell us what you need" | free text, "At least 30 characters please"; button "Get quotes" | none | none | "Trusted by over 4 million homeowners"; "Free to post, with no hidden fees"; "Every tradesperson is rated & reviewed"; "Get up to 3 quotes to compare" | "Receive multiple quotes for your job from reviewed and trusted tradespeople." |
| 1 | https://www.ratedpeople.com/post-a-job/match/job-match | "Choose the best match for your job" | single choice (8 categories); one tagged "Best match" (Building Surveyors) | none | bar at 25% (no text) | none | none |
| 2 | https://www.ratedpeople.com/post-a-job/match/job-location | "Where will the job take place" | postcode text | "We use this to find tradespeople who work in your area. Up to 3 tradespeople can choose to quote, they only see the first half of your postcode." | bar 37% | none | (same text as the reason) |
| 3 | https://www.ratedpeople.com/post-a-job/match/job-details | "When would you like the job to start?" | single choice (5), default "I'm flexible on start date"; also "It's urgent (within 48 hours)" … "I'm planning and budgeting" | none | bar 50% | none | none |
| 4 | https://www.ratedpeople.com/post-a-job/match/job-photos | "Add photos or videos" / "Bring your job to life" | file upload, optional; button "Next / Skip →" | "Photos and videos significantly increase a tradesperson's understanding of what you need, right from the start." | bar 62% | none | none |
| 5 (contact; stopped) | https://www.ratedpeople.com/post-a-job/match/job-personal-details | "Contact details" | First name, Last name, "Email (all communications will be sent here)", "Mobile number" (placeholder "Mobile number preferred") | "Your details will be used to create a job post, so that you can monitor and manage the job you have posted." | bar 75% | none | none on this screen |

Screens before contact details: 5. Total questions: 5 (description, category match, postcode, start, photos). 1 of the 5 is optional (photos). Reasons given: 2 of 5.

**After the request (Rated People's own pages):**
- **Pros per job:** "Up to 3 tradespeople can choose to quote" (job-location screen above).
- **Response speed:** none stated.
- **Phone shared:** when a tradesperson pays to quote. "Tradespeople will get in touch to provide a quote. They pay a small fee to do this, at which point they get to see your contact details" (https://www.ratedpeople.com/blog/how-our-service-works, search excerpt). Before that: "they only see the first half of your postcode" (flow).
- **Guarantee:** none seen.

## 4. Bark (UK)

Job: **Surveyors**, "General Survey". The home search would not accept free text ("* Please select a service"), and its suggestion list did not appear in this browser, so the walk starts on the category page https://www.bark.com/en/gb/surveyors/ (found by web search). The cookie banner had no reject button; non-essential cookies were left off via "Settings", "Save + Exit".

| step | url | question/heading (verbatim) | answer type | reason given | progress shown | shown before committing | promises/next (verbatim) |
|---|---|---|---|---|---|---|---|
| 0 | https://www.bark.com/en/gb/ | "Find the perfect professional for you" / "Get free quotes within minutes" / "What service are you looking for?" + "Postcode" | autocomplete (must pick a service) + postcode | none | none | "Rated 3.8 out of 5. 112223 reviews on Trustpilot" (footer) | "Get free quotes within minutes" |
| 1 | https://www.bark.com/en/gb/surveyors/ | "Find Surveyors near me" / "Where do you need Surveyors?" | postcode or town text; button "Go" | none | none | **price** (in page copy): "Homebuyer reports (Level 2) typically range from £325 to £600 … Full building surveys (Level 3) cost £400 to £850 for most homes" | "Tell us about your project and we'll send you a list of Surveyors to review. There's no pressure to hire" |
| 2 | https://www.bark.com/en/gb/surveyors/ (modal) | "What is the type of property?" | single choice (House, Flat, Apartment Buildings, Outbuilding, Commercial premises, other + text) | none | bar 43% (no text) | none | none |
| 3 | https://www.bark.com/en/gb/surveyors/ (modal) | "What type of surveying are you looking for?" | single choice (Boundary, Damp, General, Mortgage survey, Property valuation, other) | none | bar 68% | none | none |
| 4 | https://www.bark.com/en/gb/surveyors/ (modal) | "What is the size of the project?" | single choice (Small, Medium, Large, Not sure, other) | none | bar 86% | none | none |
| 5 | https://www.bark.com/en/gb/surveyors/ (modal) | "When do you want the surveying carried out?" | single choice ("Within 1 week" … "Within 3 months", other) | none | bar 100% | none | none |
| 6 | https://www.bark.com/en/gb/surveyors/ (modal) | "Great! We've found you the perfect matches." / "Lastly, we need your details to attach to your request." | interstitial, no input; "Continue" | "we need your details to attach to your request" | none | none (no count, no names) | (same text) |
| 7 (contact; stopped) | https://www.bark.com/en/gb/surveyors/ (modal) | "What email address would you like quotes sent to?" | email | none | none | none | none on this screen |

Screens before contact details: 7 (steps 0 to 6; step 0 was seen but its suggestion list failed, so the walk resumed at step 1). Total questions: 6 (service, location, property type, survey type, size, timing). The progress bar reaches 100% before contact details are asked. Reasons given: 0 of 6 (step 6's line explains the contact request, not a question).

**After the request (Bark's own pages):**
- **Pros per job:** "a maximum of five Professionals will contact you directly" (https://www.bark.com/en/us/terms/, US terms, search excerpt). "you will receive quotes from up to 5 professionals" (https://help.bark.com/hc/en-au/articles/17034945954716-Can-I-reach-out-to-professionals-directly, search excerpt).
- **Response speed:** "Get free quotes within minutes" (home page).
- **Phone shared:** professionals "contact you directly" (terms above), so the number goes to up to 5 pros. Separately: "your personal phone number is never shared when you call through Bark" (https://support.bark.com/hc/en-gb/articles/30316288033308-What-happens-when-I-call-a-Professional-on-Bark, search excerpt; this covers calls the customer makes).
- **Guarantee:** "No. Bark connects you with professionals but does not guarantee their services." (https://support.bark.com/hc/en-gb/articles/22073612773404-Does-Bark-guarantee-the-work-of-professionals, search excerpt)

## 5. Thumbtack (US)

Job: **Home Inspection** (the nearest US match to a survey), zip 10001. The flow has two parts. First a filter modal over a live list of matched pros, then a separate "Request Flow" dialog, which restarts its own progress bar. Here "IR" is short for https://www.thumbtack.com/instant-results/?…keyword_pk=102906936653958006&zip_code=10001… (the same URL for steps 1 to 12).

| step | url | question/heading (verbatim) | answer type | reason given | progress shown | shown before committing | promises/next (verbatim) |
|---|---|---|---|---|---|---|---|
| 0 | https://www.thumbtack.com/ | "For everything home could be." / "Describe your project or problem — be as detailed as you'd like!" + "Zip code" | free-text autocomplete (picked "Home Inspection") + zip | none | none | "4.9 from 15M+ reviews"; "300K+ local pros"; "100M+ home projects" | "No calls or text until you message a pro." |
| 1 | IR (modal) | "Does your home have any of the following?" | multi choice (Attic, Basement, Chimney, Crawl space, Water well, Pool, none); "Skip" | none | "30% complete" | behind the modal: "Get quotes from your top 4 matches"; cards with "Exceptional 5.0 (143)", "235 hires on Thumbtack", "Responds in about 2 hours" | none |
| 2 | IR (modal) | "What is the approximate square footage of your home?" | single choice (11 bands); "Skip" | none | bar 53 | as above | none |
| 3 | IR | "Matching home inspectors" / "Get quotes from your top 4 matches" | button "Get 4 quotes" | "These pros match your project, are highly-rated, and respond quickly." | none | **pro count** 4; per-pro rating, review count, hires, "Responds in about 37 min", "Online Now - responds in about 10 min", review snippet; "Compare prices side-by-side — You'll know how much your project costs even before booking a pro." No price figures are shown yet. | none |
| 4 | IR ("Request Flow Dialog") | "Confirm some details to get pricing" | review of earlier answers ("Attic", "Less than 500 sq ft"), "Edit" / "Next" | "Check these details first, so the pros can give the most accurate price." | "7% complete" (restarts) | none | none |
| 5 | IR (dialog) | "Why would you like an inspection?" | single choice (5) | none | 14 | none | none |
| 6 | IR (dialog) | "How many bedrooms are in your home?" | single choice (6) | none | 21 | none | none |
| 7 | IR (dialog) | "How many bathrooms are in your home?" | single choice (5) | none | 29 | none | none |
| 8 | IR (dialog) | "What type of property needs to be inspected?" | single choice (House, Condo or apartment, Townhouse) | none | 36 | none | none |
| 9 | IR (dialog) | "Are you the owner, renter, or property manager?" | single choice (5) | none | 43 | none | none |
| 10 | IR (dialog) | "When do you need this job to start?" | single choice ("I haven't decided yet" … "Specific dates") + checkbox "I can work with the pro's schedule if they aren't available in the time I chose." | none | 50 | none | none |
| 11 | IR (dialog) | "Send a message to the pro" | free text, optional (placeholder "Can you help with my job?"); "Skip" | none | 57 | none | "Ask questions or describe what you need. You don't need to include contact info yet." |
| 12 (contact; stopped) | IR (dialog) | "Where should we send the pro's response?" | email | none | 64 | none | "We don't share your email with pros." |

Screens before contact details: 12 (steps 0 to 11). Total questions: 11 (service, zip, features, square footage, reason, bedrooms, bathrooms, property type, ownership, start, message). Steps 1, 2 and 11 can be skipped. Reasons given: 0 of 11. Two screens that are not questions give reasons: step 3 (the list) and step 4 (the confirm screen).

**After the request (Thumbtack's own pages):**
- **Pros per job:** "Get quotes from your top 4 matches" (flow, step 3).
- **Response speed:** per pro, on the cards: "Responds in about 2 hours", "responds in about 10 min".
- **Phone shared:** "We'll also ask you for your phone number — your number is only shared with pros who you've decided to contact directly." (https://help.thumbtack.com/article/find-pros-on-thumbtack, search excerpt). Also "No calls or text until you message a pro." (home page).
- **Guarantee:** "The Thumbtack Guarantee provides coverage if your project wasn't finished as expected (up to $2,500) and coverage for accidental property damage." (https://help.thumbtack.com/article/the-thumbtack-guarantee, search excerpt)

## 6. Angi (US)

Job: **Addition & Remodeling**, "Building an addition", the nearest match to a loft conversion. The flow's category list offers no inspection or survey route from the home page. Defect: www.angi.com showed a Cloudflare page in the browser ("Performing security verification") and was not bypassed. Step 0 is therefore taken from a static Firecrawl scrape of https://www.angi.com/. The request flow on request.angi.com loaded normally in the browser.

| step | url | question/heading (verbatim) | answer type | reason given | progress shown | shown before committing | promises/next (verbatim) |
|---|---|---|---|---|---|---|---|
| 0 (static scrape) | https://www.angi.com/ | "The one you trust to find the ones you trust." / "What can we help you with?" + "Zip Code" | search + zip, or category tiles | none | none | project cards with rating, review count and starting price, e.g. "Handyperson for Small Projects 4.6 (599k+) \| from $158"; "Bathroom Remodel 4.4 (180k+) \| from $2,500" | none |
| 1 | https://request.angi.com/service-request/category/12001 | "Compare quotes from top-rated Addition & Remodeling Contractors" / "Enter the location of your project" | ZIP | none | bar 9% (no text) | none | none |
| 2 | same | "What do you need help with?" | single choice (4) + "Tell us in your own words..." | none | 18% | none | none |
| 3 | same | "What kind of addition?" | single choice (4) + own words | none | 27% | none | none |
| 4 | same | "What do you want to add? (Select all that apply)" | multi choice (6) + own words | none | 36% | none | none |
| 5 | same | "What stage of the project are you in?" | single choice ("Ready to hire", "Planning and budgeting", Other) | none | 45% | none | none |
| 6 | same | "Please tell us a little about your project." | free text, optional, "0/2000" | placeholder: "The more details the better - it helps pros provide the most accurate quote! (Optional)" | 73% | none | none |
| 7 | same | "Building your project" / "Local cost data..." | interstitial, auto-redirect | none | 73% | the "Local cost data..." text only; no figures shown | none |
| 8 (contact; stopped) | https://request.angi.com/service-request/category/12001/pii/ADDRESS | "What's your project address?" | Street, City, ZIP (prefilled "New York, NY"); later name, email and phone screens not seen | none | 82% | none | none |

Screens before contact details: 8 (steps 0 to 7). Total questions: 7 (service, ZIP, help type, addition kind, what to add, stage, description). 1 is optional (the description). Reasons given: 1 of 7. The first personal-data screen asks for the street address (its URL path is "pii/ADDRESS").

**After the request (Angi's own pages):**
- **Pros per job:** not stated on the pages read. "request and compare quotes from highly rated pros near you" (https://www.angi.com/landing/how-it-works).
- **Response speed:** not stated.
- **Phone shared:** not stated on the pages read.
- **Guarantee:** "When you book and pay with Angi you're covered by our Happiness Guarantee. We'll cover your project up to the full purchase price, plus limited damage protection." (https://www.angi.com/landing/how-it-works). This covers bookings paid through Angi, not quote requests.

## 7. Upwork (client job post)

Job: **video editor**. The home page's "Create a job" link goes straight to sign-up (https://www.upwork.com/nx/signup/?signupType=client). The hero "Get started" opens a pre-sign-up wizard, which is the route walked. Defect: the wizard hung at step 6, "Processing your job details", for over 60 seconds and on a retry. The network log showed repeated Cloudflare challenge calls. Step 7 (probably sign-up) was not seen.

| step | url | question/heading (verbatim) | answer type | reason given | progress shown | shown before committing | promises/next (verbatim) |
|---|---|---|---|---|---|---|---|
| 0 | https://www.upwork.com/ | "Work at the speed of your ambition" / "Get started" | button | none | none | "TRUSTED BY 800,000 CLIENTS"; rates by role, e.g. "Youtube Video Editors - 4.8 / 5 rating , $40/hr"; "Posting jobs is always free"; a price tool: "We'll calculate the average cost for freelancers with the skills you need." | "Generate a job post with AI or create your own and filter talent matches." |
| 1 | https://www.upwork.com/nx/glide/?source=hp-hero-cta | "Welcome! Let's get started." / "Describe what you need to hire for" | free text (placeholder "E.g. I need someone to help me build a Shopify website…"); "Popular right now" | none | "step 1 of 1"; bar 14% | none | none |
| 2 | same | "How soon do you need help?" | single choice: "Now" / "In 1-2 weeks" / "No rush"; "Skip" | "We'll prioritize video editing pros that can start immediately, if needed." | "step 2 of 7"; 29% | none | none |
| 3 | same | "Does talent location matter?" | single choice: "U.S. only" / "Near my time zone" / "Anywhere in the world" | "We'll filter from freelancers across 250+ countries." | "step 3 of 7"; 43% | none | none |
| 4 | same | "Do you have a budget in mind?" | Hourly / Fixed price + slider | "This helps prioritize freelancers within your range." | "step 4 of 7"; 57% | **price**: slider preset "$ 48/hour" | none |
| 5 | same | "Any job details to share?" | free text; "See an example" | "We'll search for talent who have relevant experience." | "step 5 of 7"; 71% | none | none |
| 6 (hung; stopped) | same | "Processing your job details" | none (loading) | none | "step 6 of 7"; 86% | none | none |

Screens before contact details: 7 or more (steps 0 to 6 seen; the sign-up screen was not reached). Total questions: 5 (describe, how soon, location, budget, details). Reasons given: 4 of 5. The step count changes from "1 of 1" to "2 of 7" once the job is described.

**After the request (Upwork's own pages):**
- **Pros per job:** open. Freelancers submit proposals; the client can also send "Freelancer invites per job post 5 per day*" on Basic (https://www.upwork.com/pricing/client, search excerpt).
- **Response speed:** "Once your job post is live, qualified proposals will often arrive within hours." (https://www.upwork.com/resources/how-to-post-job-on-upwork, search excerpt)
- **Phone shared:** not applicable. Contact happens through the platform after an account is made; no phone step was seen.
- **Guarantee:** "Protected payments - escrow-backed pay tied to approved work" (https://www.upwork.com/, plan box).

## Cross-platform summary

Counting rules: screens run from the first entry screen to the screen before contact details, inclusive. Questions are inputs the customer answers, including the service and location. "Reasons" counts questions that say why they are asked. Sources for the last three columns are in each platform's "After the request" list.

| platform | screens before contact | questions | progress shown (y/n) | reasons given (n of N) | shown before contact (price / pro count / reviews) | contact asked (email/phone/name) | pros per job | response promise | guarantee |
|---|---|---|---|---|---|---|---|---|---|
| MyBuilder | 10 | 10 | y (% + bar) | 3 of 10 | no / no / site-level only (home page: Trustpilot 4.2, "2,876,911 reviews") | email first (rest not seen) | invite "up to 10"; tradespeople opt in by expressing interest | none stated | none (vetting at registration) |
| Checkatrade | 4 | 3 | n (only "Final step!") | 1 of 3 | no / yes "(8)" / yes, per firm (score, count, snippet) | name, email, phone, address on one screen; marketing pre-ticked | varies by job complexity | none stated | "£1,000 guarantee" (T&Cs) |
| Rated People | 5 | 5 | y (bar, no text) | 2 of 5 | no / "up to 3" (stated, not shown) / site-level only | name, email, mobile | up to 3, who choose to quote | none stated | none seen |
| Bark | 7 | 6 | y (bar, reaches 100% before contact) | 0 of 6 | yes, a range in page copy (survey £325–£850) / no ("perfect matches", no number) / site-level only (Trustpilot 3.8) | email first (rest not seen) | up to 5 | "Get free quotes within minutes" | none ("does not guarantee") |
| Thumbtack | 12 | 11 | y (two bars; the second restarts at 7%) | 0 of 11 | promised ("Confirm some details to get pricing"), not shown / yes "top 4" / yes, per pro, plus response time per pro | email first ("We don't share your email with pros") | 4 | per pro, e.g. "Responds in about 2 hours" | up to $2,500 (Thumbtack Guarantee) |
| Angi | 8 | 7 | y (bar) | 1 of 7 | starting prices on home cards ("from $158") / no / ratings on home cards | street address first (name, email, phone not seen) | not stated | not stated | Happiness Guarantee (bookings paid through Angi only) |
| Upwork | 7+ (hung at step 6) | 5 | y ("step N of 7" + bar) | 4 of 5 | yes, hourly rates by role and a "$48/hour" budget preset / no / ratings by role | account sign-up (not reached) | open proposals; 5 invites a day | "proposals will often arrive within hours" | escrow ("Protected payments") |
