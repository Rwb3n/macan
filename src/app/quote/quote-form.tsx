"use client"

// Builds: U2, ST-U2.1, ST-U2.2, ST-U2.3, PR1, O-lead, PN3
// Problem first, answer before asking, contact last and only by choice; every field says why (D14).

import Link from "next/link"
import { useActionState, useMemo, useState } from "react"
import { REGIONS, SURVEYS, regionBySlug, suggestSurvey, surveyBySlug } from "@/catalog"
import { PLANNING_STAGES, PROJECT_TYPES, checkTimely, type Qualification } from "@/qualify"
import { ROUTING } from "@model/how"
import { leadAction, type LeadState } from "../actions"

const field = "w-full rounded-md border border-line bg-white px-3 py-2"
const BLANK = { survey: "", region: "", details: "", postcode: "", projectType: "", planningStage: "", deadline: "", councilRef: "", answer: "", name: "", email: "", phone: "" }
type Key = keyof typeof BLANK
const STEP_OF: Record<string, 1 | 2 | 3> = {
  details: 1, postcode: 1, survey: 2, region: 2, projectType: 2, planningStage: 2, deadline: 2, councilRef: 2, answer: 3, name: 3, email: 3, phone: 3,
}

type Props = { survey?: string; region?: string; firm?: string; firmName?: string; coverage: Record<string, Record<string, number>> }

