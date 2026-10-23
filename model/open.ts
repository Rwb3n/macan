// Open questions: every guess the map rests on, each with the test that would settle it.
import type { Question } from "./types"

export const questions: Question[] = [
  { id: "Q1", state: "open", name: "Architects and planning consultants are a repeat buyer and a referral channel", refs: ["R2"],
    test: "Ask 5 small practices how they choose survey firms and whether they keep a panel" },
  { id: "Q2", state: "open", name: "Firms are capacity-constrained in season, so fit matters more than volume (callsheet A6)", refs: ["R2"],
    test: "On the calls: are they booked up May-September, and would pausing enquiries matter?" },
  { id: "Q3", state: "some", name: "Firms pay per lead in this trade (callsheet A7)", refs: ["R1"],
    test: "On the calls: what would unlocking a sample brief be worth; anchor £26 (Worklanded)", note: "some: one vendor sells at £26 (R1)" },
  { id: "Q4", state: "open", name: "Buyers want an independent second quote when a first survey recommends a follow-on", refs: ["R2"],
    test: "10 real follow-on recommendations: share taking a second quote, and the price spread" },
  { id: "Q5", state: "open", name: "Season-aware matching works both sides (off-season first surveys, pre-booked summer slots)", refs: ["R2"],
    test: "Ask 10 firms whether they'd buy off-season leads and sell advance slots" },
  { id: "Q6", state: "open", name: "A postcode-to-council trigger checker beats Signed Off's generic one", refs: ["R2"],
    test: "Code triggers from 20 local validation lists; compare answers for a loft conversion" },
  { id: "Q7", state: "open", name: "A 48-hour reply promise wins against firms that ignore small jobs", refs: ["R2"],
    test: "Mystery-shop 20 firms in April-June" },
  { id: "Q8", state: "open", name: "Booked-out firms would pass overflow to a vetted local firm for a referral fee", refs: ["R2"],
    test: "Ask on the calls" },
  { id: "Q9", state: "open", name: "Independent noise/air firms and NI/Scotland firms are reachable where Arbtech refers out or is absent", refs: ["R2"],
    test: "Call 5 acoustic firms; count firms per NI council area" },
  { id: "Q10", state: "open", name: "M1 alone clears the business's threshold", refs: ["R3", "D9"],
    test: "R3: M1 at 5% capture = £99,417 against £100k provisional (D9); principal to set the threshold now reference points exist",
    note: "At the line" },
]
