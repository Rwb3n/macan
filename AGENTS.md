# macan: how we work

**We work from models.** The principal, 2026-10-23: "models are the map. we build the territory, and the maps are updated to reflect. it's a tight, closed, loop."

- **Map:** `model/`, the business model as typed data. It holds context, use cases, stages, objects and their lifecycles, and processes, following modelkit's ladder (`D:/PROJECTS/modelkit/docs/proposals/modelkit.md`). Every element cites a source.
- **Territory:** `src/`, the product.

## The loop

1. **Change the map first.** A new feature, state or rule starts as a change in `model/`, with its source.
2. **Build the territory from it.** Where code can read the map, it imports it (for example, the lead's grades and review states come from `model/objects.ts`). It never keeps its own copy.
3. **Check.** `npm test` includes `model/check.test.ts`. It fails when:
   - the levels disagree (balancing): a use case's actor is not in the context, a flow no use case explains, or a stage's use case is unknown;
   - the code disagrees with the map.
4. **Regenerate the views.** `npm run model:views` writes `model/views/` (diagrams, and the HTML page) from the map. Views are never edited by hand.
5. **When the territory teaches us something,** for example a state the code needed, update the map in the same change, so the check passes and the map shows it.

Status on each element (`built`, `part`, `missing`, `outside`) is part of the map. Change it in the same commit that changes the code.

## Rules

- **Business first.** No technology appears above level 3 (§1 of the modelkit proposal).
- **Three to five things per view.** More means: group, then drill down.
- **Name people by role.** No client or personal data in the model.
- **Receipts, not maps** (principal, 2026-10-23: "i want cold hard receipts"). A claim about the world carries a `receipt`: a URL, a filing or a measured number. Otherwise it is marked `guess: true`. An inference is never stated as fact, in the model or in a reply.
- **Decisions are the principal's,** quoted word for word with their date in `source`. Guesses are marked `guess: true`.
