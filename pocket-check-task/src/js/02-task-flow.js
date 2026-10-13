/* =====================================================================
   TASK FLOW: map -> quiz -> points -> rating -> (reval -> rating -> choices) x2 -> end
   ===================================================================== */
let S = null;
const ACT = { left: { html: `<div class="act">${svgIcon(P_LEFT, 64, 1.8)}</div>`, id: 'L' }, right: { html: `<div class="act">${svgIcon(P_RIGHT, 64, 1.8)}</div>`, id: 'R' } };
const ACTSPEC = { hw: CFG.ACT_HALF, hh: CFG.ACT_HALF, left: ACT.left, right: ACT.right };

function makeMap(rng) {
  const fM = rng() < .5, fF = rng() < .5, fT = rng() < .5;
  return { flipM: fM, flipF: fF, flipT: fT, ch: {
    S: fM ? { L: 'M1R', R: 'M1L' } : { L: 'M1L', R: 'M1R' },
    M1L: fF ? { L: 'T2', R: 'T1' } : { L: 'T1', R: 'T2' },
    M1R: fT ? { L: 'T4', R: 'T3' } : { L: 'T3', R: 'T4' } } };
}
const sideTo = (from, to) => S.map.ch[from].L === to ? 'L' : 'R';

function newSession() {
  const id = $('#pid').value.trim() || ('P' + Date.now().toString(36).slice(-5));
  const seed = Math.floor(Math.random() * 2147483647), rng = mulberry32(seed);
  S = { id, group: $('#grp').value.trim(), seed, rng, map: makeMap(rng), decisions: [], ratings: [], quiz: [], reveals: [], score: 0,
    t_start: new Date().toISOString(), mapTrial: 0,
    env: { ua: navigator.userAgent, screen: [screen.width, screen.height], win: [innerWidth, innerHeight], dpr: devicePixelRatio, stageScale: 0 } };
}

/* ---------- 1. map learning ---------- */
async function mapBlocks(blocks, label) {
  const paths = [['L', 'L'], ['L', 'R'], ['R', 'L'], ['R', 'R']], total = blocks * 4; let k = 0;
  for (let b = 0; b < blocks; b++) for (const [s0, s1] of shuffle(paths, S.rng)) {
    k++; setHud(label, k, total); const trial = ++S.mapTrial;
    let d = await decide({ ...ACTSPEC, phase: 'map', trial, step: 0, kind: 'action', state: 'S', forced: s0,
      tipPark: S.mapTrial <= 2 ? 'Move to the ring and wait' : '', tipPick: S.mapTrial <= 2 ? 'Click the glowing circle' : '' });
    S.decisions.push(d);
    const mid = S.map.ch.S[s0];
    d = await decide({ ...ACTSPEC, phase: 'map', trial, step: 1, kind: 'action', state: mid, forced: s1 });
    S.decisions.push(d);
    setTile(S.map.ch[mid][s1]); await sleep(CFG.TERMINAL_MS);
  }
}
async function quiz(round) {
  const ch = S.map.ch, items = [];
  for (const s of ['L', 'R']) items.push({ ask: `${s === 'L' ? 'Left' : 'Right'} from the circle leads to…`, state: 'S', ans: ch.S[s], other: ch.S[s] === 'M1L' ? 'M1R' : 'M1L' });
  for (const m of ['M1L', 'M1R']) { const o = m === 'M1L' ? 'M1R' : 'M1L'; for (const s of ['L', 'R']) items.push({ ask: `${ICON[m].n} can lead to…`, state: m, ans: ch[m][s], other: ch[o][S.rng() < .5 ? 'L' : 'R'] }); }
  let correct = 0; setHud('Check the map', 0, 0);
  const order = shuffle(items, S.rng);
  for (let i = 0; i < order.length; i++) {
    const it = order[i], ansSide = S.rng() < .5 ? 'L' : 'R';
    const card = id => ({ id, html: `<div class="card">${tileHTML(id, 96)}<span class="lbl">${ICON[id].n}</span></div>` });
    const d = await decide({ phase: 'quiz', trial: i + 1, step: 0, kind: 'quiz', state: it.state, ask: it.ask, hw: CFG.CARD_HW, hh: CFG.CARD_HH,
      left: card(ansSide === 'L' ? it.ans : it.other), right: card(ansSide === 'R' ? it.ans : it.other), correct: ansSide, meta: { round } });
    S.decisions.push(d); if (d.correct) correct++;
  }
  setAsk(''); S.quiz.push({ round, correct, total: order.length });
  return correct;
}
async function mapPhase() {
  await mapBlocks(CFG.SL_BLOCKS, 'Learn the map');
  let c = await quiz(1);
  if (c < CFG.QUIZ_PASS) { await mapBlocks(CFG.SL_REMEDIAL_BLOCKS, 'Learn the map again'); await quiz(2); }
}

