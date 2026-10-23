import { REGIONS, SURVEYS } from "@/catalog"

const field = "w-full rounded-md border border-line bg-white px-3 py-2"

export function SearchForm({ survey, region }: { survey?: string; region?: string }) {
  return (
    <form action="/search" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
      <label className="text-sm">
        <span className="block mb-1 text-muted">Survey</span>
        <select name="survey" defaultValue={survey ?? ""} className={field}>
          <option value="">Any survey</option>
          {SURVEYS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </label>
      <label className="text-sm">
        <span className="block mb-1 text-muted">Where is the site?</span>
        <select name="region" defaultValue={region ?? ""} className={field}>
          <option value="">Anywhere in the UK</option>
          {REGIONS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
        </select>
      </label>
      <button className="rounded-md bg-moss px-5 py-2 text-white hover:bg-moss-dark">Find firms</button>
    </form>
  )
}
