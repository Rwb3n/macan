// Builds: U1, ST-U2.2
// One survey, the way a buyer reads it: what it is and the next step first, then the facts, then who can do it.
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { REGIONS, surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { findFirms } from "@/directory"
import { routes } from "@/site"
import { FirmCard } from "@/components/firm-card"
import { SurveyFacts } from "@/components/survey-facts"
import { GetQuotes } from "@/components/get-quotes"
import { SearchForm } from "@/components/search-form"

type Params = Promise<{ survey: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = surveyBySlug((await params).survey)
  return s ? { title: `${s.name}: what it is, what it costs, who can do it`, description: s.what } : {}
}

export const dynamic = "force-dynamic"

export default async function SurveyPage({ params }: { params: Params }) {
  const survey = surveyBySlug((await params).survey)
  if (!survey) notFound()
  const firms = findFirms(db(), { survey: survey.slug })
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-muted"><Link href={routes.surveys} className="underline">All surveys</Link></p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{survey.name}</h1>
      <p className="mt-3 max-w-2xl text-lg">{survey.what}</p>
      <div className="mt-8"><GetQuotes survey={survey.slug} title={`Get quotes for this survey`} /></div>
      <SurveyFacts survey={survey} withWhat={false} />

      <h2 className="mt-12 text-2xl font-semibold">Find firms near the site</h2>
      <div className="mt-4"><SearchForm survey={survey.slug} /></div>
      {firms.length ? (
        <>
          <p className="mt-6 text-muted">{firms.length === 1 ? "One firm we list does" : `${firms.length} firms we list do`} this survey. Enter a postcode above to see who works near you.</p>
          <div className="mt-4 grid gap-4">{firms.slice(0, 5).map((f) => <FirmCard key={f.id} firm={f} highlight={survey.slug} />)}</div>
        </>
      ) : (
        <p className="mt-6">We don&apos;t list a firm for this survey yet. <Link href={routes.quote({ survey: survey.slug })} className="text-moss underline">Tell us what you need</Link> and we&apos;ll let you know who can help.</p>
      )}

      <details className="mt-12 text-sm">
        <summary className="cursor-pointer text-muted">{survey.name} by area</summary>
        <ul className="mt-3 flex flex-wrap gap-2">
          {REGIONS.map((r) => <li key={r.slug}><Link href={routes.surveyRegion(survey.slug, r.slug)} className="block rounded border border-line bg-white px-3 py-1.5 hover:border-moss">{r.name}</Link></li>)}
        </ul>
      </details>
    </div>
  )
}
