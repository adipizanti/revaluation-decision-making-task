# Preregistration — Anxiety, model-based revaluation, and overthinking

*OSF registration type: Open-Ended Registration.*

## Study Information

Participants play a computerized shape-navigation game in which they learn the structure of a two-step decision tree, learn point values for the intermediate states, and then are shown updated terminal-state values across two revaluation phases before being asked to make a series of decisions between navigating to a state versus accepting a fixed point offer. The study tests whether anxiety-related individual differences moderate the cognitive cost of model-based revaluation.

This study uses a modified version of the sequential decision-making task whose prior registration is at <https://osf.io/wn6ks/> (cited hereafter as the *prior registration*). In the prior pilot sample (N = 139), participants were classified as model-based or non-model-based using the model-agnostic classifier defined in the Variables section below. Under that classifier, 82 of 139 participants (59%) were model-based. Within the model-based subgroup, two individual-differences correlations with a per-subject Overthinking index were observed: a correlation with Physiological Anxiety (10-item somatic-symptom checklist) at Spearman ρ = 0.359, one-tailed p = 0.0005, and a correlation with trait Worry (8-item Penn State Worry Questionnaire) at Spearman ρ = 0.205, one-tailed p = 0.03. Both correlations were absent in the non-model-based subgroup. The current study is a directional replication of both effects within model-based-classified participants, using a refined task design and a goal-relevant threat-induction context. The prior registration's hierarchical Bayesian model-comparison classification serves as a convergent-validity check on the model-agnostic classifier.

## Hypotheses

**H1.** Within model-based-classified participants, Physiological Anxiety total score will correlate positively with the Overthinking index. The predicted Spearman correlation is positive (more somatic anxiety → more overthinking). One-sided test, α = 0.05.

**H2.** Within model-based-classified participants, trait Worry total score will correlate positively with the Overthinking index. The predicted Spearman correlation is positive (more worry → more overthinking). One-sided test, α = 0.05.

**H3.** Model-based-classified participants will have larger per-subject mean log-transformed deliberation reaction time than non-model-based-classified participants. The rationale is that model-based planning recomputes state-value at decision time and therefore takes more cognitive effort than habitual model-free responding. One-sided test, α = 0.05. Direction predicted from the prior pilot data; effect-size magnitude will be reported descriptively from this study.

## Design Plan

**Study type.** Within-subject observational; all participants receive the same task condition. No experimental manipulation distinguishes groups.

**Blinding and randomization.** None — single-condition design.

**Task overview.** Participants complete the following phases in fixed order:

1. **Structure-Learning** — 32 forced-choice trials in which the participant learns the transition graph of the task. The first step from the initial Circle state to one of two Middle states (Feather or Triangle) is deterministic (key press → state). The second step from each Middle state to one of two Terminal states is probabilistic: each Middle-state key press leads to one terminal 75% of the time (the "common" transition) and the other terminal 25% of the time (the "rare" transition).

2. **Structure Quiz** — a task-comprehension quiz that the participant must complete with 100% accuracy to proceed. Multiple attempts allowed; participants who cannot pass within a reasonable number of attempts are removed from the study by the platform.

3. **Value-Learning** — 20 trials in which the Feather Middle state yields +5 points and the Triangle Middle state yields −5 points; running total is displayed in real time.

4. **Attention Check** — a brief check, with an explicit warning that performance affects bonus payment, designed to ensure participants understood the value contingencies before the rating phase.

5. **Knowledge Check** — a short multi-question quiz administered after Attention Check and before the first rating. Items probe whether the participant correctly understood (a) which Middle state is currently associated with positive outcomes, (b) which is associated with negative outcomes, and (c) the probabilistic structure of the second-step transition. The per-subject `Knowledge_Check_Accuracy` field in the data export is the proportion of correctly-answered items; this field is used as an exclusion criterion (see Exclusions below).

6. **Rating 1** — Visual Analogue Scale rating of the subjective value of each Middle state (range −30 to +30).

