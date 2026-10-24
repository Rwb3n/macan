// Builds: PR3, O-claim, O-listing
// Claim a listing: an address on the firm's own domain, then a confirmation link pressed by the firm (map: PR3, O-claim; D1).
import { createHash, randomBytes } from "node:crypto"
import { z } from "zod"
import { eq } from "drizzle-orm"
import type { Db } from "./db"
import { claimRequests, firms } from "./db/schema"
import { emailMatchesWebsite } from "./claim"
import type { Mailer } from "./mailer"

export type Result = { ok: true } | { ok: false; errors: Record<string, string> }
export type Deps = { db: Db; mailer: Mailer; now: () => Date; baseUrl: string }

export const ClaimInput = z.object({ firm: z.string(), email: z.email("Enter a valid email address") })

// Stores the claim and emails the address a link. Nothing changes on the listing until the link's button is pressed.
export async function submitClaim(deps: Deps, raw: unknown): Promise<Result> {
  const parsed = ClaimInput.safeParse(raw)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) }
  const firm = deps.db.select().from(firms).where(eq(firms.slug, parsed.data.firm)).get()
  if (!firm) return { ok: false, errors: { firm: "Firm not found" } }
  if (!emailMatchesWebsite(parsed.data.email, firm.website)) {
    return { ok: false, errors: { email: `Use an address at your firm's own website domain. If you can't, reply to us and we'll check by hand.` } }
  }
  const email = parsed.data.email.toLowerCase()
  const token = randomBytes(24).toString("base64url")
  deps.db.insert(claimRequests).values({ firmId: firm.id, email, tokenHash: hash(token), createdAt: deps.now() }).run()
  await deps.mailer.send({
    to: email,
    subject: `Confirm you manage ${firm.name}'s listing`,
    text: `Hello,\n\nSomeone asked to manage ${firm.name}'s listing with this address. If it was you, confirm here:\n${deps.baseUrl}/claims/confirm/${token}\n\nIf it wasn't, ignore this email and nothing changes.`,
  })
  return { ok: true }
}

export function claimByToken(db: Db, token: string) {
  const claim = db.select().from(claimRequests).where(eq(claimRequests.tokenHash, hash(token))).get()
  if (!claim) return undefined
  const firm = db.select({ name: firms.name, slug: firms.slug }).from(firms).where(eq(firms.id, claim.firmId)).get()!
  return { ...claim, firm }
}

// The firm pressed the button: the claim is confirmed and the listing is claimed (O-claim: confirmed; O-listing: claimed).
export function confirmClaim(deps: Pick<Deps, "db" | "now">, token: string): boolean {
  const claim = deps.db.select().from(claimRequests).where(eq(claimRequests.tokenHash, hash(token))).get()
  if (!claim) return false
  if (!claim.confirmedAt) {
    deps.db.update(claimRequests).set({ confirmedAt: deps.now() }).where(eq(claimRequests.id, claim.id)).run()
    const firm = deps.db.select({ claimedAt: firms.claimedAt }).from(firms).where(eq(firms.id, claim.firmId)).get()
    if (!firm?.claimedAt) deps.db.update(firms).set({ claimedAt: deps.now() }).where(eq(firms.id, claim.firmId)).run()
  }
  return true
}

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    out[key] ??= issue.message
  }
  return out
}
