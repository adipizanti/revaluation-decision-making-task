/* =====================================================================
   RESEARCHER VIEW: trial / person / group / sample, heat maps, split times
   ===================================================================== */
const RV = { runs: [], level: 'part', part: null, group: null, trial: 0 };
const GX = 40, GY = 28, CW = 800, CH = 560, K = CW / W;
const HEAT = { bg: [11, 14, 19], a: [18, 57, 74], b: [26, 140, 166], c: [213, 243, 251] };
const mix = (p, q, f) => p.map((v, i) => v + (q[i] - v) * f);
function heatRGB(t) {
  t = Math.max(0, Math.min(1, t));
  if (t < .15) return mix(HEAT.bg, HEAT.a, t / .15);
  if (t < .55) return mix(HEAT.a, HEAT.b, (t - .15) / .4);
  return mix(HEAT.b, HEAT.c, (t - .55) / .45);
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const gname = r => r.group || '(no group)';

function openRv(run) {
  show('rv');
  if (run && !RV.runs.some(r => r.id === run.id)) RV.runs.push(run);
  else if (run) RV.runs = RV.runs.map(r => r.id === run.id ? run : r);
  if (!RV.runs.length) { const saved = lsRead(); if (saved.length) RV.runs.push(...saved); }
  if (run) RV.part = run.id;
  renderRv();
}
function addRuns(list) {
  for (const r of list) { if (!r || !r.decisions) continue; const i = RV.runs.findIndex(x => x.id === r.id); if (i >= 0) RV.runs[i] = r; else RV.runs.push(r); }
  renderRv();
}
$('#addFiles').onclick = () => $('#fileIn').click();
$('#fileIn').onchange = async e => {
  const out = [];
  for (const f of e.target.files) { try { const j = JSON.parse(await f.text()); (Array.isArray(j) ? j : [j]).forEach(x => out.push(x)); } catch (err) { /* skip unreadable file */ } }
  e.target.value = ''; addRuns(out);
};
$('#addSaved').onclick = () => addRuns(lsRead());
$('#addDemo').onclick = () => addRuns(demoRuns());
$('#clearRuns').onclick = () => { RV.runs = []; RV.part = RV.group = null; renderRv(); };
$$('#lvl button').forEach(b => b.onclick = () => { RV.level = b.dataset.l; renderRv(); });
['selPart', 'selGroup', 'selTrial', 'fPhase', 'fOut', 'fDiff', 'fSplit'].forEach(id => $('#' + id).addEventListener('change', e => {
  if (id === 'selPart') { RV.part = e.target.value; RV.trial = 0; } if (id === 'selGroup') RV.group = e.target.value; if (id === 'selTrial') RV.trial = +e.target.value; renderRv();
}));

function passes(d) {
  const ph = $('#fPhase').value, out = $('#fOut').value, df = $('#fDiff').value;
  if (ph !== 'all' && d.phase !== ph) return false;
  if (out === 'right' && d.correct !== true) return false;
  if (out === 'wrong' && d.correct !== false) return false;
  if (df !== 'all') { const x = d.meta && d.meta.dist; if (x == null) return false; if (df === 'hard' ? x > 6 : x < 12) return false; }
  return true;
}
function splitKey(it, how) {
  const d = it.d;
  if (how === 'group') return gname(it.run);
  if (how === 'out') return d.correct === true ? 'Model-based answer' : d.correct === false ? 'Other answer' : 'No right answer';
  if (how === 'diff') { const x = d.meta && d.meta.dist; return x == null ? 'n/a' : x <= 6 ? 'Hard (3, 6)' : 'Easy (12, 24)'; }
  if (how === 'phase') return { map: 'Map learning', points: 'Point learning', quiz: 'Map quiz', choice: 'Choices' }[d.phase] || d.phase;
  if (how === 'reval') return d.meta && d.meta.reval ? 'Revaluation ' + d.meta.reval : 'n/a';
  return 'All decisions';
}

/* ---------- aggregation ---------- */
function gridFor(items) {
  const g = new Float32Array(GX * GY), cw = W / GX, ch = H / GY;
  for (const { d } of items) {
    const { t, x, y } = d.tr, n = t.length, flip = (d.correctSide || d.chosen) === 'L';
    let i0 = 0; for (let i = 0; i < n; i++) { if (t[i] <= 0) i0 = i; else break; }
    for (let k = i0; k < n - 1; k++) {
      const w = (Math.max(t[k + 1], 0) - Math.max(t[k], 0)) / 1000; if (w <= 0) continue;
      const x0 = flip ? W - x[k] : x[k], y0 = y[k], x1 = flip ? W - x[k + 1] : x[k + 1], y1 = y[k + 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 10));
      for (let s = 0; s < steps; s++) {
        const f = steps === 1 ? 0 : s / steps, px = x0 + (x1 - x0) * f, py = y0 + (y1 - y0) * f;
        const cx = Math.min(GX - 1, Math.max(0, Math.floor(px / cw))), cy = Math.min(GY - 1, Math.max(0, Math.floor(py / ch)));
        g[cy * GX + cx] += w / steps;
      }
    }
  }
  const nd = items.length || 1; for (let i = 0; i < g.length; i++) g[i] /= nd;
  // light 3x3 blur
  const o = new Float32Array(g.length), kw = [1, 2, 1];
  for (let yy = 0; yy < GY; yy++) for (let xx = 0; xx < GX; xx++) {
    let s = 0, ws = 0;
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const X = xx + b, Y = yy + a; if (X < 0 || Y < 0 || X >= GX || Y >= GY) continue; const w = kw[a + 1] * kw[b + 1]; s += g[Y * GX + X] * w; ws += w; }
    o[yy * GX + xx] = s / ws;
  }
  return o;
}
function baseCanvas(c, geom) {
  c.width = CW; c.height = CH; const x = c.getContext('2d');
  x.fillStyle = '#0b0e13'; x.fillRect(0, 0, CW, CH); return x;
}
function drawGeom(x, geom, flipped) {
  x.save(); x.lineWidth = 1.5; x.setLineDash([5, 5]);
  const rects = flipped ? [['R', '#4b5b74'], ['L', '#2a3445']] : [['L', '#4b5b74'], ['R', '#4b5b74']];
  for (const [s, col] of rects) { const h = geom[s]; x.strokeStyle = col; x.strokeRect((h.cx - h.hw) * K, (h.cy - h.hh) * K, h.hw * 2 * K, h.hh * 2 * K); }
  x.setLineDash([]); x.strokeStyle = '#4b5b74'; x.beginPath(); x.arc(CFG.PARK.x * K, CFG.PARK.y * K, 34 * K, 0, 7); x.stroke();
  if (flipped) { x.fillStyle = '#8793a6'; x.font = '12px Schibsted Grotesk, sans-serif'; x.fillText('answer', (geom.R.cx - geom.R.hw) * K + 4, (geom.R.cy - geom.R.hh) * K - 6); }
  x.restore();
}
function drawHeat(c, g, max, geom) {
  const x = baseCanvas(c), off = document.createElement('canvas'); off.width = GX; off.height = GY;
  const ox = off.getContext('2d'), im = ox.createImageData(GX, GY);
  for (let i = 0; i < g.length; i++) { const [r, gg, b] = heatRGB(max > 0 ? Math.sqrt(g[i] / max) : 0); im.data.set([r, gg, b, 255], i * 4); }
  ox.putImageData(im, 0, 0); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(off, 0, 0, CW, CH);
  drawGeom(x, geom, true);
}

