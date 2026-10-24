# Project Logbook — RL Modeling

This logbook tracks every working session on this project. Each entry records the date, what was done, what was decided, what files changed, and any open questions. Both the user (Sharp Lab) and Claude refer back to this file to anchor future work.

## How to use this logbook
- **New entry per session.** Append at the bottom; never overwrite past entries.
- **Format:** date heading, then short bullets under: *Context*, *Actions*, *Decisions*, *Files changed*, *Next steps / open questions*.
- **Reference points:** when you need to "go back to where we were on X date," cite the entry header.

---

## Project structure

```
Adi Pizanti - modeling data with RL/         # ROOT = current analysis (v4_1)
├── Modelling_AllChoices_V4.ipynb            # main analysis notebook (AUTHORITATIVE classifier: cell 4 → N_MB=159)
├── experiment_results_v4_1_export.csv       # current raw behavioural export (v4_1)
├── filtered_data_v4_1.csv                   # post-exclusion analysis frame
├── task_v4.html                             # V4 task implementation (reference)
├── PREREGISTRATION_V4.md                    # CURRENT preregistration (authoritative spec)
├── README.md                                # front-door doc + terminology table
├── LOGBOOK.md                               # this file
├── fig_*_v4_1_all.png                       # current-run figures (used in the talk)
├── cbm_output_v4_1_all/                     # CBM fits + HBI pickles (FIT_ALL_TRIALS=True)
├── recovery_output_v4_1_all/                # model & parameter recovery
├── rt_analysis/                             # Paul's RT/overthinking pipeline + rt_analyses_per_subject.csv
│                                            #   ⚠ per-subject table mb_group = 217/60 (OLD rule, NOT the 159/118 authoritative split)
├── Talk and poster/                         # conference deliverables
│   ├── Worry_as_model_based_planning.pptx   #   19-slide talk deck
│   ├── figures/                             #   talk-specific diagrams (task_structure, tree_learn/reval1/reval2)
│   └── README.md                            #   deck map + headline numbers + open issues
├── papers and resources/                    # background papers, Schiff teleprompter source
├── prereg_3_testdrives/                     # V4-pilot (N≈11/20) test-run artifacts, sequestered
├── _backups/                                # stale notebook .bak files + pre_prereg_alignment_2026-05-27/ + ~$ lock
├── V3_preregistered_analysis/               # PRIOR preregistration analysis package (V3 paradigm)
└── V3_archive/                              # all V3-era data, notebooks, fits, figures (read-only TEMPLATE for V4)
```

**Convention.** v4_1 figures saved at the workspace root as `fig_<name>_v4_1_all.png` (the V4 notebook sets `OUT_PREFIX = f"{DATASET_TAG}_{FILTER_SUFFIX}"` = `v4_1_all`). CBM/HBI outputs land in `cbm_output_v4_1_all/` and `recovery_output_v4_1_all/`. **Terminology (use everywhere):** *prior preregistration / prior pilot* = OSF `wn6ks`, V3 paradigm, N=139; *current preregistration* = `PREREGISTRATION_V4.md`, v4_1 sample, N=277. The current study is the pre-registered **replication** of the prior pilot; genuinely-future work is the **follow-up**.

---

## Sessions

### 2026-04-14 — Reset and reorganize
**Context.** Earlier modeling work (Apr 7–8) had drifted from theoretical best practices with extra models (conflict-model, full-model, modular .py refactor). User decided to revert to the original two-notebook setup: `rl_2model.ipynb` (MB+MF) and `rl_modeling.ipynb` (MB+MF+Hybrid with w).

**Actions.**
- Confirmed both notebooks were self-contained (no imports from the deleted `.py` modules).
- Deleted the Apr 7–8 additions: `analysis.py`, `data_utils.py`, `models.py`, `plotting.py`, `recovery.py`, `run_all.ipynb`, `__pycache__/`, `results/`, `figures/`, `docs/`.
- Created `outputs/` folder with `2model/` and `hybrid_model/` subfolders, each containing `figures/` and `tables/`.
- Moved and renamed all surviving output files into the new structure (renamed `model_comparison.png` → `hybrid_model_comparison.png` etc. so prefixes match consistently across both models).
- Created this logbook.

**Decisions.**
- Workspace organization: split outputs by **model first, then by type** (figures vs tables). Trade-off: slightly more nesting, but each analysis is self-contained which makes extraction for the final findings section easier.
- Filename convention: every output begins with the model prefix (`2model_` or `hybrid_`).

**Files changed.**
- Deleted: 5 `.py` files, `run_all.ipynb`, `__pycache__/`, `results/`, `figures/`, `docs/`.
- Moved + renamed: 8 figures and 1 CSV into `outputs/2model/`; 5 figures and 1 CSV into `outputs/hybrid_model/`.
- Created: `outputs/` tree, `LOGBOOK.md`.

**Next steps / open questions.**
- Re-run notebooks to confirm save paths still work (notebook code may still point at root-level filenames; will need to update save paths to `outputs/<model>/...` next session).
- Decide whether to add a `data/` folder for raw inputs once more datasets are introduced.

### 2026-04-23 — Consolidation, recovery benchmark, packaging for Paul

**Context.** Paul's primary corrected analysis was `Modelling_AllChoices.ipynb`:
target switched from `chose_mb` to raw `choice`; model registry refactored
(dropped M6/M8/M11-orig, added `m12_mb_mf_sep_stim`, `m11_sep_beta_w_reval`,
`m16_sep_beta_w_stim`). On top of that, `Modelling_AntiMF.ipynb` was produced
as a *robustness check*: the same pipeline restricted to anti-MF trials only —
i.e. the trials where MB and MF predictions disagree, which is the classical
diagnostic subset in two-step / revaluation literature. Running AntiMF in
parallel answers the reviewer question "does the all-trials conclusion depend
on including the non-diagnostic trials where MB and MF agree?" The two files
share ~95% of code but produced different HBI winners, which prompted today's
consolidation + formal recovery analysis.

**Difference spelled out.** The two notebooks differ on two points in the data
pipeline:
- *Filter:* `AllChoices` feeds CBM every query trial where `choice` is defined
  (N=2224); `AntiMF` restricts to trials where MB and MF disagree (N=1251,
  subset of the same 2224). The rest of the fitting code is identical.
- *`optimal` tie-break:* in the `correct` computation, a trial where
  `ev == offer` is ambiguous (EV of gambling literally equals the safe offer).
  `AllChoices` counts such ties as correct-if-gambled (`else 1`). `AntiMF`
  counts them as not-correct (`else 0`). This only affects Q2 Triangle when
  offer=10 — a tiny number of trials — and touches only the descriptive
  `correct` column, not the model fits.

**Actions.**
- Reviewed all five notebooks (`rl_2model`, `rl_modeling`, `Revaluation_Analysis_Paul`,
  `Modelling_AllChoices`, `Modelling_AntiMF`); documented the three generations of
  the analysis (plain MLE → CBM/HBI with `chose_mb` → CBM/HBI with raw `choice`).
- Merged `AllChoices` + `AntiMF` into a single `Modelling_AllChoices.ipynb` with a
  `FIT_ALL_TRIALS` switch near the top (cell 2). Seed fixed to 42. `CBM_DIR` now
  resolves to `cbm_output_{FILTER_SUFFIX}/` so the two configurations don't collide.
  Backup saved as `Modelling_AllChoices_preMERGE_backup.ipynb`.
- Added Section 9 — Model and Parameter Recovery. 5×5 confusion over
  `M2_MF_alpha / M3_MB / M5_MB_stim / M7_MB_reval / M9_w_stim`. 200 simulated
  subjects per generating model. Parameters sampled with replacement from the
  empirical per-subject CBM MAPs. Full CBM + HBI pipeline (no MLE shortcuts).
  Outputs land in `recovery_output_{FILTER_SUFFIX}/`.
- Ran full pipeline under both configurations. Reproduced the prior real-data
  HBI splits (True: M2=68, M7=54, M9=16, M3=1; False: M2=73, M3=57, M5=9) and
  produced recovery numbers for each.
- Prepared two frozen snapshots for archival/comparison:
  `Modelling_AllChoices_run_all.ipynb` (True), `Modelling_AllChoices_run_antimf.ipynb`
  (False). Renamed the `fig_*.png` files with `_all` / `_antimf` suffixes so both
  sets of figures coexist on disk.
- Recovered from a JSON truncation on disk (VS Code save hiccup at 13:59) via
  surgical repair + `nbformat` round-trip. All three notebooks now strict-JSON
  valid.

**Decisions.**
- Target variable is raw `choice`. Final.
- One canonical working file (`Modelling_AllChoices.ipynb`) edited by both Adi
  and Paul via email ping-pong. Each exchange includes a pair of frozen
  per-configuration snapshot files so the cell outputs from each run are
  preserved without risk of being overwritten by the other run.
- Recovery set is 5 models (M2, M3, M5, M7, M9) based on who wins subjects
  under either filter. Full 11-model recovery deferred.
- M9's weak recovery (29% under True, 20% under False) is nesting (M9 ⊃ M2 and
  M9 ⊃ M3), not a model defect. Any "M9-person" group claims need more trials
  or higher-contrast stimuli.

**Files changed.**
- Merged: `Modelling_AllChoices.ipynb` (42 cells; was 37).
- Added: `Modelling_AllChoices_preMERGE_backup.ipynb`,
  `Modelling_AllChoices_run_all.ipynb`, `Modelling_AllChoices_run_antimf.ipynb`.
- Renamed: 15 `fig_*.png` → `fig_*_all.png` (True run), 15 more as `fig_*_antimf.png` (False run).
- Created: `cbm_output_all/` (15 pickles), `recovery_output_all/` (confusion +
  param recovery CSV/PNG + 5 `gen_<model>/` subfolders with per-generator fits
  + HBI), and `recovery_output_antimf/` (same structure).
- `cbm_output_antimf/` already existed from Paul's earlier AntiMF run and is
  reused as cached fits for the False configuration.

**Key numbers.**

*FIT_ALL_TRIALS = True (primary):*
- HBI per-subject split: M2=68 MF, M3+M7+M9=71 MB (1+54+16).
- PXP winner: M2_MF_alpha (0.992).
- OT × Anxiety in MB: ρ = −0.365, p = 0.0019 (n=71). MF: n.s.
- Recovery confusion diagonal: M2=.98 / M3=.99 / M5=.47 / M7=.61 / M9=.29.
- Param recovery r: M2 β=.90 α_raw=.35 / M3 β=.82 / M5 β_f=.67 β_t=.80 /
  M7 β_q1=.86 β_q2=.59 / M9 β=.65 w_f=.79 w_t=.83.

*FIT_ALL_TRIALS = False (robustness):*
- HBI per-subject split: M2=73 MF, M3+M5=66 MB (57+9).
- OT × Anxiety in MB: ρ = −0.417, p = 0.0005 (n=66). MF: n.s.
- Recovery confusion diagonal: M2=.73 / M3=.63 / M5=.28 / M7=.45 / M9=.20.
  All diagonals drop noticeably vs True — fewer diagnostic trials = less
  discriminative power. M3 drops the most (.99 → .63), collapsing into M2.
- Param recovery r: M2 β=.89 α_raw=.56 / M3 β=.89 / M5 β_f=.88 β_t=.83 /
  M7 β_q1=.89 β_q2=.70 / M9 β=.70 w_f=.83 w_t=.81. Comparable or slightly
  better than True — when you know the right model, param identifiability
  is fine in both configurations.

**Next steps / open questions.**
1. Benchmark our recovery diagonals against 2–3 two-step / revaluation papers
   (especially M9 ≈ .29 under True — is that enough for our study design?).