/* ---------- 2. point learning ---------- */
function showReward(p) {
  const r = el.reward; r.className = 'at live ' + (p > 0 ? 'p' : 'n'); r.textContent = fmtPts(p);
  void r.offsetWidth; r.classList.add('show');
}
async function pointsPhase() {
  const sF = sideTo('S', 'M1L'), sT = sideTo('S', 'M1R'), total = CFG.VL_FORCED + CFG.VL_FREE;
  const forced = shuffle([...Array(CFG.VL_FORCED / 2).fill(sF), ...Array(CFG.VL_FORCED / 2).fill(sT)], S.rng);
  for (let i = 1; i <= total; i++) {
    setHud('Collect points', i, total, S.score);
    const f = i <= CFG.VL_FORCED ? forced[i - 1] : null;
    const d = await decide({ ...ACTSPEC, phase: 'points', trial: i, step: 0, kind: 'action', state: 'S', forced: f, correct: sF,
      tipPark: i === 1 ? 'Some shapes give points' : i === CFG.VL_FORCED + 1 ? 'Now you choose' : '', tipPick: i === 1 ? 'Click the glowing circle' : '' });
    const mid = S.map.ch.S[d.chosen], pts = CFG.VL_REWARD[mid]; S.score += pts;
    d.meta = { mid, pts, score: S.score }; S.decisions.push(d);
    setTile(mid); showReward(pts); setHud('Collect points', i, total, S.score); await sleep(CFG.REWARD_MS);
  }
}

/* ---------- 3. revaluation and ratings ---------- */
function treeHTML(vals) {
  const m = S.map.ch, mids = [m.S.L, m.S.R];
  const terms = [m[mids[0]].L, m[mids[0]].R, m[mids[1]].L, m[mids[1]].R], tx = [170, 410, 590, 830];
  const P = { S: [500, 190] }; P[mids[0]] = [290, 350]; P[mids[1]] = [710, 350];
  const ln = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#344158" stroke-width="3" stroke-linecap="round"/>`;
  let lines = ln(P.S, P[mids[0]]) + ln(P.S, P[mids[1]]);
  terms.forEach((tk, i) => { lines += ln(P[mids[i < 2 ? 0 : 1]], [tx[i], 500]); });
  const at = (k, x, y, sz) => `<div style="position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%)">${tileHTML(k, sz)}</div>`;
  let h = `<svg class="lines" viewBox="0 0 1000 700">${lines}</svg>` + at('S', P.S[0], P.S[1], 84) + at(mids[0], P[mids[0]][0], P[mids[0]][1], 84) + at(mids[1], P[mids[1]][0], P[mids[1]][1], 84);
  terms.forEach((tk, i) => { h += at(tk, tx[i], 500, 84); if (vals) h += `<div class="tv ${vals[tk] > 0 ? 'p' : 'n'}" style="left:${tx[i]}px;top:578px">${fmtPts(vals[tk])}</div>`; });
  return h;
}
async function revalPhase(r) {
  setHud('Values changed', 0, 0);
  const v = { T1: CFG.EV[r].M1L, T2: CFG.EV[r].M1L, T3: CFG.EV[r].M1R, T4: CFG.EV[r].M1R };
  showOverlay(`<div class="ovh">New values for the end shapes</div><div class="ovsub">They stay like this from now on.</div>${treeHTML(v)}<div class="btnrow"><button class="btn" id="ovBtn" disabled>${Math.ceil(CFG.REVAL_MIN_MS / 1000)}</button></div>`);
  const t0 = performance.now(), btn = $('#ovBtn');
  await new Promise(res => {
    let left = Math.ceil(CFG.REVAL_MIN_MS / 1000);
    const iv = setInterval(() => { left--; if (left > 0) btn.textContent = left; else { clearInterval(iv); btn.textContent = 'Continue'; btn.disabled = false; } }, 1000);
    btn.onclick = () => res();
  });
  S.reveals.push({ reval: r, viewMs: Math.round(performance.now() - t0) }); hideOverlay();
}
async function ratingPhase(k) {
  setHud('Rate', 0, 0);
  const rows = ['M1L', 'M1R'], ys = [290, 450];
  let h = `<div class="ovh">How many points would you expect from each shape?</div><div class="ovsub">Start there, then play on.</div>`;
  rows.forEach((st, i) => {
    h += `<div class="rrow" style="top:${ys[i]}px"><div>${tileHTML(st, 84)}</div><div><input type="range" id="rs${i}" class="untouched" min="-30" max="30" step="5" value="0" aria-label="${ICON[st].n}"><div class="ticks"><span>−30</span><span>0</span><span>+30</span></div></div><div class="val" id="rv${i}">–</div></div>`;
  });
  h += `<div class="btnrow"><button class="btn" id="ovBtn" disabled>Confirm</button></div>`;
  showOverlay(h);
  const t0 = performance.now(), touched = [false, false], vals = [0, 0], btn = $('#ovBtn');
  rows.forEach((st, i) => {
    const sl = $('#rs' + i), vv = $('#rv' + i);
    const upd = () => { touched[i] = true; vals[i] = +sl.value; sl.classList.remove('untouched'); vv.textContent = fmtPts(vals[i]); vv.className = 'val ' + (vals[i] > 0 ? 'p' : vals[i] < 0 ? 'n' : ''); btn.disabled = !(touched[0] && touched[1]); };
    sl.addEventListener('input', upd); sl.addEventListener('change', upd);
  });
  await new Promise(res => { btn.onclick = () => res(); });
  S.ratings.push({ k, M1L: vals[0], M1R: vals[1], rt: Math.round(performance.now() - t0) }); hideOverlay();
}

