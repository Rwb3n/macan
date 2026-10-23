// Builds: U1, ST-U2.1, ST-U2.2
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { regionBySlug, surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { findFirms } from "@/directory"
import { routes } from "@/site"
import { FirmCard } from "@/components/firm-card"
import { SurveyFacts } from "@/components/survey-facts"

type Params = Promise<{ survey: string; region: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params
  const s = surveyBySlug(p.survey)
  const r = regionBySlug(p.region)
  return s && r ? { title: `${s.name} in ${r.name}` } : {}
}

export const dynamic = "force-dynamic"

export default async function SurveyRegionPage({ params }: { params: Params }) {
  const p = await params
  const survey = surveyBySlug(p.survey)
  const region = regionBySlug(p.region)
  if (!survey || !region) notFound()
  const results = findFirms(db(), { survey: survey.slug, region: region.slug })
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-muted"><Link href={routes.survey(survey.slug)} className="hover:underline">{survey.name}</Link> / {region.name}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{survey.name} in {region.name}</h1>
      <SurveyFacts survey={survey} />
      <div className="mt-10 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">{results.length} firms cover {region.name}</h2>
        <Link href={routes.quote({ survey: survey.slug, region: region.slug })} className="text-sm text-moss hover:underline">Get quotes →</Link>
      </div>
      <div className="mt-4 grid gap-4">
        {results.map((f) => <FirmCard key={f.id} firm={f} highlight={survey.slug} />)}
        {results.length === 0 ? <p className="text-muted">No firm listed for {region.name} yet. <Link href={routes.quote({ survey: survey.slug, region: region.slug })} className="text-moss underline">Send a request</Link> and we&apos;ll find one for you.</p> : null}
      </div>
    </div>
  )
}
