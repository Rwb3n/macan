// How (levels 2-3): the objects we track, their lifecycles, and the processes that move them.
// Code reads the lead's grades, reviews and checks from here; it keeps no copy.
import type { BusinessObject, Process } from "./types"

export const LEAD_GRADES = ["qualified", "awaiting-confirmation", "needs-info", "not-a-fit"] as const
export const LEAD_REVIEWS = ["new", "approved", "rejected"] as const
export const LEAD_CHECKS = ["real", "serious", "timely", "complete"] as const

export const objects: BusinessObject[] = [
  {
    id: "O-lead", name: "Lead", status: "part", table: "leads", refs: ["D2"], note: "Built to approved; offering is missing",
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
      { from: "approved", to: "offered", by: "routing (missing)" },
      { from: "offered", to: "closed" },
      { from: "offered", to: "expired" },
    ],
  },
  {
    id: "O-brief", name: "Brief (one lead offered to one firm)", status: "missing", table: "briefs", refs: ["D2", "Q3"], note: "The unit M1 sells",
    initial: "offered", states: ["offered", "unlocked", "declined", "lapsed", "quoted", "won", "lost"],
    transitions: [
      { from: "offered", to: "unlocked", by: "firm pays (M1)" }, { from: "offered", to: "declined", by: "firm" },
      { from: "offered", to: "lapsed", by: "time" }, { from: "unlocked", to: "quoted", by: "firm" },
      { from: "quoted", to: "won" }, { from: "quoted", to: "lost" },
    ],
  },
  {
    id: "O-listing", name: "Listing (a firm)", status: "part", table: "firms", refs: ["D1"], note: "No states in code yet",
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
    id: "O-claim", name: "Claim", status: "part", table: "claim_requests", refs: ["D1"], note: "Stored only",
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
  { id: "PR1", name: "Qualify a lead", realises: "U2", status: "built", refs: ["D2"], steps: [
    { actor: "P-buyer", step: "Describe the site and the need", status: "built" },
    { actor: "P-directory", step: "Grade on real, serious, timely, complete", status: "built" },
    { actor: "P-buyer", step: "Confirm by email (button press)", status: "built" },
    { actor: "P-directory", step: "Operator approves or rejects", status: "built" },
  ] },
  { id: "PR2", name: "Route a lead", realises: "U4", status: "missing", refs: ["D2", "Q3"],
    note: "Open: how many firms, how long to respond, what the buyer hears if nobody takes it", steps: [
    { actor: "P-directory", step: "Match firms by survey, region, availability", status: "missing" },
    { actor: "P-directory", step: "Offer briefs, contact hidden", status: "missing" },
    { actor: "P-firm", step: "Unlock (pay) or pass", status: "missing" },
    { actor: "P-directory", step: "Chase or lapse; tell the buyer", status: "missing" },
  ] },
  { id: "PR3", name: "Claim a listing", realises: "U5", status: "part", refs: ["D1"], steps: [
    { actor: "P-firm", step: "Claim with an email on the firm's domain", status: "built" },
    { actor: "P-directory", step: "Email a confirmation link", status: "missing" },
    { actor: "P-firm", step: "Edit the listing", status: "missing" },
  ] },
  { id: "PR4", name: "Add firms", realises: "U5", status: "part", refs: ["R0/S9", "R3", "R4"], note: "By hand: 10 firms", steps: [
    { actor: "P-directory", step: "Take candidates from vein", status: "missing" },
    { actor: "P-directory", step: "Take candidates from CIEEM's Registered Practice Directory (145 ecology practices)", status: "missing" },
    { actor: "P-directory", step: "Check the site sells planning surveys", status: "part" },
    { actor: "P-directory", step: "Map surveys and regions", status: "part" },
    { actor: "P-directory", step: "Send the listing notice", status: "missing" },
  ] },
  { id: "PR5", name: "Correct or remove a listing", realises: "U5", status: "missing", refs: ["D1"], steps: [
    { actor: "P-firm", step: "Ask", status: "missing" }, { actor: "P-directory", step: "Apply and tombstone", status: "missing" },
  ] },
]
