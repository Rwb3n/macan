// Builds: U1, U2, ST-U2.1, ST-U2.2, PN1, PN2, PN3, PN4
// Opens the way people already know quote sites (trust promise, one plain question), then meets the buyer at the council's
// letter (is it normal, what it costs, how long), then how it works, then why to trust us: the order buyers ask in (D18, D21, R7).
import Link from "next/link"
import { surveyBySlug } from "@/catalog"
import { ROUTING } from "@model/how"
import { routes } from "@/site"

// The surveys behind most of the buyer pain we found (R2), shown with what they cost and when they can be done.
const COMMON = ["bat-survey", "preliminary-ecological-appraisal", "flood-risk-assessment"] as const
const WORDS = ["", "one", "two", "three", "four", "five"]

export default function Home() {
  const many = WORDS[ROUTING.firmsPerLead] ?? String(ROUTING.firmsPerLead)
  return (
    <>
      <section className="bg-moss-dark text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl">Find a trusted surveyor for your planning application</h1>
          <p className="mt-4 text-lg text-white/85 max-w-2xl">Bat surveys, ecology, flood risk, trees and more. Tell us what you need and up to {many} local firms can quote. It&apos;s free.</p>
          <form action={routes.quote()} className="mt-8 max-w-2xl rounded-lg bg-white p-3 text-ink sm:flex sm:gap-3">
            <label className="block flex-1">
              <span className="sr-only">What do you need?</span>
              <input name="q" className="w-full rounded-md border border-line px-4 py-3 text-lg" placeholder="What do you need? For example, a bat survey" />
            </label>
            <button className="mt-3 w-full sm:mt-0 sm:w-auto rounded-md bg-moss px-6 py-3 text-lg text-white hover:bg-moss-dark">Get started</button>
          </form>
          <p className="mt-3 text-white/80">Not sure what you need? <Link href={routes.quote()} className="underline text-white">We&apos;ll help you work it out</Link>.</p>
        </div>
      </section>

      <section className="bg-leaf">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-2xl font-semibold">Has the council asked you for a survey?</h2>
          {/* ~76,000 English applications a year file one of these surveys (R3). */}
          <p className="mt-3 max-w-3xl">You&apos;re not alone: around 76,000 planning applications in England each year include one of these surveys. Councils ask for them when building work might affect wildlife, flooding or trees, and they usually won&apos;t decide on your application until they have the report. So the sooner it&apos;s booked, the better.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {COMMON.map((slug) => {
              const s = surveyBySlug(slug)!
              return (
                <Link key={slug} href={routes.survey(slug)} className="block rounded-lg border border-line bg-white p-5 hover:border-moss">
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="mt-2 text-sm">{s.when}</p>
                  {s.typicalPrice ? <p className="mt-3 text-sm"><b>Typical cost:</b> around £{s.typicalPrice.pounds} plus VAT for {s.typicalPrice.covers}.</p> : null}
                  <p className="mt-2 text-sm"><b>When:</b> {s.season ?? "Any time of year."}</p>
                </Link>
              )
            })}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 max-w-4xl">
            <Tip title="Ask for the full price up front">A first visit can lead to further surveys, which cost more. Ask each firm what those would cost before you book, so there are no surprises.</Tip>
            <Tip title="Watch the season">Some surveys can only be done at certain times of year. Bat surveys that decide the outcome run from May to September, and firms get booked up, so book early.</Tip>
          </div>
          <p className="mt-8"><Link href={routes.surveys} className="text-moss underline">See every survey we cover</Link></p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          <Step n={1} title="Tell us what you need">A few quick questions about the site and what the council has asked for. Takes about two minutes.</Step>
          <Step n={2} title="Local firms see your job">Up to {many} firms that work near you see the job. They have {ROUTING.replyHours} hours to say whether they can do it.</Step>
          <Step n={3} title="You choose">A firm that wants the job gets in touch with a quote. You decide who, if anyone, to book.</Step>
        </ol>
        <Link href={routes.quote()} className="mt-8 inline-block rounded-md bg-moss px-6 py-3 text-white hover:bg-moss-dark">Get started</Link>
      </section>

      <section className="border-y border-line bg-white">
        <ul className="mx-auto max-w-5xl px-4 py-8 grid gap-6 sm:grid-cols-3">
          <Proof title="Free for you">Firms pay us a small fee, and only when they take your job on.</Proof>
          <Proof title="Your details stay private">Firms see the job and the area, not your name or contact details, until one takes it on.</Proof>
          <Proof title="Checked firms">Every firm we send your job to is a registered company that does the survey and has confirmed its details with us.</Proof>
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-lg border border-line bg-white p-6 sm:flex items-center justify-between gap-6">
          <div>
            <h2 className="font-semibold">Run a survey firm?</h2>
            <p className="text-sm text-muted mt-1">Your listing is free. Claim it to choose the jobs and areas you want to hear about.</p>
          </div>
          <Link href={routes.forFirms} className="mt-4 sm:mt-0 inline-block rounded-md border border-moss px-4 py-2 text-moss hover:bg-leaf">For firms</Link>
        </div>
      </section>
    </>
  )
}

function Proof({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </li>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-lg border border-line bg-white p-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-white font-semibold">{n}</span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </li>
  )
}

function Tip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{children}</p>
    </div>
  )
}
