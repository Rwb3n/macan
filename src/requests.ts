import { z } from "zod"
import { eq } from "drizzle-orm"
import type { Db } from "./db"
import { claimRequests, firms, quoteRequests } from "./db/schema"
import { REGION_SLUGS, SURVEY_SLUGS } from "./catalog"
import { emailMatchesWebsite } from "./claim"

// UK postcode: outward code required, inward optional (people often know only "OX1").
const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?(\s*\d[A-Z]{2})?$/i

export const QuoteInput = z.object({
  survey: z.string().refine((s) => SURVEY_SLUGS.includes(s), "Choose a survey"),
  region: z.string().refine((r) => REGION_SLUGS.includes(r), "Choose where the site is"),
  postcode: z.string().trim().regex(POSTCODE, "Enter a UK postcode, or at least its first half (e.g. OX1)"),
  details: z.string().trim().min(20, "Say a little about the site and the work (at least 20 characters)").max(2000),
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.email("Enter a valid email address"),
  firm: z.string().optional(),
})

export type Result = { ok: true } | { ok: false; errors: Record<string, string> }

export function submitQuote(db: Db, raw: unknown): Result {
  const parsed = QuoteInput.safeParse(raw)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) }
  const { firm: firmSlug, ...q } = parsed.data
  const firm = firmSlug ? db.select({ id: firms.id }).from(firms).where(eq(firms.slug, firmSlug)).get() : undefined
  db.insert(quoteRequests).values({ ...q, postcode: q.postcode.toUpperCase(), firmId: firm?.id ?? null }).run()
  return { ok: true }
}

export const ClaimInput = z.object({ firm: z.string(), email: z.email("Enter a valid email address") })

export function submitClaim(db: Db, raw: unknown): Result {
  const parsed = ClaimInput.safeParse(raw)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) }
  const firm = db.select().from(firms).where(eq(firms.slug, parsed.data.firm)).get()
  if (!firm) return { ok: false, errors: { firm: "Firm not found" } }
  if (!emailMatchesWebsite(parsed.data.email, firm.website)) {
    return { ok: false, errors: { email: `Use an address at your firm's own website domain. If you can't, reply to us and we'll check by hand.` } }
  }
  db.insert(claimRequests).values({ firmId: firm.id, email: parsed.data.email.toLowerCase() }).run()
  return { ok: true }
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    out[key] ??= issue.message
  }
  return out
}
