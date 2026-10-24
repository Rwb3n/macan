// How (levels 2-3): the objects we track, their lifecycles, and the processes that move them.
// Code reads the lead's grades, reviews and checks from here; it keeps no copy.
import type { BusinessObject, Process } from "./types"

export const LEAD_GRADES = ["qualified", "awaiting-confirmation", "needs-info", "not-a-fit"] as const
export const LEAD_REVIEWS = ["new", "approved", "rejected"] as const
export const LEAD_CHECKS = ["real", "serious", "timely", "complete"] as const
export const BRIEF_STATES = ["offered", "unlocked", "declined", "lapsed", "quoted", "won", "lost"] as const

// Routing terms (PR2). Business choices not yet made by the principal: each is a guess with its test (D11: model first).
export const ROUTING = {
  firmsPerLead: 3, // Q15: Signed Off offers "quotes from up to 3", Bark shares with up to 5, Worklanded sells to 1 (R1, R2)
  replyHours: 48, // Q15, Q7: the 48-hour reply promise
  unlockFeePence: 2600, // Q3: anchor £26 a lead (Worklanded); recorded as owed, not taken (Q16)
  claimedOnly: true, // Q15: only firms that claimed their listing receive briefs; unclaimed firms are not emailed
} as const

export const objects: BusinessObject[] = [
  {
    id: "O-lead", name: "Lead", status: "part", table: "leads", refs: ["D2"], note: "offered, closed and expired are read from the lead's briefs (and when it was routed)",
    initial: "received",
    states: ["received", "awaiting-confirmation", "needs-info", "not-a-fit", "qualified", "approved", "rejected", "offered", "closed", "expired"],
    transitions: [
      { from: "received", to: "awaiting-confirmation", by: "graded at intake" },
      { from: "received", to: "needs-info", by: "graded at intake" },
      { from: "received", to: "not-a-fit", by: "graded at intake" },
      { from: "awaiting-confirmation", to: "qualified", by: "buyer confirms" },
      { from: "awaiting-confirmation", to: "needs-info", by: "buyer confirms" },
      { from: "needs-info", to: "qualified", by: "buyer adds details" },
      { from: "qualified", to: "approved", by: "operator" },
      { from: "qualified", to: "rejected", by: "operator" },
      { from: "needs-info", to: "rejected", by: "operator" },
      { from: "not-a-fit", to: "rejected", by: "operator" },
      { from: "awaiting-confirmation", to: "rejected", by: "operator" },
      { from: "approved", to: "offered", by: "routing: briefs sent" },
      { from: "approved", to: "expired", by: "routing: no firm matches" },
      { from: "offered", to: "closed", by: "a firm unlocks, none still deciding" },
      { from: "offered", to: "expired", by: "every brief declined or lapsed" },
    ],
  },
  {
    id: "O-brief", name: "Brief (one lead offered to one firm)", status: "part", table: "briefs", refs: ["D2", "Q3"], note: "The unit M1 sells. The firm records quoted, won and lost; the buyer's side of the outcome is missing",
    initial: "offered", states: ["offered", "unlocked", "declined", "lapsed", "quoted", "won", "lost"],
    transitions: [
      { from: "offered", to: "unlocked", by: "firm pays (M1)" }, { from: "offered", to: "declined", by: "firm" },
      { from: "offered", to: "lapsed", by: "time" }, { from: "unlocked", to: "quoted", by: "firm" },
      { from: "quoted", to: "won" }, { from: "quoted", to: "lost" },
    ],
  },
  {
    id: "O-listing", name: "Listing (a firm)", status: "part", table: "firms", refs: ["D1"], note: "In code: claim pending, claimed (confirmed link), paused (no briefs); removal missing",
    initial: "unclaimed", states: ["unclaimed", "claim-pending", "claimed", "paused", "removed"],
    transitions: [
      { from: "unclaimed", to: "claim-pending", by: "firm claims" }, { from: "claim-pending", to: "claimed", by: "email link confirmed" },
      { from: "claimed", to: "paused", by: "firm" }, { from: "paused", to: "claimed", by: "firm" },
      { from: "unclaimed", to: "removed", by: "removal request" }, { from: "claimed", to: "removed", by: "removal request" },
    ],
  },
  {
    id: "O-slot", name: "Slot (spare survey capacity, paid in kind)", status: "missing", table: "slots", refs: ["D6"],
    initial: "offered", states: ["offered", "allocated", "used", "expired"],
    transitions: [
      { from: "offered", to: "allocated", by: "matched to a lead" }, { from: "allocated", to: "used", by: "survey done" },
      { from: "offered", to: "expired", by: "date passes" }, { from: "allocated", to: "expired", by: "buyer drops out" },
    ],
  },
  {
    id: "O-claim", name: "Claim", status: "part", table: "claim_requests", refs: ["D1"], note: "Confirmed by the emailed link's button; operator rejection missing",
    initial: "submitted", states: ["submitted", "confirmed", "rejected"],
    transitions: [{ from: "submitted", to: "confirmed", by: "email link" }, { from: "submitted", to: "rejected", by: "operator" }],
  },
  {
    id: "O-notice", name: "Notice (Article 14, to a listed firm)", status: "missing", table: "notices", refs: ["D1"],
    initial: "due", states: ["due", "sent", "acknowledged", "objected"],
    transitions: [{ from: "due", to: "sent" }, { from: "sent", to: "acknowledged" }, { from: "sent", to: "objected" }],
  },
]

