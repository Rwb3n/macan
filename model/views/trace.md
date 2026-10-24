# Trace (generated; do not edit)

Each decision, down to the use cases, processes and objects that rest on it, and the code that builds them.

| decision | use cases | processes | objects | code |
|---|---|---|---|---|
| D1 Domain: a UK directory of planning-survey firms, built lean in its own repo | U5 | PR3, PR5, PR4 | O-listing, O-claim, O-notice | scripts/seed.ts, src/app/actions.ts, src/app/briefs/[token]/page.tsx, src/app/claims/confirm/[token]/page.tsx, src/app/firms/[slug]/claim/claim-form.tsx, src/app/firms/[slug]/claim/page.tsx, src/app/firms/[slug]/page.tsx, src/claim.ts, src/components/firm-card.tsx, src/db/schema.ts, src/directory.ts, src/requests.ts, src/routing.ts |
| D2 Business model M1: firms pay per brief they unlock; every lead is qualified first | U2, U4 | PR1, PR2 | O-lead, O-brief | scripts/tick.ts, src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/briefs/[token]/page.tsx, src/app/firms/[slug]/page.tsx, src/app/for-firms/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/requests/[token]/page.tsx, src/app/search/page.tsx, src/components/firm-card.tsx, src/components/get-quotes.tsx, src/components/search-form.tsx, src/db/schema.ts, src/directory.ts, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts, src/routing.ts |
| D3 We work from models: map first, territory follows, map updated | - | - | - | - |
| D4 Claims need receipts; a map is not evidence | - | - | - | - |
| D5 Sell firms intelligence on where and when demand is coming | U6 | - | - | src/app/for-firms/page.tsx |
| D6 Firms can pay in kind with spare survey capacity | U6 | - | O-slot | src/app/for-firms/page.tsx |
| D7 Delegation demands evidence up front | - | - | - | - |
| D8 A clear, traceable, business-driven information architecture; no bloat | - | - | - | - |
| D9 Threshold for M1, provisional: £100k a year at 5% capture | - | - | - | - |
| D10 Buyer pain points front and centre, synthesised, in design and in the model | - | - | - | - |
| D11 Business model first, then design around it for humans | - | - | - | - |
| D12 Build the product now on the placeholder terms; the calls come later | - | PR2 | - | scripts/tick.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/briefs/[token]/page.tsx, src/app/requests/[token]/page.tsx, src/jobsheet.ts, src/leads.ts, src/routing.ts |
| D13 M1 at £99,417 a year (5% capture) is acceptable | - | - | - | - |
| D14 Show the journey on the site; problem first; answer before asking; say why for every detail; Mermaid now, brand skin later | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |
| D15 Work management must survive sessions: nothing pending lives only in a chat; mirror the map to GitHub at the end of this session | - | - | - | - |
| D16 Product first: park the legal work (privacy notice, listing notice, removal) until the loop is solid | - | PR5 | - | - |
| D17 A piece is done when a layman can use it without help; only the brand skin comes later. The buyer side is not there yet | - | - | - | - |
| D18 Open the way people already know (trust headline, one plain question, proof, free, three steps), then open into what we've learned (normal? cost? time? season, follow-ons, one thing per screen) | - | - | - | - |
| D19 Say how we're paid and what we check; show three plain steps on the site, Mermaid stays for the map | - | - | - | - |
| D20 The quote journey shows a progress bar and, from the start, a checklist of everything we'll ask the buyer | - | - | - | - |
| D21 Home page order: the familiar headline, then 'Has the council asked you for a survey?', then how it works, then why to trust us | - | - | - | - |
| D22 The buyer gets a private status link to keep and revisit; it ends when a firm takes the job, the buyer cancels, or it expires; we notify them as things change | - | PR2 | - | scripts/tick.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/briefs/[token]/page.tsx, src/app/requests/[token]/page.tsx, src/jobsheet.ts, src/leads.ts, src/routing.ts |
| D23 A request drafter: a cheap language model reads what the buyer writes, shows the key facts as editable pills, and drafts the request the firm receives, live | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |
| D24 At most three firms per job, unless the buyer chooses a bigger pool | - | PR2 | - | scripts/tick.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/briefs/[token]/page.tsx, src/app/requests/[token]/page.tsx, src/jobsheet.ts, src/leads.ts, src/routing.ts |
| D25 Free for firms at first, to get the first firms on board; charge once they're happy and we have standing | - | PR2 | - | scripts/tick.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/briefs/[token]/page.tsx, src/app/requests/[token]/page.tsx, src/jobsheet.ts, src/leads.ts, src/routing.ts |
| D26 The status link shows the final state after a firm takes the job; email updates now, texts later; research the model options before building the drafter | - | PR2 | - | scripts/tick.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/briefs/[token]/page.tsx, src/app/requests/[token]/page.tsx, src/jobsheet.ts, src/leads.ts, src/routing.ts |
| D27 Firms get a standard job sheet plus a trimmed excerpt of the buyer's words, not a drafted story; fields come from survey standards and firms' own quote forms | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |
| D28 Show the buyer the request firms will get, beside every step, filling in live as they type and answer; the pills are its editable rows | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |
| D29 Keep the familiar form parts (checklist ticks, the step-by-step questions); read the work type and planning stage from the buyer's words too, pre-filled for them to confirm | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |
| D30 Every checklist row can be clicked to fill it in or change it; no repeated filler text; 'Something else' can be described | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |
| D31 The first screen says plainly that our AI reads what they write to make the most helpful request: what helps, ticked live; what the AI does and doesn't; honest when it isn't running; the provider isn't named | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |
| D32 Ask about the building in everyday words with examples, not its 'type' | - | PR1 | - | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/extract.ts, src/jobsheet.ts, src/leads.ts, src/postcode.ts, src/proxy.ts, src/qualify.ts |

