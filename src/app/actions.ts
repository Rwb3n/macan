"use server"

// Builds: PR1, PR3, O-lead, O-claim

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { isAdmin } from "@/admin"
import { mailer } from "@/mailer"
import { confirmClaim, submitClaim, type Result } from "@/requests"
import { confirmLead, reviewLead, submitLead, type Submitted } from "@/leads"
import { redirect } from "next/navigation"

export type FormState = Result | null
export type LeadState = Submitted | null

// Links in emails must not come from request headers in production: a forged Host would send the token elsewhere.
async function baseUrl(): Promise<string> {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, "")
  if (process.env.NODE_ENV === "production" && !process.env.LOCAL_DEMO) throw new Error("BASE_URL is not configured")
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  if (!host) throw new Error("No host header")
  return `${h.get("x-forwarded-proto") ?? "http"}://${host}`
}

export async function leadAction(_prev: LeadState, form: FormData): Promise<LeadState> {
  return submitLead({ db: db(), mailer: mailer(), now: () => new Date(), baseUrl: await baseUrl() }, Object.fromEntries(form))
}

export async function confirmAction(form: FormData): Promise<void> {
  const token = String(form.get("token") ?? "")
  if (!confirmLead({ db: db(), now: () => new Date() }, token)) throw new Error("Unknown confirmation link")
  redirect(`/leads/confirm/${encodeURIComponent(token)}?done=1`)
}

export async function claimAction(_prev: FormState, form: FormData): Promise<FormState> {
  return submitClaim({ db: db(), mailer: mailer(), now: () => new Date(), baseUrl: await baseUrl() }, Object.fromEntries(form))
}

export async function confirmClaimAction(form: FormData): Promise<void> {
  const token = String(form.get("token") ?? "")
  if (!confirmClaim({ db: db(), now: () => new Date() }, token)) throw new Error("Unknown confirmation link")
  redirect(`/claims/confirm/${encodeURIComponent(token)}?done=1`)
}

// Operator only. Server actions can be called directly, so the password is checked here, not only by the proxy.
export async function reviewAction(form: FormData): Promise<void> {
  if (!isAdmin((await headers()).get("authorization"))) throw new Error("Not authorised")
  const id = Number(form.get("id"))
  const decision = form.get("decision")
  if (!Number.isInteger(id) || (decision !== "approved" && decision !== "rejected")) throw new Error("Bad review")
  reviewLead({ db: db(), now: () => new Date() }, id, decision)
  revalidatePath("/admin/leads")
}
