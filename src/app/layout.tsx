// Builds: infra
import type { Metadata } from "next"
import Link from "next/link"
import { SITE, routes } from "@/site"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: `${SITE.name} — planning surveys, UK`, template: `%s · ${SITE.name}` },
  description: SITE.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b border-line bg-white">
          <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <Link href={routes.home} className="font-semibold tracking-tight text-moss-dark">{SITE.name}</Link>
            <nav className="flex gap-5 text-sm">
              <Link href={routes.search()} className="hover:underline">Find a firm</Link>
              <Link href={routes.quote()} className="hover:underline">Get quotes</Link>
              <Link href={routes.forFirms} className="hover:underline">For firms</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-16">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted space-y-2">
            <p>Firm details come from each firm&apos;s own website and Companies House. Listing is free.</p>
            <p>Is this your firm? Open its page and claim it to correct anything, or ask us to remove it.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
