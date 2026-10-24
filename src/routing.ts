// Builds: PR2, O-brief, ST-U4.2, ST-U4.3, ST-U4.5, O-listing, PN3
// Route an approved lead to firms as briefs, contact hidden; firms unlock or pass; briefs lapse; the buyer is told (map: PR2, O-brief; D2).
// The terms (how many firms, how long, the fee) are guesses in the map (ROUTING: Q15, Q16, Q3).
import { createHash, randomBytes } from "node:crypto"
import { and, eq, inArray, isNull, lt, lte, or } from "drizzle-orm"
import type { Db } from "./db"
import { briefs, firms, leads } from "./db/schema"
import { findFirms } from "./directory"
import { regionBySlug, surveyBySlug } from "./catalog"
import { PLANNING_STAGES, PROJECT_TYPES } from "./qualify"
import type { Mailer } from "./mailer"
import { BRIEF_STATES, ROUTING, objects } from "@model/how"

export type Deps = { db: Db; mailer: Mailer; now: () => Date; baseUrl: string }
export type BriefState = (typeof BRIEF_STATES)[number]
export type LeadRouting = "unrouted" | "offered" | "closed" | "expired" | "cancelled"

type Lead = typeof leads.$inferSelect
type Firm = typeof firms.$inferSelect

// What a firm sees before unlocking: survey, area, timing and the site. Never the buyer's name, email or phone.
export type BriefView = {
  survey: string; area: string; region: string; council: string | null; projectType: string; planningStage: string
  deadline: string | null; details: string; answer: string; state: BriefState; expiresAt: Date
  feePence: number | null; firm: { name: string; paused: boolean }
  contact?: { name: string; email: string; phone: string | null }
}

// Firms a lead can go to: they offer the survey and cover the region, have an inbox, are not paused,
// and (while ROUTING.claimedOnly) have claimed their listing. A firm the buyer picked comes first.
export function matchFirms(db: Db, lead: Lead): Firm[] {
  const fits = findFirms(db, { survey: lead.survey, region: lead.region })
    .filter((f) => f.email && !f.pausedAt && (!ROUTING.claimedOnly || f.claimedAt))
  const picked = fits.filter((f) => f.id === lead.firmId)
  const ordered = [...picked, ...fits.filter((f) => f.id !== lead.firmId)]
  // The buyer chose how many: 3 by default, 5, 10, or 0 for every firm covering the area (D24).
  return lead.poolSize > 0 ? ordered.slice(0, lead.poolSize) : ordered
}

// Offers an approved lead to the matching firms. With no match the lead expires and the buyer is told at once.
export async function routeLead(deps: Deps, leadId: number): Promise<{ routing: LeadRouting; offered: number }> {
  const lead = deps.db.select().from(leads).where(eq(leads.id, leadId)).get()
  if (!lead) throw new Error(`Lead ${leadId} not found`)
  if (lead.review !== "approved") throw new Error(`Lead ${leadId} is ${lead.review}; only approved leads are routed`)
  if (lead.cancelledAt) throw new Error(`Lead ${leadId} was cancelled by the buyer`)
  if (leadRouting(deps.db, leadId) !== "unrouted") throw new Error(`Lead ${leadId} has already been routed`)
  const matched = matchFirms(deps.db, lead)
  deps.db.update(leads).set({ routedAt: deps.now() }).where(eq(leads.id, leadId)).run()
  if (matched.length === 0) {
    await tellBuyerNoFirm(deps, lead)
    return { routing: "expired", offered: 0 }
  }
  const now = deps.now()
  const expiresAt = new Date(now.getTime() + ROUTING.replyHours * 3600_000)
  for (const firm of matched) {
    const token = randomBytes(24).toString("base64url")
    deps.db.insert(briefs).values({ leadId, firmId: firm.id, tokenHash: hash(token), offeredAt: now, expiresAt }).run()
    const v = leadView(lead)
    await deps.mailer.send({
      to: firm.email!,
      subject: `New ${v.survey.toLowerCase()} brief: ${v.area}`,
      text: [
        `${v.survey} near ${v.area} (${v.region}${v.council ? `, ${v.council} council` : ""}).`,
        `${v.projectType} · ${v.planningStage}${v.deadline ? ` · needed by ${v.deadline}` : ""}`,
        "", v.details, v.answer ? `\n${v.answer}` : "",
        "", `Unlock the buyer's contact or pass, by ${expiresAt.toUTCString()}:`, `${deps.baseUrl}/briefs/${token}`,
      ].join("\n"),
    })
  }
  await deps.mailer.send({
    to: lead.email,
    subject: `Your ${surveyBySlug(lead.survey)?.name.toLowerCase()} request has gone to ${matched.length === 1 ? "a firm" : `${matched.length} firms`}`,
    text: `Hello ${lead.name},\n\nWe've checked your request and sent it to ${matched.length === 1 ? "a firm that covers" : `${matched.length} firms that cover`} ${lead.postcode}. They have ${ROUTING.replyHours} hours to say whether they can do it. We'll email you as soon as one takes it on, or if none can.\n\n${statusLine(deps, lead)}`,
  })
  return { routing: "offered", offered: matched.length }
}