## Code → map

| file | builds |
|---|---|
| scripts/mirror.ts | infra |
| scripts/model-views.ts | infra |
| scripts/seed.ts | PR4, O-listing |
| scripts/tick.ts | PR2 |
| src/admin.ts | PR1 |
| src/app/actions.ts | PR1, PR2, PR3, O-lead, O-claim, O-brief |
| src/app/admin/leads/page.tsx | PR1, PR2, O-lead, O-brief |
| src/app/base-url.ts | infra |
| src/app/briefs/[token]/page.tsx | PR2, O-brief, ST-U4.2, ST-U4.3, ST-U4.5, O-listing |
| src/app/claims/confirm/[token]/page.tsx | PR3, O-claim |
| src/app/firms/[slug]/claim/claim-form.tsx | PR3, O-claim |
| src/app/firms/[slug]/claim/page.tsx | PR3, O-claim |
| src/app/firms/[slug]/page.tsx | U2, U5, O-listing |
| src/app/for-firms/page.tsx | U4, U6 |
| src/app/layout.tsx | infra |
| src/app/leads/confirm/[token]/page.tsx | PR1, O-lead |
| src/app/page.tsx | U1, U2, ST-U2.1, ST-U2.2, PN1, PN2, PN3, PN4 |
| src/app/quote/page.tsx | U2, PR1, ST-U2.1, ST-U2.2, ST-U2.3 |
| src/app/quote/quote-form.tsx | U2, ST-U2.1, ST-U2.2, ST-U2.3, PR1, O-lead, PN1, PN2, PN3, PN4 |
| src/app/requests/[token]/page.tsx | PR2, ST-U2.3, O-lead, PN3 |
| src/app/search/page.tsx | U2, ST-U2.2, PR1 |
| src/app/surveys/[survey]/[region]/page.tsx | U1, ST-U2.2 |
| src/app/surveys/[survey]/page.tsx | U1, ST-U2.2 |
| src/app/surveys/page.tsx | U1, ST-U2.2 |
| src/catalog.ts | U1, ST-U2.1, ST-U2.2 |
| src/claim.ts | PR3 |
| src/components/firm-card.tsx | U2, O-listing |
| src/components/get-quotes.tsx | U2, ST-U2.3, PN3 |
| src/components/search-form.tsx | U2, ST-U2.2 |
| src/components/survey-facts.tsx | U1, ST-U2.2, PN1, PN2 |
| src/db/index.ts | infra |
| src/db/schema.ts | O-lead, O-listing, O-claim, O-brief |
| src/directory.ts | U2, ST-U2.2, O-listing |
| src/extract.ts | PR1, PN3 |
| src/jobsheet.ts | PR1, PR2, O-brief, ST-U2.3, PN3 |
| src/leads.ts | PR1, PR2, O-lead |
| src/mailer.ts | infra |
| src/postcode.ts | PR1, ST-U2.2, PN3 |
| src/proxy.ts | PR1 |
| src/qualify.ts | PR1 |
| src/requests.ts | PR3, O-claim, O-listing |
| src/routing.ts | PR2, O-brief, ST-U4.2, ST-U4.3, ST-U4.5, O-listing, PN3 |
| src/site.ts | infra |
