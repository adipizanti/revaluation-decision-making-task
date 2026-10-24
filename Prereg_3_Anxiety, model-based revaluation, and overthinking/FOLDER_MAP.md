# FOLDER MAP — Adi Pizanti - modeling data with RL

Snapshot 2026-07-06. Sizes and file counts as of this date. One line per item; see README.md / LOGBOOK.md for history and decisions.

## Root files (76)

### Docs (6 md + 1 txt)
| File | What |
|---|---|
| `README.md` | Front-door doc: terminology (two preregistrations), partial folder table |
| `LOGBOOK.md` | Session journal; most recent entry = current project state |
| `PREREGISTRATION_V4.md` | Current preregistration (H1/H2/H3, indices, exclusions) |
| `demographics_summary.md` | Sample demographics summary |
| `external_replication_candidates.md` | Candidate open datasets for replication |
| `gillan_replication_plan.md` | Plan for Gillan-style replication |
| `2026-04-23 log - adi.txt` | Early session log (pre-LOGBOOK) |

### Notebooks (3 active + 5 backup variants)
| File | What |
|---|---|
| `Modelling_AllChoices_V4.ipynb` | Main analysis notebook; AUTHORITATIVE classifier (cell 4 mb_score → N_MB = 159) |
| `Merged_V4_Analysis.ipynb` | Poster-first 4-section merge of the analysis (113 cells) |
| `ARCHIVE_exploratory_RT.ipynb` | Archived exploratory RT notebook |
| `Modelling_AllChoices_V4.ipynb.bak_*` (4) + `.broken` | Stale in-place backups of the main notebook |

### Data (13 csv + 1 html + 1 zip)
| File | What |
|---|---|
| `experiment_results_v4_1_export.csv` | Current raw behavioural export (v4_1, Firestore) |
| `experiment_results_v4_export.csv` | Earlier v4 export |
| `filtered_data_v4_1.csv` | Post-exclusion analysis frame (N = 277) |
| `rt_analyses_per_subject.csv` | Per-subject RT/OT table — ⚠ mb_group uses OLD 217/60 rule, not 159/118 |
| `rt_analyses_corr_acc.csv`, `rt_analyses_corr_ot.csv`, `rt_analyses_corr_rt.csv` | RT-pipeline correlation tables |
| `rt_analyses_OT_decomposition.csv` | OT decomposition table |
| `convergence_agnostic_vs_hbi_v4_1_all.csv` | Model-agnostic vs HBI classifier agreement (source of the 159/118 split) |
| `hybrid_w_sensitivity_v4_1_all.csv` | Hybrid-w sensitivity analysis |
| `ddm_terfree_MB_recomputed.csv` | Reproducible Ter-free DDM refit (see figma_svg_figures README V3 caveat) |
| `demographics_analyzed_sample.csv`, `prolific_demographic_export_*.csv` | Demographics |
| `task_v4.html` | V4 task implementation (Firebase `reappraisal-task-17716`) |
| `adi_code_new.zip` | Zip of `adi_code_new_extracted/` |

### Scripts (7 py + 1 skill)
| File | What |
|---|---|
| `make_poster_figures.py`, `make_D2_fix.py`, `make_M1_fix.py`, `poster_figstyle.py` | Poster figure generation (outputs in `poster_figures_final/`) |
| `h3_violin_cell.py` | H3 violin notebook cell |
| `verify_convergence_agnostic_vs_hbi.py` | Classifier-agreement verification |
| `_fix_notebook.py` | One-off notebook repair utility |
| `figma-svg-figures.skill` | Packaged skill for Figma-ready SVG figures |

### Figures (38 png)
| Pattern | What |
|---|---|
| `fig_*_v4_1_all.png` (29) | Current-run (v4_1) figures: BMS/PXP, HBI responsibility, H1/H2/H3, κ validity, OT, PPC, RT — used in the talk |
| `fig_*_v4_all.png` (9) | Stale earlier-run (v4) counterparts |
| `fig_section1*/section5*.png` | RT-pipeline section figures (duplicated in `Paul/` and `rt_analysis/`) |

## Directories (20)

