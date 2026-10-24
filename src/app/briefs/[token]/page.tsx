// Builds: PR2, O-brief, ST-U4.2, ST-U4.3, ST-U4.5, O-listing
import type { Metadata } from "next"
import { db } from "@/db"
import { mailer } from "@/mailer"
import { briefByToken, tick } from "@/routing"
import { briefAction, outcomeAction, pauseAction } from "../../actions"
import { baseUrl } from "../../base-url"

export const metadata: Metadata = { title: "Brief", robots: { index: false } }
export const dynamic = "force-dynamic"

const pounds = (p: number) => `£${(p / 100).toFixed(p % 100 ? 2 : 0)}`

// Opening the link changes nothing: mail scanners open links. The firm presses a button.
export default async function BriefPage({ params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token
  await tick({ db: db(), mailer: mailer(), now: () => new Date(), baseUrl: await baseUrl() })
  const b = briefByToken(db(), token)
  if (!b) return <Shell title="That link doesn't work">It may have been copied wrongly. Reply to the email that brought you here and we&apos;ll sort it out.</Shell>
  const by = b.expiresAt.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" })
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-sm text-muted">Brief for {b.firm.name}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{b.survey} near {b.area}</h1>
      <p className="mt-1 text-muted">{b.council ? `${b.council} council, ` : ""}{b.region} · {b.projectType} · {b.planningStage}{b.deadline ? ` · needed by ${b.deadline}` : ""}</p>

      <div className="mt-6 rounded-lg border border-line bg-white p-5">
        <p className="whitespace-pre-line">{b.details}</p>
        {b.answer ? <p className="mt-3 text-sm text-muted whitespace-pre-line">{b.answer}</p> : null}
        <p className="mt-4 text-xs text-muted">Checked before it reached you: the buyer confirmed by email, the job is real and serious, the deadline fits the survey season, and the details are complete.</p>
      </div>

      {b.state === "offered" ? (
        <div className="mt-6 rounded-lg border border-line bg-leaf p-5">
          <p className="font-medium">Unlock the buyer&apos;s name, email and phone for {pounds(b.feePence ?? 2600)}, or pass. Open until {by}.</p>
          <p className="mt-1 text-sm text-muted">Nothing is charged now; we&apos;ll be in touch about how to pay. If you pass, the buyer goes to another firm.</p>
          <form action={briefAction} className="mt-4 flex gap-2">
            <input type="hidden" name="token" value={token} />
            <button name="decision" value="unlock" className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark">Unlock contact</button>
            <button name="decision" value="decline" className="rounded-md border border-line bg-white px-5 py-2">Pass</button>
          </form>
        </div>
      ) : (b.state === "unlocked" || b.state === "quoted" || b.state === "won" || b.state === "lost") && b.contact ? (
        <div className="mt-6 rounded-lg border border-line bg-leaf p-5">
          <h2 className="font-semibold">The buyer</h2>
          <dl className="mt-2 text-sm space-y-1">
            <div>{b.contact.name}</div>
            <div><a href={`mailto:${b.contact.email}`} className="text-moss underline">{b.contact.email}</a></div>
            {b.contact.phone ? <div><a href={`tel:${b.contact.phone.replace(/\s/g, "")}`} className="text-moss underline">{b.contact.phone}</a></div> : null}
          </dl>
          <p className="mt-3 text-sm text-muted">We&apos;ve told them you&apos;ll be in touch. {b.feePence ? `Fee owed: ${pounds(b.feePence)}.` : ""}</p>
          <form action={outcomeAction} className="mt-5 border-t border-line pt-4">
            <input type="hidden" name="token" value={token} />
            {b.state === "unlocked" ? (
              <><p className="text-sm">Let us know how it goes. It helps us send you the right jobs.</p>
                <button name="outcome" value="quoted" className="mt-2 rounded-md border border-line bg-white px-4 py-2 text-sm">I&apos;ve sent them a quote</button></>
            ) : b.state === "quoted" ? (
              <><p className="text-sm">You&apos;ve sent a quote. Did you get the job?</p>
                <div className="mt-2 flex gap-2">
                  <button name="outcome" value="won" className="rounded-md bg-moss px-4 py-2 text-sm text-white">Yes, we got it</button>
                  <button name="outcome" value="lost" className="rounded-md border border-line bg-white px-4 py-2 text-sm">No, we didn&apos;t</button>
                </div></>
            ) : (
              <p className="text-sm">{b.state === "won" ? "You got the job. Thanks for letting us know." : "You didn't get this one. Thanks for letting us know."}</p>
            )}
          </form>
        </div>
      ) : (
        <p className="mt-6 text-muted">{b.state === "declined" ? "You passed on this brief." : b.state === "lapsed" ? "This brief closed before anyone answered it." : `This brief is ${b.state}.`}</p>
      )}

      <form action={pauseAction} className="mt-8 border-t border-line pt-4 text-sm">
        <input type="hidden" name="token" value={token} />
        {b.firm.paused ? (
          <p>New briefs are paused for {b.firm.name}. <button name="paused" value="0" className="text-moss underline">Resume briefs</button></p>
        ) : (
          <p className="text-muted">Booked up? <button name="paused" value="1" className="text-moss underline">Pause new briefs</button> until you have room.</p>
        )}
      </form>
    </div>
  )
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-3 text-muted">{children}</div>
    </div>
  )
}
