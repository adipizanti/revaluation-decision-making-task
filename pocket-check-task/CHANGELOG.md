# Changelog
Versions follow `MAJOR.MINOR.PATCH`. Any change to `CFG` (timings, values, trial counts) is at least MINOR.
A version used to collect real data is tagged `task-vX.Y.Z` and never edited afterwards.

## [0.2.0] - 2026-10-13
- Researcher view: every measure in the table now has a one-line explanation.
- Researcher view: new Data tab with a participant table (one row per person), a trial table preview, and downloads (participant CSV, trial CSV, raw JSON with paths).
- New CFG knobs `MAP_PATHS` and `QUIZ_N` (defaults unchanged: 4 and 6). The demo build uses them to run in about a minute (18 decisions).
- `npm run build:demo` builds `dist/demo.html` (shortened, banner, auto-loads synthetic data). Real task behavior unchanged.

## [Unreleased]
- See `docs/OPEN_FEEDBACK.md` (3 UI items).

## [0.1.0] - 2026-10-13
- Imported proof of concept, unchanged in behavior: structure learning, value learning, revaluation, queries, ratings.
- Mouse capture with coalesced pointer events; park position; VCAT-style phase timings.
- Researcher view: heat maps at individual, group and sample level; trial viewer; demo data.
- Added: modular `src/`, build script, smoke test, CI workflow, task version stamped into each run record (`taskVersion`).
