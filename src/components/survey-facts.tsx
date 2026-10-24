// Builds: U1, ST-U2.2, PN1, PN2
// What a buyer wants to know about a survey, in their order (R7): what it is, when it's asked for, when it can be done, what it costs.
import type { Survey } from "@/catalog"

// withWhat: false where the page already says what the survey is under its heading.
export function SurveyFacts({ survey, withWhat = true }: { survey: Survey; withWhat?: boolean }) {
  return (
    <dl className="mt-8 grid gap-6 sm:grid-cols-2">
      {withWhat ? <Fact label="What it is">{survey.what}</Fact> : null}
      <Fact label="When the council asks for it">{survey.when}</Fact>
      <Fact label="When it can be done">{survey.season ?? "Any time of year."}</Fact>
      <Fact label="What it costs">
        {survey.typicalPrice
          ? `Around £${survey.typicalPrice.pounds} plus VAT for ${survey.typicalPrice.covers}, based on prices firms publish.`
          : "Prices depend on the site and the work. Firms will give you a quote."}
        {" "}If it leads to further surveys, those cost more, so ask for those prices before you book.
      </Fact>
    </dl>
  )
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}
