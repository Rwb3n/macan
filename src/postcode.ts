// Builds: PR1, ST-U2.2, PN3
// The site's area and council from its postcode, so the buyer isn't asked twice (map: PR1; D14).
// Source: postcodes.io (MIT; Ordnance Survey and ONS data). It is a free service with no guarantee:
// any failure returns undefined and the buyer picks the area instead.
import { REGIONS } from "./catalog"

export type Place = { region: string; council: string | null }

const FULL_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i
const COUNTRIES: Record<string, string> = { Wales: "wales", Scotland: "scotland", "Northern Ireland": "northern-ireland" }
const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "")

type Fetch = (url: string, init?: { signal?: AbortSignal }) => Promise<{ ok: boolean; json(): Promise<unknown> }>

export async function lookupPostcode(postcode: string, fetchImpl: Fetch = fetch, timeoutMs = 3000): Promise<Place | undefined> {
  const pc = postcode.trim()
  if (!FULL_POSTCODE.test(pc)) return undefined
  try {
    const res = await fetchImpl(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc.replace(/\s+/g, ""))}`, { signal: AbortSignal.timeout(timeoutMs) })
    if (!res.ok) return undefined
    const r = ((await res.json()) as { result?: { country?: string; region?: string | null; admin_district?: string | null } }).result
    if (!r?.country) return undefined
    // English postcodes carry a region; Wales, Scotland and Northern Ireland are regions of their own here.
    const region = COUNTRIES[r.country] ?? REGIONS.find((g) => r.region && norm(g.name) === norm(r.region))?.slug
    return region ? { region, council: r.admin_district ?? null } : undefined
  } catch {
    return undefined
  }
}
