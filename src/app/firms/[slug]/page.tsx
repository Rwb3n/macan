// Builds: U2, U5, O-listing
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { firmBySlug } from "@/directory"
import { routes } from "@/site"
import { coverage } from "@/components/firm-card"

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const f = firmBySlug(db(), (await params).slug)
  return f ? { title: f.name, description: f.summary } : {}
}

export const dynamic = "force-dynamic"

export default async function FirmPage({ params }: { params: Params }) {
  const firm = firmBySlug(db(), (await params).slug)
  if (!firm) notFound()
  const surveys = firm.surveys.map((s) => surveyBySlug(s)).filter((s) => s !== undefined)
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid gap-8 md:grid-cols-[1fr_280px]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{firm.name}</h1>
        <p className="mt-1 text-muted">{[firm.town, firm.county].filter(Boolean).join(", ")} · {coverage(firm.regions)}</p>
        {firm.summary ? <p className="mt-4">{firm.summary}</p> : null}

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted">Surveys offered</h2>
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {surveys.map((s) => (
            <li key={s.slug} className="py-2 flex justify-between gap-4">
              <Link href={routes.survey(s.slug)} className="hover:text-moss">{s.name}</Link>
              {s.season ? <span className="text-xs text-muted text-right">{s.season}</span> : null}
            </li>
          ))}
        </ul>

        {firm.accreditations.length ? (
          <>
            <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted">Memberships and licences</h2>
            <ul className="mt-2 list-disc pl-5 text-sm">{firm.accreditations.map((a) => <li key={a}>{a}</li>)}</ul>
          </>
        ) : null}
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-white p-5 space-y-3">
          <Link href={routes.quote({ firm: firm.slug })} className="block text-center rounded-md bg-moss px-4 py-2 text-white hover:bg-moss-dark">Ask {firm.name} for a quote</Link>
          <dl className="text-sm space-y-2">
            {firm.website ? <Row label="Website"><a href={firm.website} rel="nofollow noopener" target="_blank" className="text-moss underline break-all">{firm.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></Row> : null}
            {firm.phone ? <Row label="Phone"><a href={`tel:${firm.phone.replace(/\s/g, "")}`} className="text-moss underline">{firm.phone}</a></Row> : null}
            {firm.email ? <Row label="Email"><a href={`mailto:${firm.email}`} className="text-moss underline break-all">{firm.email}</a></Row> : null}
            <Row label="Company">
              <a href={`https://find-and-update.company-information.service.gov.uk/company/${firm.companyNumber}`} rel="nofollow noopener" target="_blank" className="underline">{firm.companyNumber}</a>
            </Row>
          </dl>
        </div>
        <div className="rounded-lg border border-line bg-leaf p-5 text-sm">
          {firm.claimedAt ? <p>This listing is managed by {firm.name}.</p> : (
            <>
              <p className="font-semibold">Is this your firm?</p>
              <p className="mt-1 text-muted">Claim it free to correct details and choose the jobs and areas you want enquiries for.</p>
              <Link href={routes.claim(firm.slug)} className="mt-3 inline-block text-moss underline">Claim this listing</Link>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><dt className="text-muted">{label}</dt><dd>{children}</dd></div>
}
