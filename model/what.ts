// What (levels 1-2): what each party comes to us for, and the stages it passes through.
import type { Stage, UseCase } from "./types"

export const useCases: UseCase[] = [
  { id: "U1", party: "P-buyer", name: "Find out which survey I need, and when it can be done", status: "built", flows: ["F-guide", "F-requirement"], refs: ["R2"] },
  { id: "U2", party: "P-buyer", name: "Get the survey done in time for my application", status: "part", flows: ["F-need", "F-survey", "F-payment"], refs: ["D2", "R3"] },
  { id: "U3", party: "P-agent", name: "Get several surveys quoted for one site, quickly", status: "missing", flows: ["F-agent"], refs: ["Q1"], guess: true },
  { id: "U4", party: "P-firm", name: "Get the enquiries I want, and not the ones I don't", status: "part", flows: ["F-brief", "F-fee"], refs: ["D2", "Q2", "Q3"] },
  { id: "U5", party: "P-firm", name: "Keep my listing right, or have it removed", status: "part", flows: ["F-firm", "F-notice", "F-facts"], refs: ["D1"] },
  { id: "U6", party: "P-firm", name: "Know where and when demand is coming, so I can plan my season", status: "missing", flows: ["F-intel", "F-capacity"], refs: ["D5", "D6"] },
]

export const stages: Stage[] = [
  { id: "ST-U2.1", useCase: "U2", name: "Tell us what's going on", outcome: "The problem in my own words, and where the site is", status: "built", refs: ["D14", "D18", "D20", "D21"],
    note: "Opens the way quote sites do (one plain question), then one question per screen (R7); a progress bar and a checklist of everything we'll ask (D20)" },
  { id: "ST-U2.2", useCase: "U2", name: "Find out what you need and when", outcome: "Knows the survey, its season, a typical price and how many firms cover the area", status: "built", refs: ["D1", "D14", "R3", "R8"],
    note: "33 surveys: every specialist report 3 or more of 10 councils ask for (R8)" },
  { id: "ST-U2.3", useCase: "U2", name: "Choose whether to get quotes", outcome: "Contact given knowing why; confirmed, checked and sent to up to 3 firms", status: "built", refs: ["D2", "D14", "D18", "D19"], note: "Says how we're paid and what we check; check your answers before sending. The operator approves and sends (PR1, PR2)" },
  { id: "ST-U2.4", useCase: "U2", name: "Pick a firm and book", outcome: "A firm is booked", status: "outside", refs: ["R2"] },
  { id: "ST-U2.5", useCase: "U2", name: "The survey and the report", outcome: "Has the report for the council", status: "outside", refs: ["R2"] },
  { id: "ST-U4.1", useCase: "U4", name: "Be found", outcome: "Listed, claimed or not", status: "built", refs: ["D1"] },
  { id: "ST-U4.2", useCase: "U4", name: "Get a brief", outcome: "Sees survey, area, deadline, site; contact hidden", status: "built", refs: ["D2"] },
  { id: "ST-U4.3", useCase: "U4", name: "Decide", outcome: "Unlocked (pays) or passed; paused when booked up", status: "part", refs: ["D2", "Q2"] },
  { id: "ST-U4.4", useCase: "U4", name: "Quote", outcome: "Buyer has the firm's quote", status: "outside", refs: ["R2"] },
  { id: "ST-U4.5", useCase: "U4", name: "Win or lose", outcome: "We know the outcome", status: "part", refs: ["D2"], note: "From the firm; the buyer is not asked yet" },
]
