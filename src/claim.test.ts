import { describe, expect, it } from "vitest"
import { emailMatchesWebsite, websiteDomain } from "./claim"

describe("websiteDomain", () => {
  it("strips scheme and www", () => expect(websiteDomain("https://www.leighecology.co.uk/")).toBe("leighecology.co.uk"))
  it("accepts a bare host", () => expect(websiteDomain("simecology.co.uk")).toBe("simecology.co.uk"))
  it("rejects junk", () => expect(websiteDomain("not a url")).toBeUndefined())
})

describe("emailMatchesWebsite", () => {
  it("matches the same domain", () => expect(emailMatchesWebsite("team@leighecology.co.uk", "https://www.leighecology.co.uk")).toBe(true))
  it("is case-insensitive", () => expect(emailMatchesWebsite("Team@LeighEcology.co.uk", "leighecology.co.uk")).toBe(true))
  it("rejects another domain", () => expect(emailMatchesWebsite("someone@gmail.com", "leighecology.co.uk")).toBe(false))
  it("rejects a lookalike suffix", () => expect(emailMatchesWebsite("x@ecology.co.uk", "leighecology.co.uk")).toBe(false))
  it("accepts a parent domain of a subdomain site", () => expect(emailMatchesWebsite("x@firm.co.uk", "https://surveys.firm.co.uk")).toBe(true))
  it("accepts a mail subdomain", () => expect(emailMatchesWebsite("x@mail.firm.co.uk", "https://www.firm.co.uk")).toBe(true))
  it("rejects a bare public suffix", () => expect(emailMatchesWebsite("x@co.uk", "https://firm.co.uk")).toBe(false))
  it("never trusts shared hosts", () => expect(emailMatchesWebsite("x@google.com", "https://sites.google.com/spiresecology.com/sel")).toBe(false))
  it("needs a website", () => expect(emailMatchesWebsite("x@firm.co.uk", null)).toBe(false))
})
