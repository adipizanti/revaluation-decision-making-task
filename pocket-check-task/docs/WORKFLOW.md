# Workflow

1. Pick an item from `docs/OPEN_FEEDBACK.md` or a new request. Create a branch from `main`.
2. Edit `src/`. Run `npm test`. Open `dist/index.html` and click through the changed part.
3. Update `CHANGELOG.md` (and the version in `package.json` if behavior or CFG changed).
4. Push the branch, open a PR. CI (`pocket-check-ci`) builds and runs the scripted-mouse test.
5. Review and merge. For a data-collection version, tag `task-vX.Y.Z` on the merge commit.

Pipeline: `src/` -> `scripts/build.mjs` -> `dist/index.html` (CI also uploads it as a build artifact).
Deployment (hosting, data saving, Prolific) is a separate, later step and is not part of this pipeline yet.
