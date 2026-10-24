// Builds: infra
import { headers } from "next/headers"

// Links in emails must not come from request headers in production: a forged Host would send the token elsewhere.
export async function baseUrl(): Promise<string> {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, "")
  if (process.env.NODE_ENV === "production" && !process.env.LOCAL_DEMO) throw new Error("BASE_URL is not configured")
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  if (!host) throw new Error("No host header")
  return `${h.get("x-forwarded-proto") ?? "http"}://${host}`
}