export const processes: Process[] = [
  { id: "PR1", name: "Qualify a lead", realises: "U2", status: "part", refs: ["D2", "D14"],
    note: "The postcode is looked up with an outside service (postcodes.io, ONS and Ordnance Survey data); the privacy notice must say so (A3). If the lookup fails, the buyer picks the area", steps: [
    { actor: "P-buyer", step: "Say the problem; see the answer; choose to send, giving contact last", status: "built" },
    { actor: "P-directory", step: "Work out the area and the council from the postcode, so the buyer isn't asked twice", status: "built" },
    { actor: "P-directory", step: "Grade on real, serious, timely, complete", status: "built" },
    { actor: "P-buyer", step: "Confirm by email (button press); no mail provider in production yet (Q21)", status: "built" },
    { actor: "P-directory", step: "Operator approves or rejects", status: "built" },
    { actor: "P-directory", step: "Tell buyers, in a privacy notice, what we keep, who sees it, the postcode lookup and how long we keep it (parked, D16)", status: "missing" },
  ] },
  { id: "PR2", name: "Route a lead", realises: "U4", status: "part", refs: ["D2", "D12", "Q3", "Q15", "Q16"],
    note: "Terms are guesses (ROUTING: Q15, Q16). Briefs go to claimed firms' business inboxes; claims are confirmed by link (PR3). Built on the placeholder terms (D12); the calls (R6) may change them", steps: [
    { actor: "P-directory", step: "Match firms by survey, region, availability", status: "built" },
    { actor: "P-directory", step: "Offer briefs, contact hidden", status: "built" },
    { actor: "P-firm", step: "Unlock (fee owed) or pass; pause when booked up", status: "built" },
    { actor: "P-directory", step: "Chase firms once, halfway through their time; lapse and tell the buyer", status: "built" },
    { actor: "P-firm", step: "Record that they quoted, then whether they won or lost", status: "built" },
    { actor: "P-directory", step: "Ask the buyer whether they booked a survey", status: "missing" },
  ] },
  { id: "PR3", name: "Claim a listing", realises: "U5", status: "part", refs: ["D1"], steps: [
    { actor: "P-firm", step: "Claim with an email on the firm's domain", status: "built" },
    { actor: "P-directory", step: "Email a confirmation link", status: "built" },
    { actor: "P-firm", step: "Edit the listing", status: "missing" },
  ] },
  { id: "PR4", name: "Add firms", realises: "U5", status: "part", refs: ["R0/S9", "R3", "R4", "R5"],
    note: "By hand: 10 firms. Research copies of CIEEM listings sit in D:/data/macan/r4 and r5 under its own-use clause (cl. 2.1); the principal may have them deleted. CIEEM's terms (cl. 2.3, https://cieem.net/terms-of-use/, modified 2024-12-18) forbid storing its content in another website or retrieval system without written permission: its listings are not copied until CIEEM agrees", steps: [
    { actor: "P-directory", step: "Check candidates exist and are active in vein (Companies House)", status: "missing" },
    { actor: "P-directory", step: "Take candidates from CIEEM's Registered Practice Directory (145 ecology practices), once CIEEM gives written permission", status: "missing" },
    { actor: "P-directory", step: "Check the site sells planning surveys", status: "part" },
    { actor: "P-directory", step: "Map surveys and regions", status: "part" },
    { actor: "P-directory", step: "Send the listing notice (parked, D16)", status: "missing" },
  ] },
  { id: "PR5", name: "Correct or remove a listing", realises: "U5", status: "missing", refs: ["D1", "D16"], note: "Parked until the loop is solid (D16)", steps: [
    { actor: "P-firm", step: "Ask", status: "missing" }, { actor: "P-directory", step: "Apply and tombstone", status: "missing" },
  ] },
]
