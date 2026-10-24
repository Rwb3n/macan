// Builds: PR1, O-lead
// Lead intake, confirmation and operator review (map: PR1, O-lead; decision D2).
import { createHash, randomBytes } from "node:crypto"
import { z } from "zod"
import { desc, eq } from "drizzle-orm"
import type { Db } from "./db"
import { firms, leads } from "./db/schema"
import { REGION_SLUGS, SURVEY_SLUGS, surveyBySlug } from "./catalog"
import { PLANNING_STAGES, PROJECT_TYPES, qualify, type Qualification } from "./qualify"
import type { Mailer } from "./mailer"
import { LEAD_REVIEWS } from "@model/how"

const blankToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v)

export const LeadInput = z.object({
  survey: z.string().refine((s) => SURVEY_SLUGS.includes(s), "Choose a survey"),
  region: z.string().refine((r) => REGION_SLUGS.includes(r), "Choose where the site is"),
  projectType: z.enum(PROJECT_TYPES.map(([v]) => v), "Choose what you're planning"),
  planningStage: z.enum(PLANNING_STAGES.map(([v]) => v), "Choose where you are with planning"),
  postcode: z.string().trim().min(2, "Enter the site postcode").max(10),
  council: z.preprocess(blankToNull, z.string().trim().max(80).nullable()).default(null),
  councilRef: z.preprocess(blankToNull, z.string().trim().max(40).nullable()),
  deadline: z.preprocess(blankToNull, z.iso.date("Enter a date").nullable()),
  details: z.string().trim().max(2000),
  answer: z.string().trim().max(1000).default(""),
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.email("Enter a valid email address"),
  phone: z.preprocess(blankToNull, z.string().trim().max(30).nullable()),
  firm: z.string().optional(),
})

export type Deps = { db: Db; mailer: Mailer; now: () => Date; baseUrl: string }
export type Submitted = { ok: true; qualification: Qualification } | { ok: false; errors: Record<string, string> }

// Stores every well-formed lead, grades it, and emails a confirmation link. The grade is shown to the buyer at once.
export async function submitLead(deps: Deps, raw: unknown): Promise<Submitted> {
  const parsed = LeadInput.safeParse(raw)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) }
  const { firm: firmSlug, ...l } = parsed.data
  const lead = { ...l, postcode: l.postcode.toUpperCase().replace(/\s+/g, " ") }
  const qualification = qualify({ ...lead, emailConfirmed: false }, deps.now())
  const firm = firmSlug ? deps.db.select({ id: firms.id }).from(firms).where(eq(firms.slug, firmSlug)).get() : undefined
  const token = randomBytes(24).toString("base64url")
  deps.db.insert(leads).values({
    ...lead, firmId: firm?.id ?? null, tokenHash: hash(token),
    grade: qualification.grade, qualification, createdAt: deps.now(),
  }).run()
  await deps.mailer.send({
    to: lead.email,
    subject: `Confirm your ${surveyBySlug(lead.survey)?.name.toLowerCase()} request`,
    text: `Hello ${lead.name},\n\nConfirm your request so we can pass it to firms that cover ${lead.postcode}:\n${deps.baseUrl}/leads/confirm/${token}\n\nIf you didn't ask for this, ignore this email and nothing happens.`,
  })
  return { ok: true, qualification }
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
