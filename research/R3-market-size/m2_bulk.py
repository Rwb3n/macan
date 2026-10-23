# M2 B2: download Companies House monthly accounts (iXBRL) one zip at a time, keep only the universe's files, delete the zip.
import csv, os, subprocess, sys, time, zipfile
OUT = "D:/data/macan/m2"
KEEP = f"{OUT}/accounts"
os.makedirs(KEEP, exist_ok=True)
want = {r["company_number"] for r in csv.DictReader(open(f"{OUT}/universe.csv", encoding="utf-8"))}
MONTHS = ["October2025", "November2025", "December2025", "January2026", "February2026", "March2026",
          "April2026", "May2026", "June2026", "July2026", "August2026", "September2026"]
log = open(f"{OUT}/bulk.log", "a", encoding="utf-8")
def say(m):
    line = f"{time.strftime('%H:%M:%S')} {m}"; print(line, flush=True); log.write(line + "\n"); log.flush()
for m in MONTHS:
    done = f"{KEEP}/.{m}.done"
    if os.path.exists(done):
        say(f"{m}: already done"); continue
    z = f"{OUT}/Accounts_Monthly_Data-{m}.zip"
    say(f"{m}: downloading")
    r = subprocess.run(["curl", "-sS", "-f", "--retry", "3", "-o", z, f"https://download.companieshouse.gov.uk/Accounts_Monthly_Data-{m}.zip"])
    if r.returncode != 0:
        say(f"{m}: download FAILED ({r.returncode})"); sys.exit(1)
    kept = total = 0
    with zipfile.ZipFile(z) as zf:
        for info in zf.infolist():
            total += 1
            parts = os.path.basename(info.filename).split("_")
            if len(parts) >= 3 and parts[2].upper() in want:
                with zf.open(info) as src, open(f"{KEEP}/{os.path.basename(info.filename)}", "wb") as dst:
                    dst.write(src.read())
                kept += 1
    os.remove(z)
    open(done, "w").write(f"{kept}/{total}\n")
    say(f"{m}: kept {kept} of {total} files")
say("all months done")
