# R6: what survey firms say about briefs, terms, season and overflow (pre-registered 2026-10-24, before any call)

Principal, 2026-10-24: asked "what to do now"; agreed ("sure") to firm calls, with the principal calling and Claude preparing.

**What it settles:** Q2 (season), Q3 (what a brief is worth), Q5 (off-season, advance slots), Q8 (overflow), Q11 (standard brief), Q15 (routing terms), Q16 (settlement). It also explores firm-side pain (no rule). The principal decides the terms afterwards. This study informs that decision; it does not make it.

## Sample
- **Frame:** the 134 CIEEM Registered Practices that list bat surveys (R4 pull). Bat surveys carry most buyer pain (R2), and every listing has a phone number. Using the directory to find and contact practices is its intended use. Nothing from it is copied into the product (CIEEM terms cl. 2.1, 2.3).
- **Draw:** sort by practiceId, then `random.Random(20261025).sample(frame, 15)`.
  - The first 10 are the sample; the next 5 are reserves, used in order.
  - A practice is replaced after **2 unanswered attempts on different days**, or a refusal. Replacements are recorded.
  - National multi-disciplinary firms (3+ office postcodes in R5) are replaced by the next reserve: they are not the small firms M1 serves.
- **Target:** 10 completed calls. **Floor:** 6. Fewer than 6, and the study reports as underpowered and moves no question.

## The call (about 10 minutes; the principal calls)
**Opening, said as written:** "Hi, I'm setting up a service that passes checked planning-survey enquiries to local ecology firms. I'm not selling anything today. Could I ask you eight quick questions about how you get work? About ten minutes. I won't name your firm anywhere."

If no: thank them, record a refusal. If yes, ask in this order:

1. **Season (Q2).** "Last May to September, did you turn work away because you were full?" *yes / no / sometimes*. "How far ahead were you booked in June?" *(weeks)*
2. **Where work comes from (Q1, exploration).** "Where do your best jobs come from?" Note the share they give to architects and agents, repeat clients, web and directories.
3. **Paying to be found (exploration).** "Do you pay for any listings or leads now, like CIEEM, Bark, Checkatrade or Google ads? What's good and bad about them?" *(their words)*
4. **Standard brief (Q11).** Read or send the **sample brief** below, then: "Would you rather get enquiries like this, or as they come now?" *brief / as now / no difference*
5. **Worth (Q3).** "If seeing the buyer's contact for that brief cost £26, would you pay?" If yes: "and at £40?" If no: "and at £15?" Record the highest yes.
6. **Competition and speed (Q15).**
   - "If the same brief went to you and other firms, how many others before it's not worth it?" *(number)*
   - "In June, how fast can you reply to a new enquiry?" *(hours)*
7. **Paying (Q16).** "How would you rather pay for briefs you unlock: card each time, monthly invoice, prepaid credit, or surveys from your spare capacity instead of cash?" *(one; a second choice if offered)*
8. **Off-season and overflow (Q5, Q8).**
   - "Would you take first-visit surveys booked October to April, or sell summer slots in advance?" *yes / no, each*
   - "When you're full, would you pass a job to another vetted firm for a referral fee?" *yes / no*

**Close:** "Thanks. Can I come back to you when it's running?" *yes / no*

## Sample brief (fixed stimulus, synthetic, built from what PR2 sends)
> **Bat survey near OX1 (South East).**
> Loft conversion · The council asked for a survey · needed by 1 July 2027.
>
> 1930s semi, loft conversion with two dormers; the council's validation asked for a bat survey. Clay tiles; the work touches the roof.
>
> Checked: real (email confirmed), serious, timely (season fits the deadline), complete.
>
> Unlock the buyer's contact or pass, within 48 hours.

## Recording
- **One row per call** in `D:/data/macan/r6/calls.csv`, holding the firm's name (company-level data).
- **In `research/`:** firms appear only as Firm 1–10, with answers and short verbatim quotes. **No names of people anywhere.**
- **Receipt per claim:** the call row (date, time, duration, answers as said). The principal records; Claude collates. After the first 3 calls, Claude checks the rows for completeness before the rest (D7: spot-check early).

## Decision rule (n = completed calls)
| Q | Moves to **answered (yes)** if | Moves to **answered (no)** if | Otherwise |
|---|---|---|---|
| Q2 season | ≥ 60% turned work away (yes or sometimes) | ≤ 20% | some |
| Q3 worth | ≥ 50% would pay £26 | ≤ 20% would pay £15 | some; record the price ladder |
| Q5 off-season | ≥ 50% yes to either | ≤ 20% yes to both | some |
| Q8 overflow | ≥ 40% yes | ≤ 10% | some |
| Q11 standard brief | ≥ 70% prefer the brief | ≥ 50% prefer as now | some |

- **Q15 terms:** report the median "how many others" and the median reply hours. They become the **proposal** to the principal for `firmsPerLead` and `replyHours`. The principal sets them.
- **Q16 settlement:** report the count per option. The principal decides.
- **Explorations** (questions 2–3, firm pain): themes with counts and quotes; no rule.

## Known limits, stated before the read
- **CIEEM practices only:** firms that pay a body, listing bat surveys. Unlisted firms may answer differently.
- **Small n:** 10 calls give direction, not proportions. A 60% rule at n = 10 means 6 firms.
- **Stated, not revealed:** "would pay £26" is a stated preference, not a payment. Real unlocks (PR2 live) are the stronger test.
- **The caller is the founder,** which may push answers towards politeness. The script avoids leading words, and the price question goes up or down from one anchor.
- **Defects** found after the calls go in `result.md`; this method is not changed.