/* ---------- 4. choices: play on from a shape vs a sure number ---------- */
async function choicePhase(r) {
  const list = [];
  for (const st of ['M1L', 'M1R']) for (const d of CFG.QUERY_D) for (const sg of [-1, 1]) { const ev = CFG.EV[r][st]; list.push({ st, d, sg, ev, fixed: ev + sg * d }); }
  const order = shuffle(list, S.rng), sides = shuffle(order.map((_, i) => i % 2 ? 'L' : 'R'), S.rng), total = order.length;
  const tip = 'Play on from the shape and collect where it leads, or take the sure points.';
  for (let i = 0; i < total; i++) {
    const q = order[i], rs = sides[i], ss = rs === 'L' ? 'R' : 'L';
    const route = { id: 'route:' + q.st, html: `<div class="card">${tileHTML(q.st, 92)}<span class="lbl">play on</span></div>` };
    const sure = { id: 'sure:' + q.fixed, html: `<div class="card"><div class="big ${q.fixed > 0 ? 'p' : 'n'}">${fmtPts(q.fixed)}</div><span class="lbl">sure points</span></div>` };
    setHud(`Choose ${r} of 2`, i + 1, total);
    const d = await decide({ phase: 'choice', trial: (r - 1) * total + i + 1, step: 0, kind: 'choice', showTile: false, state: q.st, hw: CFG.CARD_HW, hh: CFG.CARD_HH,
      left: rs === 'L' ? route : sure, right: rs === 'R' ? route : sure, correct: q.ev > q.fixed ? rs : ss,
      tipPark: i < 2 ? tip : '', tipPick: i < 2 ? tip : '',
      meta: { reval: r, state: q.st, ev: q.ev, fixed: q.fixed, dist: q.d, sign: q.sg, routeSide: rs, mbRoute: q.ev > q.fixed, mfRoute: CFG.VL_REWARD[q.st] > q.fixed } });
    d.meta.chosenRoute = d.chosen === rs; S.decisions.push(d);
  }
}

/* ---------- run ---------- */
async function runTask() {
  newSession(); layoutStage(); S.env.stageScale = stageScale;
  show('taskScreen'); hideOverlay(); setTile(null); setAsk(''); setCap('');
  await mapPhase();
  await pointsPhase(); setTile(null);
  await ratingPhase(1);
  for (const r of [1, 2]) { await revalPhase(r); await ratingPhase(r + 1); await choicePhase(r); }
  finishRun();
}

/* ---------- data out ---------- */
const CSV_COLS = ['id', 'group', 'phase', 'trial', 'step', 'kind', 'state', 'forced', 'chosen', 'chosenId', 'correctSide', 'correct', 'rt', 'init', 'heading', 'enter', 'dwell',
  'exits', 'visitedOther', 'hoverTime', 'hovers', 'hoverOn', 'hoverBefore', 'flips', 'mad', 'auc', 'pathLen', 'straight', 'velPeak', 'sInit', 'sMove', 'sApproach', 'sDwell',
  'reval', 'dist', 'sign', 'ev', 'fixed', 'nudged', 'wrongClicks', 'missClicks'];
