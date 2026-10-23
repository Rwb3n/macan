import Link from "next/link"
import { regionBySlug, surveyBySlug, UK_WIDE } from "@/catalog"
import type { FirmCard as Firm } from "@/directory"
import { routes } from "@/site"

export function FirmCard({ firm, highlight }: { firm: Firm; highlight?: string }) {
  const surveys = firm.surveys.map((s) => surveyBySlug(s)).filter((s) => s !== undefined)
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg"><Link href={routes.firm(firm.slug)} className="hover:underline">{firm.name}</Link></h3>
          <p className="text-sm text-muted">{[firm.town, firm.county].filter(Boolean).join(", ")} · {coverage(firm.regions)}</p>
        </div>
        {firm.claimedAt ? <span className="text-xs rounded-full bg-leaf text-moss-dark px-2 py-1">Claimed</span> : null}
      </div>
      {firm.summary ? <p className="mt-3 text-sm">{firm.summary}</p> : null}
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {surveys.map((s) => (
          <li key={s.slug} className={`text-xs rounded px-2 py-1 border ${s.slug === highlight ? "bg-moss text-white border-moss" : "border-line text-muted"}`}>{s.name}</li>
        ))}
      </ul>
    </article>
  )
}

export function coverage(regions: string[]): string {
  if (regions.includes(UK_WIDE)) return "Works UK-wide"
  const names = regions.map((r) => regionBySlug(r)?.name).filter(Boolean)
  return names.length ? `Covers ${names.join(", ")}` : "Coverage not stated"
}
