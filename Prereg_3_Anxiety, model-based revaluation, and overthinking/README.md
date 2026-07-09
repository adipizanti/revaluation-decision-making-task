# Prereg 3 — Anxiety, Model-Based Revaluation, and Overthinking: Data

Data and task for a preregistered online study (see `PREREGISTRATION_V4.md` in this folder)
examining the relationship between anxiety and deliberation during model-based planning in a
two-step revaluation task. Participants were recruited on Prolific; the experiment ran in the
browser (`task_v4.html`).

## Files

| File | Rows | Description |
|---|---|---|
| `experiment_results_v4_1_export.csv` | 380 | Raw wide export, one row per recruited participant (includes incomplete sessions). |
| `filtered_data_v4_1.csv` | 277 | Analysis sample after preregistered exclusions (see below). Start here for analyses. |
| `task_v4.html` | — | The complete experiment (self-contained HTML/JS). |
| `PREREGISTRATION_V4.md` | — | Preregistered hypotheses, design, exclusion rules, and analysis plan. |

## Anonymization

All Prolific participant IDs were replaced with anonymized codes (`sub_001` … `sub_362`),
applied consistently in the `prolific_id` and `subject_id` columns. `firestore_uid` /
`firebase_uid` are random app-generated identifiers and were left unchanged. No mapping back to
Prolific IDs is contained in, or derivable from, this repository.

## Exclusions (raw → analysis sample)

Per the preregistration: (1) `status == COMPLETED`; (2) a response-pattern ("zig-zag") check on
learning-trial choices; (3) Knowledge-Check accuracy criterion (`Knowledge_Check_Accuracy`).

## Column codebook (`filtered_data_v4_1.csv`, 493 columns)

One row per participant; trial-level data are stored wide as `<PHASE>_T<trial>_<field>`.

**Identifiers & session** — `subject_id` / `prolific_id` (anonymized codes, identical),
`firestore_uid`, `firebase_uid`, `status`, `timestamp_start/_end`, `total_task_duration_sec`,
`total_time_minutes`, `fixed_seed`.

**Learning trials** — `SL_T1..T32` (structure learning) and `VL_T1..T20` (value learning):
`_Step0_Choice`, `_Step1_Choice`, `_Step0_RT`, `_Step1_RT` (ms), `_Transition`, and for VL
`_Type`. Step-0 RTs on `SL_T1` / `VL_T1` are used for the per-subject motor baseline (below).

**Query trials** — `Query_1_T1..T12` and `Query_2_T1..T12` (12 trials per query, two query
phases separated by revaluation): `_Choice`, `_State`, `_FixedOffer` (the fixed alternative
offered), `_MB_EV` (expected value of the tree option under the current tree), `_RT` (ms),
`_Suboptimal`.

**Ratings** — `Rating_1..3_{Feather,Triangle}_{Val,RT}`: stimulus value ratings at three
timepoints.

**Revaluation / reveal** — `R1_/R2_Reveal_Press_RT`, `R1_/R2_Reveal_View_Duration`,
`Reflection_Time_R1/R2_Full`.

**Questionnaires** — `Survey_ANXIETY_1_*`: PSWQ-8 (trait worry; total = `..._1_Total_Score`,
referred to as **worry**). `Survey_ANXIETY_2_*`: MASQ anxious-arousal (somatic anxiety; total =
`..._2_Total_Score`, referred to as **somatic_anxiety**). `Survey_ERQ_*`: Emotion Regulation
Questionnaire. Per-item columns end in `_Q<k>_Raw`.

**Threat-induction / speech task** — `Threat_Induction_RT`, `Teleprompter_*` (mic permission,
attempts, preview, speech-recognition availability), `SpeakingTime_Log`,
`Final_Earned_Speaking_Time_Sec`.

**Comprehension** — `Structure_Quiz_Attempts`, `Knowledge_Check_Accuracy`.

## Preregistered derived measures (recipes)

- **Canonical query accuracy** `acc_canon`: per query trial, correct = choice matching the
  higher of MB_EV vs FixedOffer; scored 0 / 0.5 / 1 (ties = 0.5); averaged per subject.
- **Motor baseline**: per subject, mean of that subject's own `SL_T1` and `VL_T1` Step-0 RTs.
- **Deliberation** `delib_log`: query RT − own motor baseline, clipped at 10 ms, log-transformed,
  averaged over query trials.
- **Overthinking index**: `OT = z(delib_log) − z(logit(acc_canon))`, with accuracy clipped to
  [0.025, 0.975] before the logit. Positive = overthinking.
- **Model-based classification** (`mb_score` rule): per stimulus, P(choosing the model-based
  option on anti-model-free trials); a participant is classified model-based if this exceeds
  0.5 for either stimulus (OR rule). See the preregistration for the full definition.

Naming convention: use `worry` and `somatic_anxiety`; the bare term "anxiety" is ambiguous in
this dataset and is not used.

## Contact

Sharp Lab — for questions about the data or task, open an issue on this repository.