| Dir | Size / files | What |
|---|---|---|
| `cbm_output_v4_1_all/` | 1.4M / 15 | CURRENT CBM individual fits + HBI pickles (AllChoices, FIT_ALL_TRIALS=True) |
| `recovery_output_v4_1_all/` | 2.8M / 49 | Model + parameter recovery for the same regime (confusion matrix, gen_M* dirs) |
| `cbm_output_v4_all/` | 148K / 15 | Stale earlier-run CBM fits |
| `rt_analysis/` | 24M / 72 | Paul's RT/overthinking pipeline: `RT_Analyses.ipynb` + section figures + robustness CSVs |
| `Paul/` | 22M / 62 | Older copy of `rt_analysis/` (subset — lacks the section-5 OT-halves figures and median-robustness CSV) |
| `Paul's addition/` | 0 / 0 | Empty |
| `ddm/` | 11M / 119 | DDM-era model writeups (74 PDFs: DDM101 guide, process explainer, all model-description PDFs) + `ddm_worry_figures/` (45) |
| `figma_svg_figures/` | 1.4M / 32 | Figma-ready SVG poster figures V1–V13 + previews + build scripts + README (provenance table) |
| `poster_figures_final/` | 2.7M / 14 | Final PNG poster figures D1–D6, M1–M2 + captions.md + build scripts |
| `Talk and poster/` | 47M / 152 | Conference decks: CPC26 poster versions, CPC talk versions, blueprints/spines, `Talk/`, `archive/`, `figures/` |
| `papers and resources/` | 45M / 39 | Reference PDFs (Gershman 2014, Wilson & Collins 2019, Piray 2025, Schiff 2026, Gershman textbook ch. 1–15) + `preperations and writing/` (choicefit_from_DDM_explainer.pdf/.tex + assets) |
| `V3_archive/` | 66M / 328 | Entire V3 codebase, data, fits, figures (read-only; template V4 was forked from). Contains `V3_id_mapping_PRIVATE_DO_NOT_SHARE.csv` |
| `V3_preregistered_analysis/` | 14M / 168 | Prior preregistration analysis package (OSF wn6ks, pilot N = 139) |
| `prereg_3_testdrives/` | 4.7M / 78 | V4-pilot (N≈11/20) test-run artifacts, sequestered |
| `pre_prereg_alignment_2026-05-27/` | 13M / 2 | Snapshot: notebook + `Paul/RT_Analyses.ipynb` as of 2026-05-27 |
| `_backups/` | 48M / 35 | Stale notebook backups + earlier-run outputs; nothing references them |
| `_tmp_slides/` | 420K / 5 | Temp slide JPGs (slide-09..13) |
| `adi_code_new_extracted/` | 21M / 139 | Extracted `adi_code_new.zip` (original task/analysis code drop) |
| `rl-analysis-guardrails/` | 20K / 2 | SKILL.md: pre-flight guardrails for any analysis on this project + references |
| `__pycache__/` | 4K / 1 | Python cache |

## Related folders OUTSIDE this root (siblings on Desktop/adipizanti)

| Path | What |
|---|---|
| `pauls_additions/study_2/` | CURRENT modeling work: choicefit + switch cost, hierarchical PyMC, mediation; all scripts/logs/CSVs/writeups |
| `pauls_additions/study_1/`, `pauls_additions/pilot_for_study_2_version1/` | Study 1 fits; earlier pilot fits |
| `poster/` | `CPC26-poster-adi_paul_comments.pptx` (latest poster + Paul's comments, 2026-07-05) |
| `presentations/` | `ICPC_26.pptx`, `ICPC_26_v2.pptx` |

---
## Source of truth and GitHub (added 2026-10-24)
This NAS folder is the **source of truth**. A GitHub repo
(`adipizanti/Modeling-cognitive-reappraisal-using-model-based-RL`) holds only the light files
(preregistrations, task code, anonymized exports, notebooks with outputs stripped, LOGBOOK,
CONTEXT briefing). Update it with `tools/sync_from_nas.ps1` from the repo clone.
Never put `PRIVATE_*`, `*.pkl` or `cbm_output*` in git. Keep the git clone outside this synced folder.
