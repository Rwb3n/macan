"use client"

// Builds: U2, ST-U2.1, ST-U2.2, ST-U2.3, PR1, O-lead, PN1, PN2, PN3, PN4
// One thing per screen, a back link on each, one short reason per question, "not sure" where it's a fair answer,
// the answer before anything personal, contact last and only by choice, then check your answers (D14, D17, D18; R7).
// A progress bar, and from the start a checklist of everything we'll ask, ticked off as the buyer goes (D20).
// The buyer's words become pills they can remove or change; then only this survey's missing questions are asked,
// one per screen, each with "not sure" (D23, D27, R12). The check page shows the excerpt firms will read.

import Link from "next/link"
import { useActionState, useEffect, useMemo, useState } from "react"
import { SURVEYS, SURVEY_GROUPS, REGIONS, regionBySlug, suggestSurvey, surveyBySlug } from "@/catalog"
import { PLANNING_STAGES, PROJECT_TYPES, isoDate, nextWindowStart, type Qualification } from "@/qualify"
import { ROUTING } from "@model/how"
import { FIRM_STAGE, NOT_SURE, answerLabel, fieldById, fieldsFor, trimExcerpt, type Facts } from "@/jobsheet"
import { factsAction, leadAction, postcodeAction, type LeadState } from "../actions"

const BLANK = { pool: "3", survey: "", region: "", council: "", details: "", postcode: "", projectType: "", planningStage: "", deadline: "", councilRef: "", name: "", email: "", phone: "" }
type Values = typeof BLANK
// q:<field> asks one job-sheet question (jobsheet.ts).
type Screen = "problem" | "postcode" | "area" | "project" | "stage" | "deadline" | "answer" | "pills" | `q:${string}` | "details" | "pool" | "check"
const SCREEN_OF: Record<string, Screen> = {
  details: "problem", postcode: "postcode", region: "area", projectType: "project", planningStage: "stage", deadline: "deadline",
  councilRef: "deadline", survey: "answer", name: "details", email: "details", phone: "details", pool: "pool",
}
const WORDS = ["", "one", "two", "three", "four", "five"]
const PHASES = ["The job", "About the work", "What you need", "About the site", "Your details"] as const
const PHASE_OF: Record<string, number> = { problem: 0, postcode: 0, area: 0, project: 1, stage: 1, deadline: 1, answer: 2, pills: 3, details: 4, pool: 4, check: 4 }
const phaseOf = (s: Screen) => PHASE_OF[s] ?? 3
// How many firms see the job: three unless the buyer chooses more (D24).
const POOLS = [["3", "Up to 3 firms (recommended)"], ["5", "Up to 5 firms"], ["10", "Up to 10 firms"], ["all", "Every firm we list that covers the area"]] as const
const poolWords = (p: string) => (p === "all" ? "every firm we list that covers your area" : `up to ${WORDS[Number(p)] ?? p} firms`)
const input = "w-full rounded-md border-2 border-ink/30 bg-white px-3 py-2 text-lg focus:border-moss focus:outline-none"
const label = (pairs: readonly (readonly [string, string])[], v: string) => pairs.find(([k]) => k === v)?.[1] ?? v

type Props = { survey?: string; region?: string; firm?: string; firmName?: string; q?: string; coverage: Record<string, Record<string, number>> }

