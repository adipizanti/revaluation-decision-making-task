#!/usr/bin/env python3
"""Sync allow-listed light files from the NAS working folder into this repo,
then run safety checks. Dry run by default.

  python tools/update_study.py            # show what would change + run checks on repo
  python tools/update_study.py --apply    # copy (notebooks get outputs stripped), then check
Paths can be overridden with --nas / --dest (the script finds them automatically in
the Windows PC and in the Cowork VM).
"""
import argparse, glob, json, os, re, subprocess, sys

FILES = ["PREREGISTRATION_V4.md", "LOGBOOK.md", "CONTEXT_repo_briefing.md", "FOLDER_MAP.md",
         "Merged_V4_Analysis.ipynb", "Modelling_AllChoices_V4.ipynb"]
BAD_NAME = re.compile(r"(^|/)(PRIVATE_[^/]*|[^/]*\.pkl|[^/]*\.log|cbm_output[^/]*|_backups|\.env)(/|$)")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
MAX_MB = 5
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def find_nas():
    cands = [r"C:\Users\adip1\SynologyDrive\Adi Pizanti - modeling data with RL"]
    cands += glob.glob(os.path.expanduser("~/mnt/SynologyDrive/Adi Pizanti - modeling data with RL"))
    return next((c for c in cands if os.path.isdir(c)), None)

def sh(*a):
    return subprocess.run(a, cwd=REPO, capture_output=True, text=True).stdout

def strip_nb(src, dst):
    nb = json.load(open(src, encoding="utf-8"))
    for c in nb.get("cells", []):
        if c.get("cell_type") == "code":
            c["outputs"] = []; c["execution_count"] = None
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=1, ensure_ascii=False); f.write("\n")

def checks():
    problems = []
    changed = [l[3:].strip().strip('"') for l in sh("git", "status", "--porcelain", "-uall").splitlines()]
    for p in changed:
        full = os.path.join(REPO, p)
        if BAD_NAME.search(p): problems.append(f"forbidden file: {p}")
        if os.path.isfile(full):
            if os.path.getsize(full) > MAX_MB * 1024 * 1024:
                problems.append(f"larger than {MAX_MB} MB: {p}")
            if p.endswith(".ipynb"):
                nb = json.load(open(full, encoding="utf-8"))
                if any(c.get("outputs") for c in nb.get("cells", []) if c.get("cell_type") == "code"):
                    problems.append(f"notebook has outputs: {p}")
            if p.endswith((".md", ".csv", ".txt", ".json")):
                txt = open(full, encoding="utf-8", errors="ignore").read()
                em = {e for e in EMAIL.findall(txt) if not e.endswith(("example.com", "noreply@anthropic.com"))}
                if em: problems.append(f"email-like text in {p}: {sorted(em)[:3]}")
                head = txt.splitlines()[0].lower() if txt else ""
                if p.endswith(".csv") and re.search(r"prolific|pid|email|name", head):
                    problems.append(f"CSV header may hold identifiers in {p}: {head[:120]}")
            if "PREREGISTRATION" in p.upper():
                problems.append(f"PREREGISTRATION file changed (confirm intentional): {p}")
    if "PRIVATE" in sh("git", "ls-files").upper().replace("GITIGNORE", ""):
        problems.append("a PRIVATE_* file is tracked")
    return changed, problems

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--nas"); ap.add_argument("--dest")
    a = ap.parse_args()
    nas = a.nas or find_nas()
    dest = a.dest or next(iter(glob.glob(os.path.join(REPO, "Prereg_3_*"))), None)
    if not nas: sys.exit("NAS folder not found (is Synology Drive running / connected?)")
    if not dest: sys.exit("Prereg_3 folder not found in repo")
    print(f"NAS : {nas}\nDest: {dest}\nBranch: {sh('git','branch','--show-current').strip()}\n")
    for f in FILES:
        src, dst = os.path.join(nas, f), os.path.join(dest, f)
        if not os.path.exists(src): print(f"skip (missing on NAS): {f}"); continue
        if not a.apply: print(f"would copy: {f}"); continue
        if f.endswith(".ipynb"): strip_nb(src, dst)
        else:
            with open(src, "rb") as s, open(dst, "wb") as d: d.write(s.read())
        print(f"copied: {f}")
    changed, problems = checks()
    print(f"\nChanged paths in repo: {len(changed)}")
    for p in changed: print("  ", p)
    print("\nCHECKS: " + ("all clear" if not problems else f"{len(problems)} flag(s)"))
    for p in problems: print("  !", p)
    if not a.apply: print("\nDry run only. Re-run with --apply to copy.")

if __name__ == "__main__":
    main()