2. Reappraisal-questionnaire × group analysis (ERQ-Reappraisal across MF vs MB).
3. Raise with Paul next sync: commit to a single `optimal` tie-break rule.
   Currently the merged notebook uses `else 1` (AllChoices convention); the
   original AntiMF used `else 0`. Affects only the descriptive `correct`
   column on Q2-Triangle offer=10 ties — a very small number of trials —
   but worth locking in one rule across both configurations.
4. Housekeeping we can do ourselves:
   - Apply uppercase `M<N>_<name>` naming convention across the registry.
   - Fix the `m12_mb_mf_sep_stim` copy-paste bug in cell 21
     (`w = params[0]` aliases w to β_f instead of defining a free parameter).
   - `plt.savefig(...)` calls made suffix-aware via `FIG` helper — done today,
     no more manual figure renaming needed for future runs.

**Fast-recovery method (the pickle-caching pattern).** The notebook passes `fname=` to every `individual_fit(...)` call and to `hbi_main(...)`. CBM's behaviour: if the file at `fname` exists, load it and skip refitting; otherwise fit and save. Combined with the `cbm_output_<suffix>/` and `recovery_output_<suffix>/` namespacing, this means a fresh checkout from `adi_code_new.zip` (archived 2026-05-14 to `V3_archive/`) takes **1–2 minutes** to rerun instead of ~1 hour. To force a refit: delete the relevant pickle. Recovery cache rebuild is ~30–60 min per filter configuration.

**Environment used for the V3 fits.**
- Python 3.13.3
- cbm installed 2026-04-23 from https://github.com/payampiray/cbm_python
- Caveat: cbm pickles fitted under 3.13 may fail to unpickle under 3.10/3.11/3.12. Fallback is painless — delete the offending pickle and the notebook refits it on next run. CSVs in `recovery_output_*/` are plain text and pose no compatibility risk.

**Reproducing the V3 run from cached pickles.**
1. From `V3_archive/adi_code_new.zip` (or `V3_archive/adi_code_new_extracted/adi_code/`), copy `cbm_output_*/` and `recovery_output_*/` next to the notebook you want to run.
2. Open `V3_archive/Modelling_AllChoices.ipynb`. Restart kernel. Run All. CBM loads from the cached pickles → total run time ~1–2 min.
3. To see the AntiMF numbers without flipping the toggle: open `Modelling_AllChoices_run_antimf.ipynb` — frozen snapshot with those outputs already in place.

### 2026-05-13 — Task V4 audit vs V3

**Context.** Task moved from V3 to V4. Three headline changes from the user: a new teleprompter / threat-induction phase, restructured query option grids, and decision-tree visuals in the revaluation briefings. Goal of the session was to enumerate every diff between `task_v3.html` (1570 lines) and `task_v4.html` (2140 lines), surface the design rationale behind each change, and decide which surfaced flags are real to-dos vs already-handled.

**Actions.**
- Full `diff` between `task_v3.html` and `task_v4.html`; categorized changes into: teleprompter / threat induction (new phase + CSS + functions), reval briefing & active phase (new `renderTreeSilhouette` helper, click-to-reveal replaced by single-press 15 s view), query phase (option grids restructured, MB-suboptimal silent penalty added), reward structure (afterReval2 T1 −20 → −60), infrastructure (live Firebase creds, real Prolific completion code, collection rename to `experiment_results_v4`).
- Worked through three rounds of clarification on MB model assumptions with the user; final definition recorded below.
- Pulled Schiff & Sharp 2026 PDF *and* the actual `teleprompter.js` source out of the uploaded `game_version1.zip`; confirmed V4 teleprompter is a near-direct port of Schiff's implementation (same intro copy, same recording indicator, same 9-comment chat list, same 8-user roster, same 4 s silence timeout, no camera in either).

**Decisions.**
- **MB model definition (final).** MB_EV at stage 1 is computed assuming: (i) step 1 deterministic, (ii) step-2 stochasticity 75/25 common/rare *within* M1L (T1↔T2) and M1R (T3↔T4), (iii) optimal second-stage action (MB picks the second-stage move with the higher expected terminal), (iv) ±5 stage rewards on Feather (M1L) / Triangle (M1R). Formula:
  - `MB_EV(Feather)  = +5 + max( 0.75·T1+0.25·T2, 0.75·T2+0.25·T1 )`
  - `MB_EV(Triangle) = −5 + max( 0.75·T3+0.25·T4, 0.75·T4+0.25·T3 )`
  - R1: (−15, +15) ✓ ; R2 with T1=−60: (−10, +10) ✓ — both file values reproduce cleanly under this model.
- **MF cached values (final).** MF holds the intermediate stage rewards experienced during VL: Feather=+5, Triangle=−5. Does not update across revaluations.
- **Discrimination payoff.** With the V4 grids and the above MF/MB thresholds, **18 of 24 query trials are MB/MF-discriminative** (Feather R1 4/6, Triangle R1 5/6, Feather R2 4/6, Triangle R2 5/6). Up from ~half in V3 and the central justification for restructuring the grids.
- **Penalty rule (confirmed already in code).** Penalize MB-suboptimal choices, consistent across VL free-choice trials (penalty when participant chose Triangle, the lower-EV path during VL since +5 > −5) and query trials (penalty when MB_EV < offered fixed value but participant picked journey, or vice versa). Both currently log silently into `SpeakingTime_Log`. Single rule, no fork between phases.
- **`SHOW_THREAT_INDUCTION` is a dev toggle**, not a between-subjects manipulation. Consent text mentions speaking task unconditionally.
- **Tree colour coding (T1 green / T4 dark red) is acceptable** as-is — not intentionally priming, but worth a sentence in the preregistration.
- **Teleprompter design is settled.** V4 = Schiff's port. No camera, chat sidebar is correct (the paper text "in front of a camera to a live audience" is not literally in Schiff's code — actual implementation is the chat panel V4 already mirrors).

**Files changed.** None. Audit-only session — no edits made to `task_v4.html` yet; surfaced fixes are deferred to next session.

**Next steps / open questions.**
1. **Magnitude fix (one-liner).** `THREAT_PENALTY_NEG_VISIT_SEC` is currently 8 s, should be 10 s to match `THREAT_PENALTY_SUBOPTIMAL_QUERY_SEC`. Change at `task_v4.html` line 549.
2. **Threat reminder pill text.** Current copy "Speaking time depends on your decisions" is too vague. Replace with something explicit, e.g. "Wrong decisions add speaking time" or "Suboptimal choices increase your speaking time".
3. **Teleprompter alignment with Schiff (cosmetic).** Two small divergences from Schiff's `teleprompter.js`:
   - V4 scrolls at fixed speed (30 px/s, total time scales with text length); Schiff uses fixed 25 s duration. Either revert to fixed duration or document the divergence.
   - V4 inserts a "Public Speaking Task Ahead" red-warning screen before Schiff's intro. Decide whether to keep it (extra threat reinforcement) or move that framing into the consent flow to match Schiff exactly.
   - Optional: copy Schiff's intro text byte-for-byte ("brief simulation" not "brief preview", "read" not "read aloud").
4. **Preregistration items to record.**
   - The MB model definition above (75/25 step-2 stochasticity + optimal second-stage action + ±5 stage rewards).
   - Tree icon/colour coding is not a deliberate prime but participants may pick up valence cues from green/red coding.
   - The earned-speaking-time penalty system (silent per-trial accumulation into `SpeakingTime_Log`) is an *adaptation* of Schiff's manipulation to the two-step paradigm, not a literal port. Schiff's mechanism ties speaking time to obstacles hit during navigation; V4 ties it to MB-suboptimal choices.
5. **Data analysis (next session).** Move on to analyzing `experiment_results_v4_export.csv`.

### 2026-05-13 — V4 analysis notebook scaffold + V3 archival

**Context.** Same-day follow-on to the V4 audit. Built the V4 analysis notebook based on the April-23 `Modelling_AllChoices.ipynb` template and tidied the workspace by moving all V3-era files into `V3_archive/`.

