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

## Leads and qualification (docs/brief.md §5a)

- A buyer's request becomes a **lead**, graded at once on four checks (`src/qualify.ts`):
  - **real:** has a planning purpose;
  - **serious:** email confirmed;
  - **timely:** the deadline fits the survey's season;
  - **complete:** a firm could price it.
- **The buyer sees the result straight away,** for example "fieldwork can't start until May 2027".
- **Confirmation needs a button press** on the emailed link. A scanner opening the link doesn't count.
- **The operator approves qualified leads** at `/admin/leads`. Access is HTTP Basic against `ADMIN_PASSWORD` in `.env.local`, checked in the proxy and again inside the action.
- **Mail outside production** is written to `OUTBOX_DIR` (default `data/outbox/`). In production, with no mail provider, it refuses to send.

## Not built yet

- Offering approved leads to firms as briefs, and unlocking them (M1).
- Claim confirmation link and firm editing (claims are stored; confirmation is manual).
- Pausing enquiries, choosing jobs and areas (described on /for-firms as the design).
- A real mail provider.
- Privacy notice, Article 14 notice to listed firms, removal requests, retention.
- Hosting.
