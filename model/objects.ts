// Business objects and their lifecycles. Code reads these; it keeps no copy of its own.
import type { BusinessObject, Decision, Process } from "./types"

const BRIEF = "docs/brief.md §5a-7 (2026-10-23)"

export const decisions: Decision[] = [
  { id: "M1", name: "Firms pay per brief they unlock; every lead is qualified first", date: "2026-10-23",
    said: "yeah fuck it M1. we'll take in leads and qualify them. we'll build a qualification system.", source: "Principal" },
  { id: "models", name: "We work from models: map first, territory follows, map updated", date: "2026-10-23",
    said: "models are the map. we build the territory, and the maps are updated to reflect. it's a tight, closed, loop.", source: "Principal" },
]

// A lead's grade: the outcome of the four checks (brief §5a).
export const LEAD_GRADES = ["qualified", "awaiting-confirmation", "needs-info", "not-a-fit"] as const
// The operator's review of a lead.
export const LEAD_REVIEWS = ["new", "approved", "rejected"] as const
export const LEAD_CHECKS = ["real", "serious", "timely", "complete"] as const

export const objects: BusinessObject[] = [
  {
    id: "lead", name: "Lead", status: "part", source: BRIEF, note: "Built to approved; offering is missing",
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
    id: "brief", name: "Brief (one lead offered to one firm)", status: "missing", source: BRIEF, note: "The unit M1 sells",
    initial: "offered",
    states: ["offered", "unlocked", "declined", "lapsed", "quoted", "won", "lost"],
    transitions: [
      { from: "offered", to: "unlocked", by: "firm pays (M1)" },
      { from: "offered", to: "declined", by: "firm" },
      { from: "offered", to: "lapsed", by: "time" },
      { from: "unlocked", to: "quoted", by: "firm" },
      { from: "quoted", to: "won" },
      { from: "quoted", to: "lost" },
    ],
  },
  {
    id: "listing", name: "Listing (a firm)", status: "part", source: BRIEF, note: "No states in code yet",
    initial: "unclaimed",
    states: ["unclaimed", "claim-pending", "claimed", "paused", "removed"],
    transitions: [
      { from: "unclaimed", to: "claim-pending", by: "firm claims" },
      { from: "claim-pending", to: "claimed", by: "email link confirmed" },
      { from: "claimed", to: "paused", by: "firm" },
      { from: "paused", to: "claimed", by: "firm" },
      { from: "unclaimed", to: "removed", by: "removal request" },
      { from: "claimed", to: "removed", by: "removal request" },
    ],
  },
  {
    id: "claim", name: "Claim", status: "part", source: BRIEF, note: "Stored only",
    initial: "submitted", states: ["submitted", "confirmed", "rejected"],
    transitions: [{ from: "submitted", to: "confirmed", by: "email link" }, { from: "submitted", to: "rejected", by: "operator" }],
  },
  {
    id: "notice", name: "Notice (Article 14, to a listed firm)", status: "missing", source: BRIEF,
    initial: "due", states: ["due", "sent", "acknowledged", "objected"],
    transitions: [{ from: "due", to: "sent" }, { from: "sent", to: "acknowledged" }, { from: "sent", to: "objected" }],
  },
]

export const processes: Process[] = [
  {
    id: "P1", name: "Qualify a lead", realises: "U2", status: "built", source: BRIEF,
    steps: [
      { actor: "buyer", step: "Describe the site and the need", status: "built" },
      { actor: "directory", step: "Grade on real, serious, timely, complete", status: "built" },
      { actor: "buyer", step: "Confirm by email (button press)", status: "built" },
      { actor: "directory", step: "Operator approves or rejects", status: "built" },
    ],
  },
  {
    id: "P2", name: "Route a lead", realises: "U4", status: "missing", source: BRIEF,
    note: "Open: how many firms, how long to respond, what the buyer hears if nobody takes it",
    steps: [
      { actor: "directory", step: "Match firms by survey, region, availability", status: "missing" },
      { actor: "directory", step: "Offer briefs, contact hidden", status: "missing" },
      { actor: "firm", step: "Unlock (pay) or pass", status: "missing" },
      { actor: "directory", step: "Chase or lapse; tell the buyer", status: "missing" },
    ],
  },
  {
    id: "P3", name: "Claim a listing", realises: "U5", status: "part", source: BRIEF,
    steps: [
      { actor: "firm", step: "Claim with an email on the firm's domain", status: "built" },
      { actor: "directory", step: "Email a confirmation link", status: "missing" },
      { actor: "firm", step: "Edit the listing", status: "missing" },
    ],
  },
  {
    id: "P4", name: "Add firms", realises: "U5", status: "part", source: BRIEF, note: "By hand: 10 firms",
    steps: [
      { actor: "directory", step: "Take candidates from vein", status: "missing" },
      { actor: "directory", step: "Check the site sells planning surveys", status: "part" },
      { actor: "directory", step: "Map surveys and regions", status: "part" },
      { actor: "directory", step: "Send the listing notice", status: "missing" },
    ],
  },
  {
    id: "P5", name: "Correct or remove a listing", realises: "U5", status: "missing", source: BRIEF,
    steps: [{ actor: "firm", step: "Ask", status: "missing" }, { actor: "directory", step: "Apply and tombstone", status: "missing" }],
  },
]
