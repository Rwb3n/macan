"use client"

// Builds: U2, ST-U2.1, ST-U2.2, ST-U2.3, PR1, O-lead, PN3
// Problem first, answer before asking, contact last and only by choice; every field says why (D14).
// Written for someone who has never dealt with planning: plain words, full sentences.

import Link from "next/link"
import { useActionState, useMemo, useState } from "react"
import { REGIONS, SURVEYS, regionBySlug, suggestSurvey, surveyBySlug } from "@/catalog"
import { PLANNING_STAGES, PROJECT_TYPES, isoDate, nextWindowStart, type Qualification } from "@/qualify"
import { ROUTING } from "@model/how"
import { leadAction, type LeadState } from "../actions"

const field = "w-full rounded-md border border-line bg-white px-3 py-2"
const BLANK = { survey: "", region: "", details: "", postcode: "", projectType: "", planningStage: "", deadline: "", councilRef: "", answer: "", name: "", email: "", phone: "" }
type Key = keyof typeof BLANK
const STEP_OF: Record<string, 1 | 2 | 3> = {
  details: 1, postcode: 1, survey: 2, region: 2, projectType: 2, planningStage: 2, deadline: 2, councilRef: 2, answer: 3, name: 3, email: 3, phone: 3,
}
const WORDS = ["", "one", "two", "three", "four", "five"]

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
  const guessed = Boolean(v.survey) && v.survey === suggestSurvey(v.details)
  const firms = v.survey && v.region ? coverage[v.survey]?.[v.region] ?? 0 : undefined
  const outward = v.postcode.trim().split(/\s+/)[0]?.toUpperCase()
  const many = WORDS[ROUTING.firmsPerLead] ?? String(ROUTING.firmsPerLead)

  return (
    <form action={action} className="space-y-6">
      {firm ? <input type="hidden" name="firm" value={firm} /> : null}
      {Object.entries(v).map(([k, val]) => <input key={k} type="hidden" name={k} value={val} />)}

      <Step n={1} title="What's going on?" open={shown === 1} done={shown > 1} onEdit={() => setStep(1)}
        summary={`${v.details.slice(0, 90)}${v.details.length > 90 ? "…" : ""} (${v.postcode})`}>
        <Field label="Tell us in your own words" error={err.details}
          why="For example, what you're building and what the council has said to you. This helps us work out which survey you need. Nobody else will see it at this stage.">
          <textarea rows={4} className={field} value={v.details} onChange={set("details")}
            placeholder="For example: We're converting the loft of our 1930s semi-detached house. The council said they need a bat survey before they'll accept our planning application." />
        </Field>
        <Field label="Postcode of the site" error={err.postcode}
          why="We use this to find survey firms that work near the site. Firms will only ever see the first part of it (for example, OX1) unless you choose to share your details with them.">
          <input className={`${field} sm:w-48`} autoComplete="postal-code" value={v.postcode} onChange={set("postcode")} />
        </Field>
        <button type="button" disabled={v.details.trim().length < 10 || v.postcode.trim().length < 2} onClick={goAnswer}
          className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-50">Show me what I need</button>
      </Step>

      <Step n={2} title="What you need, and when it can be done" open={shown === 2} done={shown > 2} onEdit={() => setStep(2)}
        summary={[s?.name, regionBySlug(v.region)?.name].filter(Boolean).join(", ")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="The survey" error={err.survey}
            why={guessed ? "We've made a guess from what you wrote. If the council asked for something different, choose it from the list." : "Choose the survey the council asked for. If you're not sure, pick the closest one."}>
            <select className={field} value={v.survey} onChange={set("survey")}>
              <option value="">Not sure? Choose the closest</option>
              {SURVEYS.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
            </select>
          </Field>
          <Field label="Which part of the UK is the site in?" why="Survey firms usually work in particular parts of the country." error={err.region}>
            <select className={field} value={v.region} onChange={set("region")}>
              <option value="">Choose an area</option>
              {REGIONS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
            </select>
          </Field>
        </div>

        {s ? <Answer survey={s} deadline={v.deadline} firms={firms} region={regionBySlug(v.region)?.name} /> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="What are you planning to build or change?" why="The kind of work affects what the survey involves." error={err.projectType}>
            <select className={field} value={v.projectType} onChange={set("projectType")}>
              <option value="">Choose one</option>
              {PROJECT_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </Field>
          <Field label="How far have you got with planning permission?" why="This tells us how soon you need the survey, and whether you need one at all." error={err.planningStage}>
            <select className={field} value={v.planningStage} onChange={set("planningStage")}>
              <option value="">Choose one</option>
              {PLANNING_STAGES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </Field>
          <Field label="When do you need the report by? (optional)" error={err.deadline}
            why="We'll check whether the survey can be done in time. Some surveys can only be done at certain times of year.">
            <input type="date" className={field} value={v.deadline} onChange={set("deadline")} />
          </Field>
          <Field label="Planning application number (optional)" why="If you have one, firms can look up what the council has said." error={err.councilRef}>
            <input className={field} value={v.councilRef} onChange={set("councilRef")} />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" disabled={!v.survey || !v.region || !v.projectType || !v.planningStage} onClick={() => setStep(3)}
            className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-50">{firmName ? `Yes, I'd like a quote from ${firmName}` : "Yes, I'd like quotes"}</button>
          {v.survey && v.region ? <Link href={`/search?survey=${v.survey}&region=${v.region}`} className="text-sm text-moss underline">No thanks, just show me the firms</Link> : null}
        </div>
      </Step>

      <Step n={3} title={firmName ? `Get a quote from ${firmName}` : `Get quotes from up to ${many} local firms`} open={shown === 3} done={false} onEdit={() => setStep(3)} summary="">
        <div className="rounded-lg border border-line bg-white p-4 text-sm">
          <p className="font-medium">What happens next</p>
          <ol className="mt-2 space-y-2 list-decimal pl-5">
            <li>We&apos;ll email you a link. Nothing is sent to any firm until you click it.</li>
            <li>We check your request, then show it to {firmName ?? `up to ${many} firms that work in your area`}. They see the job and the first part of your postcode{outward ? ` (${outward})` : ""}, but not your name, email address or phone number.</li>
            <li>If a firm wants the job, it pays us a small fee to see your contact details, and then gets in touch with you. Firms have {ROUTING.replyHours} hours to decide.</li>
            <li>We&apos;ll email you to say which firm has taken it on, or let you know if none could. You don&apos;t pay us anything.</li>
          </ol>
        </div>
        {s?.ask ? (
          <Field label={s.ask} why="Firms need this to give you a price. Without it, they would have to contact you to ask." error={err.answer}>
            <textarea rows={2} className={field} value={v.answer} onChange={set("answer")} />
          </Field>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Your name" why="So the firm knows who they're speaking to." error={err.name}>
            <input className={field} autoComplete="name" value={v.name} onChange={set("name")} />
          </Field>
          <Field label="Your email address" why="So you can confirm the request is yours, and so we can tell you which firm has taken it on." error={err.email}>
            <input type="email" className={field} autoComplete="email" value={v.email} onChange={set("email")} />
          </Field>
          <Field label="Phone number (optional)" why="Only if you're happy for the firm to ring you." error={err.phone}>
            <input type="tel" className={field} autoComplete="tel" value={v.phone} onChange={set("phone")} />
          </Field>
        </div>
        <button disabled={pending || !v.name || !v.email} className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark disabled:opacity-60">{pending ? "Sending…" : "Send my request"}</button>
      </Step>
    </form>
  )
}

// "in the South East", "in London".
const inArea = (name?: string) => (name ? `in ${/^(North|South|East|West)/.test(name) ? "the " : ""}${name}` : "near you")

function Answer({ survey, deadline, firms, region }: { survey: NonNullable<ReturnType<typeof surveyBySlug>>; deadline: string; firms?: number; region?: string }) {
  // The season covers the surveys that decide the outcome (catalog `window`), which may not be the first visit.
  const timing = useMemo(() => {
    if (!survey.window) return undefined
    const today = new Date()
    const start = nextWindowStart(survey.window, today)
    if (!start || isoDate(start) <= isoDate(today)) return undefined
    const when = start.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
    return { when, late: Boolean(deadline) && deadline < isoDate(start) }
  }, [deadline, survey.window])
  return (
    <div className="rounded-lg border border-line bg-leaf p-5 space-y-3">
      <p className="font-semibold text-lg">{survey.name}</p>
      <p>{survey.what}</p>
      <p className="text-muted">{survey.when}</p>
      {survey.season ? <p><b>When it can be done.</b> {survey.season}</p> : null}
      {timing ? (
        timing.late
          ? <p className="text-amber font-medium">Your deadline is before the survey season starts. The surveys that decide the outcome can&apos;t begin until {timing.when}. It&apos;s worth telling the council now, as they may accept the report later or make it a condition of the permission.</p>
          : <p>The surveys that decide the outcome can&apos;t begin until {timing.when}, so it&apos;s worth booking early.</p>
      ) : null}
      {survey.typicalPrice ? (
        <p><b>Typical cost.</b> Around £{survey.typicalPrice.pounds} plus VAT for {survey.typicalPrice.covers}, based on prices that firms publish. If further surveys turn out to be needed, they cost more, so ask for those prices at the start.</p>
      ) : null}
      {firms !== undefined ? (
        <p><b>Firms near you.</b> {firms === 0
          ? `We don't list any firms for this survey ${inArea(region)} yet. You can still send your request, and we'll let you know if no one can take it on.`
          : `We list ${firms} ${firms === 1 ? "firm that does" : "firms that do"} this survey ${inArea(region)}.`}</p>
      ) : null}
    </div>
  )
}

function Step({ n, title, open, done, onEdit, summary, children }: { n: number; title: string; open: boolean; done: boolean; onEdit: () => void; summary: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-lg border ${open ? "border-moss bg-white" : "border-line"} p-5`}>
      <div className="flex items-baseline gap-3">
        <span className={`text-sm font-semibold ${open || done ? "text-moss" : "text-muted"}`}>Step {n}</span>
        <h2 className={`font-semibold ${open || done ? "" : "text-muted"}`}>{title}</h2>
        {done ? <button type="button" onClick={onEdit} className="ml-auto text-sm text-moss underline">Change</button> : null}
      </div>
      {open ? <div className="mt-4 space-y-5">{children}</div> : done && summary ? <p className="mt-1 text-sm text-muted">{summary}</p> : null}
    </section>
  )
}

function Received({ q, firmName }: { q: Qualification; firmName?: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-leaf p-6">
        <h2 className="font-semibold">Please check your email</h2>
        <p className="mt-1">We&apos;ve sent you a link. Your request won&apos;t go to {firmName ?? "any firm"} until you click it.</p>
      </div>
      {q.grade === "not-a-fit" ? <Note title="We may not be able to help with this one">{q.checks.real.note}. The firms we list carry out surveys for planning applications.</Note> : null}
      {q.missing.length ? <Note title="Firms will need one more thing">Please reply to our email with {q.missing.join(", and ")}.</Note> : null}
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
    <label className="block">
      <span className="block font-medium">{label}</span>
      <span className="block mb-2 text-sm text-muted">{why}</span>
      {children}
      {error ? <span className="block mt-1 text-sm text-red-700">{error}</span> : null}
    </label>
  )
}
