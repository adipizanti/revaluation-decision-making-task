# Run record (`schema: pocketcheck/1`)
One JSON object per participant: `taskVersion`, `id`, `group`, `startedAt`, `finishedAt`, `seed`, `map`, `cfg`, `env`,
`decisions[]`, `ratings[]`, `quiz[]`, `reveals[]`, `score`.

Each decision: `phase` (map, points, choice), `trial`, `step`, `chosen`, `correct`, `rt`, `tr {t,x,y}` (trajectory in
stage coordinates, 1000x700), and `m` (derived metrics: initiation, heading, on-target time, dwell, hovers, reversals,
deviation toward the other option, split times). Choice decisions also carry `meta` (reval, state, ev, fixed, dist, sign).
CSV export is `runToCsv()` in `02-task-flow.js`. Demo runs have `demo: true` and must never be analyzed as data.
