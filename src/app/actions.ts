"use server"

import { db } from "@/db"
import { submitClaim, submitQuote, type Result } from "@/requests"

export type FormState = Result | null

export async function quoteAction(_prev: FormState, form: FormData): Promise<FormState> {
  return submitQuote(db(), Object.fromEntries(form))
}

export async function claimAction(_prev: FormState, form: FormData): Promise<FormState> {
  return submitClaim(db(), Object.fromEntries(form))
}
