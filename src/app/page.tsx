// Builds: U1, U2, ST-U2.1, ST-U2.2, ST-U2.3
import Link from "next/link"
import { SURVEYS, SURVEY_GROUPS } from "@/catalog"
import { db } from "@/db"
import { surveyCounts } from "@/directory"
import { SITE, routes } from "@/site"
import { SearchForm } from "@/components/search-form"
import { Journey } from "@/components/journey"
import { buyerJourney } from "@/journey-stages"

export const dynamic = "force-dynamic"

export default function Home() {
  const counts = surveyCounts(db())
  return (
    <>
      <section className="bg-moss-dark text-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl">{SITE.tagline}</h1>
          <p className="mt-4 text-white/80 max-w-xl">Bat surveys, flood risk, noise, contaminated land and more. Find who covers your area, see what each survey involves, and ask for quotes in one go.</p>
          <div className="mt-8 rounded-lg bg-white p-4 text-ink">
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-12 grid gap-8 md:grid-cols-[1fr_24rem] md:items-start">
        <div>
          <h2 className="text-xl font-semibold">How it works</h2>
          <p className="mt-2 text-muted">Tell us what&apos;s going on first, and we&apos;ll tell you straight away which survey you need, when it can be done and roughly what it costs.</p>
          <p className="mt-2 text-muted">We only ask for your name and email address if you decide you&apos;d like quotes from firms. Even then, firms don&apos;t see who you are until one of them takes the job on.</p>
          <Link href={routes.quote()} className="mt-6 inline-block rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark">Start here</Link>
        </div>
        <Journey stages={buyerJourney()} />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-semibold">What survey do you need?</h2>
        <p className="mt-1 text-muted">Each page says what the survey is, when a council asks for it, and when in the year it can be done.</p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {SURVEY_GROUPS.map((group) => (
            <div key={group}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{group}</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {SURVEYS.filter((s) => s.group === group).map((s) => (
                  <li key={s.slug}>
                    <Link href={routes.survey(s.slug)} className="flex justify-between py-2 hover:text-moss">
                      <span>{s.name}</span>
                      <span className="text-sm text-muted">{counts.get(s.slug) ?? 0} firms</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4">
        <div className="rounded-lg border border-line bg-leaf p-6 sm:flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold">Run a survey firm?</h2>
            <p className="text-sm text-muted mt-1">Your listing is free. Claim it to choose the jobs and areas you want enquiries for.</p>
          </div>
          <Link href={routes.forFirms} className="mt-4 sm:mt-0 inline-block rounded-md bg-moss px-4 py-2 text-white hover:bg-moss-dark">For firms</Link>
        </div>
      </section>
    </>
  )
}