export function briefByToken(db: Db, token: string): BriefView | undefined {
  const b = findBrief(db, token)
  if (!b) return undefined
  return viewOf(db, b)
}

// The firm behind a brief link pauses or resumes new briefs (booked up in season, Q2).
export function setPausedByToken(deps: Pick<Deps, "db" | "now">, token: string, paused: boolean): boolean {
  const b = findBrief(deps.db, token)
  if (!b) return false
  setPaused(deps, b.firmId, paused)
  return true
}

// The briefs on each lead, for the operator.
export function briefsByLead(db: Db): Map<number, { firm: string; state: BriefState; expiresAt: Date }[]> {
  const rows = db.select({ leadId: briefs.leadId, state: briefs.state, expiresAt: briefs.expiresAt, firm: firms.name })
    .from(briefs).innerJoin(firms, eq(firms.id, briefs.firmId)).all()
  const out = new Map<number, { firm: string; state: BriefState; expiresAt: Date }[]>()
  for (const r of rows) out.set(r.leadId, [...(out.get(r.leadId) ?? []), { firm: r.firm, state: r.state as BriefState, expiresAt: r.expiresAt }])
  return out
}

// The firm unlocks (the fee is recorded as owed, Q16) or passes. Only an offered brief that has not lapsed can be decided.
export async function decideBrief(deps: Deps, token: string, decision: "unlock" | "decline"): Promise<BriefView> {
  const b = findBrief(deps.db, token)
  if (!b) throw new Error("Brief not found")
  if (b.state !== "offered") throw new Error(`Brief is ${b.state}`)
  if (b.expiresAt <= deps.now()) {
    await lapse(deps, [b.id])
    throw new Error("Brief has lapsed")
  }
  const unlocked = decision === "unlock"
  deps.db.update(briefs).set({ state: unlocked ? "unlocked" : "declined", decidedAt: deps.now(), feePence: unlocked ? ROUTING.unlockFeePence : null })
    .where(eq(briefs.id, b.id)).run()
  const lead = deps.db.select().from(leads).where(eq(leads.id, b.leadId)).get()!
  if (unlocked) {
    const firm = deps.db.select().from(firms).where(eq(firms.id, b.firmId)).get()!
    await deps.mailer.send({
      to: lead.email,
      subject: `${firm.name} has your ${surveyBySlug(lead.survey)?.name.toLowerCase()} request`,
      text: `Hello ${lead.name},\n\n${firm.name} has taken your request for ${lead.postcode} and will contact you.${firm.website ? `\n${firm.website}` : ""}\n\n${statusLine(deps, lead)}`,
    })
  } else {
    await afterDecision(deps, lead)
  }
  return viewOf(deps.db, deps.db.select().from(briefs).where(eq(briefs.id, b.id)).get()!)
}

// The firm records how it went: unlocked → quoted → won or lost. Moves are checked against the Brief lifecycle in the map.
export type Outcome = "quoted" | "won" | "lost"
const BRIEF = objects.find((o) => o.id === "O-brief")!
export function canMove(from: string, to: string): boolean {
  return BRIEF.transitions.some((t) => t.from === from && t.to === to)
}
export function recordOutcome(deps: Pick<Deps, "db" | "now">, token: string, outcome: Outcome): BriefView {
  const b = findBrief(deps.db, token)
  if (!b) throw new Error("Brief not found")
  if (!canMove(b.state, outcome)) throw new Error(`A ${b.state} brief can't become ${outcome}`)
  deps.db.update(briefs).set({ state: outcome, decidedAt: deps.now() }).where(eq(briefs.id, b.id)).run()
  return viewOf(deps.db, deps.db.select().from(briefs).where(eq(briefs.id, b.id)).get()!)
}

