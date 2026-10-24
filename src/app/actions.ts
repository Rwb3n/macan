"use server"

// Builds: PR1, PR2, PR3, O-lead, O-claim, O-brief

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { isAdmin } from "@/admin"
import { mailer } from "@/mailer"
import { confirmClaim, submitClaim, type Result } from "@/requests"
import { confirmLead, reviewLead, submitLead, type Submitted } from "@/leads"
import { redirect } from "next/navigation"
import { decideBrief, routeLead, setPausedByToken } from "@/routing"
import { baseUrl } from "./base-url"

export type FormState = Result | null
export type LeadState = Submitted | null


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

// Operator only: send an approved lead to matching firms (PR2).
export async function routeAction(form: FormData): Promise<void> {
  if (!isAdmin((await headers()).get("authorization"))) throw new Error("Not authorised")
  const id = Number(form.get("id"))
  if (!Number.isInteger(id)) throw new Error("Bad lead")
  await routeLead({ db: db(), mailer: mailer(), now: () => new Date(), baseUrl: await baseUrl() }, id)
  revalidatePath("/admin/leads")
}

// The firm behind a brief link: unlock or pass. The token is the firm's proof, as in the emailed link.
export async function briefAction(form: FormData): Promise<void> {
  const token = String(form.get("token") ?? "")
  const decision = form.get("decision")
  if (decision !== "unlock" && decision !== "decline") throw new Error("Bad decision")
  try {
    await decideBrief({ db: db(), mailer: mailer(), now: () => new Date(), baseUrl: await baseUrl() }, token, decision)
  } catch {
    // Already decided or lapsed: the page shows the brief's state.
  }
  redirect(`/briefs/${encodeURIComponent(token)}`)
}

export async function pauseAction(form: FormData): Promise<void> {
  const token = String(form.get("token") ?? "")
  setPausedByToken({ db: db(), now: () => new Date() }, token, form.get("paused") === "1")
  redirect(`/briefs/${encodeURIComponent(token)}`)
}
