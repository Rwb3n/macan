import type { Survey } from "@/catalog"

export function SurveyFacts({ survey }: { survey: Survey }) {
  return (
    <dl className="mt-6 grid gap-4 sm:grid-cols-3">
      <Fact label="What it is">{survey.what}</Fact>
      <Fact label="When a council asks for it">{survey.when}</Fact>
      <Fact label="Timing">{survey.season ?? "Can be done any time of year."}</Fact>
    </dl>
  )
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  )
}
