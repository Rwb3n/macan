// Builds: U1, ST-U2.2
// Every survey we cover, grouped, with what it is. Firm counts only where we list firms: "0 firms" reads as empty.
import type { Metadata } from "next"
import Link from "next/link"
import { OTHER_REPORTS, SURVEYS, SURVEY_GROUPS } from "@/catalog"
import { db } from "@/db"
import { surveyCounts } from "@/directory"
import { routes } from "@/site"

export const metadata: Metadata = { title: "Surveys we cover" }
export const dynamic = "force-dynamic"

export default function SurveysPage() {
  const counts = surveyCounts(db())
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Surveys we cover</h1>
      <p className="mt-2 text-muted max-w-2xl">Each page says what the survey is, when a council asks for it, and what time of year it can be done. If you&apos;re not sure which one you need, <Link href={routes.quote()} className="text-moss underline">we&apos;ll help you work it out</Link>.</p>
      <div className="mt-8 space-y-10">
        {SURVEY_GROUPS.map((group) => (
          <section key={group}>
            <h2 className="text-lg font-semibold">{group}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {SURVEYS.filter((s) => s.group === group).map((s) => {
                const n = counts.get(s.slug) ?? 0
                return (
                  <li key={s.slug}>
                    <Link href={routes.survey(s.slug)} className="block py-3 hover:text-moss">
                      <span className="font-medium">{s.name}</span>
                      {n > 0 ? <span className="ml-2 text-sm text-muted">{n} {n === 1 ? "firm" : "firms"} listed</span> : null}
                      <span className="block text-sm text-muted">{s.what}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
        <section>
          <h2 className="text-lg font-semibold">Also asked for sometimes</h2>
          <p className="mt-1 text-sm text-muted">A few councils ask for these. If yours has, <Link href={routes.quote()} className="text-moss underline">tell us what you need</Link> and we&apos;ll see who can help.</p>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {OTHER_REPORTS.map((r) => <li key={r.name} className="py-3"><span className="font-medium">{r.name}</span><span className="block text-sm text-muted">{r.what}</span></li>)}
          </ul>
        </section>
      </div>
    </div>
  )
}
