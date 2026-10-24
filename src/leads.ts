// Builds: PR1, PR2, O-lead
// Lead intake, confirmation and operator review (map: PR1, O-lead; decision D2).
import { createHash, randomBytes } from "node:crypto"
import { z } from "zod"
import { and, desc, eq } from "drizzle-orm"
import type { Db } from "./db"
import { briefs, firms, leads } from "./db/schema"
import { REGION_SLUGS, SURVEY_SLUGS, surveyBySlug } from "./catalog"
import { PLANNING_STAGES, PROJECT_TYPES, qualify, type Qualification } from "./qualify"
import type { Mailer } from "./mailer"
import { LEAD_REVIEWS } from "@model/how"
import { cleanFacts } from "./jobsheet"

const blankToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v)

export const LeadInput = z.object({
  survey: z.string().refine((s) => SURVEY_SLUGS.includes(s), "Choose a survey"),
  region: z.string().refine((r) => REGION_SLUGS.includes(r), "Choose where the site is"),
  projectType: z.enum(PROJECT_TYPES.map(([v]) => v), "Choose what you're planning"),
  projectOther: z.preprocess(blankToNull, z.string().trim().max(200).nullable()).default(null),
  planningStage: z.enum(PLANNING_STAGES.map(([v]) => v), "Choose where you are with planning"),
  postcode: z.string().trim().min(2, "Enter the site postcode").max(10),
  council: z.preprocess(blankToNull, z.string().trim().max(80).nullable()).default(null),
  councilRef: z.preprocess(blankToNull, z.string().trim().max(40).nullable()),
  deadline: z.preprocess(blankToNull, z.iso.date("Enter a date").nullable()),
  details: z.string().trim().max(2000),
  // The job-sheet answers as JSON (D27); only this survey's well-formed answers are kept.
  sheet: z.preprocess((v) => { if (typeof v !== "string") return v; try { return JSON.parse(v) } catch { return {} } }, z.unknown()).default({}),
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.email("Enter a valid email address"),
  phone: z.preprocess(blankToNull, z.string().trim().max(30).nullable()),
  // "3" by default; "5", "10", or "all" for every firm covering the area (D24).
  pool: z.enum(["3", "5", "10", "all"]).default("3"),
  firm: z.string().optional(),
}).refine((l) => l.projectType !== "other" || l.projectOther, { path: ["projectOther"], message: "Tell us what you're planning" })

export type Deps = { db: Db; mailer: Mailer; now: () => Date; baseUrl: string }
export type Submitted = { ok: true; qualification: Qualification; reference: string } | { ok: false; errors: Record<string, string> }

// The buyer's reference for a request, e.g. SF-00042.
export const reference = (id: number) => `SF-${String(id).padStart(5, "0")}`

// How long a status link works after the request was made (D22).
export const STATUS_LINK_DAYS = 90

// Stores every well-formed lead, grades it, and emails a confirmation link. The grade is shown to the buyer at once.
export async function submitLead(deps: Deps, raw: unknown): Promise<Submitted> {
  const parsed = LeadInput.safeParse(raw)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) }
  const { firm: firmSlug, pool, sheet, ...l } = parsed.data
  const lead = { ...l, sheet: cleanFacts(l.survey, sheet), postcode: l.postcode.toUpperCase().replace(/\s+/g, " "), poolSize: pool === "all" ? 0 : Number(pool) }
  const qualification = qualify({ ...lead, emailConfirmed: false }, deps.now())
  const firm = firmSlug ? deps.db.select({ id: firms.id }).from(firms).where(eq(firms.slug, firmSlug)).get() : undefined
  const token = randomBytes(24).toString("base64url")
  const statusToken = randomBytes(18).toString("base64url")
  const row = deps.db.insert(leads).values({
    ...lead, firmId: firm?.id ?? null, tokenHash: hash(token), statusToken,
    grade: qualification.grade, qualification, createdAt: deps.now(),
  }).returning({ id: leads.id }).get()
  await deps.mailer.send({
    to: lead.email,
    subject: `Confirm your ${surveyBySlug(lead.survey)?.name.toLowerCase()} request`,
    text: [
      `Hello ${lead.name},`, "",
      `Your reference is ${reference(row.id)}. Click this link to confirm your request, so we can pass it to firms that cover ${lead.postcode}:`,
      `${deps.baseUrl}/leads/confirm/${token}`, "",
      "Keep this link to check on your request at any time, or to cancel it:",
      `${deps.baseUrl}/requests/${statusToken}`, "",
      "If you didn't ask for this, ignore this email and nothing happens.",
    ].join("\n"),
  })
  return { ok: true, qualification, reference: reference(row.id) }
}

// The request behind a buyer's status link (D22), and whether the link has expired.
export function leadByStatusToken(deps: Pick<Deps, "db" | "now">, token: string) {
  const lead = deps.db.select().from(leads).where(eq(leads.statusToken, token)).get()
  if (!lead) return undefined
  const expired = deps.now().getTime() - lead.createdAt.getTime() > STATUS_LINK_DAYS * 86_400_000
  return { lead, expired }
}

// The buyer cancels: no new firm will see it, and briefs still on offer are withdrawn (O-lead: cancelled; O-brief: withdrawn).
export function cancelLead(deps: Pick<Deps, "db" | "now">, token: string): boolean {
  const found = leadByStatusToken(deps, token)
  if (!found || found.expired) return false
  if (!found.lead.cancelledAt) {
    deps.db.update(leads).set({ cancelledAt: deps.now() }).where(eq(leads.id, found.lead.id)).run()
    deps.db.update(briefs).set({ state: "withdrawn", decidedAt: deps.now() })
      .where(and(eq(briefs.leadId, found.lead.id), eq(briefs.state, "offered"))).run()
  }
  return true
}

export function leadByToken(db: Db, token: string) {
  return db.select().from(leads).where(eq(leads.tokenHash, hash(token))).get()
}

export function confirmLead(deps: Pick<Deps, "db" | "now">, token: string): Qualification | undefined {
  const lead = deps.db.select().from(leads).where(eq(leads.tokenHash, hash(token))).get()
  if (!lead) return undefined
  const qualification = qualify({ ...lead, emailConfirmed: true }, deps.now())
  deps.db.update(leads).set({ confirmedAt: lead.confirmedAt ?? deps.now(), grade: qualification.grade, qualification })
    .where(eq(leads.id, lead.id)).run()
  return qualification
}

export function listLeads(db: Db) {
  return db.select().from(leads).orderBy(desc(leads.createdAt)).all()
}

export type ReviewDecision = Exclude<(typeof LEAD_REVIEWS)[number], "new">

export function reviewLead(deps: Pick<Deps, "db" | "now">, id: number, decision: ReviewDecision): void {
  const lead = deps.db.select().from(leads).where(eq(leads.id, id)).get()
  if (!lead) throw new Error(`Lead ${id} not found`)
  if (decision === "approved" && lead.grade !== "qualified") throw new Error(`Lead ${id} is ${lead.grade}; only qualified leads can be approved`)
  deps.db.update(leads).set({ review: decision, reviewedAt: deps.now() }).where(eq(leads.id, id)).run()
}

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) out[String(issue.path[0] ?? "form")] ??= issue.message
  return out
}
