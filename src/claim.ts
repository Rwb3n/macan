// Builds: PR3
import { getDomain } from "tldts"

// Claim proof: an email address on the firm's own website domain.
// Pure: no I/O. The caller still has to confirm the address by sending it a link.

export function websiteDomain(website: string): string | undefined {
  try {
    const url = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`)
    return url.hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return undefined
  }
}

// True when the email and the website share a registrable domain (mail.firm.co.uk and www.firm.co.uk → firm.co.uk).
// Shared hosts (sites.google.com, wixsite.com, …) never prove ownership.
export function emailMatchesWebsite(email: string, website: string | null): boolean {
  if (!website) return false
  const host = websiteDomain(website)
  const at = email.lastIndexOf("@")
  if (!host || at < 1) return false
  if (SHARED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return false
  const site = getDomain(host)
  const mail = getDomain(email.slice(at + 1).toLowerCase().trim())
  return site !== null && site === mail
}

const SHARED_HOSTS = ["sites.google.com", "wixsite.com", "square.site", "wordpress.com", "github.io", "squarespace.com"]
