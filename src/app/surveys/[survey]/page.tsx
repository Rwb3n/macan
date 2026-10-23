// Builds: U1, ST-U2.1
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { REGIONS, surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { findFirms } from "@/directory"
import { routes } from "@/site"
import { FirmCard } from "@/components/firm-card"
import { SurveyFacts } from "@/components/survey-facts"

type Params = Promise<{ survey: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = surveyBySlug((await params).survey)
  return s ? { title: `${s.name}: firms and what to expect`, description: s.what } : {}
}

export const dynamic = "force-dynamic"

export default async function SurveyPage({ params }: { params: Params }) {
  const survey = surveyBySlug((await params).survey)
  if (!survey) notFound()
  const results = findFirms(db(), { survey: survey.slug })
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-muted">{survey.group}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{survey.name}</h1>
      <SurveyFacts survey={survey} />
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">By region</h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <li key={r.slug}><Link href={routes.surveyRegion(survey.slug, r.slug)} className="block rounded border border-line bg-white px-3 py-1.5 text-sm hover:border-moss">{r.name}</Link></li>
        ))}
      </ul>
      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">{results.length} firms offer this</h2>
        <Link href={routes.quote({ survey: survey.slug })} className="text-sm text-moss hover:underline">Get quotes →</Link>
      </div>
      <div className="mt-4 grid gap-4">{results.map((f) => <FirmCard key={f.id} firm={f} highlight={survey.slug} />)}</div>
    </div>
  )
}
