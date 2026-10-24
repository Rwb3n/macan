# R11: does the request drafter hold up on how real buyers write? (pre-registered 2026-10-24, before any post is collected or any model runs)

Principal, 2026-10-24: "use places like mumsnet to get real writing style and grammar and spelling and stuff like that to really test the system".

**Why:** R10's 20 inputs were synthetic and tidy. In R10, no line-up passed the rule. The inventions were mostly assumed surveys, which looks fixable in the instructions. This study tests that fix on real writing.

## Inputs: 20 real posts, chosen by a fixed rule
- **Sources and searches, fixed now, run in this order:**
  1. Mumsnet: "bat survey" planning
  2. Mumsnet: "planning" "survey" council "do I need"
  3. MoneySavingExpert forums: "bat survey" planning
  4. MoneySavingExpert forums: "flood risk assessment" OR "ecology survey" planning
  5. Reddit r/HousingUK or r/DIYUK: planning survey council
- **A post qualifies if** it is the opening post of a thread, from 2018 or later, at least 25 words, and a person describes their own need for a survey or report for a planning application.
- **Order and caps:** qualifying posts are taken in search-result order, at most 6 per source, until 20.
- **Fallback:** if a source can't be read in full (e.g. Reddit), it is skipped and the next source fills the gap. Skips are recorded.
- **Storage:** the post text is kept exactly as written, with no usernames, in `D:/data/macan/r11/inputs.json`. It is real people's writing, so it is kept outside `research/`.
- **What `research/` holds:** `evidence/sources.csv` (id, URL, date, word count) and results.
- **Collection** is by a sub-agent under D7: URL and date per post, and a spot-check after the first 5 posts.

## Line-ups, each on all 20 posts
- **A1:** Claude Haiku 5.5 with R10's prompt (v1), as R10.
- **A2:** Claude Haiku 5.5 with `prompt-v2.txt` (committed with this method).
- **C2:** Gemma 4 26B via OpenRouter with `prompt-v2.txt`.
- **P:** the Jev 1.14 decision model picking the survey alone. This measures time to the first pill, for the split design R10 suggested.

Judging is the same as R10: Claude Opus 5.5 against `research/R10-drafter-models/evidence/judge-checklist.md`. The principal spot-checks 5 judgements.

## Decision rule
1. **A drafting line-up passes** if it gives a schema-valid output on 20 of 20 posts and invents nothing on at least 19 of 20.
2. **Speed:**
   - **The split design passes** if P's median is 1.5 seconds or less;
   - **the draft** must finish in 5 seconds or less at the median, because it streams in while the buyer looks at the pills.
3. **If several drafting line-ups pass,** the cheapest is chosen. If none passes, the result names the failure patterns for the next prompt.

## Limits, stated before the read
- **Public forum posts are a sample of people who post.** Their writing may be longer or angrier than what someone types into a form.
- **Posts often hold several questions or a long story.** That is a harder test than a form, on purpose.
- **Latency is measured from this machine.**
- **Defects** found after the read go in `result.md`; this method is not changed.
