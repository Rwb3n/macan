"use client"

import { useActionState, useState } from "react"
import { REGIONS, SURVEYS, surveyBySlug } from "@/catalog"
import { PLANNING_STAGES, PROJECT_TYPES, type Qualification } from "@/qualify"
import { leadAction, type LeadState } from "../actions"

const field = "w-full rounded-md border border-line bg-white px-3 py-2"

export function QuoteForm({ survey, region, firm, firmName }: { survey?: string; region?: string; firm?: string; firmName?: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(leadAction, null)
  const [chosen, setChosen] = useState(survey ?? "")
  if (state?.ok) return <Received q={state.qualification} firmName={firmName} />
  const err = state && !state.ok ? state.errors : {}
  const ask = surveyBySlug(chosen)?.ask
  return (
    <form action={action} className="space-y-5">
      {firm ? <input type="hidden" name="firm" value={firm} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Survey" error={err.survey}>
          <select name="survey" value={chosen} onChange={(e) => setChosen(e.target.value)} className={field} required>
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
        <Field label="What are you planning?" error={err.projectType}>
          <select name="projectType" defaultValue="" className={field} required>
            <option value="" disabled>Choose one</option>
            {PROJECT_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="Where are you with planning?" error={err.planningStage}>
          <select name="planningStage" defaultValue="" className={field} required>
            <option value="" disabled>Choose one</option>
            {PLANNING_STAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="Site postcode" hint="The full postcode lets firms price travel." error={err.postcode}>
          <input name="postcode" className={field} autoComplete="postal-code" required />
        </Field>
        <Field label="When do you need the report by?" hint="Leave blank if there's no deadline." error={err.deadline}>
          <input name="deadline" type="date" className={field} />
        </Field>
      </div>
      <Field label="Planning reference" hint="If the council has given you one." error={err.councilRef}>
        <input name="councilRef" className={field} />
      </Field>
      <Field label="About the site and the work" hint="What's there now, what you're changing, and what the council said." error={err.details}>
        <textarea name="details" rows={4} className={field} required />
      </Field>
      {ask ? (
        <Field label={ask} error={err.answer}>
          <textarea name="answer" rows={2} className={field} />
        </Field>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your name" error={err.name}><input name="name" className={field} autoComplete="name" required /></Field>
        <Field label="Your email" error={err.email}><input name="email" type="email" className={field} autoComplete="email" required /></Field>
        <Field label="Phone (optional)" error={err.phone}><input name="phone" type="tel" className={field} autoComplete="tel" /></Field>
      </div>
      <p className="text-xs text-muted">We check every request before any firm sees it, and share it only with firms that cover your area for this survey.</p>
      <button disabled={pending} className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-60">{pending ? "Sending…" : "Send request"}</button>
    </form>
  )
}

function Received({ q, firmName }: { q: Qualification; firmName?: string }) {
  const season = q.checks.timely.note
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-leaf p-6">
        <h2 className="font-semibold">Check your email</h2>
        <p className="mt-1 text-sm">We&apos;ve sent you a link. Your request goes {firmName ? `to ${firmName}` : "to firms"} only once you&apos;ve confirmed it.</p>
      </div>
      {q.grade === "not-a-fit" ? (
        <Note tone="amber" title="We may not be able to help">{q.checks.real.note}. Our firms take on surveys for planning applications.</Note>
      ) : null}
      {q.missing.length ? (
        <Note tone="amber" title="One more thing firms will need">Please reply to the email with {q.missing.join(", and ")}.</Note>
      ) : null}
      {season ? (
        <Note tone={q.checks.timely.pass ? "plain" : "amber"} title={q.checks.timely.pass ? "About timing" : "Your deadline is before the survey season"}>
          {season}. {q.checks.timely.pass ? "" : "Tell the council now: they may accept a later report or a condition."}
        </Note>
      ) : null}
    </div>
  )
}

function Note({ tone, title, children }: { tone: "amber" | "plain"; title: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border p-5 text-sm ${tone === "amber" ? "border-amber/40 bg-amber/5" : "border-line bg-white"}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{children}</p>
    </div>
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
