# CONTEXT — Prereg 3: Anxiety, Model-Based Revaluation, and Overthinking

**Purpose of this file:** self-contained briefing for any analysis session that starts from this
repo alone (e.g., Claude working from a phone, without access to the full local project folder).
Read this before running anything. Last updated: 2026-07-09.

---

## 1. Project in one paragraph

Preregistered study (`PREREGISTRATION_V4.md`, this folder) testing whether anxiety — worry in
particular — relates to *overthinking* (OT) during model-based (MB) planning in a two-step
revaluation task. Participants (Prolific, online, task `task_v4.html`) learn a transition tree,
experience revaluation, and answer query trials; we classify each subject as a planner (MB) or
non-planner via a model-agnostic `mb_score` rule, confirm with hierarchical Bayesian model
comparison (Piray CBM/HBI over 11 RL models), and relate worry (PSWQ-8) and somatic anxiety
(MASQ-AA) to deliberation time, accuracy, and the OT index
`OT = z(delib_log) − z(logit(acc_canon))` (positive = overthinking). Headline claim (talk/poster):
**"Worry is model-based planning that doesn't know when to stop."**

Dataset tag: **v4_1** — N=380 recruited rows in the raw export, **N=277 COMPLETED subjects after
exclusions** (zig-zag + Knowledge Check), **159 planners / 118 non-planners** (authoritative split).

## 2. Data files in this folder (all ANONYMIZED)

All participant identifiers were replaced by `sub_001` … `sub_362` (consistent codes ACROSS all
files, so joins work). The Prolific-ID ↔ code mapping lives ONLY in the local project folder
(`PRIVATE_id_mapping_v4_1.csv`) and must never be committed here. Firebase `firestore_uid` values
were left as-is (random app IDs, not personally identifying).

| File | Rows | What it is |
|---|---|---|
| `experiment_results_v4_1_export.csv` | 380 | Raw wide export, one row per recruited subject (incl. incompletes). Trial-level columns: `SL_/VL_` learning trials, `Query_1_/Query_2_` query trials (12 per query), surveys, RTs. |
| `filtered_data_v4_1.csv` | 277 | Post-exclusion analysis sample written by notebook cell 1. Start here for most analyses. |
| `convergence_agnostic_vs_hbi_v4_1_all.csv` | 277 | Per-subject: `mb_score_F/T`, `mb_classif_agnostic`, HBI winning model, group, responsibilities. Source for the κ figure. |
| `hybrid_w_sensitivity_v4_1_all.csv` | 277 | Adds fitted `w` for hybrid winners; basis of the κ=0.933 w-sensitivity check. |
| `ddm_terfree_MB_recomputed.csv` | 159 | Planner-only EZ-DDM refit (Ter-free): pc, vrt, mrt, worry, drift v, boundary a. |
| `rt_analyses_per_subject.csv` | 277 | Per-subject RT/OT/accuracy/anxiety table. ⚠️ Its `mb_group` column carries an OLD 217/60 split — use `mb_classif_agnostic` from the convergence CSV as the split instead (see §4, issue 1). |
| `cbm_output_v4_1_all/` | — | Piray CBM `.pkl` fits for all 11 models + `hbi_choice.pkl` (HBI result). Load with `pickle`/`cbm` conventions. |

Also here: `LOGBOOK.md` (full day-by-day analysis log — the deep history), `PREREGISTRATION_V4.md`
(hypotheses H1–H3, exclusion rules, κ thresholds), `README.md` (project-folder readme; some paths
in it refer to the local folder, not this repo), `demographics_summary.md`, `task_v4.html` (the
experiment itself), and the two notebooks (§5).

## 3. Verified key results (recomputed & confirmed; safe to quote)

- **Classifier split (authoritative):** 159 MB / 118 non-MB of 277, from the prereg-aligned
  `mb_score` OR-rule (P(anti-MF choice) > 0.5 for either stimulus), notebook §1.
- **Convergent validity (prereg):** agnostic vs HBI winner via full 11-model group map:
  **κ = 0.764** (95% CI 0.69–0.84), 88.8% agreement (246/277), N=277. Above V3 pilot κ=0.71;
  far above the prereg's κ<0.5 reconsideration trigger. Continuous: Spearman(mb_score_max,
  P(MB family)) ρ=0.838. 30/31 disagreements are HBI-MB/agnostic-nonMB, driven by hybrid winners.
- **Hybrid-w sensitivity:** relabeling hybrid winners by fitted w>0.5 gives **κ = 0.933** (96.8%);
  the 29 MF-behaving hybrid winners have median w=0.27. Identity rule stays primary.
- **H2 (worry × OT in planners):** ρ ≈ +0.24 (one-sided p=.001); components: worry~delib ρ=+.23
  p=.004, worry~accuracy ρ=−.05 p=.52 → time-based, not error-based (the dissociation).