const MET = [
  ['Choice time (ms)', d => d.rt, 0], ['Time to first move (ms)', d => d.m.init, 0], ['Move to heading (ms)', d => d.m.sMove, 0], ['Heading to on-target (ms)', d => d.m.sApproach, 0],
  ['Time on target before click (ms)', d => d.m.dwell, 0], ['Hover time (ms)', d => d.m.hoverTime, 0], ['Hovers', d => d.m.hovers, 1], ['Direction reversals', d => d.m.flips, 1],
  ['Max pull to other side (px)', d => d.m.mad, 0], ['Area toward other side (px²)', d => d.m.auc, 0], ['Path straightness (1 = straight)', d => d.m.straight, 2],
  ['Peak speed (px/s)', d => d.m.velPeak, 0], ['Touched other option (%)', d => d.m.visitedOther ? 100 : 0, 0, true], ['Matches new values (%)', d => d.correct == null ? null : d.correct ? 100 : 0, 0, true]
];
function aggregate(items, fn, pct) {
  const by = new Map(); for (const it of items) { const v = fn(it.d); if (v == null || !isFinite(v)) continue; if (!by.has(it.run.id)) by.set(it.run.id, []); by.get(it.run.id).push(v); }
  const per = [...by.values()].map(a => pct ? mean(a) : median(a)); return mean(per);
}
const fmt = (v, dec) => v == null ? '–' : (+v).toFixed(dec);

