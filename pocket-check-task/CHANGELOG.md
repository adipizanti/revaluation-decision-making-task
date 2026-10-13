# Changelog
Versions follow `MAJOR.MINOR.PATCH`. Any change to `CFG` (timings, values, trial counts) is at least MINOR.
A version used to collect real data is tagged `task-vX.Y.Z` and never edited afterwards.

## [Unreleased]
- See `docs/OPEN_FEEDBACK.md` (3 UI items).

## [0.1.0] - 2026-10-13
- Imported proof of concept, unchanged in behavior: structure learning, value learning, revaluation, queries, ratings.
- Mouse capture with coalesced pointer events; park position; VCAT-style phase timings.
- Researcher view: heat maps at individual, group and sample level; trial viewer; demo data.
- Added: modular `src/`, build script, smoke test, CI workflow, task version stamped into each run record (`taskVersion`).
