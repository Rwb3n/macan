# R10: result, Part 1 (read 2026-10-24, after the method was committed in 1bcc9c3)

Evidence: `evidence/part1.md` has 13 candidates, each with a URL and the provider's own wording, plus OpenRouter's "Jev-Verified Cascade" pattern.

**Part 2 (the side-by-side test) has not run.** It needs the principal's API keys. (It has since run: see Part 2 below.)

## What "decision models" are
They are a real, named category on OpenRouter and Cloudflare, launched October 2026. By their makers' own words they write no text: "Send it application state and one or more typed questions, and get back a typed answer with probabilities instead of generated text" and "Jev does not produce reasoning traces, explanations, or free-form text" (https://openrouter.ai/docs/guides/community/jev; spot-checked word for word). Cloudflare's Clef is "in the same family".

**What they offer:**
- **Very cheap:** about $0.02–$0.15 per million input tokens, with output free.
- **Very fast:** typical replies in 0.12–0.62 seconds.
- **Fixed answers only:** pick one of a list, yes or no with a probability, or a score.

## What fits each part of our job (from the pages)
| Part | Fits |
|---|---|
| Pills from fixed lists (survey, project, building) | A decision model (a "choice" question per pill), or a chat model with a fixed JSON shape |
| Free values (postcode, council, date) | Code finds candidates and a decision model picks one or "none" (OpenRouter: "cannot invent a value"); or a chat model with structured output |
| The drafted request to firms | A chat model only |
| Checking the draft invents nothing | A decision model as checker (OpenRouter's cascade). The cascade was written for help-centre answers, not tested on requests like ours |

## Privacy, for UK buyers' words
- **OpenRouter:** the decision-model pages that state it say "Not currently available through EU in-region routing".
- **Cloudflare Workers AI:** promises zero retention and no training. Where requests run is not stated.
- **Anthropic:** API inputs and outputs are deleted within 30 days and not used for training by default. US-only processing is available at 1.1×.

## Consequence for the method's decision rule
A decision model alone cannot pass Part 2, because it writes no draft. The fair test is combinations:
- a chat model for the draft (and possibly the pills);
- optionally, a decision model for the pills and for checking the draft.

That is the principal's "Claude API + decision models" pairing. This finding is recorded here; the method is unchanged.

## Defects
1. **Conflicting figures:** Clef-flash's context size and price differ between Cloudflare's and OpenRouter's pages, Clef's OpenRouter price differs, and the count of decision models differs (21, 22 or 30). All are recorded.
2. **Latency:** Claude's is stated only relatively ("Fastest", "Fast"), and the Gemma chat model's wasn't found.
3. **Missing policies:** no data policy found for Liquid, and no EU-routing sentence for Perplexity and Upstage.
4. **Weaker sources:** two pages were read from Firecrawl's cache, and one figure (Mercury, "14 decisions per second") is from a search excerpt.
5. **Partial screen for the cheap chat model:** three smaller Workers AI models weren't checked for OpenRouter availability.

# R10: result, Part 2 (run 2026-10-24, inputs committed in ee684d2 before any model ran)

`run.ts` ran the 20 fixed inputs through three line-ups. Results are in `evidence/part2-results.json`. Opus 5.5 judged invented facts against `evidence/judge-checklist.md`. Spend for the whole run (models and judge) was $0.24.

| Line-up | Valid shape | No invented facts | Median time to full result | Cost per request |
|---|---|---|---|---|
| A: Claude Haiku 5.5, effort low | 20/20 | 17/20 | 2.42 s | $0.00033 |
| C: Gemma 4 26B via OpenRouter (Darkbloom) | 20/20 | 18/20 | 3.99 s | $0.00008 |
| B: Jev 1.14 decision model, after A | n/a | n/a | 0.22 s (decision call only) | $0.00008 |

**Decision rule: no candidate passes.** Both chat models miss "invents nothing in 19 of 20" and "1.5 s or less at the median". As the method says, Claude Haiku 5.5 stays as the baseline to tune.

## What was invented (judge's exact phrases)
- **A:**
  - #3: "starting with a preliminary ecological appraisal", "such as bats or great crested newts";
  - #8: "as part of the planning process";
  - #20: "A buyer needs a noise impact assessment".
- **C:**
  - #17: "The council has requested this assessment";
  - #20: "A buyer needs a noise impact assessment".

**Pattern:** the models assume which survey is needed, or that the council asked, when the text doesn't say so. That is a prompt problem, not a capability one.

## The decision model
- **Survey pick:** it agreed with Haiku in 18 of 20.
  - #6, "council just said 'ecology'": Haiku picked preliminary ecological appraisal; Jev said not_sure.
  - #9, takeaway extraction plus noise: Haiku picked ventilation; Jev picked noise. Both are defensible; the buyer needs both.
- **As a checker for invented facts:** no use as asked. Its "supported" probability on drafts with inventions (0.70, 0.59, 0.55) sat inside the range for clean drafts (0.36 to 0.92, median 0.79), so no threshold separates them.

## Design consequence
Pills don't have to wait for the draft:
- a decision model (about 0.2 s) or plain code fills the pills while the chat model writes the draft;
- the draft streams in, so speed is felt through the pills.

## Defects
1. **Latency** was measured from this machine; a UK server will differ.
2. **The judge is a model.** The principal's spot-check of 5 judgements (method) is not done yet.
3. **Gemma's route** ran on Darkbloom, whose data policy wasn't read in part 1.
4. **The inputs are synthetic and tidy.** Real buyers write differently (principal, 2026-10-24), which R11 tests.
5. **The trial run:** `evidence/part2-results-first2.json` holds the first 2 inputs, run before the full 20 to check the set-up (D7). Committed late, after the result.
