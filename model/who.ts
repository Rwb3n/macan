// Who (level 0): the system, the parties, what flows between them, how they reach us, and what they use instead.
import type { Alternative, Channel, Flow, Party, SystemOfInterest } from "./types"

export const system: SystemOfInterest = {
  id: "P-directory", name: "The directory", refs: ["D1"], reason: "It is what we build and run.",
  inside: ["the service", "the operator (the principal)"],
}

export const parties: Party[] = [
  { id: "P-buyer", name: "Buyers (homeowners, small developers)", refs: ["R0/S7", "R3"],
    receipt: "~76,000 English applications a year file one of our surveys (R3)" },
  { id: "P-agent", name: "Agents (architects, planning consultants)", refs: ["Q1"], guess: true },
  { id: "P-firm", name: "Survey firms", refs: ["R0/S9", "R3"], receipt: "~230-410 survey sellers with a website in SIC 74901 (S9)" },
  { id: "P-council", name: "Councils (planning authorities)", refs: ["R3"], receipt: "291,861 decisions a year, England, to June 2026 (MHCLG P124A)" },
  { id: "P-public", name: "Public sources (Companies House, firms' sites)", refs: ["R0/S9"] },
]

export const flows: Flow[] = [
  { id: "F-need", from: "P-buyer", to: "P-directory", name: "site, survey needed, deadline", kind: "information", viaUs: true, refs: ["D2"] },
  { id: "F-guide", from: "P-directory", to: "P-buyer", name: "which survey, when, who covers the area", kind: "information", viaUs: true, refs: ["D1"] },
  { id: "F-agent", from: "P-agent", to: "P-directory", name: "repeat requests for clients", kind: "information", viaUs: true, refs: ["Q1"], guess: true },
  { id: "F-brief", from: "P-directory", to: "P-firm", name: "a qualified brief", kind: "value", viaUs: true, refs: ["D2"] },
  { id: "F-firm", from: "P-firm", to: "P-directory", name: "claim, corrections, availability", kind: "information", viaUs: true, refs: ["D1"] },
  { id: "F-fee", from: "P-firm", to: "P-directory", name: "fee per unlocked brief (M1)", kind: "money", viaUs: true, refs: ["D2", "Q3"] },
  { id: "F-intel", from: "P-directory", to: "P-firm", name: "where and when demand is coming", kind: "value", viaUs: true, refs: ["D5"] },
  { id: "F-capacity", from: "P-firm", to: "P-directory", name: "spare survey capacity as payment in kind", kind: "services", viaUs: true, refs: ["D6"] },
  { id: "F-facts", from: "P-public", to: "P-directory", name: "firm facts", kind: "information", viaUs: true, refs: ["R0/S9"] },
  { id: "F-notice", from: "P-directory", to: "P-firm", name: "notice that they are listed", kind: "information", viaUs: true, refs: ["D1"], note: "UK GDPR Art. 14" },
  { id: "F-requirement", from: "P-council", to: "P-buyer", name: "survey required to validate the application", kind: "information", viaUs: false, refs: ["R3"] },
  { id: "F-survey", from: "P-firm", to: "P-buyer", name: "quote, survey, report", kind: "services", viaUs: false, refs: ["R2"] },
  { id: "F-payment", from: "P-buyer", to: "P-firm", name: "payment for the survey", kind: "money", viaUs: false, refs: ["R3"],
    receipt: "Bat, ecology and flood alone ~£51M a year at published median prices (R3)" },
]

export const channels: Channel[] = [
  { id: "CH-search", party: "P-buyer", kind: "search", name: "Searches the survey the council asked for", status: "part", refs: ["R0/S7", "R1"],
    receipt: "'bat survey', 'flood risk assessment', 'environmental impact assessment' each 1K-10K UK searches a month (S7); Arbtech in 14 of 23 searches (R1)" },
  { id: "CH-validation", party: "P-buyer", kind: "moment", name: "Told by the council at validation that a survey is missing", status: "missing", refs: ["R2"],
    receipt: "'Only to be told I needed a bat survey'; 'the planning officer doesn't recommend anyone, so I'm at the mercy of Google' (R2 gap-buyer.md)" },
  { id: "CH-agent", party: "P-agent", kind: "referral", name: "Architects and planning consultants pick or recommend the firm", status: "missing", refs: ["Q1"], guess: true },
  { id: "CH-outbound", party: "P-firm", kind: "outbound", name: "We find and contact firms from Companies House and their sites", status: "part", refs: ["R0/S9", "R3"],
    receipt: "2,238 companies in the trade universe, 1,799 with filed headcount (R3)" },
  { id: "CH-body", party: "P-firm", kind: "body", name: "Professional bodies' directories (CIEEM, ANC)", status: "outside", refs: ["R1"],
    receipt: "CIEEM Registered Practices Directory, firms pay £147-£368+VAT a year (R1)" },
  { id: "CH-peers", party: "P-firm", kind: "community", name: "Firms pass overflow work to each other", status: "missing", refs: ["Q8"], guess: true },
]

export const alternatives: Alternative[] = [
  { id: "ALT-arbtech", name: "Arbtech (national firm)", kind: "firm", serves: ["U1", "U2"], refs: ["R1", "R2"],
    offer: "Fixed published prices (bat roost £399+VAT), UK coverage, money-back guarantee; in 14 of 23 searches; also runs batsurveys.co.uk, ecologysurveys.uk, biodiversitynetgainplan.co.uk",
    receipt: "Arbtech Consulting Ltd (05678552) accounts to 23 Sep 2024: turnover £10,841,715, profit before tax £4,483,055, 113 staff, 'over 13,800' assessments; 60% acquired by Celnor Group" },
  { id: "ALT-signed-off", name: "Signed Off (signed-off.co.uk)", kind: "directory", serves: ["U1", "U2", "U5"], refs: ["R2"],
    offer: "'Which reports do I need?' checker (no postcode or council step), directory, quotes from up to 3; free and paid listings" },
  { id: "ALT-planning-review", name: "The Planning Review", kind: "directory", serves: ["U2"], refs: ["R2"],
    offer: "Firms found on planning applications, with quotes; no checker" },
  { id: "ALT-cieem", name: "CIEEM Registered Practices Directory", kind: "directory", serves: ["U2", "U5"], refs: ["R1"],
    offer: "Search by service and postcode; firms pay through membership" },
  { id: "ALT-worklanded", name: "Worklanded", kind: "marketplace", serves: ["U4"], refs: ["R1"],
    offer: "Bat and ecology leads sold to firms at £26 each, one firm at a time; 11 enquiries in 90 days" },
  { id: "ALT-brokers", name: "Small brokers (batsurveycost.co.uk, RenKap, Yell)", kind: "broker", serves: ["U2"], refs: ["R1"],
    offer: "Pass one request to up to 3 firms; firm-side terms not published" },
]