7. **Revaluation 1** — the four terminal-state values are revealed as Terminal-1 = Terminal-2 = −20, Terminal-3 = Terminal-4 = +20.

8. **Rating 2** — Visual Analogue Scale rating after Revaluation 1.

9. **Query 1** — 12 binary decisions between (a) navigating to a specified Middle state (taking the journey) and (b) accepting a specified fixed point offer (taking the safe option). The decisions span six different fixed offers for the Feather Middle state and six for the Triangle Middle state.

10. **Revaluation 2** — terminal-state values updated to Terminal-1 = Terminal-2 = −15, Terminal-3 = Terminal-4 = +15.

11. **Rating 3** — Visual Analogue Scale rating after Revaluation 2.

12. **Query 2** — 12 binary decisions structured identically to Query 1, with a different fixed-offer grid.

Three questionnaires are administered at session end: the 10-item Emotion Regulation Questionnaire (ERQ; Gross & John, 2003); the 8-item abbreviated Penn State Worry Questionnaire (PSWQ-8; Hopko et al., 2003) for trait worry — this is the instrument labeled "Trait Anxiety Inventory" in the prior registration, where the labeling was an error (the State-Trait Anxiety Inventory is a different instrument); and a 10-item Physiological Anxiety Checklist of somatic-symptom items rated on a 5-point "in general" scale.

**Departures from the prior registration.**

1. **Query option grids expanded and stimulus-matched.** Each query phase now contains 12 binary decisions (six Feather-state offers plus six Triangle-state offers, up from four plus four in the prior registration). Within each query the Triangle offers are the sign-flipped mirror of the Feather offers, so that the distribution of absolute Expected-Value differences (|MB Expected Value − offer|) is identical between the two Middle states. This matched-difficulty design ensures that any Feather-vs-Triangle difference in choice accuracy or reaction time is not confounded by trial-difficulty imbalance. The offered values were chosen so that **20 of every 24 query trials are model-based-versus-model-free-discriminative** under the assumed model (defined below), and the remaining 4 trials are catch trials (1 per state per query, at the extreme offer ±20). The catch trial forces the model-based agent to pick its rare option (journey on Feather at offer −20, fixed on Triangle at offer +20), which provides a within-query test against rule-following participants who might otherwise pretend to be model-based by adopting a single heuristic per stimulus. The assumed model has the 75-25 second-step transition described above, a model-based agent that picks the optimal second-stage action, and ±5-point stage rewards on the Feather (+5) and Triangle (−5) Middle states learned during Value-Learning. Under this model the Query-1 model-based Expected Values are −15 for Feather and +15 for Triangle, and the Query-2 model-based Expected Values are −10 and +10 respectively. The model-free cached values remain at the experienced stage rewards (+5 and −5). The Query-1 option grids are Feather = {−20, −10, −7, −3, 0, +3} and Triangle = {+20, +10, +7, +3, 0, −3}; the Query-2 grids are Feather = {−20, −7, −4, −1, +2, +4} and Triangle = {+20, +7, +4, +1, −2, −4}. The matched |Expected Value − offer| set is {5, 5, 8, 12, 15, 18} for Query 1 and {10, 3, 6, 9, 12, 14} for Query 2; both sets contain the same magnitudes for Feather and Triangle within each query.

2. **Revaluation tree-silhouette visuals.** The full task structure (Initial Circle → Middle Feather or Triangle → four Terminal states) is shown as a tree diagram with the updated terminal values overlaid on the leaves. The rationale is to scaffold the participant's mental representation of the transition structure implicitly while the new values are encoded, supporting model-based representation of the revalued state space. The prior "Click-to-Reveal" sequential mechanic is replaced by a single press that reveals all four terminal values simultaneously, followed by a 15-second mandatory viewing period and a 10-second reflection countdown (which also shows the tree in a gray-placeholder form to keep the structural representation salient).

