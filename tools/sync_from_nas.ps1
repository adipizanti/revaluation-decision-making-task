<#
 Copy the light, text-based project files from the NAS working folder
 into this git repo (Prereg_3 folder). DRY RUN by default; add -Apply to copy.
 Notebooks are copied with outputs stripped (keeps the repo small).
 Never copies .pkl, logs, PRIVATE_* files, backups or participant-level data.

 Usage (PowerShell, from anywhere):
   .\tools\sync_from_nas.ps1            # show what would change
   .\tools\sync_from_nas.ps1 -Apply     # copy, then review with `git status`
#>
param(
  [switch]$Apply,
  [string]$Nas  = "C:\Users\adip1\SynologyDrive\Adi Pizanti - modeling data with RL",
  [string]$Dest = (Join-Path (Split-Path $PSScriptRoot -Parent) "Prereg_3_Anxiety, model-based revaluation, and overthinking")
)

# Allow-list: only these files are ever synced.
$files = @(
  "PREREGISTRATION_V4.md", "LOGBOOK.md", "CONTEXT_repo_briefing.md", "FOLDER_MAP.md",
  "Merged_V4_Analysis.ipynb", "Modelling_AllChoices_V4.ipynb"
)

if (-not (Test-Path $Nas))  { throw "NAS folder not found: $Nas (is Synology Drive running?)" }
if (-not (Test-Path $Dest)) { throw "Destination not found: $Dest" }

$strip = @'
import json, sys
src, dst = sys.argv[1], sys.argv[2]
nb = json.load(open(src, encoding="utf-8"))
for c in nb.get("cells", []):
    if c.get("cell_type") == "code":
        c["outputs"] = []; c["execution_count"] = None
json.dump(nb, open(dst, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
'@

foreach ($f in $files) {
  $src = Join-Path $Nas $f
  if (-not (Test-Path $src)) { Write-Host "skip (missing on NAS): $f"; continue }
  $dst = Join-Path $Dest $f
  $isNb = $f.EndsWith(".ipynb")
  if (-not $Apply) { Write-Host "would copy: $f $(if($isNb){'(outputs stripped)'})"; continue }
  if ($isNb) { $strip | python - $src $dst } else { Copy-Item $src $dst -Force }
  Write-Host "copied: $f"
}
if ($Apply) { Write-Host "`nDone. Next:  git status ; git add -A ; git commit -m `"sync from NAS`" ; git push" }
else        { Write-Host "`nDry run only. Re-run with -Apply to copy." }
