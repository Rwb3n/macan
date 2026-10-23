// Builds: PR1, O-lead
import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/db"
import { leadByToken } from "@/leads"
import { routes } from "@/site"
import { confirmAction } from "../../../actions"

export const metadata: Metadata = { title: "Confirm your request", robots: { index: false } }
export const dynamic = "force-dynamic"

// Opening the link does nothing by itself: mail scanners open links. The buyer presses the button.
export default async function ConfirmPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ done?: string }> }) {
  const token = (await params).token
  const lead = leadByToken(db(), token)
  const done = (await searchParams).done === "1"
  if (!lead) {
    return (
      <Shell title="That link doesn't work">
        It may have been copied wrongly. <Link href={routes.quote()} className="text-moss underline">Send a new request</Link>.
      </Shell>
    )
  }
  if (done || lead.confirmedAt) {
    const q = lead.qualification
    return (
      <Shell title="Confirmed, thank you">
        {q.grade === "qualified"
          ? "We'll check your request and pass it to firms that cover your area. They'll reply to you by email."
          : q.grade === "needs-info"
            ? `Firms will need ${q.missing.join(", and ")}. Reply to our email with it and we'll pass your request on.`
            : "We'll be in touch about whether we can help with this one."}
      </Shell>
    )
  }
  return (
    <Shell title="Confirm your request">
      <form action={confirmAction} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <button className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark">Yes, send my request to firms</button>
      </form>
    </Shell>
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
