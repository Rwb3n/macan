// Builds: U2, ST-U2.2
import type { Metadata } from "next"
import Link from "next/link"
import { regionBySlug, surveyBySlug } from "@/catalog"
import { db } from "@/db"
import { findFirms } from "@/directory"
import { routes } from "@/site"
import { FirmCard } from "@/components/firm-card"
import { SearchForm } from "@/components/search-form"

export const metadata: Metadata = { title: "Find a firm" }

type Params = Promise<{ survey?: string; region?: string }>

export default async function Search({ searchParams }: { searchParams: Params }) {
  const q = await searchParams
  const survey = q.survey && surveyBySlug(q.survey) ? q.survey : undefined
  const region = q.region && regionBySlug(q.region) ? q.region : undefined
  const results = findFirms(db(), { survey, region })
  const label = [survey && surveyBySlug(survey)?.name, region && `in ${regionBySlug(region)?.name}`].filter(Boolean).join(" ")
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SearchForm survey={survey} region={region} />
      <div className="mt-8 flex items-baseline justify-between">
        <h1 className="text-xl font-semibold">{results.length} {results.length === 1 ? "firm" : "firms"}{label ? ` · ${label}` : ""}</h1>
        <Link href={routes.quote({ survey, region })} className="text-sm text-moss hover:underline">Ask several firms for quotes →</Link>
      </div>
      <div className="mt-4 grid gap-4">
        {results.map((f) => <FirmCard key={f.id} firm={f} highlight={survey} />)}
        {results.length === 0 ? <p className="text-muted">No firm listed here yet. <Link href={routes.quote({ survey, region })} className="text-moss underline">Send a request</Link> and we&apos;ll find one for you.</p> : null}
      </div>
    </div>
  )
}