export function QuoteForm({ survey, region, firm, firmName, coverage }: Props) {
  const [state, action, pending] = useActionState<LeadState, FormData>(leadAction, null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [v, setV] = useState<typeof BLANK>({ ...BLANK, survey: survey ?? "", region: region ?? "" })
  const set = (k: Key) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }))
  const err = state && !state.ok ? state.errors : {}
  const errStep = Math.min(...Object.keys(err).map((k) => STEP_OF[k] ?? 3)) as 1 | 2 | 3
  const shown = Object.keys(err).length && errStep < step ? errStep : step

  if (state?.ok) return <Received q={state.qualification} firmName={firmName} />

  const goAnswer = () => {
    setV((x) => ({ ...x, survey: x.survey || suggestSurvey(x.details) || "" }))
    setStep(2)
  }
  const s = surveyBySlug(v.survey)
  const firms = v.survey && v.region ? coverage[v.survey]?.[v.region] ?? 0 : undefined

  return (
    <form action={action} className="space-y-6">
      {firm ? <input type="hidden" name="firm" value={firm} /> : null}
      {Object.entries(v).map(([k, val]) => <input key={k} type="hidden" name={k} value={val} />)}

      <Step n={1} title="What's going on?" open={shown === 1} done={shown > 1} onEdit={() => setStep(1)}
        summary={`${v.details.slice(0, 90)}${v.details.length > 90 ? "…" : ""} · ${v.postcode}`}>
        <Field label="In your own words" why="So we can work out which survey you need. Nobody else sees this yet." error={err.details}>
          <textarea rows={4} className={field} value={v.details} onChange={set("details")} placeholder="e.g. We're converting the loft of a 1930s semi. The council's validation team said we need a bat survey before they'll register the application." />
        </Field>
        <Field label="Site postcode" why="To find firms near the site and check your area. Firms only ever see the first half (like OX1) unless you choose to share more." error={err.postcode}>
          <input className={`${field} sm:w-48`} autoComplete="postal-code" value={v.postcode} onChange={set("postcode")} />
        </Field>
        <button type="button" disabled={v.details.trim().length < 10 || v.postcode.trim().length < 2} onClick={goAnswer}
          className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-50">See what you need</button>
      </Step>

      <Step n={2} title="What you need, and when" open={shown === 2} done={shown > 2} onEdit={() => setStep(2)}
        summary={[s?.name, regionBySlug(v.region)?.name].filter(Boolean).join(" · ")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Survey" why={v.survey && v.survey === suggestSurvey(v.details) ? "Our best guess from what you wrote. Change it if it's wrong." : "Which survey the council asked for, or our best guess."} error={err.survey}>
            <select className={field} value={v.survey} onChange={set("survey")}>
              <option value="">Not sure: choose the closest</option>
              {SURVEYS.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
            </select>
          </Field>
          <Field label="Region" why="Firms work by region." error={err.region}>
            <select className={field} value={v.region} onChange={set("region")}>
              <option value="">Where is the site?</option>
              {REGIONS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
            </select>
          </Field>
        </div>

        {s ? <Answer survey={s} deadline={v.deadline} firms={firms} region={regionBySlug(v.region)?.name} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="What are you planning?" why="It changes what the survey involves." error={err.projectType}>
            <select className={field} value={v.projectType} onChange={set("projectType")}>
              <option value="">Choose one</option>
              {PROJECT_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </Field>
          <Field label="Where are you with planning?" why="Tells us how urgent it is, and whether you need a survey at all." error={err.planningStage}>
            <select className={field} value={v.planningStage} onChange={set("planningStage")}>
              <option value="">Choose one</option>
              {PLANNING_STAGES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </Field>
          <Field label="Report needed by (optional)" why="We'll check it against the survey season." error={err.deadline}>
            <input type="date" className={field} value={v.deadline} onChange={set("deadline")} />
          </Field>
          <Field label="Planning reference (optional)" why="Lets a firm read what the council said." error={err.councilRef}>
            <input className={field} value={v.councilRef} onChange={set("councilRef")} />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" disabled={!v.survey || !v.region || !v.projectType || !v.planningStage} onClick={() => setStep(3)}
            className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-50">{firmName ? `Send this to ${firmName}?` : "Send this to local firms?"}</button>
          {v.survey && v.region ? <Link href={`/search?survey=${v.survey}&region=${v.region}`} className="text-sm text-moss underline">No thanks, show me the firms</Link> : null}
        </div>
      </Step>

      <Step n={3} title={firmName ? `Send it to ${firmName}` : `Send it to up to ${ROUTING.firmsPerLead} local firms`} open={shown === 3} done={false} onEdit={() => setStep(3)} summary="">
        <ol className="rounded-lg border border-line bg-white p-4 text-sm space-y-1 list-decimal pl-8">
          <li>We email you a link. Your request goes nowhere until you press it.</li>
          <li>We check it, then {firmName ? firmName : `up to ${ROUTING.firmsPerLead} firms that cover your area`} see the job and the area ({v.postcode.trim().split(" ")[0]?.toUpperCase() || "first half of the postcode"}). Not your name, email or phone.</li>
          <li>A firm that wants the job unlocks your contact and gets in touch. Firms have {ROUTING.replyHours} hours.</li>
          <li>We email you which firm took it, or tell you if none could. It&apos;s free for you; firms pay us.</li>
        </ol>
        {s?.ask ? (
          <Field label={s.ask} why="Firms need this to price the job; without it they'd have to ask you first." error={err.answer}>
            <textarea rows={2} className={field} value={v.answer} onChange={set("answer")} />
          </Field>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Your name" why="So the firm knows who to ask for." error={err.name}>
            <input className={field} autoComplete="name" value={v.name} onChange={set("name")} />
          </Field>
          <Field label="Your email" why="To confirm it's you, and to tell you which firm took it." error={err.email}>
            <input type="email" className={field} autoComplete="email" value={v.email} onChange={set("email")} />
          </Field>
          <Field label="Phone (optional)" why="Only if you'd like the firm to call." error={err.phone}>
            <input type="tel" className={field} autoComplete="tel" value={v.phone} onChange={set("phone")} />
          </Field>
        </div>
        <button disabled={pending || !v.name || !v.email} className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-60">{pending ? "Sending…" : "Send my request"}</button>
      </Step>
    </form>
  )
}

function Answer({ survey, deadline, firms, region }: { survey: NonNullable<ReturnType<typeof surveyBySlug>>; deadline: string; firms?: number; region?: string }) {
  const timing = useMemo(() => {
    const t = checkTimely(deadline || null, survey.window, new Date())
    // The window is for the fieldwork that decides the outcome (catalog), which may not be the first visit.
    return { ...t, note: t.note?.replace("fieldwork can't start", "the surveys that decide the outcome can't start").replace("Fieldwork can't start", "The surveys that decide the outcome can't start") }
  }, [deadline, survey.window])
  return (
    <div className="rounded-lg border border-line bg-leaf p-5 text-sm space-y-2">
      <p className="font-semibold text-base">{survey.name}</p>
      <p>{survey.what}</p>
      <p className="text-muted">{survey.when}</p>
      {survey.season ? <p><b>When it can be done:</b> {survey.season}</p> : null}
      {timing.note ? <p className={timing.pass ? "" : "text-amber font-medium"}>{timing.pass ? timing.note + "." : `${timing.note}. Tell the council now: they may accept a later report or a condition.`}</p> : null}
      {survey.typicalPrice ? <p><b>Typical price:</b> about £{survey.typicalPrice.pounds} + VAT for {survey.typicalPrice.covers}, from firms&apos; published prices. Follow-up surveys, if needed, cost more: ask for those prices up front.</p> : null}
      {firms !== undefined ? <p><b>Firms covering {region}:</b> {firms === 0 ? "none listed yet. You can still send it; we'll tell you if nobody can take it." : `${firms} listed.`}</p> : null}
    </div>
  )
}

function Step({ n, title, open, done, onEdit, summary, children }: { n: number; title: string; open: boolean; done: boolean; onEdit: () => void; summary: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-lg border ${open ? "border-moss bg-white" : "border-line"} p-5`}>
      <div className="flex items-baseline gap-3">
        <span className={`text-sm font-semibold ${open || done ? "text-moss" : "text-muted"}`}>{n}</span>
        <h2 className={`font-semibold ${open || done ? "" : "text-muted"}`}>{title}</h2>
        {done ? <button type="button" onClick={onEdit} className="ml-auto text-sm text-moss underline">Change</button> : null}
      </div>
      {open ? <div className="mt-4 space-y-4">{children}</div> : done && summary ? <p className="mt-1 text-sm text-muted">{summary}</p> : null}
    </section>
  )
}

function Received({ q, firmName }: { q: Qualification; firmName?: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-leaf p-6">
        <h2 className="font-semibold">Check your email</h2>
        <p className="mt-1 text-sm">We&apos;ve sent you a link. Your request goes {firmName ? `to ${firmName}` : "to firms"} only once you&apos;ve pressed it.</p>
      </div>
      {q.grade === "not-a-fit" ? <Note title="We may not be able to help">{q.checks.real.note}. Our firms take on surveys for planning applications.</Note> : null}
      {q.missing.length ? <Note title="One more thing firms will need">Please reply to the email with {q.missing.join(", and ")}.</Note> : null}
    </div>
  )
}

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-amber/40 bg-amber/5 p-5 text-sm">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{children}</p>
    </div>
  )
}

function Field({ label, why, error, children }: { label: string; why: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="block font-medium">{label}</span>
      <span className="block mb-1 text-muted">{why}</span>
      {children}
      {error ? <span className="block mt-1 text-red-700">{error}</span> : null}
    </label>
  )
}
