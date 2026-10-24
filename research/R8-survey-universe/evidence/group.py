# R8 sorting: group council item names into report types (patterns below are the grouping table), mark who makes it, count councils.
import csv, re, collections, sys
TYPES = [  # (type, class, pattern) — first match wins; class: specialist / applicant / unclear
 ("Flood risk sequential and exception tests", "applicant", r"sequential|exception test"),
 ("Flood risk assessment", "specialist", r"flood risk|critical drainage"),
 ("Drainage strategy (surface water, SuDS, foul)", "specialist", r"drainage|suds|foul sewage|non-mains"),
 ("Biodiversity net gain", "specialist", r"biodiversity net gain|biodiversity gain|biodiversity metric|bng"),
 ("Habitats regulations / nutrient neutrality", "specialist", r"habitat.? regulation|nutrient|rams"),
 ("Ecology and protected species (incl. bat)", "specialist", r"ecolog|bat\b|bat survey|roost|protected species|biodiversity and ecology|biodiversity pro forma"),
 ("Tree survey (arboricultural)", "specialist", r"arboricult|\btrees?\b"),
 ("Archaeology", "specialist", r"archaeolog|historic environment record"),
 ("Heritage statement or impact assessment", "specialist", r"^(?!.*gypsy).*heritage"),
 ("Landscape and visual impact assessment", "specialist", r"landscape and visual|visual impact|townscape"),
 ("Noise impact assessment", "specialist", r"noise|acoustic"),
 ("Air quality assessment", "specialist", r"air quality|emissions mitigation|dust"),
 ("Odour assessment", "specialist", r"odour"),
 ("Ventilation and extraction", "specialist", r"ventilation|extraction"),
 ("Lighting assessment", "specialist", r"lighting"),
 ("Daylight and sunlight", "specialist", r"daylight|sunlight"),
 ("Land contamination", "specialist", r"contaminat"),
 ("Coal mining and ground stability", "specialist", r"coal|mining|ground stability|minerals safeguarding|geolog|geodiversity"),
 ("Coastal erosion and stability", "specialist", r"coastal"),
 ("Structural survey", "specialist", r"structural survey"),
 ("Topographical survey", "specialist", r"topographic|hydrograph"),
 ("Transport assessment or statement", "specialist", r"transport|trip generation|road safety audit|navigational"),
 ("Travel plan", "specialist", r"travel plan"),
 ("Energy statement, carbon and BREEAM", "specialist", r"energy|breeam|carbon|circular economy"),
 ("Sustainable construction checklist or statement", "unclear", r"sustainab|climate change"),
 ("Fire statement", "specialist", r"fire"),
 ("Viability assessment", "specialist", r"viability"),
 ("Environmental impact assessment", "specialist", r"environmental impact|environmental statement"),
 ("Health impact assessment", "unclear", r"health"),
 ("Wind and microclimate", "specialist", r"wind assessment|micro-climate"),
 ("Glint, glare and shadow flicker", "specialist", r"glint|shadow flicker"),
 ("Agricultural land classification", "specialist", r"agricultural land classification"),
 ("Basement impact assessment", "specialist", r"basement"),
 ("Retail and town centre impact", "unclear", r"retail|town centre"),
]
rows = [r for f in ["rows-a.csv", "rows-b.csv"] for r in csv.DictReader(open(f, encoding="utf-8")) if r["council"] != "National"]
by = collections.defaultdict(set); trig = collections.defaultdict(list); names = collections.defaultdict(set); other = []
for r in rows:
    t = next(((n, c) for n, c, p in TYPES if re.search(p, r["item"], re.I)), None)
    if not t: other.append(r["item"]); continue
    by[t].add(r["council"]); names[t].add(r["item"]); trig[t].append((r["council"], r["trigger"]))
out = sorted(by.items(), key=lambda kv: -len(kv[1]))
w = csv.writer(open("types.csv", "w", newline="", encoding="utf-8"))
w.writerow(["type", "class", "councils", "council_names", "names_used"])
for (n, c), cs in out:
    w.writerow([n, c, len(cs), "; ".join(sorted(cs)), " | ".join(sorted(names[(n, c)]))])
    print(f"{len(cs):2} {c:10} {n}")
print("\nunmatched (applicant documents or one-offs):", len(other))
open("unmatched.txt", "w", encoding="utf-8").write("\n".join(sorted(set(other))))
