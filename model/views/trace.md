# Trace (generated; do not edit)

Each decision, down to the use cases, processes and objects that rest on it, and the code that builds them.

| decision | use cases | processes | objects | code |
|---|---|---|---|---|
| D1 Domain: a UK directory of planning-survey firms, built lean in its own repo | U5 | PR3, PR5, PR4 | O-listing, O-claim, O-notice | scripts/seed.ts, src/app/actions.ts, src/app/firms/[slug]/claim/claim-form.tsx, src/app/firms/[slug]/claim/page.tsx, src/app/firms/[slug]/page.tsx, src/claim.ts, src/components/firm-card.tsx, src/db/schema.ts, src/directory.ts, src/requests.ts |
| D2 Business model M1: firms pay per brief they unlock; every lead is qualified first | U2, U4 | PR1, PR2 | O-lead, O-brief | src/admin.ts, src/app/actions.ts, src/app/admin/leads/page.tsx, src/app/firms/[slug]/page.tsx, src/app/for-firms/page.tsx, src/app/leads/confirm/[token]/page.tsx, src/app/page.tsx, src/app/quote/page.tsx, src/app/quote/quote-form.tsx, src/app/search/page.tsx, src/components/firm-card.tsx, src/components/search-form.tsx, src/db/schema.ts, src/directory.ts, src/leads.ts, src/proxy.ts, src/qualify.ts |
| D3 We work from models: map first, territory follows, map updated | - | - | - | - |
| D4 Claims need receipts; a map is not evidence | - | - | - | - |
| D5 Sell firms intelligence on where and when demand is coming | U6 | - | - | src/app/for-firms/page.tsx |
| D6 Firms can pay in kind with spare survey capacity | U6 | - | O-slot | src/app/for-firms/page.tsx |
| D7 Delegation demands evidence up front | - | - | - | - |
| D8 A clear, traceable, business-driven information architecture; no bloat | - | - | - | - |
| D9 Threshold for M1, provisional: £100k a year at 5% capture | - | - | - | - |

## Code → map

| file | builds |
|---|---|
| scripts/model-views.ts | infra |
| scripts/seed.ts | PR4, O-listing |
| src/admin.ts | PR1 |
| src/app/actions.ts | PR1, PR3, O-lead, O-claim |
| src/app/admin/leads/page.tsx | PR1, O-lead |
| src/app/firms/[slug]/claim/claim-form.tsx | PR3, O-claim |
| src/app/firms/[slug]/claim/page.tsx | PR3, O-claim |
| src/app/firms/[slug]/page.tsx | U2, U5, O-listing |
| src/app/for-firms/page.tsx | U4, U6 |
| src/app/layout.tsx | infra |
| src/app/leads/confirm/[token]/page.tsx | PR1, O-lead |
| src/app/page.tsx | U1, U2 |
| src/app/quote/page.tsx | U2, PR1 |
| src/app/quote/quote-form.tsx | U2, PR1, O-lead |
| src/app/search/page.tsx | U2, ST-U2.2 |
| src/app/surveys/[survey]/[region]/page.tsx | U1, ST-U2.1, ST-U2.2 |
| src/app/surveys/[survey]/page.tsx | U1, ST-U2.1 |
| src/catalog.ts | U1, ST-U2.1 |
| src/claim.ts | PR3 |
| src/components/firm-card.tsx | U2, O-listing |
| src/components/search-form.tsx | U2, ST-U2.2 |
| src/components/survey-facts.tsx | U1 |
| src/db/index.ts | infra |
| src/db/schema.ts | O-lead, O-listing, O-claim |
| src/directory.ts | U2, ST-U2.2, O-listing |
| src/leads.ts | PR1, O-lead |
| src/mailer.ts | infra |
| src/proxy.ts | PR1 |
| src/qualify.ts | PR1 |
| src/requests.ts | PR3, O-claim |
| src/site.ts | infra |
