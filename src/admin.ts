// Builds: PR1
import { timingSafeEqual } from "node:crypto"

// Operator access: HTTP Basic auth against ADMIN_PASSWORD. No password configured → no access (fail closed).
export function isAdmin(authorization: string | null, password = process.env.ADMIN_PASSWORD): boolean {
  if (!password || !authorization?.startsWith("Basic ")) return false
  const decoded = Buffer.from(authorization.slice(6), "base64").toString()
  const given = Buffer.from(decoded.slice(decoded.indexOf(":") + 1))
  const want = Buffer.from(password)
  return given.length === want.length && timingSafeEqual(given, want)
}