**Actions.**
- Schema check of `experiment_results_v4_export.csv`: N=20 COMPLETED, 491 columns, 12 query trials per query as expected, V4-specific columns present (`Final_Earned_Speaking_Time_Sec`, `SpeakingTime_Log`, `Teleprompter_*`, `Threat_Induction_RT`, `Query_*_Suboptimal`, `Query_*_MB_EV`).
- Built `Modelling_AllChoices_V4.ipynb` (44 cells) by forking the April-23 template:
  - Replaced cells 0–3 with V4-adapted versions: new header, V4 data load, V4 config with `OUT_PREFIX = f"v4_{FILTER_SUFFIX}"`, V4 data-prep cell (12 trials per query via `range(1, N_QUERY_TRIALS+1)`, `EV_MAP[(2,'Feather')] = -10` updated from V3's `0`, `id_vars` now carries `Final_Earned_Speaking_Time_Sec`, `Teleprompter_Attempts`, `Threat_Induction_RT`).
  - Inserted a new descriptives section (cells 4–5) covering: distribution of earned speaking time, earned-time × anxiety scatter, penalty breakdown by phase parsed from `SpeakingTime_Log` (eval'd via `ast.literal_eval`), per-subject suboptimal-choice counts from `Query_*_Suboptimal` columns.
  - Cells 6–43 (descriptives, LMMs, RT, overthinking, CBM/HBI, MF/MB collapse, mediation, sensitivity, recovery) preserved from the April-23 template. Output-path globals (`CBM_DIR`, `recovery_output_*`, `fig_*_{FILTER_SUFFIX}.png`) rewritten to use `OUT_PREFIX` so V4 outputs don't collide with the archived V3 ones.
  - All cell outputs cleared.
- Validated cells 1–5 on the V4 export: N=20, 480 trial-level obs, 360 anti-MF trials (75% — matches the predicted 18/24 discriminative-trial share from yesterday's audit), 224 silent penalty events (VL=16, Q1=101, Q2=107), per-subject suboptimal count mean=10.4/24.
- Moved into `V3_archive/`: `task_v3.html`, `experiment_results_v3_export.csv`, `filtered_data.csv`, 6 V3-era notebooks (`Modelling_AllChoices.ipynb` and its variants, `Modelling_AntiMF.ipynb`, `Revaluation_Analysis_Paul.ipynb`, `rl_2model.ipynb`, `rl_modeling.ipynb`), all 30 `fig_*_{all,antimf}.png`, and the `cbm_output_*`, `recovery_output_*`, `outputs/` directories.

**Decisions.**
- **V4 outputs get a `v4_` prefix on all output paths.** `cbm_output_v4_all/`, `recovery_output_v4_all/`, `fig_v4_all_*.png`. This keeps the V3 archive frozen as a reference and means rerunning the V4 notebook won't touch any V3 artifacts.
- **April-23 `Modelling_AllChoices.ipynb` stays in `V3_archive/` as the canonical V3 analysis** and remains the template that future V4 analyses fork from. If big changes to the pipeline are needed, edit `Modelling_AllChoices_V4.ipynb` rather than the archived V3 file.
- **Modelling pipeline (CBM/HBI) kept identical to April 23.** The model registry, MAP fitting via Laplace, BMS, HBI, recovery — all copied unchanged. The only modelling-side adjustment for V4 is the implicit change in `EV_MAP[(2,'Feather')]`, which propagates through `trial_df['ev']` automatically.
- **N=20 is too small for the inferential pieces.** Notebook keeps the full pipeline but treat any modelling output from this export as a smoke test, not a result. Header carries a warning to that effect.

**Files changed.**
- Created: `Modelling_AllChoices_V4.ipynb` (213 KB, 44 cells).
- Created: `V3_archive/` directory; moved 6 notebooks, 3 CSV/HTML files, 30 figures, and 5 output subdirectories into it.
- Updated: LOGBOOK Project structure section to reflect new layout.

**Next steps / open questions.**
1. Run the V4 notebook end-to-end once `cbm` is installed in the analysis environment. Confirm the modelling section completes without schema errors despite N=20.
2. Once more participants are in, re-export and rerun. The descriptives section is already useful at N=20; CBM/HBI numbers will only stabilize at N≥50ish per the recovery diagonals in the April-23 logbook.
3. Cross-check: does the V4 `Query_*_Suboptimal` column (computed in the task at trial time) agree with the notebook's `correct` computation (computed from `EV_MAP`)? Both should give the same answer per trial; a mismatch would indicate a bug in either the task's MB_EV table or the notebook's EV_MAP. Worth adding as a sanity-check cell.
4. Consider adding a V4-specific anti-MF descriptive: with 18/24 trials discriminative by design, the per-query MB choice rate is a more direct readout in V4 than it was in V3. Could be a clean new figure.

### 2026-05-14 — V4 first end-to-end analysis run (N=20 → 16)

**Context.** Ran `Modelling_AllChoices_V4.ipynb` end-to-end for the first time on the current export. Folded the V3 `Generate_All_Files.ipynb` filtering directly into cell 1 of the V4 notebook (zig-zag inconsistency ≥ 2.0 + `Knowledge_Check_Accuracy > 0.25`; dropped the V3 `dropna()` step which would have killed every V4 subject because `Teleprompter_Silence_Triggered` and `total_time_minutes` are expected-NaN columns). One source of truth: `experiment_results_v4_export.csv` → notebook, no intermediate CSVs. Old leftover `_raw = pd.read_csv("filtered_data.csv")` in cell 34 (motor baseline) replaced with `df` directly.

**Filtering outcome.** 20 COMPLETED → 16 retained (2 zig-zag, 2 knowledge check). 480 trial-level observations, 360 anti-MF (= 18 × 20, the by-design discriminative count from the V4 grid construction; see 2026-05-13 audit entry).

**Modelling regime used in this run: AllChoices only** (`FIT_ALL_TRIALS=True`). All CBM/HBI numbers below are from fits on the full 24-trial-per-subject set. The AntiMF regime (`FIT_ALL_TRIALS=False`, fit on the 18 discriminative trials only) has not been run for V4 yet; April-23 ran both side-by-side as a robustness check and that comparison still needs to be done for V4 once N grows.

**Fast-recovery operational for V4.** The V4 notebook inherited the April-23 pickle-caching pattern: every `individual_fit(...)` and `hbi_main(...)` call passes `fname=` so refits are skipped when the pickle exists. Today's run populated `cbm_output_v4_all/` (15 pkl: 11 choice + 2 CT + 2 HBI) and `recovery_output_v4_all/` (5 generator subdirs + confusion + param-recovery CSV/PNG). Drop these next to the notebook on any machine with Python 3.13 + cbm to get a sub-minute rerun. AntiMF run will populate `cbm_output_v4_antimf/` and `recovery_output_v4_antimf/` analogously.

**Threat-induction sanity (V4-only).** Earned speaking time mean 140 s (range 30–218, cap 300). 19/20 subjects accrued penalty time. Penalty events concentrate in queries (VL=16, Q1=101, Q2=107) — manipulation lands where it's designed to. Suboptimal MB choices per subject: mean 10.4 / 24 (43%), range 0–18.

**Key descriptive results.**
- Accuracy (chose optimally given MB EV):
  - Q1 Feather 55.8% / Q1 Triangle 60.0%
  - Q2 Feather **43.3% (below chance)** / Q2 Triangle 67.5%
- Ratings track revaluation but under-shoot on Feather Q2:
  - Feather: post-MF +4.5 → post-Reval1 −4.0 → post-Reval2 **−2.3** (MB EV says −10; partial revaluation)
  - Triangle: −1.0 → +5.5 → +5.3 (matches MB EV +10 cleanly)
- LMM `correct ~ abs_ev_diff + is_triangle + trial_total`: large stimulus effect `is_triangle β=+2.08, p<.001`; difficulty `abs_ev_diff β=+0.30, p<.001`; no trial-position drift.
- Anti-MF LMM `chose_mb ~ query + abs_ev_diff + is_triangle`: same stimulus asymmetry on the discriminative subset (`β=+2.46, p<.001`); no query effect.

**Modelling (CBM/HBI, all 11 choice models + 2 CT models fitted, 6+ HBI iterations).**
- BMS PXP top three: **M9_w_stim (0.231) > M5_MB_stim (0.112) ≈ M2_MF_alpha (0.109)**. Bayes Omnibus Risk = 0.72 (expected high at N=20).
- All three top models carry a **per-stimulus** parameter — `w_stim` (M9), `β_stim` (M5), or per-stimulus MF scaling (variant). The data is rejecting whole-subject MB-vs-MF in favor of within-subject Feather-vs-Triangle differentiation.
- HBI per-subject collapse: **10 MB (M3+M7+M9), 7 M5_MB_stim, 3 M1_MF, 0 pure M2_MF.** Compare V3 April-23: 68 MF vs 71 MB. V4 sample skews much more MB-like.
- HBI confidence: mean max responsibility 0.917 (SD 0.10); 17/20 subjects above 0.8. Assignments are decisive despite small N.
- CT models (RT-aware): CT_M9 wins over CT_M3 by BIC, 11 vs 9 subjects.

**Central finding.** Feather-Triangle asymmetry within subjects. Even subjects HBI labels MB act MF-ish on Feather: P(chose_mb) on anti-MF trials = **0.10 on Feather vs 0.45 on Triangle**. Q2 Feather is the cleanest novel result vs V3 — the T1=−60 change exposed a failure of MB revaluation on the negative-valence path that V3's milder Q2 EVs (Feather=0) wouldn't have shown.

**PPC notes.** Choice PPC tracks the data well on Difficulty and Stimulus splits; misses on Query (real Q2 P(MB)=0.696 vs sim 0.616) — possible learning/practice effect across the two queries not captured by the static choice models. RT PPC: real Q1 RT=3777 ms vs sim 3130; real Q2 RT=2539 vs sim 3079 — same query-direction miss, suggesting participants speed up on Q2 in a way the cost-of-time models don't reproduce.

**Bug fixes during the run.**
- Cell 35 (overthinking correlations per model group) raised `pearsonr length < 2` when one group ended up with ≤1 valid (anxiety, ot) pair. Guarded with `g.dropna(...)` + `if len(g) < 2: continue`.
- Cell 37 (MC bootstrap boxplot) raised `positions length != stats length` when no group had ≥10 valid MC samples. Guarded with `if len(vals) == 0: render insufficient-data text` instead of crashing.
- Cells 35/36/37 also got a top-of-cell dependency check that raises a clear `RuntimeError` if `subj` (built in the RT-descriptives cell) is missing, instead of a `NameError` that misleads about the actual cause.
- Also encountered a VS Code save-truncation on the notebook mid-image-data while it was being executed (same hazard logged on Apr 23). Repaired by surgical JSON truncation + re-merge of the salvaged cell outputs. Mitigation going forward: prefer `jupyter nbconvert --execute --inplace` over VS Code Run-All so the save isn't competing with the kernel's output stream.

**Files changed.**
- Updated: `Modelling_AllChoices_V4.ipynb` (filtering folded into cell 1; cell 34 motor-baseline now reads from `df`; cells 35/36/37 guarded; cell 5 figure-naming made consistent with the rest of the notebook).
- Created (this run's outputs): `cbm_output_v4_all/` (11 model pickles + HBI), `recovery_output_v4_all/`, 11 `fig_*_v4_all.png` figures at workspace root.
- Removed: `Modelling_AllChoices_V4.ipynb.broken` (truncation-repair leftover), `fig_v4_all_earned_time.png` (orphan from old naming).

**Next steps / open questions.**
1. With N=20 the modelling is a smoke-test. Re-export and rerun once N is meaningfully larger; expect HBI assignments to shift and Bayes Omnibus Risk to fall as model frequencies stabilize.
1b. Run the **AntiMF regime** (`FIT_ALL_TRIALS=False`) in addition to AllChoices, mirroring April-23's robustness-check pattern. The April-23 entry shows that under V3 the two regimes produced different HBI winners (M2/M3/M7/M9 split vs M2/M3/M5 split) — worth seeing whether V4's per-stimulus winners (M9/M5) survive when the 6 catch trials are stripped out.

### 2026-05-14 (later) — V4 task tweak: symmetric afterReval2

**Change.** `task_v4.html` line 387, `afterReval2`:
- Old: `{ T1: -60, T2: 0,   T3:  0, T4: +20 }`
- New: `{ T1: -15, T2: -15, T3: +15, T4: +15 }`

**Why.** Make both terminals within each M1 state equal. Removes the within-state step-2 discrimination requirement — under the new design, MB doesn't need to figure out which step-2 action is the better one or trust the 75/25 transition for that decision. The task collapses to "stage-1 choice + transition knowledge" rather than "stage-1 choice + stage-2 choice within the right route". Deliberate simplification.

**Why no other code changes needed.** Under the established MB model (75/25 step-2, optimal second-stage action, ±5 stage rewards):
- New Feather: `+5 + max(0.75·(−15)+0.25·(−15), 0.75·(−15)+0.25·(−15)) = +5 + (−15) = −10`
- New Triangle: `−5 + max(0.75·15+0.25·15, …) = −5 + 15 = +10`
- **Identical** to the old MB_EVs (−10 / +10). So `task_v4.html`'s `MB_EV` table (lines 552–555) stays as-is. The notebook's `EV_MAP[(2, ...)]` stays as-is. Query option grids stay valid. Suboptimal-flag classification stays identical.

**Implication for the existing N=20 export.** That data was collected against the *old* afterReval2 (T1=−60 …). The MB_EVs participants are scored against are the same (−10 / +10), so accuracy/anti-MF/CBM/HBI numbers from the 2026-05-14 run remain valid. What changes is the on-screen reveal in Section 9C: future participants see −15/−15/+15/+15 in the tree-silhouette reveal instead of the asymmetric set. Worth being aware of when mixing pre- and post-edit subjects in the same analysis.

**Worth considering:** bump the task version to `V4.1` (page title, Firestore collection name, completion URL code) so that the analysis can split subjects by which afterReval2 they saw. Not done in this commit — flagged as an open question.

**Files changed.** `task_v4.html` (one line). No notebook change.
2. The per-stimulus story is consistent across descriptive accuracy, anti-MF rate, ratings, and BMS winners. If it survives a larger sample, it becomes the V4 headline: people don't fail at revaluation uniformly — they fail on the negative-valence path specifically.
3. Why Feather resistance to revaluation? Two candidate explanations to test once N grows: (a) cached negative MF value (Feather=+5 during VL) is harder to overwrite than the cached positive Triangle=−5 — i.e. asymmetric MF-MB competition; or (b) participants apply a floor / loss-aversion clamp at 0 for Feather (won't accept the path can be worse than what they previously experienced). Distinguishable by looking at the offer values where Feather Q2 errors cluster.
4. Query-effect miss in both choice PPC and RT PPC suggests a learning or fatigue dynamic across the two queries that none of the current 11 models capture. Worth a small "test model": same as M9 but with a per-query `w` shift, or a learning-rate parameter on cached values across the revaluation interval.
5. Anxiety × overthinking: at N=20 the per-group correlations were largely skipped by the n<2 guard. Re-evaluate at N≥50.

### 2026-05-20 — V4.1 preregistration drafted; query option grids finalised (Option B)

**Context.** Drafted `PREREGISTRATION_V4.md` as an OSF Open-Ended Registration, framed as a directional replication of the OT × somatic-anxiety effect from the V3 pilot (N=139). Task bumped to V4.1 (Firestore collection renamed `experiment_results_v4.1`) and query option grids redesigned to match |EV diffs| across the Feather and Triangle Middle states. Prior prereg: osf.io/wn6ks/.

**Actions.**
- Traced the V3 central finding: April-23 logbook's "OT × Anxiety ρ=−0.365" used `Survey_ANXIETY_2_Total_Score` (somatic, not worry). With the model-agnostic classifier from `Paul/RT_Analyses.ipynb`, 82/139 (59%) were MB. Within that subgroup: somatic × OT ρ=+0.359 (one-tailed p=.0005); worry × OT ρ=+0.205 (one-tailed p=.03). Sign flipped to Paul's RT_Analyses convention (positive = slow AND inaccurate).
- Identified the task's "Physiological Anxiety Checklist" as the MASQ-AA short form (Watson 1995 / Wardenaar 2010), 10 items; only adaptation is "in general" timeframe wording. Clarified PSWQ-8 vs. the mislabelled STAI-T in the prior prereg.
- Wrote prereg end-to-end. Three one-sided α=.05 hypotheses, no hierarchy: H1 somatic × OT in MB; H2 worry × OT in MB; H3 MB > non-MB on mean log-deliberation RT.
- Powered for the smaller (worry) effect: ρ=.205, one-sided α=.05, 90% power → N_MB ≈ 200 (G*Power 3.1). At 59% MB rate + 10% attrition → Prolific target = 377.
- Folded operational definitions (motor baseline, `delib_log_i`, `acc_canon`, OT, `mb_score`) into the Variables section so reviewers don't need the notebook.
- Iterated query option grids; settled on Option B: 6 offers per state per query, Triangle = sign-flipped mirror of Feather, 5 anti-MF discriminative + 1 low-extreme catch (±20) per cell. Committed Q1 Feather=[−20,−10,−7,−3,0,+3] / Triangle mirrored; Q2 Feather=[−20,−7,−4,−1,+2,+4] / Triangle mirrored. MB EVs unchanged at ∓15 / ∓10.
- Reviewed Firestore rules for `experiment_results_v4.1`: create/update only if `request.auth.uid == docId`; read/list/delete denied to participants. Flagged that F12 jumps still pass these rules — debug testing should use a separate collection.

**Decisions.**
- Convergent-validity check (model-agnostic vs HBI; V3 was κ=0.71) added as a manipulation check, not a hypothesis. κ<0.5 in new sample → methodological reconsideration before confirmatory inference.
- No multiple-comparison correction across H1/H2/H3 (conceptually distinct tests). No stopping rule; recruitment runs to 377. No primary/secondary hypothesis hierarchy.
- Prereg is authoritative; any notebook/prereg divergence is flagged in the manuscript with prereg winning.
- N=20 V4 pilot does not match V4.1 stimuli (asymmetric Reval-2 + asymmetric Triangle + +6 catch). Exploratory only; no pooling.

**Files changed.**
- Created: `PREREGISTRATION_V4.md` (~2,400 words).
- Modified: `task_v4.html` query option grids (lines 531–538) + Firestore collection rename.
- Not modified: `Modelling_AllChoices_V4.ipynb` (pipeline updates deferred until V4.1 data lands).

**Next steps / open questions.**
1. When V4.1 data arrives: update `DATA_FILE` and `OUT_PREFIX = v4_1_<suffix>`; pin V4 pilot outputs to existing `cbm_output_v4_all/` so V4.1 doesn't overwrite.
2. Confirm `finishAll()` sets `status = 'COMPLETED'` before write (affects the notebook's COMPLETED-only filter).
3. Consider incremental Firestore saves at phase boundaries + try/catch+retry on the final write (mid-task dropouts currently produce zero data).
4. Confirm OSF submission and IRB before 2026-05-19 data-collection start.

### 2026-05-24 — V3 reviewer bundle: anonymized GitHub-ready archive

**Context.** User wanted a safe copy of `V3_archive/` to push to GitHub for external reviewers. Original `V3_archive` must remain untouched. Audit of the archive found extensive participant PII (Prolific IDs, Firebase Auth UIDs, `subject_id`s for 151 participants) in CSVs and notebook outputs; no real Firebase API keys (placeholder strings only); researcher names appeared only in the task consent form and in personal log files.

**Actions.**
- Audited a working copy for: Firebase API keys (none — only `PASTE_YOUR_API_KEY_HERE` placeholders in `task_v3.html`), .env/.pem/service-account JSON (none), Prolific PIDs / Firebase UIDs / `subject_id`s (151 each in `experiment_results_v3_export.csv` and `filtered_data.csv`; 137 each in `outputs/2model/tables/2model_results.csv` and `outputs/hybrid_model/tables/hybrid_model_results.csv`; thousands of occurrences across cached cell outputs in 13 notebooks).
- Verified `.pkl` CBM artifacts and HBI logs contain no IDs (grep against ID list returned 0 hits).
- Built a single anonymization mapping: every Prolific PID, Firebase UID, and `subject_id` → a single anonymous code `P001`..`P151`. Stored privately at `V3_archive/V3_id_mapping_PRIVATE_DO_NOT_SHARE.csv` (302 rows).
- Created `V3_preregistered_analysis/`: 4 analysis notebooks (cleared outputs), `PREREGISTRATION.md`, `task/task_v3.html`, `figures/` (30 PNGs), `outputs/` (anonymized model-fit tables), `cbm_output_{all,antimf}/`, `recovery_output_{all,antimf}/`, `filtered_data.csv` (anonymized), `README.md`.
- Anonymized all four CSVs; cleared outputs + execution counts on all four notebooks via direct JSON manipulation (no jupyter available in sandbox).
- Replaced `task_v3.html` consent line "researchers at Bar-Ilan University: Adi Pizanti and Dr. Paul Sharp" → "researchers at Bar-Ilan University".
- Final scan against the 302 raw IDs: 0 leaks. Case-insensitive `\bpaul\b|\badi\b`: 0 hits. `AIza…` / `firebaseio.com` / `firebasedatabase.app`: 0 hits.
- Verified original `V3_archive`: 324 files / 67,560,812 bytes (identical to pre-session). Deleted intermediate `V3_archive_github_copy/` after confirming the clean folder was complete.

**Decisions.**
- Folder name `V3_preregistered_analysis` (reflects the Feb 3 2026 OSF preregistration that anchors the included analysis).
- Notebooks kept: `Modelling_AllChoices_run_all.ipynb` and `Modelling_AllChoices_run_antimf.ipynb` (the two canonical robustness-pair runs that produced the `_all` / `_antimf` figures); `rl_2model.ipynb` and `rl_modeling.ipynb` (distinct earlier analyses kept as reference implementations).
- Notebooks dropped: `Modelling_AllChoices.ipynb` (older template), `Modelling_AllChoices_preMERGE_backup.ipynb` (backup), `Modelling_AntiMF.ipynb` (superseded by `_run_antimf`), `Revaluation_Analysis_Paul.ipynb` (duplicate of AllChoices), plus all duplicates inside `adi_code_new_extracted/adi_code/` and the `adi_code_new.zip` itself.
- Personal logs dropped: `LOGBOOK.md`, `2026-04-23 log - adi.txt`, `2026-04-26 log - paul.txt`, the entire `Paul/` folder, and the `adi_code_new_extracted/` tree.
- Data files: kept only `filtered_data.csv` (the cleaned analysis dataset). Dropped `experiment_results_v3_export.csv` (raw export carries many semi-identifying behavioral columns not needed for review).
- Anonymization scheme: a single `P###` code replaces all three identifier columns (`subject_id`, `firebase_uid`, `prolific_id`) per participant. Cleaner for reviewers; preserves linkage across files.
- `task_v3.html` kept (placeholder Firebase config is fine, and the task is reference-useful for reviewers).

**Files changed.**
- Created: `V3_preregistered_analysis/` (168 files, 7.4 MB) — README, PREREGISTRATION, 4 cleared notebooks, anonymized `filtered_data.csv`, `outputs/2model/tables/2model_results.csv`, `outputs/hybrid_model/tables/hybrid_model_results.csv`, `figures/` (30 PNGs), `cbm_output_{all,antimf}/`, `recovery_output_{all,antimf}/`, `task/task_v3.html`.
- Created: `V3_archive/V3_id_mapping_PRIVATE_DO_NOT_SHARE.csv` (302 rows, the raw-ID ↔ anonymous-code mapping).
- Deleted: `V3_archive_github_copy/` (intermediate working folder).
- Not modified: `V3_archive/` (324 files / 67,560,812 bytes verified identical to pre-session).

**Next steps / open questions.**
1. Push `V3_preregistered_analysis/` as a GitHub repo for external reviewers. Add a `.gitignore` rule excluding any `*PRIVATE*` filename pattern as a belt-and-suspenders guard.
2. Never commit `V3_id_mapping_PRIVATE_DO_NOT_SHARE.csv`. It lives in `V3_archive/`, which is not shared.
3. When V4.1 confirmatory analyses are finalized, mirror this anonymization-and-bundle process for the V4.1 share (same `P###` scheme, fresh mapping file kept private).
4. If reviewers ask for the raw export rather than `filtered_data.csv`, regenerate an anonymized version of `experiment_results_v3_export.csv` using the existing mapping rather than re-deriving IDs.

### 2026-05-27 — V4.1 full-sample export landed (N=362 COMPLETED); notebook parameterised, H2 cell added, data audited

**Context.** The V4.1 full-sample export arrived (1.26 MB, 380 rows / 362 COMPLETED). Session covered: archiving the V4 pilot artifacts, parameterising the notebook so dataset swaps don't require multi-cell edits, full data audit against the pipeline's actual reads, correcting an earlier mis-report about which survey columns map to H1 vs H2, additively wiring an H2 (Worry × OT) analysis cell, and investigating one behaviorally-suspect participant. The full v4_1 analysis run is executing as of this entry; no folder modifications during the run.

**Actions.**
- Reorganised the project root: created `prereg_3_testdrives/` and moved the V4-pilot test-run artifacts into it — 3 old CSV exports (`_v4_export.csv`, `_v4_export-N1.csv`, `_v4_export_N20.csv`), 12 `fig_*_v4_all.png` figures, and (on second pass) the `cbm_output_v4_all/` and `recovery_output_v4_all/` fit/recovery folders. Root now holds only project-level docs + active V4.1 data + the notebook.
- Parameterised `Modelling_AllChoices_V4.ipynb` cell 1: introduced `DATA_FILE = 'experiment_results_v4_1_export.csv'` and `DATASET_TAG = 'v4_1'` as the only two knobs needed to swap datasets. Cell 2 now derives `OUT_PREFIX = f"{DATASET_TAG}_{FILTER_SUFFIX}"` so v4_1 outputs land in `cbm_output_v4_1_all/`, `recovery_output_v4_1_all/`, `fig_*_v4_1_all.png` — no collision with the archived V4-pilot artifacts.
- Diagnosed and resolved a filename hiccup: the new export landed as `experiment_results_v4_1_exporא.csv` — Hebrew-layout typo where the final `t` came out as `א`. Renamed to canonical filename; size 1,258,284 bytes, modified May 26 20:57, 380 raw rows.
- Briefly added small-N polyfit guards to cells 35/36 to absorb a crash on the N=11 test export, then reverted on user's instruction. Confirmed convention: crashes on test-size data are diagnostic for the wiring; the analyses themselves are written for the full sample and should not be guarded against small-N edge cases.
- Full data audit on the new export. Funnel: 380 raw → 18 fully-empty placeholder rows stripped (status=NaN, 0 non-null cells) → 362 COMPLETED → 30 KCA fails (KCA ≤ 0.25) + 58 zig-zag fails (≥ 2.0), 3 overlap → final N = 277 for modelling. Subject IDs clean: 362 unique, zero duplicates, zero missing; `prolific_id` populated on every row (firestore_uid fallback never triggers). Trial-level coverage: 24 query trials per subject across T1..T12 × Q1,Q2 (276/277 full, one half-completer); 64 SL motor-baseline RTs fully populated for all 277; threat-induction fields all present.
- Identified the survey labelling correctly: `Survey_ANXIETY_1` is the 8-item PSWQ trait Worry (the H2 measure), `Survey_ANXIETY_2` is the 10-item MASQ-AA Physiological Anxiety (H1). The two are different instruments — not pre/post timepoints of one scale — corroborated by differing item counts (8 vs 10) and a modest pre→post correlation (r=+0.52). Corrected an earlier mis-statement on my part that H2 was untestable from this CSV alone.
- Confirmed `N_QUERY_TRIALS = 12` in cell 3 matches the deployed task. Verified per-(query, state) offer sets exactly match `task_v4.html`'s `queryOptionsFeather` and `queryOptionsTriangle` in this project folder, in all four cells. A spurious "7th offer per state" reported earlier in the session was traced to me pooling singleton trials from the half-completer — the design is 6 offers per (query, state), and every full subject saw exactly 6.
- Added new H2 cell at notebook position 37, additively (no modifications to any existing cell, verified byte-for-byte against the pre-edit backup). The cell mirrors the simple OT × Anxiety analysis from cell 35 but substitutes `Anxiety_pre` (PSWQ) as the predictor, reports All / MF / MB panels with MB tagged "← H2", and uses a one-sided positive Spearman per prereg. Saves to `fig_h2_worry_ot_{OUT_PREFIX}.png`. Cell count 44 → 45.
- Investigated participant `6a10f7620612b4eb8ab0b410`: only 6/12 query trials completed in each phase, all 12 query choices = 1 (always chose state), narrow query RT IQR of 682 ms, exact 20/20 + 32/32 splits in VL/SL motor trials, 30s of speaking (sample median 150s), teleprompter-silence warning triggered 13 times (sample max otherwise = 9), and a partially-contaminated Q1 offer set (Q2 offer values bled into the Q1 trials). KCA = 1.0, zig-zag = 0 — passed both prereg filters. Profile consistent with a low-effort responder / bot that happened to ace the multiple-choice knowledge check.
- Built an exploratory multi-signal bot-detection diagnostic (6 sample-relative flags: uniform query choice; ~50% accuracy on anti-MF discriminative trials with binomial p>0.3; query RT IQR in bottom 5%; silence-triggered in top 5%; speaking time at the 30s floor; KCA fail). Saved per-subject diagnostic CSV `bot_detection_report.csv` (362 rows). Known-suspect subject tripped 4/6 flags; one other ≥3-flag subject was not already caught by the prereg filters. User said "let it go" — no further iteration.
- Triggered the full v4_1 notebook run on the parameterised pipeline. ETA ≈ 3–8 hours wall-clock, dominated by the model-recovery section.

**Decisions.**
- `prereg_3_testdrives/` is the canonical home for all V4-pilot (N=11/20) artifacts. V4 pilot is not deleted, just sequestered so V4.1 outputs land in fresh directories and don't overwrite the pilot reference run.
- Notebook stays the single source of truth — H2 is added as a new cell, not via modification of the existing OT × Anxiety cells. Existing H1 analyses unchanged. Cells 35/36 explicitly NOT guarded for small-N (per prior decision: test-run crashes are diagnostic).
- Bot detection is exploratory only. It is not added to the notebook and not used as an exclusion criterion — that would be a prereg deviation. If used downstream it should be reported as a sensitivity analysis. The known-suspect subject stays in the prereg-defined sample.
- `anxiety_pilot_scores.xlsx` (60-row id → high/low label spreadsheet) is no longer in the project. Exhaustive grep across every `.ipynb`, `.py`, `.md`, `.txt`, `.r`/`.R` file in the tree found zero references; the file was a manual-reference list never loaded by code, so removal has no analytical impact.
- The screenshot showing `±6` as the last offer per cell is from a different code version than the deployed `task_v4.html` in this project. The deployed file has `±3` (Q1) and `±4` (Q2) and matches the data exactly. No design drift in the live task.

**Files changed.**
- Created: `prereg_3_testdrives/` folder containing the V4-pilot test-run artifacts (3 CSV exports + 12 `fig_*_v4_all.png` + `cbm_output_v4_all/` + `recovery_output_v4_all/`).
- Modified: `Modelling_AllChoices_V4.ipynb` — cell 1 (DATA_FILE / DATASET_TAG parameterisation), cell 2 (OUT_PREFIX uses DATASET_TAG), new cell inserted at position 37 (H2 — Worry × OT). Cell count 44 → 45.
- Created: 3 sequential `Modelling_AllChoices_V4.ipynb.bak_*` backups in the root (`.bak_pre_v4_1`, `.bak_pre_polyfit_guard`, `.bak_pre_h2_cell`) marking each edit boundary. After the polyfit revert, only `.bak_pre_h2_cell` carries a distinct pre-edit state; the other two are byte-identical to the current notebook.
- Created: `bot_detection_report.csv` at the root (362 rows × ~25 cols, per-subject diagnostic flags + raw signals).
- Renamed: `experiment_results_v4_1_exporא.csv` → `experiment_results_v4_1_export.csv`.
- Removed (by user, outside this session): `anxiety_pilot_scores.xlsx`. No code referenced it.
- Not modified: `README.md`, `LOGBOOK.md`, `PREREGISTRATION_V4.md`, `task_v4.html`, the anxiety/ERQ raw items, `V3_archive/`, `V3_preregistered_analysis/`, `Paul/`, `papers and resources/`.

**Next steps / open questions.**
1. The v4_1 notebook run is executing now (started 27.5.2026); ETA roughly 3–8 hours wall-clock, dominated by the model-recovery section. When it finishes: confirm `OUT_PREFIX` correctly routed outputs into `cbm_output_v4_1_all/` and `recovery_output_v4_1_all/` and that nothing overwrote the archived V4-pilot artifacts inside `prereg_3_testdrives/`.
2. After the run completes, eyeball the new H2 cell's MB panel (rho, one-sided p) and compare against H1. Per the V3 pilot, somatic anxiety was the larger effect (ρ=+0.359) and worry the smaller (ρ=+0.205); the V4.1 sample is powered to detect the worry effect at 90% (N_MB target ≈ 200).
3. Teleprompter task showing field bugs in V4.1 recruitment: 366 completed but 724 returned (a 66% return rate), and 25 participants sent messages reporting screen flashing, lag, and false "you're not speaking" prompts. Two implications: (a) draft a participant-facing apology/resolution message — open to compensation, no-penalty return, or just acknowledgement; (b) bot-detection signals F4 (silence-triggered ≥4) and F5 (speaking time at the 30s floor) may be partly catching real software failures, not low-effort responders. Worth disentangling before relying on those flags as engagement proxies.
4. Decide whether to formalise the bot diagnostic as a reported sensitivity analysis (recommend yes given the teleprompter bug situation) or leave it exploratory. Either way: not added to the notebook unless explicitly authorised.
5. `README.md` still lists the old V4-pilot artifact paths (`cbm_output_v4_all/`, `fig_*_v4_all.png`, `experiment_results_v4_export.csv`). Update to point at `prereg_3_testdrives/` once the run completes, and add a note that `experiment_results_v4_1_export.csv` (380 rows / 362 COMPLETED / 277 post-filter) is the canonical analysis dataset.
6. The two stale `.bak_*` backups at the root (`.bak_pre_v4_1`, `.bak_pre_polyfit_guard`) are byte-identical to the current notebook after the polyfit revert and can be deleted whenever convenient. `.bak_pre_h2_cell` is the only one carrying a meaningful pre-edit state; keep it until the H2 cell has been reviewed in the post-run output.
7. Confirm the teleprompter bug is not blocking convergent-validity of the MB classifier (κ ≥ 0.5 between model-agnostic and HBI) before reporting H1/H2/H3 confirmatorily — that check was a prereg precondition.

### 2026-05-29 — V4.1 prereg-alignment pass: H1/H2/H3 + κ + mb_score + prereg OT; column rename; H1 significant on N=159

**Context.** v4_1 run from 27.5.2026 completed. Audited the V4 notebook against the prereg and found four gaps in the confirmatory pipeline: H1 was implicit only (the cell-36 OT × Anxiety descriptive was de facto H1 but two-sided, unlabeled, and partitioned on CBM groups); H2 was tagged but also used CBM; H3 was absent; convergent-validity κ was absent. The OT formula was V3-convention `z(acc) − z(log_delib)` (positive = efficient) instead of prereg's `z(delib_log) − z(logit(acc_canon))` (positive = overthinking). Bare `Anxiety` / `Anxiety_pre` column names violated the Paul-notebook discipline from 28.4.2026. Closed all four gaps, fixed the formula, renamed columns across both notebooks, and confirmed H1 on the corrected pipeline.

**Actions.**
- Backup. Created `pre_prereg_alignment_2026-05-27/` at root with pre-edit copies of `Modelling_AllChoices_V4.ipynb` and `Paul/RT_Analyses.ipynb` (Paul subfolder preserved).
- V4 cell 1 — added one-line `df.to_csv(f'filtered_data_{DATASET_TAG}.csv', index=False)` after the exclusion stack. Updated the stale "no separate CSV to keep in sync" comment. V4 stays the single source of truth for filtering; the CSV is a derived artifact for Paul. Output: `filtered_data_v4_1.csv` at root, 277 rows.
- V4 cell 3 — added `correct_canon ∈ {0, 0.5, 1}` column with prereg's 0.5-on-tie scoring (the existing `correct` column defaults ties to 1). Both kept; OT formula uses `correct_canon`.
- New cell 4 — model-agnostic mb_score classifier per prereg Variables section. Builds `mb_score_df` with `mb_score_F`, `mb_score_T`, `n_anti_F`, `n_anti_T`, and `mb_classif_agnostic = (mb_score_F > 0.5) | (mb_score_T > 0.5)` (the lenient OR-rule).
- V4 cell 35 — added `accuracy_canon=("correct_canon", "mean")` to the `subj` agg.
- V4 cells 36, 37 — replaced OT formula with prereg's `z(delib_log) − z(logit(acc_canon))`, logit clipped to [0.025, 0.975]. Legacy `z_rt` / `z_acc` aliased so downstream plot code keeps working. Sign flipped: positive OT now = overthinking.
- V4 cell 37 (H2) — retrofitted to use `mb_classif_agnostic` as primary partition. CBM-MF / CBM-MB panels kept as exploratory descriptives. "← H2" tag moved from CBM-MB to mb_score-MB panel.
- New cell 38 (V4) — H1 (preregistered) — Somatic × OT, one-sided positive Spearman in mb_score-MB subjects. Five panels mirroring H2. Predictor `df['somatic_anxiety']` (post-rename).
- New cell 40 (V4) — H3 (preregistered) — one-sided Mann-Whitney on `subj.mean_log_delib` (MB > nonMB by `mb_classif_agnostic`); reports U, one-sided p, rank-biserial `r_rb = 1 − 2U/(n_MB · n_nonMB)`, plus Welch-HC3 OLS sensitivity.
- New cell 41 (V4) — Convergent validity (preregistered) — Cohen's κ between `mb_classif_agnostic` and CBM-collapsed classification (M2 vs M3+M7+M9). Tiered interpretation against V3 pilot's κ = 0.71 and the prereg's < 0.5 reconsideration trigger. 2×2 confusion plotted.
- Column rename — `Anxiety` → `somatic_anxiety`, `Anxiety_pre` → `worry` across V4 in two passes (84 + 12 = 96 substitutions). Captures column writes, all downstream column accesses (`['anxiety']`, groupby agg kwargs, dropna subsets, Spearman pair extractions), and label updates. Caught and fixed a pre-existing mislabel: an axis title read `'Anxiety (Worry)'` while the plotted variable was somatic; corrected to `'Somatic Anxiety'`. Second-pass cleanup fixed two stragglers (a `plot_df['Anxiety']` in the earned-time scatter, and the stale `if "Anxiety" not in df.columns:` check in the H1 cell that the bulk-replace missed because it matched `df[...]` accesses, not bare string membership tests). Internal Python variable names (`anx_map`, `med_anx`) left alone — local and unambiguous.
- Paul minimal V3→v4_1 patch — `EV_MAP[(2,'Feather')]` 0 → −10 (V4 task design); `range(1, 9)` → `range(1, 13)` in cells 8 and 54 (V4 = 12 trials/query); 8 filename swaps to `filtered_data_v4_1.csv`; cell 54 `EV_MAP_216` updated. Paul's OT formula was already prereg-exact — no formula change. `EV_DET_MAP` and `CANONICAL_RATING_EV` sensitivity variants left untouched (separate theoretical interpretations).
- Paul cell 1 — added `_find_filtered_csv()` helper searching cwd, parent dir, and `os.path.dirname(getcwd())` before raising a FileNotFoundError that lists searched paths. Wrapped all 4 later `_raw = pd.read_csv(...)` reads through it. Fixes the cwd-mismatch failure when Jupyter launches Paul's kernel from the Paul/ subfolder while V4 writes the CSV at project root.
- Diagnosed and fixed the H1/H2 sample-size bug. After all the additions, H1 was reporting `MB (mb_score) n = 61` instead of n ≈ 159. Traced upstream: cell 36 still had `ot = subj[subj["model"].isin(MODEL_GROUPS)].copy()`, pre-filtering to CBM-MF-or-MB winners and silently dropping the ~30% of subjects whose CBM winner was M1/M4/M5/M10/M11/M12/M16. Replaced with full-sample `ot = subj.copy()` plus an upstream merge of `mb_classif_agnostic`; switched the dropna from legacy `accuracy` to `accuracy_canon`; removed the now-redundant merges from H1 and H2 cells. CBM-group descriptive panels in cell 36 still iterate over `MODEL_GROUPS` — those stay exploratory.
- Investigated the 7-distinct-points-per-curve artifact visible in early Query-1 P(choose gamble) plots. Traced to exactly one subject (`6a10f7620612b4eb8ab0b410`) with a non-prereg offer grid (Q1 Feather {−20, −7, −4}, Q1 Triangle {+4, +7, +20}; Q2 similarly truncated). KCA = 1.0, zig-zag = 0 — passes both prereg filters. Consistent with an earlier task version slipping through. Drafted an offer-grid exclusion filter but did not apply.
- Funnel audit. 380 raw → 362 COMPLETED (4.7% non-completion) → 277 after both exclusions (zig-zag 58/362 = 16%; KC 30/362 = 8.3%; overlap 3). Total attrition 27.1% vs prereg's planned 10%. Median zig-zag among completers is 0; mean 0.71. KC mean 0.799.
- Results on corrected pipeline (N=277, N_MB = 159). BMS: BOR = 0.0000. M2_MF_alpha wins PXP = 0.938; M3_MB second at 0.062. Mean LME favors hybrid M9_w_stim (−9.59) but M2 wins on per-subject frequency. Family breakdown ~31% MF / 30% pure MB / 39% hybrid. CT family: CT_M9 51.6%, CT_M3 48.4%. **H1 result: Spearman ρ = +0.149, one-sided p = 0.0308 \*** on N_MB = 159. Direction as predicted. Effect ~58% smaller than V3 pilot's ρ = 0.359 (typical replication shrinkage; the prereg's power calc was sensitized to the smaller worry effect). nonMB (mb_score) ρ = −0.05, confirming MB-specificity. H2, H3, κ not yet inspected post-fix.

**Decisions.**
- `mb_classif_agnostic` is the primary partition for H1/H2/H3; CBM is the convergent-validity check (κ) only. The earlier H2 cell's use of CBM groups was a prereg deviation, now corrected.
- OT sign: positive = overthinking everywhere. Prediction direction in H1/H2 stays positive ρ.
- Cell 36 is the canonical home of `ot`, built from the full sample, no CBM filter. H1/H2 inherit. The mid-session "self-contained paste" that built `ot_h1` / `ot_h2` inside the H cells was a debugging step; the canonical state is the cell 36 fix.
- Offer-grid exclusion for the anomalous subject was drafted but not applied. Stays in prereg sample.
- Paul stays as the prereg-named home for mb_score and OT pipeline. V4 also implements mb_score (cell 4) because H1/H2/H3 live there. Cross-check the two implementations.
- PyMC LMM in Paul §2 and Bayesian DDM regression in Paul §3 need pytensor — `conda install -c conda-forge pymc`. Not required for V4 confirmatory tests (scipy + cbm only).
- Funnel: 27% attrition is significantly above prereg's 10%. To hit 200 MB at current rates, recruitment needs ~481 vs prereg's 377. Recommend extending by ~100; document deviation regardless.

**Files changed.**
- Created: `pre_prereg_alignment_2026-05-27/` at root with pre-edit copies of both notebooks (~13.1 MB).
- Modified: `Modelling_AllChoices_V4.ipynb` — 45 → 49 cells. New: mb_score classifier (4), H1 (38), H3 (40), κ (41). In-place edits to cells 1, 3, 35, 36, 37 (OT formula + filter fix), and 38 (rename-pass cleanup). 96 column-name substitutions for the Anxiety/Anxiety_pre rename.
- Modified: `Paul/RT_Analyses.ipynb` — 63 cells unchanged. Edits in cells 1 (EV_MAP V4 fix + path-resilient loader), 8, 54 (range(1, 13)), 54 (`EV_MAP_216`), and 8 filename swaps across cells 1/12/36/40/48/54/61. 4 `_raw` reads wrapped in the helper.
- Created: `filtered_data_v4_1.csv` at root (277 rows).
- Not modified: `PREREGISTRATION_V4.md`, `README.md`, `task_v4.html`, `bot_detection_report.csv`, `V3_archive/`, `V3_preregistered_analysis/`.

**Next steps / open questions.**
1. Re-inspect H2, H3, κ on the corrected N=159 sample. H2 was last seen at N=61 with ρ = +0.422, one-sided p = 0.0004 ***; expect the full-sample result in ρ = 0.25–0.35 range with one-sided p < .001.
2. Decide on recruitment overage: continue toward prereg's 377 target (currently 380) and document the higher-than-planned attrition, or extend to ~481 to hit the prereg's 200-MB target.
3. If κ comes in < 0.5, trigger the prereg's reconsideration clause. With M2_MF_alpha at 26.4% CBM frequency but mb_score-MB at 57.4%, expect κ in the 0.4–0.55 range — borderline. Recovery results in §9 feed the interpretation; low-recovery models excuse some of the disagreement.
4. Run Paul end-to-end on N=277 for the secondary RT analyses (hierarchical Bayesian LMM, ART moderation, EZ-DDM). Install pymc first; §§2 and 3b need pytensor.
5. Address subject `6a10f7620612b4eb8ab0b410` before manuscript: either add the drafted offer-grid filter to cell 1 (drops N to 276) or run a sensitivity with the subject excluded. Currently stays in the prereg sample.
6. Update `README.md` for the new layout (49 cells, prereg block at 38–41, column rename, `filtered_data_v4_1.csv` at root).
7. The two stale `.bak_*` backups at root and `pre_prereg_alignment_2026-05-27/` can be deleted once H1/H2/H3/κ results are reviewed and accepted on a clean from-scratch run.
8. Cross-check whether the κ-disagreeing subjects cluster on teleprompter-bug indicators (the 27.5.2026 entry flagged 25 self-reports of UI failures); if so, the κ < 0.5 risk is partly driven by UI noise corrupting CBM fits, not genuine construct divergence.

### 2026-06-03 — Conference talk deck built; supplementary stats run; folder reorganised + wording harmonised

**Context.** Two parallel threads opened: (a) build the conference talk deck (which will also seed the poster) from the v4_1 results, and (b) tidy the project so a fresh analysis chat can start clean. Work happened in Cowork (file tools + sandbox), not in the notebook — no notebook cells were run or changed this session.

**Actions — talk deck.**
- Built `Talk and poster/Worry_as_model_based_planning.pptx` (19 slides, clean-academic style, navy/teal). Arc: title-as-claim → question/gap → 3 hypotheses → **4 method slides** → OT-index method → 3 results → implications → backup section (classifier separation, κ, BMS, HBI responsibilities, confusion matrix, parameter recovery).
- Method section expanded to four slides per user request: three **flipped-tree** diagrams (Start at bottom, terminals at top) showing the value states in sequence — Learn (middles +5/−5, terminals hidden as "?"), Revaluation 1 (terminals −20/+20), Revaluation 2 (terminals −15/+15) — plus a dedicated Query slide (journey-vs-offer with the MF-vs-MB dissociation). A 4-step phase stepper ties them together. Talk-specific figures generated with matplotlib and stored in `Talk and poster/figures/` (`task_structure.png`, `tree_learn/reval1/reval2.png`).
- Headline numbers used on results slides (all from the **main-notebook authoritative mb_score split, N_MB = 159**): H2 worry × OT within MB ρ = 0.25 (one-sided p = .0007), non-MB ρ = 0.10 n.s., CBM-MB ρ = 0.47; H3 MB > non-MB deliberation RT U = 13,520, p < .0001, |r_rb| = 0.44; H1 somatic × OT in MB ρ = 0.15 (p = .031) but also in non-MB ρ = 0.22 (less specific); convergent validity κ = 0.966 (98.3%).

**Actions — supplementary stats (run in-sandbox on `rt_analysis/rt_analyses_per_subject.csv`).**
- "Does anxiety predict *being* a planner?" Group comparison (Kruskal–Wallis, MB vs non-MB): worry p = .65 (n.s.), somatic p = .32 (n.s.) → neither scale predicts who plans. (The deck's slide-7 card previously cited p = .35, which was the *somatic × CBM-group* test; worry was unchecked until now.)
- Worry-specificity partial correlations within planners: worry × OT controlling for somatic = **0.17 (one-sided p = .006, survives)**; somatic × OT controlling for worry = **0.03 (p = .32, vanishes)**; worry–somatic r = .50. So worry carries the unique relationship with overthinking; somatic does not. Confirms the "worry specifically, not general anxiety" claim.
- "Are there anxious people who don't overthink?" Yes — among the top worry tercile, only 46% of planners actually overthink (OT>0); worry explains ~5% of OT variance within planners. Supports "modest, subgroup misallocation," not "anxiety = overthinking for all."

**Decisions / clarifications.**
- The current study (v4_1, `PREREGISTRATION_V4.md`) **is** the pre-registered replication of the prior pilot's H1/H2 effects — not a future to-do. Deck wording corrected accordingly: "needs replication" removed from limitations; the replication framed as a strength. Canonical terms fixed project-wide (see README terminology table): *prior preregistration/pilot* (OSF wn6ks, V3, N=139) vs *current preregistration* (V4, v4_1, N=277); future work = *follow-up*.
- Deck reframe line changed from "deployed where model-free caching would do" (misleading — MB is the accurate strategy here) toward "model-based planning run past the point where more simulation improves the decision."

**Files changed.**
- Created: `Talk and poster/` (deck + `figures/` + `README.md`).
- Rewrote: `README.md` (current v4_1 paths, folder map, two-preregistration terminology table).
- Updated: this LOGBOOK (project-structure block refreshed; this entry).
- Moved (not deleted) into `_backups/`: the 3 `Modelling_AllChoices_V4.ipynb.bak_*` files, `pre_prereg_alignment_2026-05-27/`, and the stale `~$…pptx` lock file.
- Note: the user has been hand-editing the deck in PowerPoint between turns; the .pptx on disk reflects their edits plus the inserted slides. No analysis files, figures, CSVs, or notebook were modified.

**⚠ TOP OPEN ISSUE for the next analysis chat — classifier discrepancy.**
There are two model-agnostic mb classifications in the project that do NOT agree on group size:
- **Authoritative:** main notebook `Modelling_AllChoices_V4.ipynb` cell 4 (prereg-aligned mb_score) → **N_MB = 159 / non-MB = 118** (used by all `fig_*_v4_1_all.png` and the deck).
- **Stale/different:** `rt_analysis/rt_analyses_per_subject.csv` column `mb_group` → **217 / 60** (older or more lenient rule; agrees with `mb_score>0.5` at only ~95%).
The supplementary stats above (group tests + partial correlations) were computed on the **217 split** because that's where the per-subject worry/somatic/OT table lives. Direction of all conclusions is expected to hold, but **exact ρ/p values and n must be recomputed on the 159 split** before they go on the poster or into the manuscript. First task next session: reconcile the two rules (which one matches the prereg's "mb_score_Feather>0.5 OR mb_score_Triangle>0.5"?), then export a single per-subject table from the main notebook carrying mb_score, mb_group, worry, somatic, OT, and rerun the group + partial-correlation tests from it.

**Next steps / open questions.**
1. Resolve the 159-vs-217 classifier discrepancy (above) and regenerate the supplementary stats on the authoritative split.
2. Run the worry-specificity partial correlation and the worry/somatic × group tests inside the main notebook (not the rt_analysis CSV) so they share the prereg classifier and can be cited cleanly.
3. Poster: derive from the deck once the numbers above are locked; reuse `Talk and poster/figures/`.
4. Carry forward unresolved items from the 2026-05-29 entry (recruitment overage, κ reconsideration clause, subject `6a10f7620612b4eb8ab0b410`, AntiMF robustness regime on v4_1).
5. Deck still has minor wording to finalise (implications-slide limitation card, "follow-up" card wording) — see `Talk and poster/README.md`.

### 2026-06-10 — CBM group-collapse widened to cover all 11 models (the "118 → 277" tweak)

**Context.** Investigating why the CBM-based MF/MB analyses (cells 32, 37, 41, 42) only ever showed ~118 subjects when CBM actually fits all **277**. Root cause: the `GROUP_MAP` in cell 32 only mapped 4 of the 11 fitted models to a group (`M2_MF_alpha`→MF; `M3_MB`/`M7_MB_reval`/`M9_w_stim`→MB). Subjects whose winning model fell outside those 4 got no MF/MB label, so every cell that filters on `MODEL_GROUPS = ["MF","MB"]` silently dropped them. The 118 was 57 MF + 61 MB (the two collapsed groups); the other 159 winners (`m11_sep_beta_w_reval`=69, `m16_sep_beta_w_stim`=38, `M1_MF`=32, `M10_w_reval`=19, `m12_mb_mf_sep_stim`=1) were unmapped. (Note: this 118 is a *different* set from the 159/118 model-agnostic split — same n for non-MB by coincidence, different membership.)

**Decisions.**
- **Classification rule:** a model is **MF** iff the choice value depends *only* on cached stage value (`mf_value`) with no expected-value term; it is **MB** if the tree `ev` enters the decision at all (including the `w`-mixture hybrids, consistent with the prior convention that already put the `M9` hybrid in MB). Resulting full map:
  - MF: `M1_MF`, `M2_MF_alpha`
  - MB: `M3_MB`, `M4_MB_MF`, `M5_MB_stim`, `M7_MB_reval`, `M9_w_stim`, `M10_w_reval`, `m11_sep_beta_w_reval`, `m12_mb_mf_sep_stim`, `m16_sep_beta_w_stim`
- This puts all 277 CBM-fitted subjects into the MF/MB collapse instead of 118.
- **Caveat recorded (not yet resolved):** the five `w`-mixture hybrids (`M9`, `M10`, `m11`, `m12`, `m16`) are classed MB by *model identity*, but a subject can win a hybrid with fitted `w≈0` (effectively MF). The construct-valid alternative is to label hybrid-winners by fitted `w` (e.g. `w>0.5`→MB). Since the hybrids are most of the 159 newly-included subjects, the choice can move the MF/MB counts materially. Left as model-identity for now; flagged for review.

**Files changed.**
- To edit: `Modelling_AllChoices_V4.ipynb` cell 32 — replace `GROUP_MAP` with the 11-model map above. (Tweak decided this session; takes effect only after a clean re-run — see below.)

**Next steps / open questions.**
1. **Kernel restart wiped state.** A `NameError: winning_params not defined` confirmed the Jupyter kernel had restarted (in-memory vars gone; `.pkl`/`.csv` on disk intact). To rebuild `winning_params`, re-run in order: cell 1 (load+filter) → 3 (`trial_df`) → 4 (`mb_score_df`) → CBM cells 24→25→26→27 → 31 (HBI) → 32 (collapse, edited `GROUP_MAP`) → downstream OT/H3 cells. Simplest: **Restart & Run All**. The expensive fits are cached in `cbm_output_v4_1_all/` (model `.pkl` + `hbi_choice.pkl`, dated May 30); unverified whether the `cbm` wrapper reloads them or refits (HBI was the ~8–10 min step in recovery runs).
2. Decide hybrid handling: keep model-identity collapse, or reclassify `w`-hybrid winners by fitted `w`. Report how MF/MB counts shift under each before locking.
3. Fix or drop `m12_mb_mf_sep_stim` — its likelihood sets `w = params[0]` (= `beta_f`) instead of a real third parameter, so its mixing weight is malformed (1 subject won it).
4. After re-run, re-check downstream CBM-group numbers (cells 33, 37, 41 κ, 42) now that they span 277 not 118; update any talk/poster figures that cited the 118-subject CBM collapse.

### 2026-06-11 (Cowork) — Merged the two notebooks into a poster-first 4-section notebook + archive

**Context.** Consolidated the two parallel notebooks — `Modelling_AllChoices_V4.ipynb` (modeling + poster) and `rt_analysis/RT_Analyses.ipynb` (RT/overthinking + §5 follow-ups) — into one concise notebook. Goal: cut the sprawl of exploratory analyses, order the punchy poster results before the heavy stuff, and standardise on the 159 classifier. Work done in Cowork (file tools + sandbox); originals left untouched alongside the new files.

**Actions.**
- Created `Merged_V4_Analysis.ipynb` (113 cells) with a **poster-first 4-section structure**:
  1. **Prep for Main Analyses** — load, derived `trial_df`, the canonical 159 `mb_classif_agnostic`, RT/OT prep (`rt_per_subj`, OT def), and a lean per-subject `subj` table (no CBM).
  2. **Main / Poster (model-agnostic)** — H1 (somatic×OT), H2 (worry×OT), H3 (log-delib MB vs non-MB), main correlations, somatic–worry dissociation. All on the 159 split; runs with NO CBM block.
  3. **Modeling (heavy) + CBM confirmation** — CBM/HBI, BMS/PXP, PPC, group collapse, full RT-descriptives, then **H1/H2 re-run under the CBM classification** (saved to `*_cbmconfirm.png` so they don't overwrite the clean agnostic poster figs), κ convergent validity, recovery, Bayesian RT-LMM, EZ + generative DDMs.
  4. **Validations & Sensitivity (heavy)** — sample descriptives, paradigm-validation LMMs, questionnaire factor structure, assumption checks, power, OLS + rank moderation, partials, robustness, OT-half decompositions.
- Created `ARCHIVE_exploratory_RT.ipynb` (45 cells) holding all 22 cut exploratory RT §2.x analyses (alt OT / cognitive-waste operationalisations, per-stim trajectories, time-per-points, R1→Q1 gap, subjective-rating RTs, adaptive-accuracy OT). Outputs preserved; each tagged with its source cell index. Nothing dropped silently — every source cell is in the merged or the archive (coverage check: 0 missing).
- Verified §1 + §2 execute clean end-to-end in-sandbox (no CBM): H1/H2/H3 reproduce on the 159 split (H2 in MB ρ=+0.251, one-sided p=0.0007; H3 MB>non-MB p<0.0001), figures show only the 3 agnostic panels.

**Decisions.**
- **Preregistration cell removed** from the notebook (per user; the spec still lives in `PREREGISTRATION_V4.md`).
- **CBM framed as confirmatory, after the Hs.** The CBM-overlay panels in the OT/H1/H2 cells are gated behind `subj['model'].notna().any()` — off in §2 (clean agnostic), on in §3 once the full RT-descriptives cell rebuilds `subj` with CBM labels. The §3 re-run is the confirmation step.
- **Reorganise, don't recompute.** Existing outputs preserved; the 159 standardisation is at the *code* level. Outputs in §3–§4 that predate the 2026-06-11 reconciliation (older Ns 139/217/60/67/72) are flagged with a banner + inline ⚠ markers — they still need re-running on 159 (see TOP OPEN ISSUE, 2026-06-03 entry).

**Files changed.**
- Created: `Merged_V4_Analysis.ipynb`, `ARCHIVE_exploratory_RT.ipynb` (root).
- Bug fixes baked into the merged notebook (the two source notebooks shared variable names and clobbered each other in one kernel):
  - `df`/`trial_df` → RT pipeline namespaced to `rt_df`/`rt_trial`.
  - `per_subj`/`motor_map` → RT pipeline namespaced to `rt_per_subj`/`rt_motor_map` (M06/M33 build their own `per_subj`; was wiping `mb_group`).
- Originals (`Modelling_AllChoices_V4.ipynb`, `rt_analysis/RT_Analyses.ipynb`) unchanged.

**Next steps / open questions.**
1. §3 (CBM/HBI, DDM) and §4 (LMMs, sensitivity) need the `cbm` package / PyMC — not run in Cowork; execute in the real kernel to confirm they're clean top-to-bottom.
2. The 159 recompute pass is still pending (the headline analyses already recompute correctly on 159; some §3–§4 preserved outputs are stale — re-run the flagged cells).
3. Optional: collapse the §2-vs-§3 figure duplication if a single set of figures is preferred.

### 2026-07-02 (Cowork) — Convergent validity verified via Piray HBI responsibilities; robust κ cell installed in both notebooks

**Context.** Verified the MB/MF allocation convergence (prereg manipulation check) independently of notebook kernel state, per the "two-way verification" framing in the V3 talk.

**Result (prereg-correct, N = 277).** Model-agnostic `mb_classif_agnostic` (159/277 MB) vs HBI winner from `cbm_output_v4_1_all/hbi_choice.pkl` collapsed with the full 11-model GROUP_MAP (188 MB / 89 MF): **agreement 246/277 (88.8%), Cohen's κ = +0.764 (95% CI 0.685–0.842)** — above the V3 pilot (κ = 0.71) and well above the prereg κ < 0.5 trigger. Continuous check: Spearman(mb_score_max, P(MB family)) ρ = +0.838, p < 1e-73. Matches `fig_kappa_convergent_validity_v4_1_all_CORRECTED.png` cell-for-cell (88/1/30/158). Cross-check: restricting to the old narrow map (M2 vs M3/M7/M9) reproduces the stale N = 118, κ = +0.966 exactly — validates subject alignment and confirms the deck's 0.966 is the narrow-map number, to be replaced with 0.764.

**Disagreement anatomy.** 30/31 disagreements are HBI-MB / agnostic-nonMB; 29 won hybrids (m11 = 16, m16 = 9, m10 = 4). Consistent with the 2026-06-10 hybrid caveat (MB-by-identity with possibly w ≈ 0). Reclassifying hybrid winners by fitted w would likely raise κ.

**HBI decisiveness.** Mean max responsibility 0.846 (median 0.899); 69.3% of subjects > 0.8. Family-level: mean P(MB family) = 0.963 for HBI-MB, mean P(MF family) = 0.857 for HBI-MF.

**Files changed.**
- Replaced the κ convergent-validity cell in BOTH notebooks — `Merged_V4_Analysis.ipynb` cell 48 and `Modelling_AllChoices_V4.ipynb` cell 41 — with a robust version that loads HBI responsibilities directly from the pickle (lenient unpickler, no `cbm` import, no dependence on `subj`/`winning_params` kernel state), applies the full 11-model collapse, asserts subject alignment against the fit order, and reports κ + CI, confusion, continuous ρ, and the disagreement table. Stale outputs cleared. Pre-edit backups: `_backups/*_pre_robust_kappa_2026-07-02.ipynb`.
- New: `verify_convergence_agnostic_vs_hbi.py` (standalone replication), `convergence_agnostic_vs_hbi_v4_1_all.csv` (per-subject table: mb_scores, agnostic label, HBI winner/group/max-resp/P(MB family)).

**Next steps.**
1. Update deck/poster κ: 0.966 (98.3%, N=118) → **0.764 (88.8%, N=277)**; the corrected figure is ready.
2. Hybrid-by-fitted-w sensitivity for κ still pending (2026-06-10 item 2).
3. Cells 39/48 (Merged) saved outputs elsewhere in §3 remain stale until a full re-run with the `cbm` kernel.

### 2026-07-02 (Cowork, cont.) — Hybrid-by-fitted-w sensitivity: κ 0.764 → 0.933; resolves the 2026-06-10 hybrid-handling item

**Check.** Extracted each hybrid winner's individual-level fitted mixing weight(s) from `hbi_choice.pkl` (`output.parameters`) and relabeled hybrid winners MB iff any w > 0.5 (OR-rule, mirroring the agnostic classifier). w extraction follows each likelihood exactly: m4 `expit(p1)`; m9/m10 `max(expit(p1),expit(p2))`; m16 `max(expit(p2),expit(p3))`; **m11 uses raw w (no sigmoid in its likelihood)**; m12 excluded (malformed w = beta_f bug; its 1 subject kept MB by identity).

**Results.**
- The 29 MF-behaving hybrid winners have **w median = 0.27; 25/29 have w ≤ 0.5** — confirmed effectively-MF. Agreeing hybrid winners: w median = 0.95; 98/101 have w > 0.5. Spearman(w, mb_score_max) among hybrid winners ρ = +0.72, p = 2.5e-22 — the two verification methods track the same latent quantity.
- Hybrid-by-w split: **160 MB / 117 MF** — converges almost exactly on the agnostic 159/118.
- **κ (fitted-w rule) = +0.933 (95% CI 0.89–0.98), 96.8% agreement, N = 277** (vs 0.764 under identity rule). Remaining disagreements: 9.
- Also checked: the 29 are not random clickers — 98.3% accurate on concordant (non-anti-MF) trials (rest of sample: 92.2%); anti-MF P(chose MB) median 0.20, i.e. systematic MF choice, not ~0.5. (HBI has no per-subject random-responder detection; `hbi_null`/BOR is a group-level chance test. Clickers are handled upstream by the cell-2 zig-zag exclusion.)

**Interpretation.** The identity-rule κ = 0.764 understated convergence because of a labeling artifact: hybrids-by-identity with fitted w ≈ 0. Report κ = 0.764 as primary (prereg wording) with κ = 0.933 as the w-sensitivity; the 2026-06-10 "decide hybrid handling" question now has an empirical answer — hybrid-by-w matches the agnostic classifier.

**Files changed.**
- New cell inserted in BOTH notebooks directly after the robust κ cell (`Merged_V4_Analysis.ipynb` → index 49, now 114 cells; `Modelling_AllChoices_V4.ipynb` → index 42, now 50 cells). Tested end-to-end in-sandbox.
- New: `hybrid_w_sensitivity_v4_1_all.csv` (per-subject: hbi_model, fitted w, identity-rule group, w-rule group, agnostic label).

**Next steps.** Poster/deck: κ line becomes "κ = .76 (identity rule), .93 when hybrid winners are classified by fitted w". Decide whether the w-rule becomes the default CBM collapse for the manuscript (prereg wording says "pure-MF vs MB-and-hybrid variants" → identity rule stays the preregistered primary).

### 2026-07-04 → 07-06 (Cowork) — Poster figure suite as Figma-ready SVGs; DDM provenance resolved via new ddm/ library; worry→checking supersedes worry→effort; figure skill packaged

**Context.** CPC26 poster build-out: reproduce H3 as a violin, produce the remaining result visuals in an editable form for Figma, wire up Modeling/Conclusions/References text, and verify the DDM/Dyna numbers against sources.

**Figma constraint → SVG pipeline.** Figma MCP is unusable on the Starter plan (6 tool calls/MONTH; resets ~Aug 1). Workaround adopted: hand-emitted SVGs dragged into Figma import as native editable layers (circle→ellipse, text→text when font is Inter/Arial). All result figures rebuilt this way in `figma_svg_figures/` (V1–V9 + V4b + previews + README with per-figure provenance):
- V1 worry×delib, V2 worry×accuracy (recomputed exactly on the authoritative 159/118 split; stats match pptx digit-for-digit), V3 DDM boundary/drift, V4 + V4b mediation (full + poster-distance), V5 Dyna effort, V6 RT decomposition, V7 H3 violin (exact notebook pipeline: U=13520, r_rb=−0.441), V8 worry×OT ranks (ρ=+0.242), V9 κ confusion matrix (88/1/30/158 recomputed from convergence CSV).
- V3 dots digitized from published PNG (144+148/158 recovered; digitized ρ=+0.187/−0.081 vs published +0.196/−0.078; labels carry published values). V5 points recovered EXACTLY from vector PDF via pdfminer (ρ=+0.273, E×delib 0.940).

**DDM provenance resolved.** User expanded `ddm/` into a 74-PDF library. `result_ddm_worry_boundary.pdf` documents the exact Ter-free fit: accuracy-coded Navarro–Fuss MLE, Ter=0, z=a/2, 3×3 grid, delib floored at 10 ms, motor = median of 64 SL step RTs, **N=276 after one task-version integrity exclusion → 158 MB** (resolves the 158-vs-159 discrepancy). In-session refit with 0.05 s floor on n=159 gave a: ρ=+0.166 (.036) — gap explained by floor + the excluded subject. `PROCESS_EXPLAINER_ddm_worry.pdf` verified faithful to all source docs.

**Model-story correction (important).** Final choicefit model: worry loads on the **checking constant C** (ρ=+.284, p<.001, S2; recovery .94), NOT on the Dyna sampling term — supersedes the iteration-1 "worry→effort E" framing (E≈RT ρ=.94, near-circular). V6 caption corrected accordingly. Poster decision: Modeling column = who-plans (κ) + V3 + V4 only; Dyna/checking held as verbal material + one Conclusions sentence. Study 1 checking replication: same direction, n.s. (ρ=+.10).

**Measures verified against task_v4.html.** Somatic scale = Mini-MASQ AA item-for-item (cite Casillas & Clark 2000 ✓). Worry items = exactly the Hopko et al. (2003) PSWQ-A 8-item set (Meyer 1990 covers wording only — recommend citing Hopko for "PSWQ-A").

**Poster text delivered.** Who-plans / Drift-diffusion (paradox framing, "more time ≠ more accuracy") / Planning-as-sampling blocks; Conclusions box (3 sentences, ends on checking); reference list finalized at 7 compact entries with exact superscript placements (Gillan¹ no-link claim, Gershman² retrospective revaluation, PSWQ-A³, Mini-MASQ⁴, Piray/HBI⁵, Ratcliff/DDM⁶, Sutton/Dyna⁷-if-kept). Mediation-as-three-regressions explainer + regression-table form provided.

**Files changed.** New: `figma_svg_figures/` (9 figures + previews + README), `h3_violin_cell.py`, `fig_h3_log_delib_mb_vs_nonmb_violin_v4_1_all.png`, `ddm_terfree_MB_recomputed.csv` (root; EZ-variant refit table), `figma-svg-figures.skill` (packaged skill: data/script/figure → verified stats → Figma-ready SVG; parameterized CONFIG, marks always data-driven). No notebook edits.

**Next steps / open questions.**
1. Poster punch list: task badges still 5/5/5; email box wraps; restore the 159/118+κ classifier line to Participants; reconcile n=158 (DDM) vs n=159 (descriptives) with a one-line integrity-exclusion footnote; violin colors vs green/blue time/accuracy color-language clash.
2. Swap Meyer→Hopko (or cite both) for PSWQ-A — user decision pending.
3. Per-subject fitted parameters (a, v, E, n_base, C) still not saved as CSVs anywhere — export on next refit run.
4. V3's printed ρ=+0.196: provenance now documented, but a one-shot refit with the documented spec (10 ms floor, n=158) would make it fully regenerable.

### 2026-10-24 (Cowork) — NAS made source of truth; GitHub repo reorganized for light sharing
- **Context:** Project moved from a local-only folder to the lab Synology NAS (`SynologyDrive`); goal was access from other machines/phone and less load on the PC.
- **Actions:** Compared NAS vs local copies (NAS was a superset; shared files identical); copied the 3 local-only items to the NAS (`Claude outputs`, thesis proposal draft docx, `academic-writing.md`). In the GitHub repo (`Analyses documentation`): added root `.gitignore`, `README.md`, `tools/update_study.py` (allow-listed NAS→repo sync with safety checks; strips notebook outputs), committed pocket-check task v5 groundwork. Created the `update-study` skill. Synced V4 notebooks, LOGBOOK, CONTEXT briefing and FOLDER_MAP into `Prereg_3_...` on `main`.
- **Decisions:** NAS = source of truth. GitHub = light files only (no `.pkl`, logs, `cbm_output*`, `PRIVATE_*`). Prereg folder names unchanged (may be cited externally). Pocket-check stays in the same repo as the next study (task v5). No git history rewrite. Git clone stays outside the synced folder.
- **Files changed:** NAS: `FOLDER_MAP.md` (pointer section), `LOGBOOK.md` (this entry). Repo: see commits `Add root .gitignore, README and NAS sync tooling`, `WIP: pocket-check task v5 groundwork`, `Sync from NAS`.
- **Next steps / open questions:** Push from the PC (Cowork has no GitHub credentials). Turn on on-demand files in Synology Drive Client to free PC disk. Archive the old local project folder once confident. Decide later whether to slim `prereg_2_dev_iterations` and the large Prereg_2 notebooks.
