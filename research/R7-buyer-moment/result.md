# R7: result (read 2026-10-24, after the method was committed in f4bc9ca)

Exploration; no decision rule. Every claim below cites its source.

## 1. The buyer's moment, in their order
From `research/R2-gaps/evidence/gap-buyer.md` (each line there has its URL).

**The trigger is the council, and it's a shock.** "Recently applied for planning permission … Only to be told I needed a 'bat survey'" (MSE-2013). "The council says we need a bat survey before we can replace the roof" (MN-racket).

**Then they ask, in this order** (one post asks the first four in a single breath: "we've now been told we need a bat survey. Does anyone have any experience of this, cost, time etc. Or recommendations?", MN-2014):
1. **Is this normal, and do I really need it?** "When is a bat survey needed for planning?" (r/HousingUK). "why do we need to spend £2k+ on surveys, if we just agree to do mitigations?" (MN-racket).
2. **How much?** "I'm worried the costs will escalate to £1000 +" (MN-2014). The follow-on bill is the big fear (about 14 sources): "£28,726.80 for Phase 2 surveys" (TP-A).
3. **How long, and will it hold me up?** "also delay plans" (MN-2014). "you could miss it and it can set you back months" (MN-2014). "until they're done you're just, stuck" (Reddit snippet).
4. **Who do I go to?** "the planning officer doesn't recommend anyone, so I'm at the mercy of Google" (MSE-p2). "Or recommendations?" (MN-2014).
5. **Can I trust them?** "this is starting to feel like a racket" (MN-racket). "known for finding things on purpose" (TP-A).
6. **Will the council accept it?** "phone the planning department and ask who they accept surveys from before paying out" (MN-2014).
7. **Will anyone answer me?** "Requested quote over two weeks ago - heard nothing." (TP-A).

## 2. What tested UK patterns say
- **Start page** (https://design-system.service.gov.uk/patterns/start-using-a-service/):
  - give "just enough information to help them understand what the service does and whether it will meet their need";
  - name it for "the problem it solves";
  - one start button;
  - say "how much it costs to use the service and roughly how long it will take".
- **One thing per page** (https://www.gov.uk/service-manual/design/form-structure): each page holds "one piece of information you're telling a user, one decision they have to make, one question they have to answer". This helps people "find their way through an unfamiliar process" and "use the service on a mobile device". "Know why you're asking every question."
- **Question pages** (https://design-system.service.gov.uk/patterns/question-pages/):
  - "make sure it's clear to users why you're asking each question";
  - "allow users to answer 'I do not know' or 'I'm not sure'";
  - "only ask for a piece of information once";
  - always a Back link and a "Continue" button;
  - hint text is "a single short sentence".
- **Check answers** (https://design-system.service.gov.uk/patterns/check-answers/): a summary with "Change" links before sending. It increases "users' confidence".

## 3. What "normal" looks like on UK quote sites (opening screens, 2026-10-24)
- **Checkatrade** (https://www.checkatrade.com/):
  - **Headline:** "Find a tradesperson you can trust".
  - **Trust:** "Every trade passes up to 12 checks", "6M+ real reviews", "£1,000 guarantee".
- **MyBuilder** (https://www.mybuilder.com/):
  - **Headline:** "The reliable way to hire a tradesperson".
  - **First ask:** "What is your job?"
  - **Steps:** "Post your job for free / Tradespeople respond / Review profiles and choose".
  - **Trust:** "undergo checks at registration - such as ID documents, company details …".
- **Bark** (https://www.bark.com/en/gb/):
  - **Headline:** "Find the perfect professional for you".
  - **Promise:** "Get free quotes within minutes".

**Shared shape:**
- a headline that promises trust;
- one plain question;
- proof of checks;
- "free";
- three short steps.

None leads with a list of categories or a dropdown.

## 4. What this says about our buyer pages (judgement, against the receipts above)
- **The home page opens on our model, not the buyer's moment.** It asks them to choose a survey from a dropdown, the thing they don't know. The problem-first route is below the fold.
- **No answer to "can I trust you?"** (question 5). There's no who, no why it's free, and no checks shown.
- **The step-by-step journey is a flowchart,** where the quote sites use three short numbered steps.
- **The form puts several questions per step,** with long grey hints under each, against one thing per page and one-sentence hints.
- **"0 firms" is shown against surveys.** That reads as empty.
- **Questions 1–3 (normal? cost? time?)** are answered only after the buyer has typed their problem, not on the page they land on.

## Limits
- **No buyer has been watched using our pages.**
- **The quote sites sell trades, not planning surveys.**
- **Almost all the buyer evidence is about bat surveys** (R2's own caveat).
