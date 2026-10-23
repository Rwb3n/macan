# macan (codename)

A UK directory of planning-survey firms: buyers find a firm by the survey a planning application needs and where the site is; firms claim their free listing. Lean on purpose: Next.js, SQLite, no auth yet.

Decided 2026-10-23 (callsheet log 000071) on the evidence of callsheet's screens S5–S10.

## Run

```
npm install
npm run db:seed            # loads data/seed/firms.json (gitignored: company data stays out of git)
npm run dev
npm run check              # typecheck + tests
```

## Shape

- `src/catalog.ts`: survey types (with what / when / season), regions. The single source.
- `src/db/`: SQLite schema (Drizzle) and DDL.
- `src/directory.ts`: search queries. `src/requests.ts`: quote and claim submissions (validated with Zod). `src/claim.ts`: claim proof (email on the firm's registrable domain).
- `src/app/`: pages. Server components read the database directly; forms use server actions.

## Not built yet

- Claim confirmation link and firm editing (claims are stored; confirmation is manual).
- Sending quote requests to firms (stored; forwarded by hand).
- Pausing enquiries, choosing jobs and areas (described on /for-firms as the design).
- Privacy notice, Article 14 notice to listed firms, removal requests, retention.
- Hosting.