export function QuoteForm({ survey, region, firm, firmName, q, coverage }: Props) {
  const [state, action, pending] = useActionState<LeadState, FormData>(leadAction, null)
  const [v, setV] = useState<Values>({ ...BLANK, survey: survey ?? "", region: region ?? "", details: q ?? "" })
  const [trail, setTrail] = useState<Screen[]>(["problem"])
  const [checking, setChecking] = useState(false) // came from "check your answers": Continue returns there
  const [looking, setLooking] = useState(false)
  const [hasDeadline, setHasDeadline] = useState<"" | "yes" | "no">("")
  // Job-sheet answers. Those with a quote were read from the buyer's words; the rest the buyer gave.
  const [facts, setFacts] = useState<Facts>({})
  const [readFor, setReadFor] = useState<string | null>(null) // the words last sent to be read
  const [reading, setReading] = useState(false)
  const screen = trail.at(-1)!
  const set = (k: keyof Values, val: string) => setV((x) => ({ ...x, [k]: val }))
  const go = (next: Screen) => { setTrail((t) => [...t, checking && next !== "check" ? "check" : next]); setChecking(false) }
  const back = () => setTrail((t) => (t.length > 1 ? t.slice(0, -1) : t))
  const change = (to: Screen) => { setChecking(true); setTrail((t) => [...t, to]) }
  const s = surveyBySlug(v.survey)
  const many = WORDS[ROUTING.firmsPerLead] ?? String(ROUTING.firmsPerLead)
  const err = state && !state.ok ? state.errors : {}

  // The server found a problem: take the buyer to the screen that asks for it.
  useEffect(() => {
    const first = Object.keys(err).map((k) => SCREEN_OF[k]).find(Boolean)
    if (first) { setChecking(true); setTrail((t) => [...t, first]) }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { window.scrollTo({ top: 0 }) }, [screen])

  // Read the buyer's words a moment after they stop typing (D23). New words replace the old pills, never the buyer's own answers.
  const readWords = (text: string) => {
    if (text === readFor || text.trim().length < 25) return
    setReadFor(text); setReading(true)
    factsAction(text).then((r) => r.facts).catch(() => ({}) as Facts).then((found) => {
      setFacts((f) => {
        const out: Facts = Object.fromEntries(Object.entries(f).filter(([, x]) => !x.quote))
        for (const [id, x] of Object.entries(found)) if (!out[id]) out[id] = x
        return out
      })
      setReading(false)
    })
  }
  useEffect(() => {
    if (screen !== "problem") return
    const t = setTimeout(() => readWords(v.details), 1200)
    return () => clearTimeout(t)
  }, [v.details, screen]) // eslint-disable-line react-hooks/exhaustive-deps

  if (state?.ok) return <Received q={state.qualification} firmName={firmName} reference={state.reference} />

  const afterPostcode = async () => {
    setLooking(true)
    const found = await postcodeAction(v.postcode).catch(() => null)
    setLooking(false)
    setV((x) => ({ ...x, region: found?.region ?? x.region, council: found?.council ?? "" }))
    go(found || v.region ? "project" : "area")
  }
  const toAnswer = () => {
    setV((x) => ({ ...x, survey: x.survey || suggestSurvey(x.details) || "" }))
    go("answer")
  }
  const deadlineChoice = hasDeadline || (v.deadline ? "yes" : "")

  const fields = fieldsFor(v.survey)
  // Until the buyer has seen the answer, the panel shows our guess at the survey from their words.
  const guess = v.survey ? undefined : surveyBySlug(suggestSurvey(v.details) ?? "")
  const setFact = (id: string, value: string) => setFacts((f) => ({ ...f, [id]: { value } }))
  const removeFact = (id: string) => setFacts(({ [id]: _, ...rest }) => rest)
  // The next question with no answer after `id` (or the first), else the contact details.
  const nextAfter = (id?: string): Screen => {
    const from = id ? fields.findIndex((f) => f.id === id) + 1 : 0
    const next = fields.slice(from).find((f) => !facts[f.id])
    return next ? `q:${next.id}` : "details"
  }
  const toSite = () => go(nextAfter())
  const sheet = JSON.stringify(Object.fromEntries(fields.filter((f) => facts[f.id]).map((f) => [f.id, facts[f.id]])))
  const asking = screen.startsWith("q:") ? fieldById(screen.slice(2)) : undefined
  const trimmed = trimExcerpt(v.details)

  const visited = new Set(trail)
  const phase = phaseOf(screen)
  const panel = (
    <RequestPanel v={v} survey={s ?? guess} guessed={!s && Boolean(guess)} facts={facts} reading={reading} trimmed={trimmed}
      deadlineAsked={visited.has("answer")} onSet={setFact} onRemove={removeFact} />
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
    <div className="lg:order-2 lg:sticky lg:top-6">
      <details open={screen === "problem" || undefined} className="rounded-lg border-2 border-moss/40 bg-white p-4 lg:hidden">
        <summary className="cursor-pointer font-semibold">What firms will get</summary>
        {panel}
      </details>
      <div className="hidden rounded-lg border-2 border-moss/40 bg-white p-5 lg:block">
        <p className="text-lg font-semibold">What firms will get</p>
        {panel}
      </div>
    </div>
    <form action={action} className="max-w-2xl lg:order-1">
      <Progress phase={phase} />
      {firm ? <input type="hidden" name="firm" value={firm} /> : null}
      {Object.entries(v).map(([k, val]) => <input key={k} type="hidden" name={k} value={val} />)}
      <input type="hidden" name="sheet" value={sheet} />
      {trail.length > 1 ? <button type="button" onClick={back} className="mb-6 text-moss underline">Back</button> : null}

      {screen === "problem" ? (
        <Question title={q ? "Tell us a bit more" : "What has the council asked for?"}
          hint="In your own words: what you're planning and what you've been told." error={err.details}>
          <textarea rows={5} className={input} value={v.details} onChange={(e) => set("details", e.target.value)}
            placeholder="For example: We're converting our loft. The council says they need a bat survey before they'll look at the application." />
          <p className="text-muted">Not sure what you need yet? Just describe the work you&apos;re planning.</p>
          <Continue disabled={v.details.trim().length < 10} onClick={() => { readWords(v.details); go("postcode") }} />
        </Question>
      ) : null}

      {screen === "postcode" ? (
        <Question title="What's the postcode of the site?" hint="We use it to find firms near you. Firms only see the first part, like OX1." error={err.postcode}>
          <input className={`${input} max-w-xs`} autoComplete="postal-code" value={v.postcode} onChange={(e) => set("postcode", e.target.value)} />
          <Continue disabled={v.postcode.trim().length < 2 || looking} onClick={afterPostcode} label={looking ? "Just a moment…" : undefined} />
        </Question>
      ) : null}

      {screen === "area" ? (
        <Question title="Which part of the UK is the site in?" hint="We couldn't work it out from the postcode." error={err.region}>
          <Radios name="area" value={v.region} onChange={(x) => setV((y) => ({ ...y, region: x, council: "" }))} options={REGIONS.map((r) => [r.slug, r.name] as const)} />
          <Continue disabled={!v.region} onClick={() => go("project")} />
        </Question>
      ) : null}

      {screen === "project" ? (
        <Question title="What are you planning?" hint="The kind of work changes what the survey involves." error={err.projectType}>
          <Radios name="project" value={v.projectType} onChange={(x) => set("projectType", x)} options={PROJECT_TYPES} />
          <Continue disabled={!v.projectType} onClick={() => go("stage")} />
        </Question>
      ) : null}

      {screen === "stage" ? (
        <Question title="How far have you got with planning permission?" hint="This tells us how soon you need the survey." error={err.planningStage}>
          <Radios name="stage" value={v.planningStage} onChange={(x) => set("planningStage", x)} options={PLANNING_STAGES} />
          <Continue disabled={!v.planningStage} onClick={() => go("deadline")} />
        </Question>
      ) : null}

      {screen === "deadline" ? (
        <Question title="Do you need the report by a certain date?" hint="Some surveys can only be done at certain times of year, so we'll check." error={err.deadline}>
          <Radios name="hasDeadline" value={deadlineChoice} onChange={(x) => { setHasDeadline(x as "yes" | "no"); if (x === "no") set("deadline", "") }}
            options={[["yes", "Yes"], ["no", "No, or I'm not sure"]] as const} />
          {deadlineChoice === "yes" ? (
            <label className="block">
              <span className="block text-lg font-medium">Date</span>
              <input type="date" className={`${input} max-w-xs`} value={v.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </label>
          ) : null}
          <Continue disabled={!(deadlineChoice === "no" || v.deadline)} onClick={toAnswer} />
        </Question>
      ) : null}

      {screen === "answer" ? (
        <Answer v={v} survey={s} guessed={Boolean(v.survey) && v.survey === suggestSurvey(v.details)}
          firms={v.survey && v.region ? coverage[v.survey]?.[v.region] ?? 0 : undefined}
          onSurvey={(x) => set("survey", x)} onArea={() => change("area")} err={err.survey}
          quotesLabel={firmName ? `Get a quote from ${firmName}` : `Get quotes from up to ${many} local firms`}
          onQuotes={toSite} />
      ) : null}

      {asking ? (
        <Question title={asking.ask} hint={asking.why}>
          {asking.options ? (
            <Radios name={asking.id} value={facts[asking.id]?.value ?? ""} onChange={(x) => setFact(asking.id, x)} options={[...asking.options, [NOT_SURE, "Not sure"]]} />
          ) : (
            <>
              <textarea rows={2} className={input} placeholder={asking.placeholder}
                value={facts[asking.id]?.value === NOT_SURE ? "" : facts[asking.id]?.value ?? ""} onChange={(e) => setFact(asking.id, e.target.value)} />
              <button type="button" onClick={() => { setFact(asking.id, NOT_SURE); go(nextAfter(asking.id)) }} className="block text-moss underline">I&apos;m not sure, skip this</button>
            </>
          )}
          <Continue disabled={!facts[asking.id]?.value.trim()} onClick={() => go(nextAfter(asking.id))} />
        </Question>
      ) : null}

      {screen === "details" ? (
        <Question title="Your details" hint="So the firm that takes your job on can contact you. Until then, no firm sees them.">
          <Field label="Your name" error={err.name}><input className={input} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Email address" hint="We'll send a link to confirm it's you." error={err.email}><input type="email" className={input} autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Phone number (optional)" hint="Only if you're happy for the firm to ring you." error={err.phone}><input type="tel" className={input} autoComplete="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Continue disabled={v.name.trim().length < 2 || !/.+@.+\..+/.test(v.email)} onClick={() => go("check")} />
        </Question>
      ) : null}

      {screen === "pool" ? (
        <Question title="How many firms should see your job?" hint="More firms can mean more quotes, but also more people getting in touch." error={err.pool}>
          <Radios name="pool" value={v.pool} onChange={(x) => set("pool", x)} options={POOLS} />
          <Continue onClick={() => go("check")} />
        </Question>
      ) : null}

      {screen === "check" ? (
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Check your answers before sending</h1>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            <Row k="What you told us" val={v.details} onChange={() => change("problem")} />
            <Row k="Postcode" val={`${v.postcode.toUpperCase()}${v.council ? ` (${v.council})` : ""}`} onChange={() => change("postcode")} />
            <Row k="Survey" val={s?.name ?? "Not chosen"} onChange={() => change("answer")} />
            <Row k="What you're planning" val={label(PROJECT_TYPES, v.projectType)} onChange={() => change("project")} />
            <Row k="Planning permission" val={label(PLANNING_STAGES, v.planningStage)} onChange={() => change("stage")} />
            <Row k="Needed by" val={v.deadline ? new Date(v.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "No date"} onChange={() => change("deadline")} />
            {fields.map((f) => <Row key={f.id} k={f.sheet} val={facts[f.id] ? answerLabel(f, facts[f.id]!.value) : "Not answered"} onChange={() => change(`q:${f.id}`)} />)}
            <Row k="Firms will read, in your words" onChange={() => change("problem")}
              val={trimmed.excerpt ? `“${trimmed.excerpt}”${trimmed.dropped ? `\n\nWe've left out ${trimmed.dropped === 1 ? "a sentence" : `${trimmed.dropped} sentences`} with prices, quotes or contact details.` : ""}` : "Nothing"} />
            <Row k="Your details" val={[v.name, v.email, v.phone].filter(Boolean).join("\n")} onChange={() => change("details")} />
            {firm ? null : <Row k="How many firms" val={POOLS.find(([k]) => k === v.pool)?.[1] ?? v.pool} onChange={() => change("pool")} />}
          </dl>
          <h2 className="mt-8 text-xl font-semibold">What happens next</h2>
          <ol className="mt-3 space-y-2 list-decimal pl-5 text-lg">
            <li>We email you a link. Nothing goes to any firm until you click it.</li>
            <li>{firmName ?? `${poolWords(v.pool).replace(/^u/, "U")} near you`} see the job and the first part of your postcode, not your details.</li>
            <li>A firm that wants the job gets your details and contacts you. Firms have {ROUTING.replyHours} hours, and we&apos;ll tell you if none can take it on.</li>
          </ol>
          <button disabled={pending} className="mt-8 rounded-md bg-moss px-6 py-3 text-lg text-white hover:bg-moss-dark disabled:opacity-60">{pending ? "Sending…" : "Send my request"}</button>
        </div>
      ) : null}
    </form>
    </div>
  )
}

function Progress({ phase }: { phase: number }) {
  return (
    <div className="mb-8" aria-label={`Step ${phase + 1} of ${PHASES.length}: ${PHASES[phase]}`}>
      <p className="text-sm font-medium text-muted">Step {phase + 1} of {PHASES.length}: <span className="text-ink">{PHASES[phase]}</span></p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {PHASES.map((p, i) => <span key={p} className={`h-2 flex-1 rounded-full ${i <= phase ? "bg-moss" : "bg-line"}`} />)}
      </div>
    </div>
  )
}

// The request firms will get, beside every step, filling in as the buyer types and answers (D23, D27). Rows read from the
// buyer's words can be changed or removed there and then; empty rows say we'll ask. It replaces the checklist (D20).
function RequestPanel({ v, survey, guessed, facts, reading, trimmed, deadlineAsked, onSet, onRemove }: {
  v: Values; survey?: NonNullable<ReturnType<typeof surveyBySlug>>; guessed: boolean; facts: Facts; reading: boolean
  trimmed: { excerpt: string; dropped: number }; deadlineAsked: boolean
  onSet: (id: string, value: string) => void; onRemove: (id: string) => void
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const ask = <span className="text-muted">We&apos;ll ask</span>
  const area = v.postcode.trim().toUpperCase().split(/\s+/)[0]
  const fields = survey ? fieldsFor(survey.slug) : []
  return (
    <div className="mt-2 text-sm">
      <p className="text-muted">Most survey firms&apos; websites just ask you to write a message. We gather what surveyors&apos; own guidelines say they need, so firms can price your job straight away.</p>

      <PanelGroup title="The job">
        <PanelRow k="Survey">{survey ? <>{survey.name}{guessed ? <span className="block text-xs text-muted">Our guess from what you wrote. You&apos;ll see it and can change it.</span> : null}</> : <span className="text-muted">We&apos;ll work it out with you</span>}</PanelRow>
        <PanelRow k="Where">{area ? <>Near {area}{v.council ? `, ${v.council}` : ""}<span className="block text-xs text-muted">Firms only see the first part of your postcode.</span></> : ask}</PanelRow>
        <PanelRow k="The work">{v.projectType ? label(PROJECT_TYPES, v.projectType) : ask}</PanelRow>
        <PanelRow k="Planning">{v.planningStage ? FIRM_STAGE[v.planningStage] ?? label(PLANNING_STAGES, v.planningStage) : ask}</PanelRow>
        <PanelRow k="Needed by">{v.deadline ? new Date(v.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : deadlineAsked ? "No date" : ask}</PanelRow>
      </PanelGroup>

      <PanelGroup title="About the site">
        {!survey ? <p className="py-1 text-muted">A few questions, picked for your survey.</p> : fields.map((f) => {
          const fact = facts[f.id]
          return (
            <PanelRow key={f.id} k={f.sheet}>
              {editing === f.id ? (
                f.options ? (
                  <select autoFocus className="w-full rounded border border-line bg-white px-1 py-1" value={fact?.value ?? ""}
                    onChange={(e) => { onSet(f.id, e.target.value); setEditing(null) }} onBlur={() => setEditing(null)}>
                    <option value="" disabled>Choose…</option>
                    {[...f.options, [NOT_SURE, "Not sure"] as const].map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                ) : (
                  <input autoFocus className="w-full rounded border border-line bg-white px-1 py-1" defaultValue={fact?.value === NOT_SURE ? "" : fact?.value ?? ""}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur() } }}
                    onBlur={(e) => { const x = e.currentTarget.value.trim(); if (x) onSet(f.id, x); setEditing(null) }} />
                )
              ) : fact ? (
                <span className={fact.quote ? "inline-block rounded-md border border-moss bg-leaf px-2 py-0.5" : ""}>
                  {answerLabel(f, fact.value)}
                  {fact.quote ? <>
                    <button type="button" onClick={() => setEditing(f.id)} className="ml-2 text-moss" aria-label={`Change ${f.sheet.toLowerCase()}`} title="Change">✎</button>
                    <button type="button" onClick={() => onRemove(f.id)} className="ml-1 text-moss" aria-label={`Remove ${f.sheet.toLowerCase()}`} title="Remove">×</button>
                  </> : null}
                </span>
              ) : reading ? <span className="text-muted">Reading what you wrote…</span> : ask}
            </PanelRow>
          )
        })}
        {fields.some((f) => facts[f.id]?.quote) ? <p className="mt-2 text-xs text-muted">Green ones we read from what you wrote. ✎ to change, × to remove and we&apos;ll ask instead.</p> : null}
      </PanelGroup>

      <PanelGroup title="In your words">
        <p className="py-1 italic">{trimmed.excerpt ? `“${trimmed.excerpt}”` : <span className="not-italic text-muted">What you write goes here.</span>}</p>
        {trimmed.dropped ? <p className="text-xs text-muted">We leave out prices, other firms&apos; quotes and contact details.</p> : null}
      </PanelGroup>

      <PanelGroup title="You">
        <p className="py-1 text-muted">Your name, email and phone. Only the firm you choose sees them, and we ask for them last.</p>
      </PanelGroup>
    </div>
  )
}

function PanelGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 border-t border-line pt-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <dl className="mt-1">{children}</dl>
    </section>
  )
}

function PanelRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-2 py-1">
      <dt className="font-medium">{k}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function Answer({ v, survey, guessed, firms, onSurvey, onArea, onQuotes, quotesLabel, err }: {
  v: Values; survey?: NonNullable<ReturnType<typeof surveyBySlug>>; guessed: boolean; firms?: number
  onSurvey: (s: string) => void; onArea: () => void; onQuotes: () => void; quotesLabel: string; err?: string
}) {
  const timing = useMemo(() => {
    if (!survey?.window) return undefined
    const today = new Date()
    const start = nextWindowStart(survey.window, today)
    if (!start || isoDate(start) <= isoDate(today)) return undefined
    const when = start.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
    return { when, late: Boolean(v.deadline) && v.deadline < isoDate(start) }
  }, [v.deadline, survey?.window])
  const place = regionBySlug(v.region)?.name
  if (!survey) {
    return (
      <Question title="Which survey has the council asked for?" hint="We couldn't tell from what you wrote. Choose the closest." error={err}>
        {SURVEY_GROUPS.map((g) => (
          <fieldset key={g}>
            <legend className="mb-2 font-semibold">{g}</legend>
            <Radios name={`survey-${g}`} value={v.survey} onChange={onSurvey} options={SURVEYS.filter((x) => x.group === g).map((x) => [x.slug, x.name] as const)} />
          </fieldset>
        ))}
      </Question>
    )
  }
  return (
    <div>
      <p className="font-medium text-moss">Here&apos;s what you need</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{survey.name}</h1>
      <p className="mt-2 text-muted">{guessed ? "Our best guess from what you wrote." : "The survey you chose."}{" "}
        <label>
          <span className="sr-only">Change the survey</span>
          <select className="rounded border border-line bg-white px-1" value={survey.slug} onChange={(e) => onSurvey(e.target.value)}>
            {SURVEYS.map((x) => <option key={x.slug} value={x.slug}>{x.slug === survey.slug ? "Not right? Change it" : x.name}</option>)}
          </select>
        </label>
      </p>
      <div className="mt-6 space-y-5 text-lg">
        <Fact title="What it is">{survey.what}</Fact>
        <Fact title="When it can be done">
          {survey.season ?? "Any time of year."}
          {timing ? (timing.late
            ? <span className="mt-2 block font-medium text-amber">Your date is before the season starts: the surveys that decide the outcome can&apos;t begin until {timing.when}. Tell the council now, as they may accept the report later.</span>
            : <span className="mt-2 block">The surveys that decide the outcome can&apos;t begin until {timing.when}, so it&apos;s worth booking early.</span>) : null}
        </Fact>
        <Fact title="What it costs">
          {survey.typicalPrice ? `Around £${survey.typicalPrice.pounds} plus VAT for ${survey.typicalPrice.covers}, from prices firms publish. ` : "Prices depend on the size of the site. "}
          If it leads to further surveys, those cost more, so ask for those prices before you book.
        </Fact>
        <Fact title="Firms near you">
          {place ? <>The site is {v.council ? `in ${v.council}, ` : ""}{inArea(place)}. <button type="button" onClick={onArea} className="text-base text-moss underline">Not right?</button> </> : null}
          {firms === undefined ? null : firms === 0
            ? "We don't list a firm for this survey near you yet. You can still ask, and we'll tell you if no one can take it on."
            : `We list ${firms} ${firms === 1 ? "firm that does" : "firms that do"} this survey near you.`}
        </Fact>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" onClick={onQuotes} className="rounded-md bg-moss px-6 py-3 text-lg text-white hover:bg-moss-dark">{quotesLabel}</button>
        {v.region ? <Link href={`/search?survey=${survey.slug}&region=${v.region}`} className="text-moss underline">Just show me the firms</Link> : null}
      </div>
      <p className="mt-3 text-muted">Getting quotes is free. We&apos;ll ask for your name and email on the next step.</p>
    </div>
  )
}

// "in the South East", "in London".
const inArea = (name: string) => `in ${/^(North|South|East|West)/.test(name) ? "the " : ""}${name}`

function Question({ title, hint, error, children }: { title: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {hint ? <p className="mt-2 text-lg text-muted">{hint}</p> : null}
      {error ? <p className="mt-3 font-medium text-red-700">{error}</p> : null}
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  )
}

function Continue({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="mt-2 rounded-md bg-moss px-6 py-3 text-lg text-white hover:bg-moss-dark disabled:opacity-50">{label ?? "Continue"}</button>
}

function Radios({ name, value, onChange, options }: { name: string; value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[] }) {
  return (
    <div className="space-y-2">
      {options.map(([k, l]) => (
        <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-md border-2 px-4 py-3 text-lg ${value === k ? "border-moss bg-leaf" : "border-line bg-white hover:border-ink/40"}`}>
          <input type="radio" name={name} value={k} checked={value === k} onChange={() => onChange(k)} className="h-5 w-5 accent-[var(--color-moss)]" />
          {l}
        </label>
      ))}
    </div>
  )
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-lg font-medium">{label}</span>
      {hint ? <span className="block text-muted">{hint}</span> : null}
      {error ? <span className="block font-medium text-red-700">{error}</span> : null}
      <span className="mt-1 block">{children}</span>
    </label>
  )
}

function Fact({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{children}</p>
    </div>
  )
}

function Row({ k, val, onChange }: { k: string; val: string; onChange: () => void }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr_auto] sm:gap-4">
      <dt className="font-semibold">{k}</dt>
      <dd className="whitespace-pre-line">{val}</dd>
      <dd><button type="button" onClick={onChange} className="text-moss underline">Change<span className="sr-only"> {k.toLowerCase()}</span></button></dd>
    </div>
  )
}

function Received({ q, firmName, reference }: { q: Qualification; firmName?: string; reference: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-muted">Reference {reference}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Nearly done: please check your email</h1>
      <p className="mt-3 text-lg">We&apos;ve sent you a link. Click it to confirm, and we&apos;ll send your request to {firmName ?? "local firms"}.</p>
      <p className="mt-2 text-muted">It can take a minute or two to arrive. Check your junk folder if you can&apos;t see it.</p>
      <h2 className="mt-8 text-xl font-semibold">What happens next</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>You click the link in our email to confirm.</li>
        <li>We check your request and send it on, and email you when we have.</li>
        <li>Firms have {ROUTING.replyHours} hours to say whether they can do it. We email you as soon as one takes it on, or if none can.</li>
      </ol>
      <p className="mt-4">The same email has a private link where you can see where your request is, or cancel it, at any time.</p>
      {q.grade === "not-a-fit" ? <p className="mt-6 rounded-lg border border-amber/40 bg-amber/5 p-4">{q.checks.real.note}. The firms we list do surveys for planning applications, so we may not be able to help with this one.</p> : null}
      {q.missing.length ? <p className="mt-6 rounded-lg border border-amber/40 bg-amber/5 p-4">Firms will also need {q.missing.join(", and ")}. Reply to our email with it.</p> : null}
    </div>
  )
}
