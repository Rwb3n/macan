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

**Operator page:** `/admin/leads`. HTTP Basic auth against `ADMIN_PASSWORD` in `.env.local`.

**Mail:** outside production it goes to `data/outbox/`. A local `next start` with `LOCAL_DEMO=1` does the same.

## Before a public deploy

- `BASE_URL` must be set. Production refuses to build email links from request headers.
- A mail provider is needed, with `LOCAL_DEMO` unset. Production refuses to send without one.
- Lead submission needs a rate limit.
- The legal pieces (the map's O-notice, PR5 and aim A3) must be built.
