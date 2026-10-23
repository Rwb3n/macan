import type { Metadata } from "next"
import Link from "next/link"
import { routes } from "@/site"

export const metadata: Metadata = { title: "For firms" }

const points = [
  ["Enquiries that fit", "Say which surveys and which areas you want. Buyers describe the site, the council's request and their deadline before anything reaches you."],
  ["Your season, your call", "Pause enquiries when you're fully booked through bat season, and switch them back on when you have room."],
  ["Free to be listed", "Your listing is built from your own website and Companies House. Claim it to correct it, or ask us to take it down."],
] as const

export default function ForFirms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">For survey firms</h1>
      <p className="mt-2 text-muted">Homeowners and small developers need surveys for planning and don&apos;t know who to ask. We send them to firms that do the work, in the right area, with the details you&apos;d ask for on the phone.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {points.map(([title, body]) => (
          <div key={title} className="rounded-lg border border-line bg-white p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted">{body}</p>
          </div>
        ))}
      </div>
      <p className="mt-8">Find your firm with <Link href={routes.search()} className="text-moss underline">search</Link>, open its page and choose “Claim this listing”.</p>
    </div>
  )
}
