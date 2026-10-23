"use client"

import { useActionState } from "react"
import { REGIONS, SURVEYS } from "@/catalog"
import { quoteAction, type FormState } from "../actions"

const field = "w-full rounded-md border border-line bg-white px-3 py-2"

export function QuoteForm({ survey, region, firm, firmName }: { survey?: string; region?: string; firm?: string; firmName?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(quoteAction, null)
  if (state?.ok) {
    return (
      <div className="rounded-lg border border-line bg-leaf p-6">
        <h2 className="font-semibold">Request received</h2>
        <p className="mt-1 text-sm">{firmName ? `We'll pass it to ${firmName}.` : "We'll pass it to firms that cover your area."} They'll reply to you by email.</p>
      </div>
    )
  }
  const err = state && !state.ok ? state.errors : {}
  return (
    <form action={action} className="space-y-4">
      {firm ? <input type="hidden" name="firm" value={firm} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Survey" error={err.survey}>
          <select name="survey" defaultValue={survey ?? ""} className={field} required>
            <option value="" disabled>Choose a survey</option>
            {SURVEYS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Region" error={err.region}>
          <select name="region" defaultValue={region ?? ""} className={field} required>
            <option value="" disabled>Where is the site?</option>
            {REGIONS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Site postcode" hint="The first half is enough (e.g. OX1)." error={err.postcode}>
        <input name="postcode" className={field} autoComplete="postal-code" required />
      </Field>
      <Field label="About the site and the work" hint="What are you planning, what has the council asked for, and by when?" error={err.details}>
        <textarea name="details" rows={5} className={field} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" error={err.name}><input name="name" className={field} autoComplete="name" required /></Field>
        <Field label="Your email" error={err.email}><input name="email" type="email" className={field} autoComplete="email" required /></Field>
      </div>
      <p className="text-xs text-muted">We share your request only with the firms you're asking for quotes, so they can reply.</p>
      <button disabled={pending} className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-60">{pending ? "Sending…" : "Send request"}</button>
    </form>
  )
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 font-medium">{label}</span>
      {hint ? <span className="block mb-1 text-muted">{hint}</span> : null}
      {children}
      {error ? <span className="block mt-1 text-red-700">{error}</span> : null}
    </label>
  )
}
