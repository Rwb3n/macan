// Builds: PR3, O-claim
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getDomain } from "tldts"
import { db } from "@/db"
import { firmBySlug } from "@/directory"
import { websiteDomain } from "@/claim"
import { ClaimForm } from "./claim-form"

export const metadata: Metadata = { title: "Claim your listing" }
export const dynamic = "force-dynamic"

export default async function ClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const firm = firmBySlug(db(), (await params).slug)
  if (!firm) notFound()
  const host = firm.website ? websiteDomain(firm.website) : undefined
  const domain = host ? getDomain(host) ?? undefined : undefined
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Claim {firm.name}</h1>
      <p className="mt-2 text-muted">Free. Once it&apos;s yours you can correct the details, choose which surveys and areas you want enquiries for, and pause enquiries in your busy season.</p>
      <div className="mt-8"><ClaimForm firm={firm.slug} domain={domain} /></div>
    </div>
  )
}
