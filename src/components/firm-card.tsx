// Builds: U2, O-listing
import Link from "next/link"
import { regionBySlug, surveyBySlug, UK_WIDE } from "@/catalog"
import type { FirmCard as Firm } from "@/directory"
import { routes } from "@/site"

export function FirmCard({ firm, highlight }: { firm: Firm; highlight?: string }) {
  const surveys = firm.surveys.map((s) => surveyBySlug(s)).filter((s) => s !== undefined)
  const place = [firm.town, firm.county].filter(Boolean).join(", ")
  return (
    <article className="rounded-lg border border-line bg-white p-5 sm:flex sm:items-start sm:justify-between sm:gap-6">
      <div>
        <h3 className="text-lg font-semibold"><Link href={routes.firm(firm.slug)} className="hover:underline">{firm.name}</Link></h3>
        <p className="text-muted">{place ? `Based in ${place}. ` : ""}{coverage(firm.regions)}.</p>
        {firm.claimedAt ? <p className="mt-1 text-sm text-moss">✓ The firm has confirmed these details</p> : null}
        {firm.summary ? <p className="mt-3">{firm.summary}</p> : null}
        <p className="mt-3 text-sm text-muted">Surveys: {surveys.map((s, i) => (
          <span key={s.slug}>{i ? ", " : ""}<span className={s.slug === highlight ? "font-semibold text-ink" : ""}>{s.name}</span></span>
        ))}</p>
      </div>
      <Link href={routes.quote({ firm: firm.slug, survey: highlight })} className="mt-4 inline-block shrink-0 rounded-md border-2 border-moss px-4 py-2 text-moss hover:bg-leaf sm:mt-0">Ask for a quote</Link>
    </article>
  )
}

export function coverage(regions: string[]): string {
  if (regions.includes(UK_WIDE)) return "Works anywhere in the UK"
  const names = regions.map((r) => regionBySlug(r)?.name).filter((n): n is NonNullable<typeof n> => Boolean(n))
    .map((n) => (/^(North|South|East|West)/.test(n) ? `the ${n}` : n))
  return names.length ? `Works in ${names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]}` : "Areas not stated"
}
