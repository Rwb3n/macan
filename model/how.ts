// How (levels 2-3): the objects we track, their lifecycles, and the processes that move them.
// Code reads the lead's grades, reviews and checks from here; it keeps no copy.
import type { BusinessObject, Process } from "./types"

export const LEAD_GRADES = ["qualified", "awaiting-confirmation", "needs-info", "not-a-fit"] as const
export const LEAD_REVIEWS = ["new", "approved", "rejected"] as const
export const LEAD_CHECKS = ["real", "serious", "timely", "complete"] as const
export const BRIEF_STATES = ["offered", "unlocked", "declined", "lapsed", "withdrawn", "quoted", "won", "lost"] as const

// Routing terms (PR2). Business choices not yet made by the principal: each is a guess with its test (D11: model first).
export const ROUTING = {
  firmsPerLead: 3, // the default; the buyer can choose 5, 10 or every firm covering the area (D24). Q15: Signed Off offers "quotes from up to 3", Bark shares with up to 5, Worklanded sells to 1 (R1, R2)
  replyHours: 48, // Q15, Q7: the 48-hour reply promise
  unlockFeePence: 0, // free for firms at first (D25); the anchor when charging starts is £26 a lead (Q3, Q16)
  claimedOnly: true, // Q15: only firms that claimed their listing receive briefs; unclaimed firms are not emailed
} as const

export const objects: BusinessObject[] = [
  {
    id: "O-lead", name: "Lead", status: "part", table: "leads", refs: ["D2"], note: "offered, closed and expired are read from the lead's briefs (and when it was routed)",
    initial: "received",
    states: ["received", "awaiting-confirmation", "needs-info", "not-a-fit", "qualified", "approved", "rejected", "offered", "closed", "expired", "cancelled"],
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
      { from: "awaiting-confirmation", to: "cancelled", by: "buyer cancels (D22)" },
      { from: "qualified", to: "cancelled", by: "buyer cancels (D22)" },
      { from: "approved", to: "cancelled", by: "buyer cancels (D22)" },
      { from: "offered", to: "cancelled", by: "buyer cancels; open briefs are withdrawn (D22)" },
    ],
  },
  {
    id: "O-brief", name: "Brief (one lead offered to one firm)", status: "part", table: "briefs", refs: ["D2", "Q3"], note: "The unit M1 sells. The firm records quoted, won and lost; the buyer's side of the outcome is missing",
    initial: "offered", states: ["offered", "unlocked", "declined", "lapsed", "withdrawn", "quoted", "won", "lost"],
    transitions: [
      { from: "offered", to: "unlocked", by: "firm pays (M1)" }, { from: "offered", to: "declined", by: "firm" },
      { from: "offered", to: "lapsed", by: "time" }, { from: "offered", to: "withdrawn", by: "buyer cancels (D22)" }, { from: "unlocked", to: "quoted", by: "firm" },
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
  { id: "PR1", name: "Qualify a lead", realises: "U2", status: "part", refs: ["D2", "D14", "D23", "D27", "R12"],
    note: "The postcode is looked up with an outside service (postcodes.io, ONS and Ordnance Survey data); the privacy notice must say so (A3). If the lookup fails, the buyer picks the area. Job sheet: the core fields (site, planned work) are required; the per-survey questions from R12 are asked one per screen, each with 'not sure', unless the buyer's words already answer them; unknowns are listed on the sheet. Pills come from Claude Haiku when a key is set (model choice still Q26), and every pill must quote the buyer's own words or it is dropped; with no key, a few plain word rules. On two made-up texts (not a study) the model also read facts the quoted words don't say ('no idea where to start' as no drawings): the prompt now says so, and access, earlier surveys and drawings are always asked, never read (the model also put 'council said we need a bat survey' under access). Pills show the quoted words so the buyer can remove a wrong one. Principal, 2026-10-24, on a separate pills screen four steps in: 'right now i dont know what im looking at'. So the request firms will get is shown beside every step, filling in live as the buyer types and answers; pills are its editable rows, and it replaces the checklist (D20). Principal, next: 'very close... you threw the baby out with the bathwater... there needs to be some traditional parts still present. yep pull the work type and planning stage from the words too'. So the panel keeps the checklist's ticks, time and 'nothing about you yet'; the work and planning stage are read too, but their question screens stay, pre-filled with the words shown, for the buyer to confirm. Principal, next: 'they should be able to click on the checklist items to fill in at the end. also \"we'll ask\" as a filler repeated over and over... is confusing', and 'something else... theres no way to describe it?'. So every panel row goes to its question and back (as the check page does), empty rows are blank with 'Next' on the first, and 'Something else' asks for the buyer's own description, which the firm's sheet shows. The model read 'council mentioned a tree survey' as already applied; it now leaves the planning stage unless the words say an application was made The buyer's words (emails and phone numbers removed first) go to Anthropic, which the privacy notice must say (A3). The excerpt drops sentences with prices, quotes and contact details (Q27). Part: drawings or photos can't be uploaded yet; the drafter was tested for drafts (R10, R11), not for this extraction (Q29)", steps: [
    { actor: "P-buyer", step: "Say the problem; see the answer; choose to send, giving contact last", status: "built" },
    { actor: "P-directory", step: "Pull the facts out of the buyer's words as editable pills, ask for what's missing, and build the firm's job sheet plus a trimmed excerpt (D23, D27, Q26); fields per survey from R12", status: "part" },
    { actor: "P-directory", step: "Work out the area and the council from the postcode, so the buyer isn't asked twice", status: "built" },
    { actor: "P-directory", step: "Grade on real, serious, timely, complete", status: "built" },
    { actor: "P-buyer", step: "Confirm by email (button press); no mail provider in production yet (Q21)", status: "built" },
    { actor: "P-directory", step: "Operator approves or rejects", status: "built" },
    { actor: "P-directory", step: "Tell buyers, in a privacy notice, what we keep, who sees it, the postcode lookup and how long we keep it (parked, D16)", status: "missing" },
  ] },
  { id: "PR2", name: "Route a lead", realises: "U4", status: "part", refs: ["D2", "D12", "D22", "D24", "D25", "D26", "Q3", "Q15", "Q16"],
    note: "Terms are guesses (ROUTING: Q15, Q16). Briefs go to claimed firms' business inboxes; claims are confirmed by link (PR3). Built on the placeholder terms (D12); the calls (R6) may change them", steps: [
    { actor: "P-directory", step: "Match firms by survey, region, availability", status: "built" },
    { actor: "P-directory", step: "Offer briefs, contact hidden", status: "built" },
    { actor: "P-firm", step: "Unlock (fee owed) or pass; pause when booked up", status: "built" },
    { actor: "P-directory", step: "Chase firms once, halfway through their time; lapse and tell the buyer", status: "built" },
    { actor: "P-firm", step: "Record that they quoted, then whether they won or lost", status: "built" },
    { actor: "P-buyer", step: "Keep a private status link, emailed as things change; after a firm takes the job it shows the final state; it stops on cancelling or expiry (D22, D26)", status: "built" },
    { actor: "P-buyer", step: "Choose a bigger pool than three firms if they want: 5, 10 or every firm that covers the area (D24)", status: "built" },
    { actor: "P-directory", step: "Free for firms at first; the fee is set to nothing until firms are happy (D25)", status: "built" },
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
