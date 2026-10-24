// Builds: U1, ST-U2.2
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { regionBySlug, surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { findFirms } from "@/directory"
import { routes } from "@/site"
import { FirmCard } from "@/components/firm-card"
import { SurveyFacts } from "@/components/survey-facts"
import { GetQuotes } from "@/components/get-quotes"

type Params = Promise<{ survey: string; region: string }>

const inArea = (name: string) => `${/^(North|South|East|West)/.test(name) ? "the " : ""}${name}`

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params
  const s = surveyBySlug(p.survey)
  const r = regionBySlug(p.region)
  return s && r ? { title: `${s.name} in ${inArea(r.name)}` } : {}
}

export const dynamic = "force-dynamic"

export default async function SurveyRegionPage({ params }: { params: Params }) {
  const p = await params
  const survey = surveyBySlug(p.survey)
  const region = regionBySlug(p.region)
  if (!survey || !region) notFound()
  const firms = findFirms(db(), { survey: survey.slug, region: region.slug })
  const where = inArea(region.name)
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-muted"><Link href={routes.survey(survey.slug)} className="underline">{survey.name}</Link></p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{survey.name} in {where}</h1>
      <p className="mt-3 max-w-2xl text-lg">{survey.what}</p>
      <div className="mt-8"><GetQuotes survey={survey.slug} region={region.slug} title={`Get quotes from firms in ${where}`} /></div>
      <h2 className="mt-12 text-2xl font-semibold">{firms.length ? `Firms that work in ${where}` : `Firms in ${where}`}</h2>
      {firms.length
        ? <div className="mt-4 grid gap-4">{firms.map((f) => <FirmCard key={f.id} firm={f} highlight={survey.slug} />)}</div>
        : <p className="mt-3">We don&apos;t list a firm for this survey in {where} yet. <Link href={routes.quote({ survey: survey.slug, region: region.slug })} className="text-moss underline">Tell us what you need</Link> and we&apos;ll let you know who can help.</p>}
      <h2 className="mt-12 text-2xl font-semibold">About this survey</h2>
      <SurveyFacts survey={survey} withWhat={false} />
    </div>
  )
}
