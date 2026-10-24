// Builds: infra
// Display name is a working title until the principal picks a brand.
export const SITE = {
  name: "Survey Finder",
  tagline: "Find the right firm for the survey your planning application needs.",
} as const

export const routes = {
  home: "/",
  search: (q: { survey?: string; region?: string } = {}) => {
    const p = new URLSearchParams(Object.entries(q).filter((e): e is [string, string] => Boolean(e[1])))
    return p.size ? `/search?${p}` : "/search"
  },
  surveys: "/surveys",
  survey: (survey: string) => `/surveys/${survey}`,
  surveyRegion: (survey: string, region: string) => `/surveys/${survey}/${region}`,
  firm: (slug: string) => `/firms/${slug}`,
  claim: (slug: string) => `/firms/${slug}/claim`,
  quote: (q: { survey?: string; region?: string; firm?: string; q?: string } = {}) => {
    const p = new URLSearchParams(Object.entries(q).filter((e): e is [string, string] => Boolean(e[1])))
    return p.size ? `/quote?${p}` : "/quote"
  },
  forFirms: "/for-firms",
} as const
