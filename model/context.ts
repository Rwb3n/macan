// Level 0: who the business deals with, and what passes between them.
import type { Aim, Flow, Party, SystemOfInterest } from "./types"

const BRIEF = "docs/brief.md §2 (2026-10-23)"

export const system: SystemOfInterest = {
  id: "directory", name: "The directory", source: 'Principal, 2026-10-23: "lets build it"',
  reason: "It is what we build and run.",
  inside: ["the service", "the operator (the principal)"],
}

export const parties: Party[] = [
  { kind: "party", id: "buyer", name: "Buyers (homeowners, small developers)", source: "S7: buyer-phrased demand ~14,800 searches/month" },
  { kind: "party", id: "agent", name: "Agents (architects, planning consultants)", source: BRIEF, guess: true, note: "May be the repeat buyer. Untested." },
  { kind: "party", id: "firm", name: "Survey firms", source: "S9: ~230-410 survey sellers with a website in SIC 74901" },
  { kind: "party", id: "council", name: "Councils (planning authorities)", source: BRIEF },
  { kind: "party", id: "public", name: "Public sources (Companies House, firms' sites)", source: BRIEF },
]

export const flows: Flow[] = [
  { id: "need-in", from: "buyer", to: "directory", name: "site, survey needed, deadline", kind: "information", viaUs: true, source: BRIEF },
  { id: "guide-out", from: "directory", to: "buyer", name: "which survey, when, who covers the area", kind: "information", viaUs: true, source: BRIEF },
  { id: "agent-in", from: "agent", to: "directory", name: "repeat requests for clients", kind: "information", viaUs: true, source: BRIEF, guess: true },
  { id: "brief-out", from: "directory", to: "firm", name: "a qualified brief", kind: "value", viaUs: true, source: BRIEF },
  { id: "firm-in", from: "firm", to: "directory", name: "claim, corrections, availability", kind: "information", viaUs: true, source: BRIEF },
  { id: "fee-in", from: "firm", to: "directory", name: "fee per unlocked brief (M1)", kind: "money", viaUs: true, source: 'Principal, 2026-10-23: "yeah fuck it M1"' },
  { id: "intel-out", from: "directory", to: "firm", name: "where and when demand is coming (councils, surveys, season)", kind: "value", viaUs: true,
    source: 'Principal, 2026-10-23: "4. okay, GOOD! LETS DO THAT TOO"' },
  { id: "capacity-in", from: "firm", to: "directory", name: "spare survey capacity (off-season days, advance slots) as payment in kind", kind: "services", viaUs: true,
    source: 'Principal, 2026-10-23: "5. GOOOD LETS DO THAT TOO"' },
  { id: "facts-in", from: "public", to: "directory", name: "firm facts", kind: "information", viaUs: true, source: BRIEF },
  { id: "notice-out", from: "directory", to: "firm", name: "notice that they are listed", kind: "information", viaUs: true, source: "UK GDPR Art. 14 duty (brief §6)" },
  { id: "requirement", from: "council", to: "buyer", name: "survey required to validate the application", kind: "information", viaUs: false, source: BRIEF },
  { id: "survey", from: "firm", to: "buyer", name: "quote, survey, report", kind: "services", viaUs: false, source: BRIEF },
  { id: "payment", from: "buyer", to: "firm", name: "payment for the survey", kind: "money", viaUs: false, source: BRIEF },
]

export const aims: Aim[] = [
  { id: "earn", name: "Earn money (M1)", source: 'Principal, 2026-10-23: "yeah fuck it M1"' },
  { id: "list", name: "Grow and keep a correct list of firms", source: BRIEF },
  { id: "lawful", name: "Stay lawful: listing notices, removal, retention", source: BRIEF },
]
