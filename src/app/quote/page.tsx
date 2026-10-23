import type { Metadata } from "next"
import { db } from "@/db"
import { firmBySlug } from "@/directory"
import { QuoteForm } from "./quote-form"

export const metadata: Metadata = { title: "Get quotes" }
export const dynamic = "force-dynamic"

type Params = Promise<{ survey?: string; region?: string; firm?: string }>

export default async function QuotePage({ searchParams }: { searchParams: Params }) {
  const q = await searchParams
  const firm = q.firm ? firmBySlug(db(), q.firm) : undefined
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{firm ? `Ask ${firm.name} for a quote` : "Get quotes for your survey"}</h1>
      <p className="mt-2 text-muted">Tell us about the site once. {firm ? "We'll send it on." : "We'll send it to firms that cover your area and offer that survey."}</p>
      <div className="mt-8">
        <QuoteForm survey={q.survey ?? firm?.surveys[0]} region={q.region ?? firm?.baseRegion ?? undefined} firm={firm?.slug} firmName={firm?.name} />
      </div>
    </div>
  )
}