- **H1 (somatic × OT):** planners ρ=+.16 p=.0496 (knife-edge); non-planners ρ=+.22 p=.017 →
  somatic anxiety is GLOBAL, worry is planner-specific (worry in non-planners ρ=.12 n.s.).
- **Worry specificity:** worry×OT | somatic = 0.17 (p=.006 — survives); somatic×OT | worry
  vanishes. (⚠️ computed on the old split — redo on 159; direction expected to hold.)
- **H3:** planners deliberate longer than non-planners (Mann-Whitney one-sided), effect ≈ r=0.44
  (that 0.44 is r-family — Cohen's d ≈ 1.02 — don't call it d).
- **Motor-confound control:** worry~motor-baseline ρ=+.01 p=.94. Motor baseline is PER-SUBJECT
  (own SL_T1 + VL_T1 Step0 RTs, median 2.0 s); delib = query RT − own baseline, clip 10ms, log.
- **Rounds:** planners get faster (p<1e-21) AND more accurate (77%→88%, p<1e-9) in round 2;
  worry~delib survives in both rounds.
- **Task duration:** median 16.1 min, mean 19.1 min.
- **Sample comparison** (V3 pilot N=139 vs v4_1): MB share 48.2% → 57.4% (p=.09); trait worry
  identical; somatic elevated in S2 (p=.002) — threat induction hit state, not trait. Ordering
  caveat open (questionnaire vs induction).

## 4. Open issues — check before trusting derived stats

1. **Classifier discrepancy (TOP issue):** `rt_analyses_per_subject.csv::mb_group` is an old
   217/60 rule; the authoritative split is 159/118 (`mb_classif_agnostic`). Any group or partial
   correlation computed on `mb_group` must be redone on the 159 split. The planned fix: export one
   canonical per-subject table (mb_score, group, worry, somatic, OT) from the main notebook.
2. **DDM Ter vs boundary:** in the standard EZ-DDM worry loads on **non-decision time Ter
   (ρ=+.26, p=.001)**, not boundary. The poster's "boundary ρ=+.196" panel is a Ter-free refit
   (per-subject values only in local `ddm_worry_figures/` pkls, not here). The mediation figure
   (M2, 23% mediated via a) is boundary-based — parameterizations must be reconciled before the
   manuscript. Decision pending: keep Ter-free boundary story vs switch to data-faithful Ter story.
3. **Subject `sub_339`:** non-prereg Q1 offer grid + only ~3 trials/state (older task version
   slipped through); currently passes all filters. Candidate for an offer-grid exclusion.
4. **Notebook staleness:** some notebook cell *outputs* predate fixes (e.g., κ cells 39/48 show
   stale numbers; RT cell 10 output shows 217). The CODE is correct; re-run before quoting outputs.

## 5. Notebooks & how to analyze here

- **`Merged_V4_Analysis.ipynb`** — the main 4-section notebook: §1 Prep (load, exclusions, 159
  classifier, RT/OT prep) → §2 Main/Poster analyses (model-agnostic, no CBM needed) → §3 Modeling
  (CBM/HBI, κ, recovery, RT-LMM, DDM) → §4 Validations & sensitivity. §1+§2 run without heavy deps.
- **`Modelling_AllChoices_V4.ipynb`** — the original modeling notebook (49 cells); cell 1 has
  `DATA_FILE` / `DATASET_TAG` params; writes `filtered_data_{TAG}.csv` and all `fig_*_{TAG}_all.png`.
- Quick phone workflow: clone repo → work in this folder → `pip install pandas scipy matplotlib
  statsmodels` covers §1–§2; CBM/PyMC only needed to refit models (fits are already in
  `cbm_output_v4_1_all/`).
- **Guardrails:** analyses are written for the full sample — if a test run on few subjects
  crashes, that's diagnostic; report it, don't silently patch small-N edge cases. Never mix the
  two classifier splits. Column names: use `worry` (PSWQ-8) and `somatic_anxiety` (MASQ-AA);
  bare "anxiety" is banned.

## 6. Figures

- `figures/` — the ~30 result figures from the v4_1 run (`fig_*_v4_1_all.png`; `*_cbmconfirm.png`
  = H1/H2 re-run under CBM labels; `*_CORRECTED` κ figure is the current one).
- `poster_figures_final/` — CPC26 poster figures in the unified palette (gold #C77F16 = signal,
  slate #6E7F8C = null, ink #1C3040), with `captions.md` and the generating scripts
  (`make_poster_figures.py`, `poster_figstyle.py`). D1 κ, D2 H3, D3 dissociation, D4 worry×OT,
  D5 somatic, D6 non-planner control, M1 DDM, M2 mediation schematic.

## 7. Terminology

*Prior preregistration / prior pilot* = OSF wn6ks, V3 paradigm, N=139. *Current preregistration* =
`PREREGISTRATION_V4.md`, v4_1, N=277 — this study IS the preregistered replication of the pilot's
H1/H2. Future work = "the follow-up", not "replication". Poster: CPC26, poster A51.
