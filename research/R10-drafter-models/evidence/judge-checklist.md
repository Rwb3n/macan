# R10 part 2: invented-facts checklist (fixed before any model runs)

A draft **invents a fact** if it states anything about the buyer's job that is not in the buyer's text and not a pill the buyer kept. That includes:
- a survey type, building age, material, location, postcode, council, size, deadline, budget, number of homes, species or history the text doesn't give;
- a price, a promise of timing, or a legal claim (e.g. "the council will accept…") presented as fact;
- a name, phone or email (the draft must hold no contact details at all).

**Not an invention:**
- restating the text in other words;
- saying a fact is unknown or should be confirmed;
- naming the survey the buyer said the council asked for;
- a pill value that is a plain normalisation of the text (e.g. "OX4" for "in OX4", "Leicester" for "LE2").

**Grading:** for each draft, the judge lists every invented fact with the exact phrase, or "none". A draft passes if the list is empty. The principal spot-checks 5 judgements.

**Schema-valid:** the response parses against the output schema with no repair.
**Speed:** time from sending the request to the full pills-and-draft response, measured on this machine.