function runToCsv(runs) {
  const rows = [CSV_COLS.join(',')];
  for (const run of runs) for (const d of run.decisions) {
    const o = { id: run.id, group: run.group, ...d, ...d.m, ...d.meta };
    rows.push(CSV_COLS.map(c => { let v = o[c]; if (v == null) return ''; if (typeof v === 'boolean') v = v ? 1 : 0; v = String(v); return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(','));
  }
  return rows.join('\n');
}
async function saveFile(name, text, mime) {
  try {
    const dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null;
    if (dl) { await dl.save({ filename: name, data: text }); return 'saved'; }
  } catch (e) { if (e && e.code === 'declined') return 'declined'; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); return 'fallback';
}
const LS_KEY = 'pocketcheck.runs.v1';
function lsRead() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) { return []; } }
function lsWrite(arr) { try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); return true; } catch (e) { return false; } }
function lsAdd(run) { let arr = lsRead().filter(r => r.id !== run.id); arr.push(run); while (arr.length && !lsWrite(arr)) arr.shift(); return arr.some(r => r.id === run.id); }

let LAST = null;
function finishRun() {
  const meds = S.decisions.map(d => d.m && d.m.medDt).filter(v => v != null);
  S.env.medianSampleIntervalMs = median(meds);
  LAST = { schema: 'pocketcheck/1', taskVersion: '__TASK_VERSION__', id: S.id, group: S.group, startedAt: S.t_start, finishedAt: new Date().toISOString(), seed: S.seed, map: S.map, cfg: CFG, env: S.env,
    quiz: S.quiz, ratings: S.ratings, reveals: S.reveals, score: S.score, decisions: S.decisions };
  const kept = lsAdd(LAST);
  const ch = S.decisions.filter(d => d.phase === 'choice');
  const acc = ch.length ? ch.filter(d => d.correct).length / ch.length : null;
  const q = S.quiz[S.quiz.length - 1];
  const kv = [[acc == null ? '–' : Math.round(acc * 100) + '%', 'Answers matching the new values'], [Math.round(median(ch.map(d => d.rt)) || 0) + ' ms', 'Median choice time'],
    [Math.round(median(ch.map(d => d.m.init)) || 0) + ' ms', 'Median time to first move'], [Math.round(median(ch.map(d => d.m.dwell)) || 0) + ' ms', 'Median time on target before click'],
    [q ? `${q.correct}/${q.total}` : '–', 'Map quiz'], [fmtPts(S.score), 'Points collected']];
  $('#endKv').innerHTML = kv.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('');
  $('#endSub').textContent = kept ? 'Your run is saved in this browser.' : 'This run was too large to keep in the browser. Save the JSON file.';
  $('#endNote').textContent = '';
  show('endScreen');
}
$('#dlJson').onclick = async () => { if (!LAST) return; const r = await saveFile(`pocketcheck_${LAST.id}.json`, JSON.stringify(LAST), 'application/json'); $('#endNote').textContent = r === 'declined' ? 'Not saved.' : 'Sent to your downloads.'; };
$('#dlCsv').onclick = async () => { if (!LAST) return; const r = await saveFile(`pocketcheck_${LAST.id}_metrics.csv`, runToCsv([LAST]), 'text/csv'); $('#endNote').textContent = r === 'declined' ? 'Not saved.' : 'Sent to your downloads.'; };
$('#again').onclick = () => show('intro');
$('#endToRv').onclick = () => { openRv(LAST); };

/* ---------- screens ---------- */
function show(id) { for (const s of ['intro', 'taskScreen', 'endScreen', 'rv']) $('#' + s).hidden = s !== id; window.scrollTo(0, 0); if (id === 'taskScreen') layoutStage(); }
$('#startBtn').onclick = () => { runTask(); };
$('#toRv').onclick = () => openRv();
$('#rvBack').onclick = () => show('intro');
(function intro() {
  const coarseOnly = matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches;
  $('#mouseWarn').hidden = !coarseOnly;
  const order = [['S', 50, 12], ['M1L', 27, 40], ['M1R', 73, 40], ['T1', 14, 76], ['T2', 40, 76], ['T3', 60, 76], ['T4', 86, 76]];
  const pos = Object.fromEntries(order.map(([k, x, y]) => [k, [x, y]]));
  const link = (a, b) => `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}" stroke="#344158" stroke-width=".7" stroke-linecap="round"/>`;
  $('#treeArt').innerHTML = `<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none">${link('S', 'M1L')}${link('S', 'M1R')}${link('M1L', 'T1')}${link('M1L', 'T2')}${link('M1R', 'T3')}${link('M1R', 'T4')}</svg>` +
    order.map(([k, x, y]) => `<div class="tile" style="left:${x}%;top:${y}%;--c:${ICON[k].c};--s:${k === 'S' || k.startsWith('M') ? 86 : 72}px">${svgIcon(ICON[k].p, (k === 'S' || k.startsWith('M') ? 86 : 72) * .5)}</div>`).join('');
})();
