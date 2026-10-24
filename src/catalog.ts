// Builds: U1, ST-U2.1, ST-U2.2
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
  // Median of 3+ published prices, ex VAT (R3, A3), for the first visit only; follow-on surveys cost more (PN1).
  typicalPrice?: { pounds: number; covers: string }
}

export const SURVEY_GROUPS = ["Ecology", "Water and flooding", "Noise and air", "Ground", "Trees", "Heritage", "Buildings and light", "Transport", "Major projects"] as const
export type SurveyGroup = (typeof SURVEY_GROUPS)[number]

export const SURVEYS: readonly Survey[] = [
  {
    slug: "preliminary-ecological-appraisal", name: "Preliminary ecological appraisal", group: "Ecology",
    typicalPrice: { pounds: 725, covers: "the first visit and report" },
    what: "A first ecology visit and desk study that says which habitats and protected species could be affected, and which further surveys you need.",
    when: "Usually the first ecology step for a planning application on land with any wildlife value.",
    season: "Possible all year; best April to September.",
    ask: "Roughly how big is the site, and what is on it now (buildings, grass, trees, ponds)?",
  },
  {
    slug: "bat-survey", name: "Bat survey", group: "Ecology",
    typicalPrice: { pounds: 362, covers: "the first visit to look for signs of bats" },
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
    typicalPrice: { pounds: 599, covers: "the assessment" },
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
  // Added from councils' validation lists: specialist reports asked for by 3 or more of 10 sampled councils (R8).
  // "when" paraphrases the councils' own trigger wording, kept in research/R8-survey-universe/evidence.
  {
    slug: "drainage-strategy", name: "Drainage strategy", group: "Water and flooding",
    what: "Shows how rain water and waste water will be dealt with, for example soakaways, a septic tank or a connection to the sewer.",
    when: "New buildings, and any site not connecting to the public sewer, such as one using a septic tank or treatment plant.",
  },
  {
    slug: "coastal-erosion-assessment", name: "Coastal erosion assessment", group: "Water and flooding",
    what: "Looks at how the coastline near the site is changing and whether the building will be safe for its lifetime.",
    when: "Building or extending in an area the council has marked as at risk from coastal change or unstable land.",
  },
  {
    slug: "habitats-regulations-assessment", name: "Habitats regulations and nutrient assessment", group: "Ecology",
    what: "Checks whether new homes could harm a protected wildlife site, for example through extra visitors or water pollution, and how that will be made up for.",
    when: "New homes near some protected wildlife sites, or in river catchments where councils ask for 'nutrient neutrality'.",
  },
  {
    slug: "ventilation-extraction", name: "Ventilation and extraction details", group: "Noise and air",
    what: "Shows how cooking fumes and smells from a kitchen will be taken away without bothering neighbours.",
    when: "Restaurants, cafés, takeaways, pubs and any building with a commercial kitchen.",
  },
  {
    slug: "odour-assessment", name: "Odour assessment", group: "Noise and air",
    what: "Looks at whether a new use will cause smells for people nearby, or whether new homes would suffer from an existing smell.",
    when: "Uses that create smells, such as food businesses or farms, especially near homes, schools or hospitals.",
  },
  {
    slug: "coal-mining-risk-assessment", name: "Coal mining and ground stability assessment", group: "Ground",
    what: "Checks old mine workings, mine gas or unstable ground under the site, and what is needed to build safely.",
    when: "New building in a coal mining high risk area, or anywhere the council knows or suspects the ground is unstable.",
  },
  {
    slug: "heritage-statement", name: "Heritage statement", group: "Heritage",
    what: "Explains what is historically important about a building or place and how the work will affect it.",
    when: "Work to a listed building, in a conservation area, or near another protected historic place.",
  },
  {
    slug: "archaeology-assessment", name: "Archaeological assessment", group: "Heritage",
    what: "A desk study, and sometimes trial digging, to find out whether there could be archaeology under the site.",
    when: "Sites with known archaeological interest, larger sites, or demolition of a listed building.",
  },
  {
    slug: "structural-survey", name: "Structural survey", group: "Buildings and light",
    what: "An engineer's report on whether an existing building is sound enough to convert or alter.",
    when: "Converting barns and other buildings in the countryside, and demolition or major change to listed or protected buildings.",
  },
  {
    slug: "daylight-sunlight-assessment", name: "Daylight and sunlight assessment", group: "Buildings and light",
    what: "Measures how much light neighbouring homes would lose, and whether new homes will get enough.",
    when: "Taller or larger buildings close to neighbours' windows.",
  },
  {
    slug: "lighting-assessment", name: "Lighting assessment", group: "Buildings and light",
    what: "Shows what outdoor lights are planned and how glare and light spill will be kept down.",
    when: "Floodlights, sports pitches and larger schemes, and anywhere near dark-sky areas or sensitive wildlife.",
  },
  {
    slug: "transport-assessment", name: "Transport assessment or statement", group: "Transport",
    what: "Looks at the traffic, parking and access a development will create and how it will be managed.",
    when: "Developments that will create noticeable extra traffic. Larger schemes need a full assessment, smaller ones a shorter statement.",
  },
  {
    slug: "travel-plan", name: "Travel plan", group: "Transport",
    what: "A plan for encouraging people to walk, cycle or use public transport to and from the site.",
    when: "Larger developments with significant transport effects, usually alongside a transport assessment.",
  },
  {
    slug: "energy-statement", name: "Energy statement or BREEAM assessment", group: "Major projects",
    what: "Shows how the building will save energy and cut carbon, sometimes using the BREEAM rating scheme.",
    when: "Mainly larger schemes, such as 10 or more homes or 1,000 square metres or more of floorspace. Some councils ask sooner.",
  },
  {
    slug: "fire-statement", name: "Fire statement", group: "Major projects",
    what: "A fire engineer's statement on fire safety for tall residential buildings.",
    when: "Buildings with 2 or more homes that are 18 metres or more high, or 7 or more storeys.",
  },
  {
    slug: "landscape-visual-impact-assessment", name: "Landscape and visual impact assessment", group: "Major projects",
    what: "Shows how the development will change the landscape and the views people have of it.",
    when: "Schemes likely to have a big effect on the landscape or on important views, because of their size or where they are.",
  },
  {
    slug: "viability-assessment", name: "Viability assessment", group: "Major projects",
    what: "A financial appraisal showing whether a scheme can afford what planning policy asks of it, such as affordable housing.",
    when: "When a developer says a scheme can't afford the affordable housing or other contributions policy requires.",
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

// Specialist reports only 1 or 2 of the 10 sampled councils ask for (R8): listed so a buyer can find them, not yet in the catalogue.
export const OTHER_REPORTS: readonly { name: string; what: string }[] = [
  { name: "Wind and microclimate assessment", what: "How a tall building changes wind at street level." },
  { name: "Glint, glare and shadow flicker assessment", what: "Reflections from solar panels, and flickering shadows from wind turbines." },
  { name: "Topographical survey", what: "An accurate measured plan of the site's levels and features." },
  { name: "Basement impact assessment", what: "The effect of digging a basement on neighbours, ground and water." },
  { name: "Agricultural land classification", what: "How good the farmland is that a development would use." },
]

export const SURVEY_SLUGS = SURVEYS.map((s) => s.slug)
export const REGION_SLUGS: readonly string[] = REGIONS.map((r) => r.slug)

export function surveyBySlug(slug: string): Survey | undefined {
  return SURVEYS.find((s) => s.slug === slug)
}

// A first guess at the survey from the buyer's own words (ST-U2.1). Most specific words first; the buyer can change it.
const SUGGEST: readonly [RegExp, string][] = [
  [/\b(bats?|roost)/i, "bat-survey"],
  [/\b(newts?|gcn)\b/i, "great-crested-newt-survey"],
  [/\bbadger/i, "badger-survey"],
  [/\b(reptiles?|slow ?worms?|lizards?|snakes?)\b/i, "reptile-survey"],
  [/\b(water ?voles?|otters?)\b/i, "water-vole-otter-survey"],
  [/\bdormi?ouse|dormice/i, "dormouse-survey"],
  [/\b(nesting|breeding) birds?|bird survey/i, "bird-survey"],
  [/biodiversity net gain|\bbng\b/i, "biodiversity-net-gain"],
  [/\bflood|\bfra\b|flood zone/i, "flood-risk-assessment"],
  [/\bnoise|acoustic/i, "noise-impact-assessment"],
  [/air quality/i, "air-quality-assessment"],
  [/contaminat|ground investigation|phase (1|one) (desk|geo)/i, "contaminated-land-assessment"],
  [/\btrees?\b|arboricult|\btpo\b/i, "arboricultural-survey"],
  [/coal|mine workings|mining|unstable ground|ground stability/i, "coal-mining-risk-assessment"],
  [/coastal|erosion|cliff/i, "coastal-erosion-assessment"],
  [/nutrient|habitats regulations|\bhra\b|\brams\b/i, "habitats-regulations-assessment"],
  [/drainage|\bsuds\b|septic|soakaway|sewage/i, "drainage-strategy"],
  [/extraction|ventilation|takeaway|commercial kitchen/i, "ventilation-extraction"],
  [/odour|smell/i, "odour-assessment"],
  [/archaeolog/i, "archaeology-assessment"],
  [/heritage|listed building|conservation area/i, "heritage-statement"],
  [/structural survey|structural report|structural engineer/i, "structural-survey"],
  [/daylight|sunlight|overshadow/i, "daylight-sunlight-assessment"],
  [/lighting|floodlight/i, "lighting-assessment"],
  [/travel plan/i, "travel-plan"],
  [/transport|traffic/i, "transport-assessment"],
  [/fire statement|fire safety/i, "fire-statement"],
  [/energy statement|\bbreeam\b/i, "energy-statement"],
  [/viability/i, "viability-assessment"],
  [/landscape and visual|\blvia\b/i, "landscape-visual-impact-assessment"],
  [/environmental impact assessment|\beia\b/i, "environmental-impact-assessment"],
  [/ecological impact|\becia\b/i, "ecological-impact-assessment"],
  [/ecolog|\bpea\b|wildlife|habitat|protected species/i, "preliminary-ecological-appraisal"],
]
export function suggestSurvey(text: string): string | undefined {
  return SUGGEST.find(([re]) => re.test(text))?.[1]
}

export function regionBySlug(slug: string): (typeof REGIONS)[number] | undefined {
  return REGIONS.find((r) => r.slug === slug)
}
