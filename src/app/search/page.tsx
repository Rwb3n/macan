// Builds: U2, ST-U2.2, PR1
// Find firms by survey and the site's postcode; the postcode is turned into an area on our server (as in PR1).
import type { Metadata } from "next"
import Link from "next/link"
import { regionBySlug, surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { findFirms } from "@/directory"
import { lookupPostcode } from "@/postcode"
import { routes } from "@/site"
import { FirmCard } from "@/components/firm-card"
import { SearchForm } from "@/components/search-form"
import { GetQuotes } from "@/components/get-quotes"

export const metadata: Metadata = { title: "Find a firm" }
export const dynamic = "force-dynamic"

type Params = Promise<{ survey?: string; region?: string; postcode?: string }>

const inArea = (name: string) => `${/^(North|South|East|West)/.test(name) ? "the " : ""}${name}`

export default async function Search({ searchParams }: { searchParams: Params }) {
  const q = await searchParams
  const survey = q.survey && surveyBySlug(q.survey) ? q.survey : undefined
  const postcode = q.postcode?.trim().slice(0, 10) || undefined
  const place = postcode ? await lookupPostcode(postcode) : undefined
  const region = place?.region ?? (q.region && regionBySlug(q.region) ? q.region : undefined)
  const firms = findFirms(db(), { survey, region })
  const surveyName = survey ? surveyBySlug(survey)!.name : undefined
  const where = region ? inArea(regionBySlug(region)!.name) : undefined
  const heading = surveyName ? `${surveyName}: firms${where ? ` in ${where}` : ""}` : `Survey firms${where ? ` in ${where}` : ""}`
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">Find a survey firm</h1>
      <p className="mt-2 text-lg text-muted">Look up firms yourself, or let us send your job to up to three of them.</p>
      <div className="mt-6"><SearchForm survey={survey} postcode={postcode} /></div>
      {postcode && !place ? <p className="mt-4 font-medium text-amber">We couldn&apos;t find that postcode. Check it, or search without one.</p> : null}

      <h2 className="mt-10 text-2xl font-semibold">{heading}</h2>
      {place?.council ? <p className="mt-1 text-muted">The site is in {place.council}.</p> : null}
      {firms.length ? (
        <>
          <p className="mt-1 text-muted">{firms.length === 1 ? "1 firm" : `${firms.length} firms`}{where ? ", with firms based in the area first" : ""}.</p>
          <div className="mt-4 grid gap-4">{firms.map((f) => <FirmCard key={f.id} firm={f} highlight={survey} />)}</div>
        </>
      ) : (
        <p className="mt-3">We don&apos;t list a firm for this yet. <Link href={routes.quote({ survey, region })} className="text-moss underline">Tell us what you need</Link> and we&apos;ll let you know who can help.</p>
      )}
      <div className="mt-10"><GetQuotes survey={survey} region={region} title="Rather not ring round? We'll send your job to local firms" /></div>
    </div>
  )
}