3. **Public-speaking teleprompter threat induction.** A new phase precedes Structure-Learning. Participants are told that following the shape-navigation game they will complete a public-speaking task — reading aloud from a teleprompter while a simulated live audience watches and posts text comments on their performance — and that the duration of that speaking task depends on their decisions in the shape-navigation game (worse decisions yield longer speaking time). A brief teleprompter preview with the simulated audience-chat sidebar is run before Structure-Learning to reinforce the threat. Throughout the task, each model-based-suboptimal choice silently adds time to a per-participant earned-speaking-time counter (base 30 seconds, ceiling 5 minutes; 8 seconds per free-choice Value-Learning trial reaching the Triangle Middle state, 10 seconds per model-based-suboptimal query response). The counter is logged for analysis but not displayed to the participant. At the end of the session, participants are debriefed that the public-speaking task will not be administered. The rationale is to embed the modelling decisions in a goal-relevant threat context. We do not preregister specific confirmatory hypotheses about the differential effect of the threat induction because the manipulation is novel to this paradigm and the relevant effect sizes are unknown; the earned-speaking-time variable is examined descriptively (see Exploratory analyses).

4. **Symmetric Revaluation-2 terminal values.** The second revaluation set was changed from the prior-registration design (Terminal-1 = −20, Terminal-2 = 0, Terminal-3 = 0, Terminal-4 = +20) to symmetric values (Terminal-1 = Terminal-2 = −15, Terminal-3 = Terminal-4 = +15). The rationale is to eliminate within-state value variance, so that the model-based-optimal participant no longer needs to discriminate between second-stage actions within each Middle state; the task collapses to first-stage choice plus transition knowledge. Model-based Expected Values are mathematically unchanged at −10 (Feather) and +10 (Triangle) under the assumed model.

## Sampling Plan

