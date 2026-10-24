import { describe, expect, it } from "vitest"
import { lookupPostcode } from "./postcode"

const reply = (result: unknown, ok = true) => async () => ({ ok, json: async () => ({ result }) })

describe("lookupPostcode", () => {
  it("maps an English region and gives the council", async () => {
    expect(await lookupPostcode("OX1 2JD", reply({ country: "England", region: "South East", admin_district: "Oxford" }))).toEqual({ region: "south-east", council: "Oxford" })
  })
  it("matches region names whatever their capitals", async () => {
    expect((await lookupPostcode("LS1 1AA", reply({ country: "England", region: "Yorkshire and The Humber", admin_district: "Leeds" })))?.region).toBe("yorkshire-humber")
  })
  it("treats Wales, Scotland and Northern Ireland as regions", async () => {
    expect((await lookupPostcode("CF10 1AA", reply({ country: "Wales", region: null, admin_district: "Cardiff" })))?.region).toBe("wales")
    expect((await lookupPostcode("BT1 5GS", reply({ country: "Northern Ireland", region: null, admin_district: "Belfast" })))?.region).toBe("northern-ireland")
  })
  it("asks nothing of the service for a part postcode", async () => {
    let called = false
    expect(await lookupPostcode("OX1", async () => { called = true; return { ok: true, json: async () => ({}) } })).toBeUndefined()
    expect(called).toBe(false)
  })
  it("gives up quietly when the service fails, is unknown or errors", async () => {
    expect(await lookupPostcode("ZZ1 1ZZ", reply(null, false))).toBeUndefined()
    expect(await lookupPostcode("OX1 2JD", async () => { throw new Error("down") })).toBeUndefined()
    expect(await lookupPostcode("OX1 2JD", reply({ country: "England", region: "Atlantis" }))).toBeUndefined()
  })
})
