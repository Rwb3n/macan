# R10: result, Part 1 (read 2026-10-24, after the method was committed in 1bcc9c3)

Evidence: `evidence/part1.md` has 13 candidates, each with a URL and the provider's own wording, plus OpenRouter's "Jev-Verified Cascade" pattern.

**Part 2 (the side-by-side test) has not run.** It needs the principal's API keys.

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
