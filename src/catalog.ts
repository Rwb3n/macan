// Builds: U1, ST-U2.1
// The fixed catalogue: survey types, regions and counties. No imports, safe everywhere.
// Survey list from S7's buyer terms (callsheet docs/screens/s7-env-buyer-demand) plus the species surveys a PEA leads to.

export type Survey = {
  slug: string
  name: string
  group: SurveyGroup
  what: string
  when: string
  season?: string
  // Months (1-12) in which the fieldwork that decides the outcome can be done. Absent: any time of year.
  window?: readonly number[]
  // What a firm needs to know to price it, beyond the site description.
  ask?: string
}

export const SURVEY_GROUPS = ["Ecology", "Water and flooding", "Noise and air", "Ground", "Trees", "Major projects"] as const
export type SurveyGroup = (typeof SURVEY_GROUPS)[number]

export const SURVEYS: readonly Survey[] = [
  {
    slug: "preliminary-ecological-appraisal", name: "Preliminary ecological appraisal", group: "Ecology",
    what: "A first ecology visit and desk study that says which habitats and protected species could be affected, and which further surveys you need.",
    when: "Usually the first ecology step for a planning application on land with any wildlife value.",
    season: "Possible all year; best April to September.",
    ask: "Roughly how big is the site, and what is on it now (buildings, grass, trees, ponds)?",
  },
  {
    slug: "bat-survey", name: "Bat survey", group: "Ecology",
    what: "Checks a building or tree for signs of roosting bats, then, if needed, watches at dusk or dawn to confirm.",
    when: "Often asked for when you alter a roof or loft, convert a barn or demolish an older building.",
    season: "The first inspection can happen all year. Follow-up dusk and dawn surveys only run from May to September.",
    window: [5, 6, 7, 8, 9], ask: "How old is the building, what is the roof made of, and will the work touch the roof, loft or walls?",
  },
  {
    slug: "great-crested-newt-survey", name: "Great crested newt survey", group: "Ecology",
    what: "Tests ponds near your site for great crested newts, often by water sample (eDNA).",
    when: "When there's a pond within about 500 metres and suitable land in between.",
    season: "eDNA samples: mid-April to the end of June.",
    window: [4, 5, 6], ask: "How many ponds are within about 500 metres, and are any on the site?",
  },
  {
    slug: "badger-survey", name: "Badger survey", group: "Ecology",
    what: "Looks for setts and badger activity on and around the site.",
    when: "When signs of badgers turn up, or the site has suitable banks, hedges or woodland.",
    season: "All year; easiest in spring and autumn.",
    ask: "Have you seen setts or signs of badgers?",
  },
  {
    slug: "reptile-survey", name: "Reptile survey", group: "Ecology",
    what: "Repeat visits checking refuges for slow-worms, lizards and snakes.",
    when: "On rough grassland, scrub and brownfield sites.",
    season: "Roughly March to October, in suitable weather.",
    window: [3, 4, 5, 6, 7, 8, 9, 10], ask: "Roughly how big is the area of rough grass or scrub?",
  },
  {
    slug: "bird-survey", name: "Bird survey", group: "Ecology",
    what: "Records breeding or wintering birds on the site.",
    when: "Larger sites, or work that removes hedges, trees or buildings used by nesting birds.",
    season: "Breeding birds: March to August.",
    window: [3, 4, 5, 6, 7, 8], ask: "What will be removed: hedges, trees, buildings?",
  },
  {
    slug: "water-vole-otter-survey", name: "Water vole and otter survey", group: "Ecology",
    what: "Checks riverbanks, ditches and ponds for water voles and otters.",
    when: "Work on or near watercourses.",
    season: "Water voles: April to September.",
    window: [4, 5, 6, 7, 8, 9], ask: "How long a stretch of river, ditch or bank is affected?",
  },
  {
    slug: "dormouse-survey", name: "Dormouse survey", group: "Ecology",
    what: "Nest tubes checked over several months in hedges and woodland.",
    when: "Work affecting hedgerows or woodland in dormouse areas.",
    season: "April to November.",
    window: [4, 5, 6, 7, 8, 9, 10, 11], ask: "How much hedgerow or woodland is affected?",
  },
  {
    slug: "biodiversity-net-gain", name: "Biodiversity net gain", group: "Ecology",
    what: "Measures the site's habitats before and after development with the statutory metric, and plans the 10% gain.",
    when: "Most planning applications in England need it. Householder applications are exempt, and since 6 August 2026 so are sites of 0.2 hectares or less (gov.uk, biodiversity net gain exempt developments).",
    ask: "How big is the site, and is a habitat survey already done?",
  },
  {
    slug: "ecological-impact-assessment", name: "Ecological impact assessment", group: "Ecology",
    what: "The full ecology report: what the development affects and how to avoid, reduce or make up for it.",
    when: "Larger or more sensitive sites, after the species surveys.",
  },
  {
    slug: "flood-risk-assessment", name: "Flood risk assessment", group: "Water and flooding",
    what: "Shows how the site floods, whether the development is safe, and that it won't make flooding worse elsewhere.",
    when: "Required for development in Flood Zones 2 and 3, and for sites over 1 hectare in Flood Zone 1.",
    ask: "Which flood zone is the site in, if you know, and how big is it?",
  },
  {
    slug: "noise-impact-assessment", name: "Noise impact assessment", group: "Noise and air",
    what: "Measures existing noise and predicts the effect of the development, with mitigation.",
    when: "New homes near roads, railways or businesses, and noisy uses such as bars, plant or workshops.",
    ask: "What is the noise source or the noisy use (road, rail, plant, venue)?",
  },
  {
    slug: "air-quality-assessment", name: "Air quality assessment", group: "Noise and air",
    what: "Assesses traffic, dust and other emissions from the development and their effect on people nearby.",
    when: "Developments in or near an Air Quality Management Area, or that add a lot of traffic.",
    ask: "Is the site in an Air Quality Management Area, and how many homes or vehicle trips?",
  },
  {
    slug: "contaminated-land-assessment", name: "Contaminated land assessment", group: "Ground",
    what: "A desk study (phase 1) of the site's past uses, and if needed sampling (phase 2) to show the ground is safe.",
    when: "Land with a past industrial, agricultural or garage use, and most new homes on previously used land.",
    ask: "What was the site used for before?",
  },
  {
    slug: "arboricultural-survey", name: "Tree survey (arboricultural)", group: "Trees",
    what: "A BS 5837 survey of trees on and near the site, with root protection areas and a tree protection plan.",
    when: "When there are trees on or next to the site, or a tree preservation order.",
    ask: "Roughly how many trees are on or next to the site, and are any protected?",
  },
  {
    slug: "environmental-impact-assessment", name: "Environmental impact assessment", group: "Major projects",
    what: "The formal assessment for large projects, bringing every topic together in an environmental statement.",
    when: "Projects that fall under the EIA Regulations, usually large housing, infrastructure or energy schemes.",
  },
]

export const REGIONS = [
  { slug: "north-east", name: "North East" },
  { slug: "north-west", name: "North West" },
  { slug: "yorkshire-humber", name: "Yorkshire and the Humber" },
  { slug: "east-midlands", name: "East Midlands" },
  { slug: "west-midlands", name: "West Midlands" },
  { slug: "east-of-england", name: "East of England" },
  { slug: "london", name: "London" },
  { slug: "south-east", name: "South East" },
  { slug: "south-west", name: "South West" },
  { slug: "wales", name: "Wales" },
  { slug: "scotland", name: "Scotland" },
  { slug: "northern-ireland", name: "Northern Ireland" },
] as const
export type RegionSlug = (typeof REGIONS)[number]["slug"]
// A firm that works anywhere in the UK.
export const UK_WIDE = "uk-wide"

export const SURVEY_SLUGS = SURVEYS.map((s) => s.slug)
export const REGION_SLUGS: readonly string[] = REGIONS.map((r) => r.slug)

export function surveyBySlug(slug: string): Survey | undefined {
  return SURVEYS.find((s) => s.slug === slug)
}

export function regionBySlug(slug: string): (typeof REGIONS)[number] | undefined {
  return REGIONS.find((r) => r.slug === slug)
}
