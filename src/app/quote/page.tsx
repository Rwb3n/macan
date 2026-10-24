// Builds: U2, PR1, ST-U2.1, ST-U2.2, ST-U2.3
import type { Metadata } from "next"
import { db } from "@/db"
import { coverageCounts, firmBySlug } from "@/directory"
import { Journey } from "@/components/journey"
import { buyerJourney } from "@/journey-stages"
import { QuoteForm } from "./quote-form"

export const metadata: Metadata = { title: "Get quotes" }
export const dynamic = "force-dynamic"

type Params = Promise<{ survey?: string; region?: string; firm?: string }>

export default async function QuotePage({ searchParams }: { searchParams: Params }) {
  const q = await searchParams
  const firm = q.firm ? firmBySlug(db(), q.firm) : undefined
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div>
      <h1 className="text-3xl font-semibold tracking-tight">{firm ? `Ask ${firm.name} for a quote` : "Find out which survey you need, then get quotes"}</h1>
      <p className="mt-2 text-muted">Start by telling us what&apos;s going on. We&apos;ll tell you which survey you need and when it can be done before we ask anything about you.</p>
      <div className="mt-8">
        <QuoteForm survey={q.survey ?? firm?.surveys[0]} region={q.region ?? firm?.baseRegion ?? undefined} firm={firm?.slug} firmName={firm?.name} coverage={coverageCounts(db())} />
      </div>
      </div>
      <aside className="lg:sticky lg:top-6">
        <details open className="rounded-lg border border-line bg-white p-4">
          <summary className="cursor-pointer font-semibold">How this works</summary>
          <div className="mt-4"><Journey stages={buyerJourney()} /></div>
        </details>
      </aside>
    </div>
  )
}
