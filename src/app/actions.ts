"use server"

// Builds: PR1, PR2, PR3, O-lead, O-claim, O-brief

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { isAdmin } from "@/admin"
import { mailer } from "@/mailer"
import { confirmClaim, submitClaim, type Result } from "@/requests"
import { cancelLead, confirmLead, reviewLead, submitLead, type Submitted } from "@/leads"
import { redirect } from "next/navigation"
import { decideBrief, recordOutcome, routeLead, setPausedByToken } from "@/routing"
import { baseUrl } from "./base-url"
import { lookupPostcode, type Place } from "@/postcode"
import { extractFacts, type Extraction } from "@/extract"

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

// The buyer's area and council from the site postcode (PR1). Runs on our server, so the buyer's browser talks only to us.
export async function postcodeAction(postcode: string): Promise<Place | null> {
  return (await lookupPostcode(String(postcode).slice(0, 10))) ?? null
}

// The buyer's words, read into pills while they answer the next questions (D23, D27).
export async function factsAction(text: string): Promise<Extraction> {
  return extractFacts(String(text).slice(0, 2000))
}

// The firm records how it went (ST-U4.5): quoted, then won or lost.
export async function outcomeAction(form: FormData): Promise<void> {
  const token = String(form.get("token") ?? "")
  const outcome = form.get("outcome")
  if (outcome !== "quoted" && outcome !== "won" && outcome !== "lost") throw new Error("Bad outcome")
  try {
    recordOutcome({ db: db(), now: () => new Date() }, token, outcome)
  } catch {
    // Not a move the brief can make: the page shows its state.
  }
  redirect(`/briefs/${encodeURIComponent(token)}`)
}

// The buyer cancels from their status link (D22). Opening the link changes nothing; this needs the button.
export async function cancelRequestAction(form: FormData): Promise<void> {
  const token = String(form.get("token") ?? "")
  cancelLead({ db: db(), now: () => new Date() }, token)
  redirect(`/requests/${encodeURIComponent(token)}`)
}
