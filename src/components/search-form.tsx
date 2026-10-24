// Builds: U2, ST-U2.2
// Search the way people think: which survey, and where the site is (a postcode, not a region).
import { SURVEYS } from "@/catalog"

const field = "w-full rounded-md border-2 border-ink/30 bg-white px-3 py-2 text-lg"

export function SearchForm({ survey, postcode }: { survey?: string; postcode?: string }) {
  return (
    <form action="/search" className="grid gap-3 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
      <label className="block">
        <span className="mb-1 block font-medium">Which survey?</span>
        <select name="survey" defaultValue={survey ?? ""} className={field}>
          <option value="">Any survey</option>
          {SURVEYS.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block font-medium">Postcode of the site</span>
        <input name="postcode" defaultValue={postcode ?? ""} autoComplete="postal-code" className={field} />
      </label>
      <button className="rounded-md bg-moss px-6 py-2.5 text-lg text-white hover:bg-moss-dark">Find firms</button>
    </form>
  )
}
