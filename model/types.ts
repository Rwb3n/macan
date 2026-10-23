// The shape of the map (modelkit levels 0-3, kept to what this product needs). No imports.

export type Status = "built" | "part" | "missing" | "outside"
export type Source = string // who said it or what evidence, word for word where a person said it

type Element = { id: string; name: string; source: Source; guess?: boolean; note?: string }

// Level 0
export type Party = Element & { kind: "party" }
export type SystemOfInterest = Element & { reason: string; inside: string[] }
export type FlowKind = "information" | "money" | "services" | "value"
export type Flow = Element & { from: string; to: string; kind?: FlowKind; viaUs: boolean }

// Level 1
export type UseCase = Element & { party: string; status: Status; flows: string[] }
export type Aim = Element // the system's own aims: kept on the boundary, never a use case

// Level 2
export type Stage = Element & { useCase: string; outcome: string; status: Status }

// Objects and lifecycles
export type Transition = { from: string; to: string; by?: string }
export type BusinessObject = Element & { states: string[]; initial: string; transitions: Transition[]; status: Status }

// Level 3 (BPMN later; until then a named list of steps per actor)
export type Process = Element & { realises: string; steps: { actor: string; step: string; status: Status }[]; status: Status }

export type Decision = Element & { said: string; date: string }

// What a party uses today instead of us, per use case (research C1).
export type Alternative = Element & { kind: "firm" | "marketplace" | "directory" | "broker"; serves: string[]; offer: string }
