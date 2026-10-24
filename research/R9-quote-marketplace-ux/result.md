# R9: result (read 2026-10-24, after the method was committed in a344c2c)

Exploration; no decision rule. Evidence:
- `evidence/a-flows.md`: 7 platforms walked screen by screen, up to the contact-details screen;
- `evidence/b-reviews.md`: 114 rows from customers and providers, with ranked themes;
- `evidence/c-evidence.md`: 49 rows of published UX evidence, each tagged with its strength.

Every row carries a URL and verbatim text.

## 1. How the archetype is built (A)

| platform | screens before contact | reasons given | shown before contact | pros per job | response promise | guarantee |
|---|---|---|---|---|---|---|
| MyBuilder | 10 | 3 of 10 | nothing (trust figures on home page only) | invites up to 10 | none stated | none |
| Checkatrade | 4 | 1 of 3 | count of firms "(8)" and each firm's reviews | varies | none stated | "£1,000 guarantee" |
| Rated People | 5 | 2 of 5 | "up to 3" (stated) | up to 3 | none stated | none seen |
| Bark | 7 | 0 of 6 | a price range in the page copy | up to 5 | "within minutes" | "does not guarantee" |
| Thumbtack | 12 | 0 of 11 | "top 4" pros, each with reviews and "Responds in about 2 hours" | 4 | per pro | up to $2,500 |
| Angi | 8 | 1 of 7 | starting prices | not stated | not stated | Happiness Guarantee (only when booked through Angi) |
| Upwork | 7+ | 4 of 5 | hourly rates, budget preset | open proposals | "within hours" | escrow |

**Shared shape:**
- the customer describes the job, answers a few questions, gives a postcode, then contact details;
- a progress bar on almost all;
- reasons are rarely given;
- no account is needed before the request.

**The best (Thumbtack)** shows *who* will see the job, each pro's reviews and *how fast they reply*, before asking for contact details. Checkatrade shows the matching firms. The rest show nothing.

## 2. What people love and hate (B; independent sources per theme)

**Customers**
- **Love:**
  - a fast response (9);
  - choosing from several, with reviews and profiles to compare (6);
  - easy to post (4);
  - a clear, fair price (4);
  - the platform stepping in when something goes wrong (4).
- **Hate:**
  - "a listing is no guarantee" (vetting) (7);
  - the platform won't help when it goes wrong (6);
  - reviews they can't trust (5);
  - being bombarded with calls (4);
  - overpriced quotes, or prices that change (4);
  - no response, poor matches, and not knowing what happens next (3 each).

**Providers**
- **Hate:**
  - paying for leads that never answer or are fake (15, the biggest theme on either side);
  - the same lead sold to several pros (10);
  - contracts or subscriptions (4);
  - fees (3).
- **Love:** real work coming in (4).

**The tension:** customers love fast replies, and other customers hate being bombarded with calls. Both come from many pros receiving the same lead.

## 3. What the published evidence says (C; strength in brackets)
- **Value before asking (moderate to strong).** "Asking for information before providing any value is a breach of trust" (NN/g, C18). Users go elsewhere when prices are hidden (C24). A service site that asked users to write in for a rate was ruled out in 35 seconds (C22).
- **Reasons for personal fields (strong).** An unexplained phone field leads to false entries or abandonment (Baymard, C9).
- **The number of fields matters more than the number of steps (strong, from checkout).** C3, C11.
- **Reviews (strong).** "Every participant … would read reviews before deciding which company to hire" (C30). The first five reviews carry most of the gain (C33). An Airbnb host without reviews is about four times less likely to be booked (C35). Detailed public evaluations help newcomers get hired (C39).
- **Response time (moderate).** Replying within an hour made a firm about 7 times more likely to qualify the lead (HBR audit, 2011, C40). Yet 23% of firms never replied (C41). Users expect a time estimate before committing (NN/g, C29).
- **What happens next (guideline).** A confirmation page must give "details of what happens next and when" (GOV.UK, C10).
- **Three quotes (platform's own data).** "having three good choices is correlated with a good customer experience". Pre-matching pros instead of waiting for bids "more than doubled" requests with 3+ quotes (Thumbtack, C43, C44).
- **Progress bars (strong, from survey experiments).** A plain "% complete" bar does not cut drop-off, and a bar that looks slow at the start increases it (C16, C17). Fewer and easier questions do more.

## 4. Where our journey already sits
- **Ahead of most:**
  - a reason for every question;
  - the answer before contact details (survey, season, typical price, firms near you);
  - no account needed;
  - phone optional;
  - at most 3 firms;
  - a firm sees the brief before paying;
  - details shared only with a firm that takes the job;
  - check your answers.
- **Behind the best:**
  - we don't show *which* firms will see the job, or how fast they reply;
  - we have no reviews;
  - after sending, the buyer sees only "check your email", with no reference, timeline or status;
  - nothing happens if a firm unlocks and never calls (our buyer check-in is missing);
  - prices for only 3 of 33 surveys.

## 5. Proposals for the principal (grouped; not yet decided)
1. **Show who would get the job, before contact.** On the answer screen, list the up-to-3 firms that would see the job:
   - where each is based, and what it does;
   - its licences and memberships;
   - "confirmed its details";
   - its typical reply time, once we have data.

   The buyer can untick one. (Thumbtack and Checkatrade show this; customers love choosing, B5; three good choices, C43.)
2. **Make the wait visible.** The confirmation page gives a reference, what happens next and **when**, and a link to a status page ("Sent to 3 firms · 1 has taken it on"). 48 hours after a firm unlocks, we ask the buyer "has the firm been in touch?". If not, we follow up and the firm's record shows it. (C10, C29; B: no response, unclear what happens next, platform won't help.)
3. **Trust from real jobs.** Collect a short review only from buyers whose job went through us, after the outcome (ST-U4.5); firms can reply. Show licences and memberships. Add one page on how we check firms and how we're paid, linked from the trust banner. (C30, C33, C35, C39; B: vetting, untrusted reviews.)
4. **No bombardment, and speed as a promise.** Say it plainly: "At most 3 firms, and only the one that takes the job gets your details". Let the buyer choose email only or phone too. Set a reply target for firms and show each firm's reply speed. (B: bombarded, fast response; C40.)
5. **The firm side (for later, and a business decision).** Answer the providers' biggest hate:
   - qualified, confirmed buyers only;
   - at most 3 firms per job;
   - a credit if a buyer never responds after unlock.

   That credit is M1 terms (Q16 territory). (B: provider themes 1 and 2.)

## Defects
1. **Method deviation:** B includes provider reviews from Trustpilot. The method said customers "not providers"; Claude's brief asked for both, and provider rows were kept as useful (both sides are our customers).
2. **A did not complete two walks:** Angi's home screen came from a static copy behind a bot check, and the Upwork walk stalled before sign-up.
3. **Some sources are weaker:** several "after the request" quotes in A, and Reddit and MSE rows in B, are search excerpts (marked). C's excerpt-only rows C18, C29, C43 and C44 were spot-checked against full pages and matched word for word.
4. **B's love rows are few on the provider side (6).** Page-one 4–5 star reviews mostly praise individual tradespeople, not the platform.
5. **Most of C comes from e-commerce or government forms.** Applying it to quote marketplaces is inference, marked where used.
6. **D7 spot-checks:**
   - A: MyBuilder's heading and steps 1 and 2 matched the live page.
   - B: rows 1, 2 and 10 matched Trustpilot.
   - C: C3, C9, C18, C29, C43 and C44 matched their sources.
