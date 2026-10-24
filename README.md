# macan (codename)

A UK directory of planning-survey firms, built lean. **What it is and why:** `model/views/map.md`, or `map.html` for the page. **How we work:** `AGENTS.md`.

## Run

```
npm install
npm run db:seed            # loads data/seed/firms.json (gitignored: company data stays out of git)
npm run dev                # http://localhost:3000
npm run check              # typecheck + tests, including the map's checks
npm run model:views        # regenerate model/views/ after changing model/ or a Builds line
```

**Starting cold:** read `AGENTS.md`, then `model/views/open.md` (open questions) and the `missing` and `part` items in `model/views/map.md`. The same backlog is mirrored as GitHub issues (`npm run mirror`), but the map is the source.

**Other scripts:** `npm run tick` chases and lapses firms' briefs (pages also do it on load). `npm run mirror` syncs the map's backlog to GitHub issues, using the `gh` CLI.

**`.env.local`** (git-ignored; never commit keys):
- `ADMIN_PASSWORD`: the operator page.
- `ANTHROPIC_API_KEY`: optional. With it, Claude Haiku reads the buyer's words into pills (`src/extract.ts`). Without it, plain word rules do, and the page says so. The current keys are 7-day test keys from 2026-10-24 (OpenRouter capped at $5).
- `OPENROUTER_API_KEY`: research runs only (R10, R11).
- `DATABASE_PATH`, `OUTBOX_DIR`: optional, to run a demo against a scratch database and outbox.

**Operator page:** `/admin/leads`. HTTP Basic auth against `ADMIN_PASSWORD` in `.env.local`.

**Mail:** outside production it goes to `data/outbox/`. A local `next start` with `LOCAL_DEMO=1` does the same.

## Before a public deploy

- `BASE_URL` must be set. Production refuses to build email links from request headers.
- A mail provider is needed, with `LOCAL_DEMO` unset. Production refuses to send without one.
- Lead submission needs a rate limit.
- The legal pieces (the map's O-notice, PR5 and aim A3) must be built.
