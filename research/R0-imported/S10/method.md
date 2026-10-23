<!-- Imported unchanged from callsheet 98c5786, docs/screens/s10-seed-factcheck/method.md. Read-only here: corrections go in a new study. -->

# S10: fact-check of the seed research behind the 4rfv-competitor case (pre-registered 2026-10-23, before any verification read)

The principal is weighing environmental consultancy (#78, S5–S9) against the original idea: a competitor to 4rfv.co.uk that delivers far more value. That idea rests on `docs/strategic-positioning.md` (locked), `archive/0-strategic-frame` and `archive/1-investigation`. S10 checks whether that research holds up.

## What has been read, and what hasn't
- **Inventory.** An extraction pass read the corpus and listed 173 checkable external claims with file:line references. It used no web access. The inventory is kept outside the repo in the session scratchpad, and its claim ids are cited here. It found:
  - **No URLs** anywhere in the corpus.
  - **About 122 claims unsourced.**
  - The `*-research.md` files labelled as agent output.
  - **25 internal contradictions.**
- **4rfv research.** A separate research pass (4rfv today, its owner, search visibility, the UK competitor set) was started before this method was written. Root has not read its output. It is evidence gathered without knowing the verdict rule, not a verification.
- **ArtilleryIQ research.** A third pass (artilleryiq.com) has been read. It informs the alternative model (lead intelligence rather than listings), not any claim below.

## Claims checked
The 25 claims the inventory rates **H** (the case depends on them):

| Group | Claims |
|---|---|
| 4rfv | C1, C2, C5, C6, C9, C10, C11, C12, C16, C19, C21 |
| The Knowledge / MBI | C26, C27, C31 |
| Competitive gap | C60, C61 |
| Market size | C82, C83 |
| Willingness to pay | C93, C94 |
| Buyer behaviour | C99, C100, C101 |
| Timing thesis | C110 |
| Data readiness | C170 |

M and L claims are checked only where an H claim depends on them.

## Verdicts
Each claim gets exactly one verdict, with a URL, filing or data file for every source.

| Verdict | Meaning |
|---|---|
| **confirmed** | A primary source agrees within the stated precision. Primary sources: the site itself, live or Wayback; a Companies House filing; an audit certificate; a search-volume read. |
| **outdated** | Primary evidence shows it was true at some point but is not true now. |
| **partly** | Primary evidence agrees with part of the claim, or only a secondary source agrees. |
| **refuted** | Primary evidence contradicts it. |
| **unverifiable** | No primary source exists or can be reached. A claim that is the research agent's own estimate is unverifiable by definition. |

**Claims that need people:** the buyer-behaviour claims (C99–C101) cannot be confirmed from the web. They are recorded as **unverifiable** unless search data or published surveys address them. A buyer interview test is proposed, not run.

## Decision rule
- **Core premise:** C1, C2, C6, C9, C21, C82, C83, C100, C110.
- **Failure test:** count the core-premise claims that come out **refuted** or **unverifiable**.
  - 6 or more of the 9 → the seed research is **not evidence** for the 4rfv-competitor case. The case then stands only on new evidence, gathered by the same pre-registered screens as S2–S9.
  - 3 or fewer → the seed case **stands**, subject to the corrections.
  - Between the two → it stands **in part**, and the result names the claims that must be re-established.
- **The choice stays with the principal.** S10 informs the domain choice; it does not make it.

## Known limits, stated before the read
- **Hindsight.** Web state in Oct 2026 may differ from Feb 2026, when the research was written. Wayback snapshots near Feb 2026 are preferred, and a claim that held in Feb but not now is marked **outdated**, not refuted.
- **Filings.** Companies House figures can only be checked as far as the filed accounts disclose them (micro and small accounts omit turnover).
- **Tooling.** Verification passes run as sub-agents with separate output files. They are given this method and the claim text, and they see no other verdicts.
- **Defects** found after the read go in `result.md`; this method is not changed.