**Data-collection procedures.** Participants will be recruited through Prolific, beginning **2026-05-19**. Recruitment eligibility on the platform is restricted to: approval rate between 98 and 100; first language English; fluent in English; current country of residence in the United Kingdom, United States, Ireland, or Canada. Participants who have completed any prior version of this task (including the version registered at <https://osf.io/wn6ks/>) are excluded via a Prolific custom-screener / prior-participant-list.

**Sample size and rationale.** The power calculation is sensitized to the smaller of the two preregistered individual-differences correlations (Worry × Overthinking, prior pilot Spearman ρ = 0.205). Ensuring power to detect that effect implies power to detect the larger Physiological Anxiety × Overthinking effect (ρ = 0.359). For ρ = 0.205, one-sided α = 0.05, and target power = 0.90, the required model-based subgroup size is N_MB ≈ 200, computed via Fisher z-transformation as N = ((z_(1−α) + z_power) / atanh(ρ))² + 3 = ((1.6449 + 1.2816) / 0.2079)² + 3 ≈ 202. Assuming the 59% model-based-classification rate observed in the prior pilot (82 of 139) and a 10% exclusion attrition rate (zig-zag inconsistency plus knowledge-check failure), the Prolific recruitment target is 200 / 0.59 / 0.90 = **377 participants**.

## Variables

**Measured — questionnaires.** Emotion Regulation Questionnaire (ERQ; 10 items, 7-point Likert), Penn State Worry Questionnaire abbreviated form (PSWQ-8; 8 items, 5-point Likert), and Physiological Anxiety Checklist (10 items, 5-point Likert). Data field names: `Survey_ERQ_Q*_Raw`, `Survey_ANXIETY_1_Q*_Raw` (PSWQ-8 / worry), `Survey_ANXIETY_2_Q*_Raw` (Physiological Anxiety / somatic). Subject-level summaries: `worry` = sum of PSWQ-8 items (range 8–40); `somatic_anxiety` = sum of Physiological Anxiety items (range 10–50).

**Measured — task.** Per-trial choice (0 = take the fixed offer, 1 = take the journey to the Middle state), per-trial reaction time in seconds (data field `rt_s`), per-rating valence on a Visual Analogue Scale (range −100 to +100), per-trial state visited (Feather or Triangle), and per-trial offered fixed value in points.

**Indices.** The four indices below define the variables used in the confirmatory hypotheses. Each definition is self-contained; no notebook reference is required to evaluate the math.

- **Motor baseline (`motor_i`).** Per-subject median of Structure-Learning trial step reaction times, in seconds. Captures non-deliberative components of reaction time — key-press execution time and perceptual encoding — and is intended to isolate the cognitive-deliberation portion of the reaction time on query trials.

- **Per-trial deliberation time (`delib_t`).** Per-trial reaction time minus the subject's motor baseline, with a floor at 0.01 seconds:
  
  `delib_t = max(rt_t − motor_i, 0.01)`
  
  The clip avoids taking the log of zero or a negative number when raw reaction time is at or below the motor floor.

- **Per-subject log-transformed deliberation (`delib_log_i`).** Per subject, the mean across that subject's query trials of the natural log of per-trial deliberation time:
  
  `delib_log_i = (1 / n_i) · Σ_t log(delib_{i,t})`
  
  All deliberation measures throughout the analysis are on this log scale.

- **Canonical accuracy (`acc_canon_i`).** Per subject, the mean of `correct_canon` over that subject's query trials, where `correct_canon ∈ {0, 0.5, 1}`. A trial counts as 1 if the participant's choice matched the sign of (model-based Expected Value − fixed offer), as 0 if it had the wrong sign, and as 0.5 if the model-based Expected Value exactly equals the fixed offer (a value-neutral trial that cannot be "right" or "wrong").

- **Overthinking index (`OT_i`).**
  
  `OT_i = z(delib_log_i) − z(logit(acc_canon_i))`
  
  where `logit(p) = log(p / (1 − p))` with `p` clipped to the interval `[0.025, 0.975]` to avoid undefined values at the extremes, and `z(·)` is the pool z-score across all analyzed subjects (mean 0, standard deviation 1, computed once across the full model-based plus non-model-based sample). **Positive Overthinking values denote slow AND inaccurate responding** — the "more-overthinking" pole of the index. Footnote on sign: the prior pilot reported a Spearman correlation of −0.365 between somatic anxiety and an earlier definition of OT (`z(accuracy) − z(log deliberation RT)`, where positive = efficient). Under the current OT definition above, the same relationship is a positive correlation of equal magnitude. The predictions for H1 and H2 are stated as positive to match the current OT convention.

- **Anti-model-free trial.** A query trial in which the model-free cached value (Feather = +5 or Triangle = −5) and the model-based Expected Value (Feather = −15 or Triangle = +15 in Query 1, Feather = −10 or Triangle = +10 in Query 2) predict opposite choices for the offered fixed value. Anti-model-free trials are the subset on which model-based and model-free agents make different predictions and are therefore diagnostic of the participant's planning strategy.

- **Model-agnostic model-based classification (`mb_score`).** Per stimulus s ∈ {Feather, Triangle}:
  
  `mb_score_s = P(chose the model-based option | anti-model-free trial in stimulus s)`
  
  computed as the subject's mean choice rate on the subset of that subject's anti-model-free query trials in stimulus s, where the "model-based option" is the choice that aligns with the model-based Expected Value at that trial's offered fixed value. A subject is classified as **model-based** if `mb_score_Feather > 0.5` OR `mb_score_Triangle > 0.5` (above-chance model-based responding on at least one Middle state); otherwise the subject is classified as **non-model-based**. This is the lenient, either-stimulus, above-chance rule.

**Convergent validity of the model-agnostic classifier.** The model-agnostic classification is the binary partition used in confirmatory tests. We additionally fit the full hierarchical Bayesian inference pipeline from Payam Piray's Computational Brain/Behavior Modelling package (<https://github.com/payampiray/cbm_python>) and compute per-subject model responsibilities over an 11-model reinforcement-learning registry. The registry spans: pure model-free models with and without a learning-rate scaling parameter; pure model-based models; model-based models with separate temperature parameters per Middle state or per revaluation; one-parameter hybrid model-based / model-free models with a shared mixing weight; and parameter-extended hybrid variants with the mixing weight or temperature separated per stimulus or per revaluation. A binary classification is derived from each subject's winning hierarchical-Bayesian-inference model (pure-model-free models versus model-based and hybrid variants). In the prior pilot (N = 139), the model-agnostic and hierarchical-Bayesian-inference classifications agreed on 85.6% of subjects (Cohen's κ = 0.71). The disagreements concentrated on subjects whose winning hierarchical-Bayesian-inference model was a poorly-recovered nested model (those with weak parameter recovery in the prior simulation work), i.e. cases where the model fit itself was uncertain. We will report the same convergence statistics on the new sample as a manipulation check; if the new-sample agreement falls substantially below the prior pilot (Cohen's κ < 0.5), this would indicate that the two classifiers are no longer measuring the same construct in this sample and would prompt methodological reconsideration before interpreting the confirmatory tests.

## Analysis Plan

**H1 model.** Spearman correlation between `somatic_anxiety` and per-subject Overthinking, restricted to model-based-classified subjects. One-sided test at α = 0.05; predicted Spearman ρ > 0 (more somatic anxiety → more overthinking).

**H2 model.** Spearman correlation between `worry` and per-subject Overthinking, restricted to model-based-classified subjects. One-sided test at α = 0.05; predicted Spearman ρ > 0 (more worry → more overthinking).

**H3 model.** One-sided Mann-Whitney U test comparing per-subject log-transformed deliberation (`delib_log`) between model-based-classified and non-model-based-classified subjects, with the model-based group predicted to have the larger mean. α = 0.05. The standardized effect-size measure reported alongside U is the **rank-biserial correlation** (`r_rb`), computed as `1 − (2·U) / (n_MB · n_nonMB)`. A linear-regression comparison (`delib_log ~ mb_group`) with Welch-corrected standard errors is reported in parallel for transparency.

**Exclusion criteria** (applied in order on the subset of participants whose session status is COMPLETED in the data export):

1. **Zig-zag inconsistency** score ≥ 2.0, computed per subject as the summed monotonicity violation of P(chose-fixed-offer) across the offer-value range within each query × state cell. A consistent participant should be increasingly likely to take the fixed offer as the offer increases; the zig-zag score sums all the "drops" where a higher offer is taken less often than a lower one, across the four query × state cells.

2. **Knowledge-Check accuracy ≤ 0.25**, where the Knowledge Check is the short task-comprehension quiz administered after the Attention Check (see Task overview). The 0.25 threshold corresponds to floor performance on a four-alternative quiz.

**Missing data.** Subjects missing any item on a questionnaire are excluded from the corresponding individual-differences analysis (i.e. from H1 if any Physiological Anxiety item is missing; from H2 if any Penn State Worry Questionnaire item is missing). Per-trial missing data: query trials with missing choice or missing offered value are dropped from the trial-level dataframe; query trials with missing reaction time are kept for choice-based analyses but dropped from reaction-time-based analyses (Deliberation reaction time, Overthinking index, H3).

## Code availability

All analyses are implemented in two notebooks archived in the project repository: `Modelling_AllChoices_V4.ipynb` (data filtering, descriptive analyses, hierarchical Bayesian model fitting, and the H1 / H2 / H3 confirmatory tests) and `Paul/RT_Analyses.ipynb` (the model-agnostic `mb_score` classifier and the Overthinking index pipeline). The two notebooks are versioned alongside the data export and the task implementation (`task_v4.html`). The preregistration above is the authoritative specification of the planned analyses; any deviation between the notebook implementation and the preregistration will be noted explicitly in the manuscript.
