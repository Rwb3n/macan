// Builds: PR3, O-claim
import { z } from "zod"
import { eq } from "drizzle-orm"
import type { Db } from "./db"
import { claimRequests, firms } from "./db/schema"
import { emailMatchesWebsite } from "./claim"

export type Result = { ok: true } | { ok: false; errors: Record<string, string> }

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
