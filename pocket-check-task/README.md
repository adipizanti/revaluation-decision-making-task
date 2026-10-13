# Pocket Check Task (proof of concept)

A two-step revaluation task (structure learning, value learning, revaluation, queries, ratings) that records
**mouse trajectories** so that checking (knowing the answer but hesitating) can be separated from slow calculation.
Model-based vs model-free behavior is measured from the query choices, before and independent of any checking measure.

**Status:** v0.1.0 proof of concept. Not deployed. Nothing here goes to Prolific until a tagged release is approved.

## Develop

    npm install
    npx playwright install chromium
    npm run build      # src/ -> dist/index.html (single self-contained file)
    npm test           # build + scripted-mouse smoke test
    npm run serve      # build and open on http://localhost:8080

## Layout

    src/head.html, styles.css, markup.html   page shell
    src/js/01-core.js            CONFIG (CFG), icons, mouse capture, decision engine, metrics
    src/js/02-task-flow.js       map learning, points, quiz, reval, ratings, choice, CSV export
    src/js/03-researcher-view.js heat maps (individual / group / sample), trial viewer, demo data
    scripts/build.mjs            concatenates src into dist/index.html, stamps the version
    tests/smoke.mjs              Playwright: scripted mouse + researcher view
    docs/                        data format, decision log, open feedback

Edit `src/` only. `dist/` is generated and ignored by git.

## Workflow

See `CLAUDE.md` and `docs/WORKFLOW.md`. Short version: branch, change, `npm test`, PR, review, merge, tag.
