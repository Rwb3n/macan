// The shape of the map. Ids, one scheme across the project:
//   D decision · PN pain · A aim · P party · F flow · CH channel · ALT alternative · U use case · ST stage
//   PR process · O object · Q open question · R research study (a folder in research/; R0/S7 = research/R0-imported/S7)
// No imports.

export type Status = "built" | "part" | "missing" | "outside"

// refs: the ids this element rests on. Each must include at least one D, R or Q. A guess must cite its Q.
// receipt: the verifiable evidence itself (a quote, a number, a filing), from the R it cites.
export type Element = { id: string; name: string; refs: string[]; guess?: boolean; receipt?: string; note?: string }

// why
export type Decision = { id: string; name: string; said: string; date: string; refs: string[] }
export type Aim = Element
// A pain the buyer has today, synthesised from sources (D10). answeredBy: the U, ST, PR, CH or Q that answers it.
export type Pain = Element & { party: string; sources: number; answeredBy: string[] }

// who
export type SystemOfInterest = Element & { reason: string; inside: string[] }
export type Party = Element
export type FlowKind = "information" | "money" | "services" | "value"
export type Flow = Element & { from: string; to: string; kind?: FlowKind; viaUs: boolean }
export type ChannelKind = "search" | "moment" | "referral" | "outbound" | "body" | "community"
export type Channel = Element & { party: string; kind: ChannelKind; status: Status }
export type Alternative = Element & { kind: "firm" | "marketplace" | "directory" | "broker"; serves: string[]; offer: string }

// what
export type UseCase = Element & { party: string; status: Status; flows: string[] }
export type Stage = Element & { useCase: string; outcome: string; status: Status }

// how
export type Transition = { from: string; to: string; by?: string }
export type BusinessObject = Element & { states: string[]; initial: string; transitions: Transition[]; status: Status; table?: string }
export type Process = Element & { realises: string; steps: { actor: string; step: string; status: Status }[]; status: Status }

// open
export type Question = { id: string; name: string; test: string; state: "open" | "some" | "answered"; refs: string[]; note?: string }