// One reminder to each firm still deciding halfway through its time, with a fresh link to the same brief.
export async function chaseBriefs(deps: Deps): Promise<number> {
  const now = deps.now()
  const half = new Date(now.getTime() - (ROUTING.replyHours / 2) * 3600_000)
  const due = deps.db.select().from(briefs)
    .where(and(eq(briefs.state, "offered"), isNull(briefs.chasedAt), lte(briefs.offeredAt, half), lt(briefs.offeredAt, now))).all()
    .filter((b) => b.expiresAt > now)
  for (const b of due) {
    const token = randomBytes(24).toString("base64url")
    deps.db.update(briefs).set({ chasedAt: now, chaseTokenHash: hash(token) }).where(eq(briefs.id, b.id)).run()
    const lead = deps.db.select().from(leads).where(eq(leads.id, b.leadId)).get()!
    const firm = deps.db.select().from(firms).where(eq(firms.id, b.firmId)).get()!
    const v = leadView(lead)
    await deps.mailer.send({
      to: firm.email!,
      subject: `Reminder: ${v.survey.toLowerCase()} brief near ${v.area}`,
      text: `The ${v.survey.toLowerCase()} brief near ${v.area} is still open until ${b.expiresAt.toUTCString()}. After that it goes to the buyer as unanswered.

Unlock the buyer's contact or pass:
${deps.baseUrl}/briefs/${token}`,
    })
  }
  return due.length
}

// Everything time does to briefs: chase, then lapse. Pages run it on load; scripts/tick.ts runs it on a schedule.
export async function tick(deps: Deps): Promise<{ chased: number; lapsed: number }> {
  const chased = await chaseBriefs(deps)
  const lapsed = await lapseBriefs(deps)
  return { chased, lapsed }
}

// Lapses every offered brief past its time; tells buyers whose leads end with no firm.
export async function lapseBriefs(deps: Deps): Promise<number> {
  const due = deps.db.select({ id: briefs.id }).from(briefs).where(and(eq(briefs.state, "offered"), lt(briefs.expiresAt, deps.now()))).all()
  await lapse(deps, due.map((d) => d.id))
  return due.length
}

// The lead's routing state, read from its briefs (O-lead: offered, closed, expired).
export function leadRouting(db: Db, leadId: number): LeadRouting {
  const states = db.select({ state: briefs.state }).from(briefs).where(eq(briefs.leadId, leadId)).all().map((b) => b.state)
  const cancelled = db.select({ at: leads.cancelledAt }).from(leads).where(eq(leads.id, leadId)).get()?.at
  if (cancelled) return "cancelled"
  if (states.length === 0) {
    const lead = db.select({ routedAt: leads.routedAt }).from(leads).where(eq(leads.id, leadId)).get()
    return lead?.routedAt ? "expired" : "unrouted"
  }
  if (states.includes("offered")) return "offered"
  return states.some((s) => s !== "declined" && s !== "lapsed") ? "closed" : "expired"
}

// Firms pause when booked up and resume when they have room (O-listing: claimed ⇄ paused).
export function setPaused(deps: Pick<Deps, "db" | "now">, firmId: number, paused: boolean): void {
  deps.db.update(firms).set({ pausedAt: paused ? deps.now() : null }).where(eq(firms.id, firmId)).run()
}

async function lapse(deps: Deps, ids: number[]): Promise<void> {
  if (ids.length === 0) return
  deps.db.update(briefs).set({ state: "lapsed", decidedAt: deps.now() }).where(and(inArray(briefs.id, ids), eq(briefs.state, "offered"))).run()
  const leadIds = [...new Set(deps.db.select({ leadId: briefs.leadId }).from(briefs).where(inArray(briefs.id, ids)).all().map((b) => b.leadId))]
  for (const lead of deps.db.select().from(leads).where(inArray(leads.id, leadIds)).all()) await afterDecision(deps, lead)
}

// When the last brief on a lead is declined or lapses with no unlock, the buyer hears so.
async function afterDecision(deps: Deps, lead: Lead): Promise<void> {
  if (leadRouting(deps.db, lead.id) === "expired") await tellBuyerNoFirm(deps, lead)
}

async function tellBuyerNoFirm(deps: Deps, lead: Lead): Promise<void> {
  await deps.mailer.send({
    to: lead.email,
    subject: `No firm could take your ${surveyBySlug(lead.survey)?.name.toLowerCase()} request yet`,
    text: `Hello ${lead.name},\n\nNo firm covering ${lead.postcode} could take your request this time. Firms listed for the area are on ${deps.baseUrl}/search?survey=${lead.survey}&region=${lead.region}\n\n${statusLine(deps, lead)}`,
  })
}

// What any firm may see of a lead before unlocking.
function leadView(lead: Lead) {
  const label = (pairs: readonly (readonly [string, string])[], v: string) => pairs.find(([k]) => k === v)?.[1] ?? v
  return {
    survey: surveyBySlug(lead.survey)?.name ?? lead.survey,
    area: lead.postcode.split(" ")[0]!,
    region: regionBySlug(lead.region)?.name ?? lead.region,
    council: lead.council,
    projectType: label(PROJECT_TYPES, lead.projectType),
    planningStage: label(PLANNING_STAGES, lead.planningStage),
    deadline: lead.deadline, details: mask(lead.details), answer: mask(lead.answer),
  }
}

