# R11: result (run 2026-10-24, method and prompt v2 committed in 25597f8 before any post was collected)

Evidence: `evidence/sources.csv` (5 posts: URL, date, word count), `evidence/collection-log.md` (every search result looked at, with its outcome) and `evidence/results.json` (model outputs and judgements by post id). The posts themselves are in `D:/data/macan/r11/inputs.json`, outside the repo.

## Shortfall: 5 real posts, not 20
At a fixed depth of 50 results per source, 5 posts qualify:
- 3 from Mumsnet "bat survey";
- 0 from Mumsnet "do I need";
- 1 from MSE "bat survey";
- 1 from MSE flood or ecology;
- Reddit refused all automated reading (Firecrawl, `.json`, old.reddit).

Most hits failed the rule: dated before 2018, not the opening post, someone else's application, or a buyer's building survey rather than a survey for planning. The posts that qualified are long (114 to 481 words), messy and detailed.

As the method says, the line-ups ran on what qualified. On 5 posts the rule ("19 of 20") is read as "invents nothing on any".

| Line-up | Valid | Invents nothing | Median time |
|---|---|---|---|
| A1: Haiku 5.5, R10 prompt (v1) | 5/5 | **5/5** | 4.9 s |
| A2: Haiku 5.5, prompt v2 | 5/5 | 2/5 | 5.4 s |
| C2: Gemma 4, prompt v2 | 5/5 | 3/5 | 5.7 s |
| P: Jev 1.14 survey pick | n/a | n/a | **0.24 s** |

## Decision rule
- **Drafting:** only A1 passes. Its median time, 4.9 s, is inside the 5-second limit for a draft that streams in.
- **Split design:** P's 0.24 s is well inside 1.5 s. Its survey picks matched A1 on 4 of 5. On post 3 (a historic building), P said heritage statement where A1 said archaeology; the post asks about a historic buildings survey, so P's pick is the closer one.
- **But n = 5,** so this does not settle the choice. Across R10 and R11, the v1 prompt is invention-free on 22 of 25 inputs: 17 of 20 synthetic, 5 of 5 real.

## What the inventions were
- **v2 made it worse, with a new kind of error, misattribution:**
  - "Your colleague quoted £540": another firm's quote addressed to this firm as its own colleague's;
  - "results are normally valid for a year": a general claim stated as fact;
  - an advice request the buyer didn't make.
- **Gemma:**
  - it named a survey the buyer didn't ("preliminary ecological appraisal");
  - it turned a quoted price into the buyer's "Budget: £2750".
- **The v2 instructions** ("say 'the buyer thinks…'") pushed the model to restate and reframe, and it reframed wrongly. The next prompt should stay close to v1 and add only a narrow rule against assuming the survey (R10's failure).

## A product question this surfaced (for the principal)
Real buyers mention **other firms' quotes and prices** ("an ecologist quoted £540"). Every line-up carried them into the draft that goes to a competing firm. Whether that should be passed on, dropped, or offered as a choice is a decision for the buyer and the principal, not the model. → Q27.

## Defects
1. **Depth:** the method gave no search depth. It was set to 50 for all sources after the first 20 results of sources 1 to 4 had been seen; the order already taken was kept.
2. **Reddit:** unreadable by any route tried.
3. **Exclusions:**
   - 20 of source 2's later results were excluded on title and snippet without opening the post (logged);
   - one exclusion is borderline (logged);
   - dates used to exclude threads came from a model-based extraction mode, not verbatim receipts.
4. **Small sample:** n = 5 is too small to separate the line-ups with confidence.
5. **The judge is a model;** the principal's 5-judgement spot-check is still to do (shared with R10).
6. **Encoding:** the "£" signs are stored correctly; they only display garbled on this machine's console.
