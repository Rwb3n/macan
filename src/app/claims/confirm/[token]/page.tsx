// Builds: PR3, O-claim
import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/db"
import { claimByToken } from "@/requests"
import { confirmClaimAction } from "../../../actions"

export const metadata: Metadata = { title: "Confirm your listing", robots: { index: false } }
export const dynamic = "force-dynamic"

// Opening the link does nothing by itself: mail scanners open links. The firm presses the button.
export default async function ConfirmClaimPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ done?: string }> }) {
  const token = (await params).token
  const claim = claimByToken(db(), token)
  const done = (await searchParams).done === "1"
  if (!claim) return <Shell title="That link doesn't work">It may have been copied wrongly. Claim the listing again from your firm&apos;s page.</Shell>
  if (done || claim.confirmedAt) {
    return (
      <Shell title="Confirmed, thank you">
        You now manage <Link href={`/firms/${claim.firm.slug}`} className="text-moss underline">{claim.firm.name}</Link>&apos;s listing.
      </Shell>
    )
  }
  return (
    <Shell title={`Confirm you manage ${claim.firm.name}'s listing`}>
      <form action={confirmClaimAction} className="mt-6">
        <input type="hidden" name="token" value={token} />
        <button className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark">Yes, it&apos;s our listing</button>
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
