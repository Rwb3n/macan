# macan: how we work

The only rules file. What the business is lives in `model/`; what we know lives in `research/`; the product lives in `src/`.

## Information architecture (D8)

```
model/      THE MAP: the spine; typed data, every element cites what it rests on
  why.ts      D decisions (principal's words) · A aims
  who.ts      P parties · F flows · CH channels · ALT alternatives
  what.ts     U use cases · ST stages
  how.ts      O objects and lifecycles · PR processes
  open.ts     Q open questions: every guess, with its test
  index.ts    the registry, the research resolver, the trace
  check.test.ts, render.ts, views/ (generated only)
research/   RECEIPTS: R<n>-<name>/ with method.md (before the read), result.md, evidence/; R0-imported/ = callsheet screens, unchanged
src/        THE TERRITORY: every module's first line is "// Builds: <ids>" (or "infra")
scripts/    the same rule as src/
```

**Read it top-down:** why (D) → who (P, CH) → what (U, ST) → how (PR, O) → code.
- Each element's `refs` names what it rests on: a **D**, an **R** (`R3`, `R0/S7`) or a **Q**.
- A guess cites its Q.
- A claim about the world carries its `receipt`.

**Nothing else is added.** No hand-written status files, trackers, briefs or second descriptions: status is the `status` field in the map. A new folder or a new kind of file needs the principal's say-so.

## The loop (D3)

1. **Change the map first,** with its refs.
2. **Build from it.** Code imports the map where it can (the lead's grades, reviews and checks come from `model/how.ts`) and names what it builds in its Builds line.
3. **Check.** `npm test` runs `model/check.test.ts`, which fails when:
   - an id doesn't resolve;
   - something dangles: a use case with no party on the context, a flow no use case explains, a stage or process with no use case;
   - code names no ids, or a built or part-built element has no code;
   - a study is cited by nothing, or has no method or result;
   - the code disagrees with the map;
   - a view is stale.
4. **Regenerate the views:** `npm run model:views` writes `model/views/` (`map.md`, `trace.md`, `open.md`, `map.html`).
5. **When the code teaches us something,** update the map in the same commit.

## Rules

- **Business first.** No technology appears above processes (modelkit, `D:/PROJECTS/modelkit/docs/proposals/modelkit.md`).
- **Three to five things per view.** More means: group, then drill down.
- **Name people by role.** No client or personal data in `model/` or `research/`. Company-level data stays in `D:/data/`.
- **Receipts, not maps (D4).** A claim about the world carries a receipt: a URL, a filing, a measured number. Otherwise it is a guess with a Q. An inference is never stated as fact, in the model or in a reply.
- **Pre-register a study before the read.** Write `method.md` first, with its decision rule, then read. Defects found after the read go in `result.md`. An exploration with no rule says so in its method (see R2).
- **Delegation demands evidence up front (D7).** Every sub-agent task:
  1. names the receipt per claim and the output column that holds it;
  2. is spot-checked against those receipts after the first 10 rows, before the rest of the spend.

  Anything unbacked is dropped as a defect.
- **Decisions are the principal's,** recorded in `model/why.ts` word for word, with the date.
