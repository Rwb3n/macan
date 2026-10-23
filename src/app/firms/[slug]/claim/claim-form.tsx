"use client"

// Builds: PR3, O-claim

import { useActionState } from "react"
import { claimAction, type FormState } from "../../../actions"

export function ClaimForm({ firm, domain }: { firm: string; domain?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(claimAction, null)
  if (state?.ok) {
    return (
      <div className="rounded-lg border border-line bg-leaf p-6">
        <h2 className="font-semibold">Claim received</h2>
        <p className="mt-1 text-sm">We&apos;ll email that address a link to confirm it&apos;s yours. Once confirmed, you can edit the listing.</p>
      </div>
    )
  }
  const err = state && !state.ok ? state.errors : {}
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="firm" value={firm} />
      <label className="block text-sm">
        <span className="block mb-1 font-medium">Your work email</span>
        {domain ? <span className="block mb-1 text-muted">It must end in @{domain}, so we know you work there.</span> : null}
        <input name="email" type="email" required autoComplete="email" className="w-full rounded-md border border-line bg-white px-3 py-2" />
        {err.email ? <span className="block mt-1 text-red-700">{err.email}</span> : null}
      </label>
      <button disabled={pending} className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-60">{pending ? "Checking…" : "Claim listing"}</button>
    </form>
  )
}
