# R9: what buyers of request-for-quote marketplaces are used to, love and hate, and how the best journeys are built (exploration, 2026-10-24, before any read)

Principal, 2026-10-24: "our product fits into an archetype, irrespective of domain - surveying or video production or whatever - lets find out how to enhance further our frontend UX from other examples. not worried about the style just yet, im thinking about the information architecture, cadence, the audience, what theyre used, what they love hate, how we can we leverage that for a better journey".

**The archetype:** a request-for-quote marketplace. The customer describes a job once, the platform qualifies it, matched providers respond, and the customer chooses. Our product is one (D2).

**This is exploration, not a screen.** There is no decision rule. It produces:
- a read-back of proposed changes to the buyer journey (information architecture, order and pace of questions, what is shown when), for the principal to approve before any build;
- guesses with their tests (new Qs).

R7 (2026-10-24) already holds the opening screens of Checkatrade, MyBuilder and Bark, and GOV.UK's form patterns; this study goes past the opening screen.

## Platforms, fixed now
**UK trades:** Checkatrade, MyBuilder, Rated People. **General services:** Bark (UK), Thumbtack (US), Angi (US). **Creative or freelance, for the "any domain" view:** Upwork job post.

## A. How the journey is built (one reader, a real browser where needed)
For each platform, walk the customer's request flow as far as is possible without submitting real contact details (stop before them). Record per screen, with the URL and verbatim text:
- the question asked;
- answer type (free text, choices, date, postcode);
- any reason given for asking;
- progress shown;
- what the customer is shown before committing (prices, number of pros, reviews);
- where contact details are asked and what is promised about them;
- what is said will happen next, and how fast.

**Output:** a screen-by-screen table per platform, plus counts (screens before contact details, total questions).

## B. What people love and hate (one reader)
**Sources:**
- Trustpilot reviews of each platform: most recent, both 1–2 star and 4–5 star, from **customers** (not providers);
- Reddit or forum threads (r/HousingUK, r/DIYUK, MoneySavingExpert, r/smallbusiness for the provider side).

**Output:** themes ranked by number of independent sources. Each theme carries at least 2 verbatim quotes with URL and date, and is tagged customer or provider, love or hate.

## C. Published UX evidence (one reader)
Studies and case studies on:
- multi-step quote or lead forms;
- when to ask for contact details;
- marketplace trust signals (reviews, vetting, guarantees);
- progress indicators;
- showing price estimates before contact;
- follow-up after a request.

**Prefer:**
- research bodies (Baymard Institute, Nielsen Norman Group, GOV.UK);
- platforms' own engineering or design blogs (for example Thumbtack, Airbnb, Upwork);
- named A/B results.

**Output:** finding, source URL, verbatim quote, and the kind of evidence (study, A/B test, opinion).

## Delegation (D7)
- **Receipts:** each reader gives a URL and verbatim text per row.
- **Spot-check:** each reader stops after its first 10 rows (A: after the first platform), and Claude spot-checks 3 rows against the source before the rest.
- **Defects:** rows without a URL and verbatim text are dropped.
- **Personal data:** reviewers are named by role only ("a customer", "a tradesperson"), never by name. No personal data goes in `research/`.

## Limits, stated before the read
- **Walking flows without submitting** sees only the screens before contact details. What happens after is taken from what the platform says, plus reviews.
- **Reviews skew to the extremes;** counts show what people complain about, not how often it happens.
- **US platforms (Thumbtack, Angi)** are included for their pattern, not their market.
- **Opinion pieces** are marked as opinion and carry less weight than studies or tests.
