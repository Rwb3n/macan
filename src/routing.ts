// Builds: PR2, O-brief, ST-U4.2, ST-U4.3, O-listing, PN3
// Route an approved lead to firms as briefs, contact hidden; firms unlock or pass; briefs lapse; the buyer is told (map: PR2, O-brief; D2).
// The terms (how many firms, how long, the fee) are guesses in the map (ROUTING: Q15, Q16, Q3).
import { createHash, randomBytes } from "node:crypto"
import { and, eq, inArray, lt } from "drizzle-orm"
import type { Db } from "./db"
import { briefs, firms, leads } from "./db/schema"
import { findFirms } from "./directory"
import { regionBySlug, surveyBySlug } from "./catalog"
import { PLANNING_STAGES, PROJECT_TYPES } from "./qualify"
import type { Mailer } from "./mailer"
import { BRIEF_STATES, ROUTING } from "@model/how"

export type Deps = { db: Db; mailer: Mailer; now: () => Date; baseUrl: string }
export type BriefState = (typeof BRIEF_STATES)[number]
export type LeadRouting = "unrouted" | "offered" | "closed" | "expired"

type Lead = typeof leads.$inferSelect
type Firm = typeof firms.$inferSelect

// What a firm sees before unlocking: survey, area, timing and the site. Never the buyer's name, email or phone.
export type BriefView = {
  survey: string; area: string; region: string; projectType: string; planningStage: string
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
  return [...picked, ...fits.filter((f) => f.id !== lead.firmId)].slice(0, ROUTING.firmsPerLead)
}

// Offers an approved lead to the matching firms. With no match the lead expires and the buyer is told at once.
export async function routeLead(deps: Deps, leadId: number): Promise<{ routing: LeadRouting; offered: number }> {
  const lead = deps.db.select().from(leads).where(eq(leads.id, leadId)).get()
  if (!lead) throw new Error(`Lead ${leadId} not found`)
  if (lead.review !== "approved") throw new Error(`Lead ${leadId} is ${lead.review}; only approved leads are routed`)
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
        `${v.survey} near ${v.area} (${v.region}).`,
        `${v.projectType} · ${v.planningStage}${v.deadline ? ` · needed by ${v.deadline}` : ""}`,
        "", v.details, v.answer ? `\n${v.answer}` : "",
        "", `Unlock the buyer's contact or pass, by ${expiresAt.toUTCString()}:`, `${deps.baseUrl}/briefs/${token}`,
      ].join("\n"),
    })
  }
  return { routing: "offered", offered: matched.length }
}

export function briefByToken(db: Db, token: string): BriefView | undefined {
  const b = db.select().from(briefs).where(eq(briefs.tokenHash, hash(token))).get()
  if (!b) return undefined
  return viewOf(db, b)
}

// The firm behind a brief link pauses or resumes new briefs (booked up in season, Q2).
export function setPausedByToken(deps: Pick<Deps, "db" | "now">, token: string, paused: boolean): boolean {
  const b = deps.db.select({ firmId: briefs.firmId }).from(briefs).where(eq(briefs.tokenHash, hash(token))).get()
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
  const b = deps.db.select().from(briefs).where(eq(briefs.tokenHash, hash(token))).get()
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
      text: `Hello ${lead.name},\n\n${firm.name} has taken your request for ${lead.postcode} and will contact you.${firm.website ? `\n${firm.website}` : ""}`,
    })
  } else {
    await afterDecision(deps, lead)
  }
  return viewOf(deps.db, deps.db.select().from(briefs).where(eq(briefs.id, b.id)).get()!)
}

// Lapses every offered brief past its time; tells buyers whose leads end with no firm. Run on a schedule.
export async function lapseBriefs(deps: Deps): Promise<number> {
  const due = deps.db.select({ id: briefs.id }).from(briefs).where(and(eq(briefs.state, "offered"), lt(briefs.expiresAt, deps.now()))).all()
  await lapse(deps, due.map((d) => d.id))
  return due.length
}

// The lead's routing state, read from its briefs (O-lead: offered, closed, expired).
export function leadRouting(db: Db, leadId: number): LeadRouting {
  const states = db.select({ state: briefs.state }).from(briefs).where(eq(briefs.leadId, leadId)).all().map((b) => b.state)
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
    text: `Hello ${lead.name},\n\nNo firm covering ${lead.postcode} could take your request this time. Firms listed for the area are on ${deps.baseUrl}/search?survey=${lead.survey}&region=${lead.region}`,
  })
}

// What any firm may see of a lead before unlocking.
function leadView(lead: Lead) {
  const label = (pairs: readonly (readonly [string, string])[], v: string) => pairs.find(([k]) => k === v)?.[1] ?? v
  return {
    survey: surveyBySlug(lead.survey)?.name ?? lead.survey,
    area: lead.postcode.split(" ")[0]!,
    region: regionBySlug(lead.region)?.name ?? lead.region,
    projectType: label(PROJECT_TYPES, lead.projectType),
    planningStage: label(PLANNING_STAGES, lead.planningStage),
    deadline: lead.deadline, details: mask(lead.details), answer: mask(lead.answer),
  }
}

function viewOf(db: Db, b: typeof briefs.$inferSelect): BriefView {
  const lead = db.select().from(leads).where(eq(leads.id, b.leadId)).get()!
  const firm = db.select({ name: firms.name, pausedAt: firms.pausedAt }).from(firms).where(eq(firms.id, b.firmId)).get()!
  const state = b.state as BriefState
  return {
    ...leadView(lead), state, expiresAt: b.expiresAt, feePence: b.feePence, firm: { name: firm.name, paused: Boolean(firm.pausedAt) },
    // Once unlocked, the firm has paid to see everything the buyer wrote.
    ...(state === "unlocked" ? { details: lead.details, answer: lead.answer, contact: { name: lead.name, email: lead.email, phone: lead.phone } } : {}),
  }
}

// Buyers sometimes type their own email or phone into the free text; hide it until unlock.
function mask(s: string): string {
  return s.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email hidden]").replace(/(?:\+44\s?|0)(?:\d[\s-]?){9,10}/g, "[phone hidden]")
}

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}
