// Builds: PR1, PR2, O-lead, O-brief
import type { Metadata } from "next"
import { regionBySlug, surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { listLeads } from "@/leads"
import { PLANNING_STAGES, PROJECT_TYPES } from "@/qualify"
import { mailer } from "@/mailer"
import { briefsByLead, lapseBriefs, leadRouting } from "@/routing"
import { reviewAction, routeAction } from "../../actions"
import { baseUrl } from "../../base-url"
import { LEAD_CHECKS } from "@model/how"

export const metadata: Metadata = { title: "Leads", robots: { index: false } }
export const dynamic = "force-dynamic"

const GRADE_STYLE: Record<string, string> = {
  "qualified": "bg-leaf text-moss-dark",
  "awaiting-confirmation": "bg-white text-muted border border-line",
  "needs-info": "bg-amber/10 text-amber",
  "not-a-fit": "bg-red-50 text-red-700",
}
const label = (pairs: readonly (readonly [string, string])[], v: string) => pairs.find(([k]) => k === v)?.[1] ?? v

export default async function LeadsPage() {
  await lapseBriefs({ db: db(), mailer: mailer(), now: () => new Date(), baseUrl: await baseUrl() })
  const rows = listLeads(db())
  const briefs = briefsByLead(db())
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Leads ({rows.length})</h1>
      <div className="mt-6 space-y-4">
        {rows.map((l) => {
          const q = l.qualification
          return (
            <article key={l.id} className="rounded-lg border border-line bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs rounded-full px-2 py-1 ${GRADE_STYLE[l.grade] ?? ""}`}>{l.grade}</span>
                <span className="text-xs text-muted">review: {l.review}</span>
                {l.review === "approved" ? <span className="text-xs text-muted">· routing: {leadRouting(db(), l.id)}</span> : null}
                <span className="ml-auto text-xs text-muted">#{l.id} · {l.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
              </div>
              <h2 className="mt-2 font-semibold">{surveyBySlug(l.survey)?.name} · {l.postcode} · {l.council ? `${l.council}, ` : ""}{regionBySlug(l.region)?.name}</h2>
              <p className="text-sm text-muted">{label(PROJECT_TYPES, l.projectType)} · {label(PLANNING_STAGES, l.planningStage)}{l.councilRef ? ` · ref ${l.councilRef}` : ""}{l.deadline ? ` · by ${l.deadline}` : ""}</p>
              <p className="mt-2 text-sm whitespace-pre-line">{l.details}</p>
              {l.answer ? <p className="mt-1 text-sm text-muted whitespace-pre-line">{l.answer}</p> : null}
              <ul className="mt-3 grid gap-1 sm:grid-cols-4 text-xs">
                {LEAD_CHECKS.map((k) => (
                  <li key={k} className={q.checks[k].pass ? "text-moss" : "text-amber"} title={q.checks[k].note}>{q.checks[k].pass ? "✓" : "✗"} {k}{q.checks[k].note ? `: ${q.checks[k].note}` : ""}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">{l.name} · {l.email}{l.phone ? ` · ${l.phone}` : ""}</p>
              {briefs.get(l.id)?.length ? (
                <ul className="mt-3 text-xs text-muted space-y-0.5">
                  {briefs.get(l.id)!.map((b, i) => <li key={i}>{b.firm}: {b.state}{b.state === "offered" ? ` until ${b.expiresAt.toISOString().slice(0, 16).replace("T", " ")}` : ""}</li>)}
                </ul>
              ) : null}
              {l.review === "approved" && leadRouting(db(), l.id) === "unrouted" ? (
                <form action={routeAction} className="mt-3">
                  <input type="hidden" name="id" value={l.id} />
                  <button className="rounded-md bg-moss px-3 py-1.5 text-sm text-white">Send to firms</button>
                </form>
              ) : null}
              {l.review === "new" ? (
                <form action={reviewAction} className="mt-3 flex gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <button name="decision" value="approved" disabled={l.grade !== "qualified"} className="rounded-md bg-moss px-3 py-1.5 text-sm text-white disabled:opacity-40">Approve</button>
                  <button name="decision" value="rejected" className="rounded-md border border-line px-3 py-1.5 text-sm">Reject</button>
                </form>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