/* ---------- main render ---------- */
function renderRv() {
  const runs = RV.runs, main = $('#rvMain');
  $('#demoTag').hidden = !runs.some(r => r.demo);
  // run list
  $('#runList').innerHTML = runs.map((r, i) => `<div class="run"><span class="id" title="${esc(r.id)}">${esc(r.id)}</span><input type="text" data-i="${i}" value="${esc(r.group || '')}" placeholder="group" aria-label="Group for ${esc(r.id)}"><button data-x="${i}" aria-label="Remove ${esc(r.id)}">×</button></div>`).join('') || '<div class="muted" style="font-size:13px">No runs loaded.</div>';
  $$('#runList input').forEach(inp => inp.oninput = e => { runs[+e.target.dataset.i].group = e.target.value; clearTimeout(inp._t); inp._t = setTimeout(renderRv, 350); });
  $$('#runList button').forEach(b => b.onclick = () => { runs.splice(+b.dataset.x, 1); renderRv(); });
  if (!runs.length) { main.innerHTML = `<div class="empty"><b>No runs loaded yet</b>Finish the task, add JSON files from earlier runs, or load synthetic demo data to see the views.</div>`; $('#selPart').innerHTML = $('#selGroup').innerHTML = $('#selTrial').innerHTML = ''; return; }
  const groups = [...new Set(runs.map(gname))];
  if (!runs.some(r => r.id === RV.part)) RV.part = runs[0].id;
  if (!groups.includes(RV.group)) RV.group = groups[0];
  $('#selPart').innerHTML = runs.map(r => `<option value="${esc(r.id)}">${esc(r.id)}${r.group ? ' · ' + esc(r.group) : ''}</option>`).join(''); $('#selPart').value = RV.part;
  $('#selGroup').innerHTML = groups.map(g => `<option>${esc(g)}</option>`).join(''); $('#selGroup').value = RV.group;
  $$('#lvl button').forEach(b => b.classList.toggle('on', b.dataset.l === RV.level));
  const L = RV.level;
  $('#selPartWrap').hidden = !(L === 'trial' || L === 'part'); $('#selGroupWrap').hidden = L !== 'group'; $('#selTrialWrap').hidden = L !== 'trial'; $('#filtBox').hidden = L === 'trial';
  if (L === 'trial') return renderTrial(runs.find(r => r.id === RV.part));
  let pool = runs;
  if (L === 'part') pool = runs.filter(r => r.id === RV.part);
  if (L === 'group' && $('#fSplit').value !== 'group') pool = runs.filter(r => gname(r) === RV.group);
  const items = []; for (const run of pool) for (const d of run.decisions) if (d.tr && passes(d)) items.push({ run, d });
  const how = $('#fSplit').value, map = new Map();
  for (const it of items) { const k = splitKey(it, how); if (!map.has(k)) map.set(k, []); map.get(k).push(it); }
  const panels = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([label, its]) => ({ label, its, g: gridFor(its) }));
  if (!panels.length) { main.innerHTML = `<div class="empty"><b>No decisions match these filters</b>Try All phases, or clear the outcome and difficulty filters.</div>`; return; }
  const max = Math.max(...panels.map(p => Math.max(...p.g)));
  const geom = (items[0] && items[0].d.hit) || { L: { cx: 190, cy: 175, hw: 96, hh: 104 }, R: { cx: 810, cy: 175, hw: 96, hh: 104 } };
  main.innerHTML = `<div class="panels">${panels.map((p, i) => `<div class="pnl"><div class="ph"><b>${esc(p.label)}</b><span class="muted num" style="font-size:12px">${p.its.length} decisions · ${new Set(p.its.map(x => x.run.id)).size} people</span></div><canvas id="hc${i}"></canvas></div>`).join('')}</div>
    <div class="legend"><span>less time</span><i></i><span>more time (up to ${max.toFixed(2)} s per decision in one cell). Paths are flipped so the answer is on the right.</span></div>
    <div class="tbl"><table><thead><tr><th>Measure</th>${panels.map(p => `<th>${esc(p.label)}</th>`).join('')}</tr></thead><tbody>${MET.map(([name, fn, dec, pct]) => `<tr><td>${name}</td>${panels.map(p => `<td>${fmt(aggregate(p.its, fn, pct), dec)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="muted" style="font-size:12px;margin-top:8px">Table cells are each person's median, averaged across people (percentages are means).</p>`;
  panels.forEach((p, i) => drawHeat($('#hc' + i), p.g, max, geom));
}

/* ---------- single trial ---------- */
const SPLITC = [['#1f5f78', '#e8ecf3', 'First move'], ['#2b8fa6', '#06222c', 'Heading'], ['#6fc3d6', '#06222c', 'Approach'], ['#d5f3fb', '#06222c', 'On target']];
function renderTrial(run) {
  const main = $('#rvMain');
  const list = run.decisions.filter(d => d.tr);
  if (RV.trial >= list.length) RV.trial = 0;
  $('#selTrial').innerHTML = list.map((d, i) => `<option value="${i}">${i + 1}. ${d.phase} ${d.trial}.${d.step} ${d.chosen}${d.correct == null ? '' : d.correct ? ' ✓' : ' ✗'} ${Math.round(d.rt)} ms</option>`).join(''); $('#selTrial').value = RV.trial;
  const d = list[RV.trial], m = d.m, { t, x, y } = d.tr, n = t.length;
  const c = document.createElement('canvas'), cx = baseCanvas(c);
  drawGeom(cx, d.hit, false);
  const rt = Math.max(1, t[n - 1]), col = f => mix([43, 143, 166], [232, 236, 243], f).map(Math.round);
  cx.lineWidth = 3; cx.lineCap = 'round';
  for (let i = 1; i < n; i++) { const f = Math.max(0, Math.min(1, t[i] / rt)); cx.strokeStyle = t[i] < 0 ? '#2a3445' : `rgb(${col(f)})`; cx.beginPath(); cx.moveTo(x[i - 1] * K, y[i - 1] * K); cx.lineTo(x[i] * K, y[i] * K); cx.stroke(); }
  const at = tm => { let j = 0; for (let i = 0; i < n; i++) if (t[i] <= tm) j = i; return [x[j] * K, y[j] * K]; };
  const dot = (tm, label, fill, below) => { if (tm == null) return; const [px, py] = at(tm); cx.beginPath(); cx.arc(px, py, 6, 0, 7); cx.fillStyle = fill ? '#e8ecf3' : '#0b0e13'; cx.fill(); cx.strokeStyle = '#e8ecf3'; cx.lineWidth = 2; cx.stroke(); cx.fillStyle = '#e8ecf3'; cx.font = '12px Schibsted Grotesk, sans-serif'; cx.fillText(label, below ? px - 22 : px + 10, below ? py + 24 : py - 8); };
  dot(0, 'reveal', false, true); dot(m.init, 'first move', false); dot(m.heading, 'heading', false); dot(m.enter, 'on target', false); dot(rt, 'click', true);
  const segs = [m.sInit, m.sMove, m.sApproach, m.sDwell].map(v => v == null ? 0 : Math.max(0, v)), tot = segs.reduce((a, b) => a + b, 0) || 1;
  main.innerHTML = `<div class="trialgrid">
    <div class="pnl"><div class="ph"><b>${esc(run.id)} · ${d.phase} ${d.trial}.${d.step}</b><span class="muted num" style="font-size:12px">chose ${d.chosen}${d.correct == null ? '' : d.correct ? ', matches new values' : ', other answer'}</span></div><div id="tcWrap"></div>
      <div class="splitbar">${segs.map((s, i) => s > 0 ? `<div style="flex:${s / tot};background:${SPLITC[i][0]};color:${SPLITC[i][1]}">${Math.round(s)}</div>` : '').join('')}</div>
      <div class="splitkey">${SPLITC.map(s => `<span><i style="background:${s[0]}"></i>${s[2]}</span>`).join('')}</div></div>
    <div class="tbl" style="margin:0"><table><tbody>${[['Choice time', d.rt], ['First move', m.init], ['Heading', m.heading], ['On target', m.enter], ['Time on target', m.dwell], ['Hover time', m.hoverTime], ['Hovers', m.hovers], ['Reversals', m.flips], ['Max pull to other side (px)', m.mad], ['Touched other option', m.visitedOther ? 'yes' : 'no'], ['Left the target before click', m.exits], ['Peak speed (px/s)', m.velPeak], ['Samples', m.nSamples], ['Median sample gap (ms)', m.medDt]].map(([k, v]) => `<tr><td>${k}</td><td>${v == null ? '–' : typeof v === 'number' ? Math.round(v * 10) / 10 : v}</td></tr>`).join('')}</tbody></table></div></div>`;
  $('#tcWrap').appendChild(c); c.style.cssText = 'width:100%;display:block;border-radius:10px;aspect-ratio:1000/700';
}

/* ---------- synthetic demo data (clearly labelled in the UI) ---------- */
function demoRuns() {
  const rng = mulberry32(2026), out = [];
  const gauss = () => { let u = 0, v = 0; while (!u) u = rng(); while (!v) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  for (let p = 0; p < 12; p++) {
    const high = p >= 6, weak = p === 2 || p === 9;
    const P = { init: 380 + gauss() * 40, move: 640 + gauss() * 70, pHes: high ? .5 : .12, dwellHes: 700, dwellBase: 120, pDetour: high ? .3 : .08, worry: high };
    const decisions = []; let seq = 0;
    const synth = (phase, trial, step, kind, correctSide, geomHW, geomHH, meta, errRate, fast) => {
      const hit = { L: { cx: 190, cy: 175, hw: geomHW, hh: geomHH }, R: { cx: 810, cy: 175, hw: geomHW, hh: geomHH } };
      const chosen = rng() < errRate ? (correctSide === 'L' ? 'R' : 'L') : correctSide;
      const hard = meta && meta.dist != null && meta.dist <= 6;
      const sx = 500 + gauss() * 6, sy = 600 + gauss() * 6, tgt = hit[chosen];
      const tx = tgt.cx + (rng() * 2 - 1) * tgt.hw * .45, ty = tgt.cy + (rng() * 2 - 1) * tgt.hh * .45;
      const initMs = Math.max(120, (fast ? P.init * .6 : P.init) * Math.exp(gauss() * .3) * (hard ? 1.25 : 1));
      const moveMs = Math.max(320, (fast ? P.move * .85 : P.move) * Math.exp(gauss() * .2));
      const dwell = fast ? 60 + rng() * 90 : (rng() < P.pHes ? P.dwellHes * (.6 + rng() * .9) : P.dwellBase * (.5 + rng()));
      const detour = !fast && rng() < P.pDetour * (hard ? 1.4 : 1), detAmp = detour ? 160 + rng() * 140 : 0;
      const dev = (hard ? 55 : 30) * (.5 + rng()) * (P.worry ? 1.3 : 1) * (fast ? .4 : 1), ps = chosen === 'R' ? -1 : 1;
      const t = [], x = [], y = [], push = (ti, xi, yi) => { t.push(Math.round(ti * 10) / 10); x.push(Math.round(xi * 10) / 10); y.push(Math.round(yi * 10) / 10); };
      for (let tt = -650; tt < 0; tt += 60 + rng() * 40) push(tt, sx + gauss() * .6, sy + gauss() * .6);
      push(0, sx, sy);
      let ti = 0; while (ti < initMs - 120) { ti += 100 + rng() * 120; push(ti, sx + gauss() * .8, sy + gauss() * .8); }
      const steps = Math.round(moveMs / 12);
      for (let k = 1; k <= steps; k++) {
        const s = k / steps, e = 10 * s ** 3 - 15 * s ** 4 + 6 * s ** 5;
        const bend = Math.sin(Math.PI * s) * dev + (detour ? Math.exp(-(((s - .62) / .12) ** 2)) * detAmp : 0);
        push(initMs + k * moveMs / steps + gauss() * 1.2, sx + (tx - sx) * e + ps * bend, sy + (ty - sy) * e);
      }
      let te = initMs + moveMs; const end = te + dwell;
      while (te < end - 120) { te += 90 + rng() * 130; push(te, tx + gauss() * .9, ty + gauss() * .9); }
      push(end, tx + gauss() * .5, ty + gauss() * .5);
      const d = { i: ++seq, phase, trial, step, kind, state: null, forced: null, chosen, chosenId: chosen, leftId: 'L', rightId: 'R', correctSide, correct: correctSide ? chosen === correctSide : null,
        rt: t[t.length - 1], nudged: false, wrongClicks: 0, missClicks: 0, meta: meta || {}, hit, tr: { t, x, y } };
      d.m = computeMetrics(d); decisions.push(d);
    };
    for (let i = 0; i < 32; i++) synth('map', (i >> 1) + 1, i & 1, 'action', rng() < .5 ? 'L' : 'R', 75, 75, null, 0, true);
    for (let i = 0; i < 16; i++) synth('points', i + 1, 0, 'action', rng() < .5 ? 'L' : 'R', 75, 75, null, i < 6 ? 0 : .12, true);
    for (const r of [1, 2]) for (const dd of [3, 6, 12, 24]) for (const st of ['M1L', 'M1R']) for (const sg of [-1, 1]) {
      const ev = CFG.EV[r][st], fixed = ev + sg * dd, rs = rng() < .5 ? 'L' : 'R', ss = rs === 'L' ? 'R' : 'L';
      const err = (weak ? .45 : .06 + .3 * Math.exp(-dd / 8));
      synth('choice', decisions.length, 0, 'choice', ev > fixed ? rs : ss, 96, 104, { reval: r, state: st, ev, fixed, dist: dd, sign: sg, routeSide: rs, mbRoute: ev > fixed }, err, false);
    }
    out.push({ schema: 'pocketcheck/1', demo: true, id: 'demo-' + String(p + 1).padStart(2, '0'), group: high ? 'High worry' : 'Low worry', decisions, quiz: [], ratings: [], reveals: [], score: 0 });
  }
  return out;
}

/* ---------- boot ---------- */
layoutStage();
