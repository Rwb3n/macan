// Level 1: what each party comes to the business for. Level 2: the stages each one passes through.
import type { Stage, UseCase } from "./types"

const BRIEF = "docs/brief.md §3-4 (2026-10-23)"

export const useCases: UseCase[] = [
  { id: "U1", party: "buyer", name: "Find out which survey I need, and when it can be done", status: "built", flows: ["guide-out"], source: BRIEF },
  { id: "U2", party: "buyer", name: "Get the survey done in time for my application", status: "part", flows: ["need-in", "survey", "payment"], source: BRIEF },
  { id: "U3", party: "agent", name: "Get several surveys quoted for one site, quickly", status: "missing", flows: ["agent-in"], source: BRIEF, guess: true },
  { id: "U4", party: "firm", name: "Get the enquiries I want, and not the ones I don't", status: "missing", flows: ["brief-out", "fee-in"], source: BRIEF },
  { id: "U5", party: "firm", name: "Keep my listing right, or have it removed", status: "part", flows: ["firm-in", "notice-out", "facts-in"], source: BRIEF },
]

// Councils come to us for nothing: they set the requirement (flow "requirement" is explained by U2's need).
export const requirementExplainedBy = "U2"

export const stages: Stage[] = [
  { id: "U2.1", useCase: "U2", name: "Learn what's needed", outcome: "Knows the survey and its season", status: "built", source: BRIEF },
  { id: "U2.2", useCase: "U2", name: "Find who covers it", outcome: "Has firms for the survey and region", status: "built", source: BRIEF },
  { id: "U2.3", useCase: "U2", name: "Ask once", outcome: "Request described, confirmed and qualified", status: "part", source: BRIEF, note: "Qualified; not routed to firms" },
  { id: "U2.4", useCase: "U2", name: "Choose and book", outcome: "A firm is booked", status: "outside", source: BRIEF },
  { id: "U2.5", useCase: "U2", name: "Survey and report", outcome: "Has the report for the council", status: "outside", source: BRIEF },
  { id: "U4.1", useCase: "U4", name: "Be found", outcome: "Listed, claimed or not", status: "built", source: BRIEF },
  { id: "U4.2", useCase: "U4", name: "Get a brief", outcome: "Sees survey, area, deadline, site; contact hidden", status: "missing", source: BRIEF },
  { id: "U4.3", useCase: "U4", name: "Decide", outcome: "Unlocked (pays) or passed; paused when booked up", status: "missing", source: BRIEF, note: "The product (A6)" },
  { id: "U4.4", useCase: "U4", name: "Quote", outcome: "Buyer has the firm's quote", status: "outside", source: BRIEF },
  { id: "U4.5", useCase: "U4", name: "Win or lose", outcome: "We know the outcome", status: "missing", source: BRIEF },
]
