# M2 B1: the trade, from vein (read-only), with S1's substantive filter (callsheet docs/screens/s5-b2b-claimability/sample.py).
import csv, os, sqlite3
OUT = "D:/data/macan/m2"
os.makedirs(OUT, exist_ok=True)
db = sqlite3.connect("file:D:/data/vein/vein.db?mode=ro", uri=True)
BASE = """status='Active' and category in ('Private Limited Company','Limited Liability Partnership')
  and incorporation_date <= '2021-02-28'
  and coalesce(accounts_category,'') not in ('DORMANT','NO ACCOUNTS FILED','ACCOUNTS TYPE NOT AVAILABLE','','MICRO ENTITY')"""
STEMS = ["ECOLOG", "ACOUSTIC", "ARBORI", "GEO-ENVIRONMENTAL", "GEOENVIRONMENTAL", "FLOOD", "NOISE"]
rows = {}
for (n, name, sic) in db.execute(f"select company_number, name, sic_1 from companies where {BASE} and substr(sic_1,1,5)='74901'"):
    rows[n] = dict(company_number=n, name=name, sic=sic[:5], group="a_74901", stem="")
for stem in STEMS:
    for (n, name, sic) in db.execute(f"select company_number, name, sic_1 from companies where {BASE} and upper(name) like ?", (f"%{stem}%",)):
        r = rows.setdefault(n, dict(company_number=n, name=name, sic=(sic or "")[:5], group="b_stem", stem=stem))
        if r["group"] == "a_74901" and not r["stem"]:
            r["stem"] = stem  # in both groups: counted once, in group a
with open(f"{OUT}/universe.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["company_number", "name", "sic", "group", "stem"])
    w.writeheader(); w.writerows(rows.values())
from collections import Counter
print("group counts:", Counter(r["group"] for r in rows.values()))
print("stem counts (group b):", Counter(r["stem"] for r in rows.values() if r["group"] == "b_stem"))
print("group b top SICs:", Counter(r["sic"] for r in rows.values() if r["group"] == "b_stem").most_common(8))
