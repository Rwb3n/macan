// Builds: PR2
// What time does to briefs: chase firms halfway through, lapse the overdue and tell buyers. Run every few minutes by a scheduler (Q21).
// Usage: BASE_URL=https://… npm run tick
import { db } from "../src/db"
import { mailer } from "../src/mailer"
import { tick } from "../src/routing"

const baseUrl = process.env.BASE_URL?.replace(/\/$/, "")
if (!baseUrl) throw new Error("BASE_URL is required: links in emails must not guess the host")
const done = await tick({ db: db(), mailer: mailer(), now: () => new Date(), baseUrl })
console.log(JSON.stringify({ event: "tick", ...done }))
