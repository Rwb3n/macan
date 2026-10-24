// Builds: U2, ST-U2.3, PN3
// The same next step on every buyer page: one clear button, and the three things people worry about (D18, D19).
import Link from "next/link"
import { ROUTING } from "@model/how"
import { routes } from "@/site"

const WORDS = ["", "one", "two", "three", "four", "five"]

export function GetQuotes({ survey, region, firm, title }: { survey?: string; region?: string; firm?: string; title: string }) {
  const many = WORDS[ROUTING.firmsPerLead] ?? String(ROUTING.firmsPerLead)
  return (
    <div className="rounded-lg border border-line bg-leaf p-6">
      <p className="text-xl font-semibold">{title}</p>
      <ul className="mt-3 space-y-1">
        <li>✓ Free for you, with no obligation to book.</li>
        <li>✓ {firm ? "The firm sees" : `Up to ${many} local firms see`} the job, not your contact details, until {firm ? "it takes" : "one takes"} it on.</li>
        <li>✓ About two minutes. We tell you what you need before we ask anything about you.</li>
      </ul>
      <Link href={routes.quote({ survey, region, firm })} className="mt-5 inline-block rounded-md bg-moss px-6 py-3 text-lg text-white hover:bg-moss-dark">Get started</Link>
    </div>
  )
}
