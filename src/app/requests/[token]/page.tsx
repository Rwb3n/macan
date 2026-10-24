// Builds: PR2, ST-U2.3, O-lead, PN3
// The buyer's private status link (D22): where their request is, the firm once one takes it on, and a way to cancel.
import type { Metadata } from "next"
import Link from "next/link"
import { surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { leadByStatusToken, reference } from "@/leads"
import { requestStatus } from "@/routing"
import { routes } from "@/site"
import { cancelRequestAction } from "../../actions"

export const metadata: Metadata = { title: "Your request", robots: { index: false } }
export const dynamic = "force-dynamic"

export default async function RequestStatusPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ cancel?: string }> }) {
  const token = (await params).token
  const asking = (await searchParams).cancel === "1"
  const found = leadByStatusToken({ db: db(), now: () => new Date() }, token)
  if (!found) return <Shell title="We can't find that request">The link may have been copied wrongly. Check the email we sent you, or <Link href={routes.quote()} className="text-moss underline">start a new request</Link>.</Shell>
  if (found.expired) return <Shell title="This link has expired">Status links work for 90 days. If you still need a survey, <Link href={routes.quote()} className="text-moss underline">start a new request</Link>.</Shell>
  const { lead } = found
  const status = requestStatus(db(), lead)
  const survey = surveyBySlug(lead.survey)?.name ?? lead.survey
  const canCancel = status.state !== "cancelled" && status.state !== "taken" && status.state !== "no-firm" && status.state !== "rejected"
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-muted">Reference {reference(lead.id)}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your {survey.toLowerCase()} request</h1>
      <p className="mt-2 text-muted">For the site at {lead.postcode}{lead.council ? `, ${lead.council}` : ""}. Keep this page: you can come back to it at any time.</p>

      {status.state === "cancelled" ? (
        <p className="mt-6 rounded-lg border border-line bg-white p-4">You cancelled this request. No firm will be sent it{status.offeredTo ? ", and the firms who had it can no longer take it on" : ""}.</p>
      ) : null}

      {status.firm ? (
        <div className="mt-6 rounded-lg border border-moss bg-leaf p-5">
          <p className="text-lg font-semibold">{status.firm.name} has taken your job on</p>
          <p className="mt-1">They have your details and will contact you. If you&apos;d rather get in touch first:</p>
          <ul className="mt-3 space-y-1">
            {status.firm.phone ? <li>Phone: <a href={`tel:${status.firm.phone.replace(/\s/g, "")}`} className="text-moss underline">{status.firm.phone}</a></li> : null}
            {status.firm.email ? <li>Email: <a href={`mailto:${status.firm.email}`} className="text-moss underline">{status.firm.email}</a></li> : null}
            {status.firm.website ? <li>Website: <a href={status.firm.website} rel="nofollow noopener" target="_blank" className="text-moss underline">{status.firm.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></li> : null}
            <li><Link href={routes.firm(status.firm.slug)} className="text-moss underline">See their page</Link></li>
          </ul>
          <p className="mt-3 text-sm text-muted">Ask for the full price up front, including any further surveys the first visit might lead to.</p>
        </div>
      ) : null}

      <ol className="mt-8 space-y-4">
        {status.steps.map((s, i) => (
          <li key={s.label} className="flex gap-3">
            <span aria-hidden="true" className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${s.done ? "border-moss bg-moss text-white" : "border-ink/30 text-muted"}`}>{s.done ? "✓" : i + 1}</span>
            <div>
              <p className={s.done ? "font-medium" : "text-muted"}>{s.label}{s.done ? <span className="sr-only"> (done)</span> : null}</p>
              {s.detail ? <p className="text-sm text-muted">{s.detail}</p> : null}
            </div>
          </li>
        ))}
      </ol>

      {status.state === "no-firm" ? (
        <p className="mt-6">You can still <Link href={routes.search({ survey: lead.survey, region: lead.region })} className="text-moss underline">look up firms near you</Link> and contact them directly.</p>
      ) : null}

      {canCancel ? (
        asking ? (
          <form action={cancelRequestAction} className="mt-10 rounded-lg border border-amber/40 bg-amber/5 p-4">
            <input type="hidden" name="token" value={token} />
            <p className="font-medium">Cancel this request?</p>
            <p className="mt-1 text-sm">No more firms will see it, and any firm that hasn&apos;t taken it on yet won&apos;t be able to.</p>
            <div className="mt-3 flex gap-3">
              <button className="rounded-md bg-ink px-4 py-2 text-white">Yes, cancel it</button>
              <Link href={`/requests/${token}`} className="rounded-md border border-line bg-white px-4 py-2">No, keep it</Link>
            </div>
          </form>
        ) : (
          <p className="mt-10 text-sm"><Link href={`/requests/${token}?cancel=1`} className="text-muted underline">Cancel this request</Link></p>
        )
      ) : null}
    </div>
  )
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-3 text-muted">{children}</div>
    </div>
  )
}
