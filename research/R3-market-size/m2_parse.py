# M2 B2/B3: read turnover and average employees from the kept iXBRL accounts; one row per company (latest period).
import csv, glob, os, re, statistics, sys
from html.parser import HTMLParser

OUT = "D:/data/macan/m2"
TURNOVER = {"turnoverrevenue", "turnover", "revenue", "turnovergrossoperatingrevenue"}
EMPLOYEES = {"averagenumberemployeesduringperiod", "averagenumberemployees"}

class Facts(HTMLParser):
    def __init__(self):
        super().__init__(); self.ctx = {}; self.cur_ctx = None; self.in_end = False; self.in_instant = False
        self.facts = []; self.cur = None; self.buf = ""
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); t = tag.lower()
        if t.endswith(":context"): self.cur_ctx = a.get("id")
        elif t.endswith(":enddate") or t.endswith(":instant"): self.in_end = True; self.buf = ""
        elif t in ("ix:nonfraction",):
            local = (a.get("name") or "").split(":")[-1].lower()
            if local in TURNOVER or local in EMPLOYEES:
                self.cur = dict(name=local, ctx=a.get("contextref"), scale=int(a.get("scale") or 0), sign=a.get("sign"), fmt=a.get("format") or ""); self.buf = ""
    def handle_endtag(self, tag):
        t = tag.lower()
        if (t.endswith(":enddate") or t.endswith(":instant")) and self.in_end:
            if self.cur_ctx: self.ctx[self.cur_ctx] = self.buf.strip()
            self.in_end = False
        elif t == "ix:nonfraction" and self.cur:
            raw = re.sub(r"[^\d.]", "", self.buf)
            if raw:
                v = float(raw) * (10 ** self.cur["scale"]) * (-1 if self.cur["sign"] == "-" else 1)
                self.facts.append((self.cur["name"], self.cur["ctx"], v))
            self.cur = None
    def handle_data(self, d):
        if self.in_end or self.cur is not None: self.buf += d

def read(path):
    p = Facts()
    with open(path, encoding="utf-8", errors="ignore") as f: p.feed(f.read())
    out = {}
    for kind, names in (("turnover", TURNOVER), ("employees", EMPLOYEES)):
        vals = [(p.ctx.get(c, ""), v) for (n, c, v) in p.facts if n in names]
        if vals: out[kind] = max(vals)[1]  # value for the latest period end
    return out

if __name__ == "__main__":
    files = sorted(glob.glob(f"{OUT}/accounts/*.htm*") + glob.glob(f"{OUT}/accounts/*.xml"))
    latest = {}
    for fp in files:
        parts = os.path.basename(fp).split("_")
        num, date = parts[2].upper(), parts[3][:8] if len(parts) > 3 else ""
        if num in latest and latest[num][0] >= date: continue
        latest[num] = (date, fp)
    uni = {r["company_number"]: r for r in csv.DictReader(open(f"{OUT}/universe.csv", encoding="utf-8"))}
    rows = []
    for num, (date, fp) in latest.items():
        f = read(fp); u = uni.get(num, {})
        rows.append(dict(company_number=num, group=u.get("group", ""), stem=u.get("stem", ""), sic=u.get("sic", ""), period_file_date=date,
                         turnover=f.get("turnover", ""), employees=f.get("employees", "")))
    with open(f"{OUT}/figures.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()) if rows else ["company_number"]); w.writeheader(); w.writerows(rows)
    print(f"{len(files)} files, {len(rows)} companies; turnover filed {sum(1 for r in rows if r['turnover'] != '')}, employees filed {sum(1 for r in rows if r['employees'] != '')}")
