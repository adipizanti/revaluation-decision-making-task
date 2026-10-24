# Modeling cognitive reappraisal / anxiety, model-based revaluation and overthinking

Sharp Lab, Bar-Ilan University. This repo holds the **light, citable part** of the project:
preregistrations, task code, anonymized data exports, analysis notebooks, and dissemination files.
Heavy files (model fits `.pkl`, logs, backups, papers) live on the lab NAS, not here.

## Where things live

| Thing | Location |
|---|---|
| Working project (source of truth) | Synology NAS: `Adi Pizanti - modeling data with RL` (synced to `C:\Users\adip1\SynologyDrive`) |
| Light files for sharing / Claude on phone | **this repo** |
| Participant-identifying files (`PRIVATE_*`) | NAS only. Never in git. |
| Model fits (`cbm_output*`, `*.pkl`), logs, backups | NAS only (git-ignored) |

## Repo map

| Folder | What |
|---|---|
| `Prereg_1_...` | Study 1 (V1): task + data |
| `Prereg_2_...-Revised` | Study 2 (V3): task, data, analysis notebooks |
| `prereg_2_dev_iterations` | V2 development iterations and outputs |
| `Prereg_3_Anxiety, model-based revaluation, and overthinking` | Study 3 (V4/V4.1): preregistration, task, anonymized exports, **current analysis notebooks, LOGBOOK, CONTEXT_repo_briefing** (synced from NAS) |
| `pocket-check-task` | Next study (task v5): source, build, tests, CI |
| `Talk and poster (CPC26)` | CPC26 poster and talk |
| `tools/sync_from_nas.ps1` | Copies the allow-listed files from the NAS into this repo |

Folder names of the three preregistrations are kept as-is because they may be cited externally.

## Workflow

1. Work on the NAS folder (notebooks, fits, figures).
2. When something is ready to share: `.\tools\sync_from_nas.ps1` (dry run), then `-Apply`.
3. Review with `git status`, then `git add -A`, `git commit`, `git push`.
4. Keep this git clone on a normal local disk, **not inside the Synology Drive folder**
   (live sync can corrupt `.git`).

If you are Claude starting a session from a phone: read `Prereg_3_.../CONTEXT_repo_briefing.md`
and `LOGBOOK.md` first; the latest LOGBOOK entry is the current project state.