// Unlocked, and every state the map lets a brief reach after it.
const PAID = (() => {
  const out = new Set<string>(["unlocked"])
  for (let grew = true; grew; ) {
    grew = false
    for (const t of BRIEF.transitions) if (out.has(t.from) && !out.has(t.to)) { out.add(t.to); grew = true }
  }
  return out
})()

function viewOf(db: Db, b: typeof briefs.$inferSelect): BriefView {
  const lead = db.select().from(leads).where(eq(leads.id, b.leadId)).get()!
  const firm = db.select({ name: firms.name, pausedAt: firms.pausedAt }).from(firms).where(eq(firms.id, b.firmId)).get()!
  const state = b.state as BriefState
  return {
    ...leadView(lead), state, expiresAt: b.expiresAt, feePence: b.feePence, firm: { name: firm.name, paused: Boolean(firm.pausedAt) },
    // Once unlocked, the firm has paid to see everything the buyer wrote, for the rest of the brief's life.
    ...(PAID.has(state) ? { details: lead.details, answer: lead.answer, contact: { name: lead.name, email: lead.email, phone: lead.phone } } : {}),
  }
}

// Buyers sometimes type their own email or phone into the free text; hide it until unlock.
function mask(s: string): string {
  return s.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email hidden]").replace(/(?:\+44\s?|0)(?:\d[\s-]?){9,10}/g, "[phone hidden]")
}

// A brief answers to its first link and, once chased, to the reminder's link.
function findBrief(db: Db, token: string) {
  const h = hash(token)
  return db.select().from(briefs).where(or(eq(briefs.tokenHash, h), eq(briefs.chaseTokenHash, h))).get()
}

// The line every buyer email ends with: their private status link (D22).
function statusLine(deps: Pick<Deps, "baseUrl">, lead: Lead): string {
  return lead.statusToken ? `Check on your request, or cancel it, at any time: ${deps.baseUrl}/requests/${lead.statusToken}` : ""
}

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

// What the buyer's status link shows (D22): each step so far, and the firm once one has taken it on.
export type StatusStep = { label: string; done: boolean; detail?: string }
export type RequestStatus = {
  steps: StatusStep[]
  state: "waiting-confirmation" | "checking" | "rejected" | "with-firms" | "taken" | "no-firm" | "cancelled"
  firm?: { name: string; website: string | null; phone: string | null; email: string | null; slug: string }
  offeredTo: number
  expiresAt?: Date
}

export function requestStatus(db: Db, lead: Lead): RequestStatus {
  const rows = db.select({ state: briefs.state, expiresAt: briefs.expiresAt, firmId: briefs.firmId }).from(briefs).where(eq(briefs.leadId, lead.id)).all()
  const taken = rows.find((r) => PAID.has(r.state))
  const firm = taken ? db.select().from(firms).where(eq(firms.id, taken.firmId)).get() : undefined
  const routing = leadRouting(db, lead.id)
  const open = rows.filter((r) => r.state === "offered")
  const state: RequestStatus["state"] = lead.cancelledAt ? "cancelled" : firm ? "taken" : routing === "expired" ? "no-firm"
    : routing === "offered" ? "with-firms" : lead.review === "rejected" ? "rejected" : lead.confirmedAt ? "checking" : "waiting-confirmation"
  const steps: StatusStep[] = [
    { label: "You sent your request", done: true },
    { label: "You confirmed it by email", done: Boolean(lead.confirmedAt), detail: lead.confirmedAt ? undefined : "Click the link in the email we sent you." },
    { label: "We checked it", done: lead.review === "approved", detail: lead.review === "rejected" ? "We couldn't pass this one on to firms." : undefined },
    { label: rows.length ? `Sent to ${rows.length === 1 ? "a firm" : `${rows.length} firms`} near you` : "Sent to firms near you", done: rows.length > 0 || routing === "expired",
      detail: open.length ? `They have until ${open[0]!.expiresAt.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" })} to say whether they can do it.` : undefined },
    { label: firm ? `${firm.name} has taken it on` : "A firm takes it on", done: Boolean(firm),
      detail: state === "no-firm" ? "No firm could take it on this time." : undefined },
  ]
  return {
    steps, state, offeredTo: rows.length, expiresAt: open[0]?.expiresAt,
    firm: firm ? { name: firm.name, website: firm.website, phone: firm.phone, email: firm.email, slug: firm.slug } : undefined,
  }
}
