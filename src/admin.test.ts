import { describe, expect, it } from "vitest"
import { isAdmin } from "./admin"

const basic = (user: string, pass: string) => `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`

describe("isAdmin", () => {
  it("accepts the right password", () => expect(isAdmin(basic("op", "s3cret-pass"), "s3cret-pass")).toBe(true))
  it("rejects a wrong password", () => expect(isAdmin(basic("op", "nope"), "s3cret-pass")).toBe(false))
  it("rejects no header", () => expect(isAdmin(null, "s3cret-pass")).toBe(false))
  it("fails closed with no password configured", () => expect(isAdmin(basic("op", ""), "")).toBe(false))
  it("keeps colons in the password", () => expect(isAdmin(basic("op", "a:b"), "a:b")).toBe(true))
})
