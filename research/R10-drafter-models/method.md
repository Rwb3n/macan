# R10: which model should draft the buyer's request? (pre-registered 2026-10-24, before any read)

Principal, 2026-10-24: "wed use a cheap llm, maybe one of the new decision models" and "claude API + openrouter or cloudflare decision models (new type of models come out recently)". Then: "Research, then compare" (D23, D26, Q26).

**The job:** as a buyer types a short description (50–300 words) of a planning-survey need, return within about a second:
- key facts as pills (survey, project, building details, deadline, council or postcode);
- a drafted request to firms.

The draft is redone when pills change. It needs structured output (a fixed shape), must invent nothing, and must keep the buyer's words private.

**Known before the read:** Claude's current price list (claude-api reference, cached 2026-10-06):
- Haiku 5.5: $0.10 in / $0.50 out per million tokens;
- Sonnet 5.5: $2 / $10;
- Opus 5.5: $4 / $20.

Nothing is known about "decision models". Claude has no knowledge of them; that is what this finds out.

## Part 1: what are they? (desk research, receipts per claim)
1. **What "decision models" are:** the term as OpenRouter and Cloudflare use it, from their own pages (announcements, docs, model pages): what they do, and how they differ from chat models.
2. **For each candidate (decision models on OpenRouter and on Cloudflare Workers AI, plus Claude Haiku 5.5 as the baseline), record:**
   - price per million input and output tokens;
   - stated latency or throughput;
   - whether it can return structured output (a JSON schema);
   - context size;
   - where requests are processed, and data retention or training use (for UK buyers' words);
   - terms that matter for a commercial product.
3. **Every row carries the URL and the verbatim wording.**

## Part 2: side-by-side test (only after Part 1, and only with the principal's API keys)
- **Inputs:** the same 20 synthetic buyer descriptions for every candidate. Written before any model is run and fixed in `evidence/inputs.json`; no real buyer data. They span bat, ecology, flood, heritage, drainage and vague requests.
- **Per candidate, recorded:**
  - time to first result and to full result;
  - tokens and cost;
  - schema-valid output (yes/no);
  - invented facts: anything in the draft not in the input, judged by Claude against a written checklist, with the principal spot-checking 5.
- **Decision rule:** choose the cheapest candidate that, on the 20 inputs:
  - invents nothing in at least 19;
  - gives schema-valid output in all 20;
  - returns pills in 1.5 seconds or less at the median.

  If none passes, report it, and keep Claude Haiku 5.5 as the baseline to tune.

## Limits, stated before the read
- **New products change fast.** Prices and names are as of the read date.
- **Twenty inputs** show fitness, not a full evaluation.
- **Latency measured from this machine** differs from a hosted server.
- **Defects** found after the read go in `result.md`; this method is not changed.
