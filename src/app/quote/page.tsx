// Builds: U2, PR1, ST-U2.1, ST-U2.2, ST-U2.3
import type { Metadata } from "next"
import { db } from "@/db"
import { coverageCounts, firmBySlug } from "@/directory"
import { QuoteForm } from "./quote-form"

export const metadata: Metadata = { title: "Get quotes" }
export const dynamic = "force-dynamic"

type Params = Promise<{ survey?: string; region?: string; firm?: string; q?: string }>

export default async function QuotePage({ searchParams }: { searchParams: Params }) {
  const q = await searchParams
  const firm = q.firm ? firmBySlug(db(), q.firm) : undefined
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <QuoteForm survey={q.survey ?? firm?.surveys[0]} region={q.region ?? firm?.baseRegion ?? undefined} firm={firm?.slug} firmName={firm?.name}
        q={q.q?.slice(0, 500)} coverage={coverageCounts(db())} />
    </div>
  )
}
