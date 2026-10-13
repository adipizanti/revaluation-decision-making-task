# Working rules for this folder (read first)

- Scope: only this folder and `ci/pocket-check-ci.yml` (copied to `.github/workflows/` on push). Never touch other project folders in the repo.
- Never push to `main`. Work on a branch `feature/<short-name>` or `fix/<short-name>`; open a PR; the user merges.
- Edit `src/`, never `dist/`. Run `npm test` before every commit; do not commit if it fails.
- Any change to timings, values, trial counts or instructions: add a CHANGELOG entry and bump the version in `package.json`.
- Do not edit the task between pipeline changes and a requested feature; UI feedback lives in `docs/OPEN_FEEDBACK.md`.
- Nothing is deployed to Prolific. A study freeze means: tag `task-vX.Y.Z`, then stop editing that version.
- No participant data, ids, or keys in the repo. Run exports and demo data stay out of git.
- Commit messages: one line, imperative ("Add ...", "Fix ...").
