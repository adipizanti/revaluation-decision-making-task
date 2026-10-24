'use strict';
/* =====================================================================
   POCKET CHECK - core: config, icons, mouse capture, decision engine, metrics
   ===================================================================== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const W = 1000, H = 700;

const CFG = {
  PARK: { x: 500, y: 600, hit: 46 }, HOLD_MS: 450,
  TGT: { L: { x: 190, y: 175 }, R: { x: 810, y: 175 } },
  ACT_HALF: 75, CARD_HW: 96, CARD_HH: 104,
  TILE: { x: 500, y: 400 },
  SL_BLOCKS: 4, SL_REMEDIAL_BLOCKS: 2, QUIZ_PASS: 5, MAP_PATHS: 4, QUIZ_N: 6,
  VL_FORCED: 6, VL_FREE: 10, VL_REWARD: { M1L: 5, M1R: -5 },
  QUERY_D: [3, 6, 12, 24],
  EV: { 1: { M1L: -20, M1R: 20 }, 2: { M1L: -15, M1R: 15 } },
  REVAL_MIN_MS: 5000, TERMINAL_MS: 550, REWARD_MS: 750,
  INIT_PX: 10, HEAD_PX: 70, HOVER_MS: 150, HOVER_PX: 4, FLIP_PX: 25, NUDGE_MS: 3000, PRE_MS: 700
};

/* ---------- shapes: icons and colours kept from the original task ---------- */
const ICON = {
  S:   { c: '#94a3b8', n: 'Circle',   p: '<circle cx="12" cy="12" r="8.5"/>' },
  M1L: { c: '#f032e6', n: 'Feather',  p: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>' },
  M1R: { c: '#4363d8', n: 'Triangle', p: '<path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>' },
  T1:  { c: '#22c55e', n: 'Square',   p: '<rect x="4" y="4" width="16" height="16" rx="2.5"/>' },
  T2:  { c: '#eab308', n: 'Lamp',     p: '<path d="M8.5 3h7l3 9h-13z"/><path d="M12 12v8"/><path d="M8 21h8"/>' },
  T3:  { c: '#f97316', n: 'Amphora',  p: '<path d="M9.5 3h5M10 3v3.2C7.2 7.3 6 9.6 6 12.5 6 16.6 8.7 20 12 20s6-3.4 6-7.5c0-2.9-1.2-5.2-4-6.3V3"/><path d="M6.3 10.5C3.5 10 2.5 12 3.2 14c.5 1.4 1.8 2 3 1.8"/><path d="M17.7 10.5c2.8-.5 3.8 1.5 3.1 3.5-.5 1.4-1.8 2-3 1.8"/><path d="M10 21.5h4"/>' },
  T4:  { c: '#991b1b', n: 'Cloud',    p: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>' }
};
const P_LEFT = '<path d="M19 12H5m7-7-7 7 7 7"/>', P_RIGHT = '<path d="M5 12h14m-7-7 7 7-7 7"/>';
const svgIcon = (p, size, sw = 1.8) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const tileHTML = (k, size = 112, extra = '') => `<div class="tile ${extra}" style="--c:${ICON[k].c};--s:${size}px">${svgIcon(ICON[k].p, size * .5)}</div>`;
const fmtPts = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v);

/* ---------- seeded random ---------- */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, rng) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const median = a => { const b = a.filter(v => v != null && isFinite(v)).sort((x, y) => x - y); if (!b.length) return null; const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
const mean = a => { const b = a.filter(v => v != null && isFinite(v)); return b.length ? b.reduce((s, v) => s + v, 0) / b.length : null; };

/* ---------- layout / scaling ---------- */
const stageEl = $('#stage'), wrapEl = $('#stageWrap');
let stageScale = 1;
function layoutStage() {
  const s = Math.max(.35, Math.min((window.innerWidth - 32) / W, (window.innerHeight - 28) / H, 1.4));
  stageScale = s;
  stageEl.style.transform = `scale(${s})`;
  wrapEl.style.width = W * s + 'px'; wrapEl.style.height = H * s + 'px';
}
window.addEventListener('resize', layoutStage);

/* ---------- mouse capture ---------- */
const ptr = { x: 0, y: 0, ok: false };
let buf = [], rec = null;
window.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  const list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  const evs = list && list.length ? list : [e];
  const r = stageEl.getBoundingClientRect(), kx = W / r.width, ky = H / r.height;
  for (const ev of evs) {
    const s = { t: ev.timeStamp, x: (ev.clientX - r.left) * kx, y: (ev.clientY - r.top) * ky };
    ptr.x = s.x; ptr.y = s.y; ptr.ok = true;
    buf.push(s); if (rec) rec.push(s);
  }
  if (!rec) { const cut = e.timeStamp - CFG.PRE_MS * 2; let k = 0; while (k < buf.length && buf[k].t < cut) k++; if (k) buf.splice(0, k); }
}, { passive: true });

/* ---------- stage helpers ---------- */
const el = { tile: $('#tile'), ask: $('#ask'), cap: $('#cap'), park: $('#park'), reward: $('#reward'), L: $('#tgtL'), R: $('#tgtR'), ov: $('#overlay'),
  hudPhase: $('#hudPhase'), hudScore: $('#hudScore'), hudFill: $('#hudFill'), fg: $('#park .fg') };
const placeAt = (node, x, y) => { node.style.left = x + 'px'; node.style.top = y + 'px'; };
placeAt(el.L, CFG.TGT.L.x, CFG.TGT.L.y); placeAt(el.R, CFG.TGT.R.x, CFG.TGT.R.y);
placeAt(el.park, CFG.PARK.x, CFG.PARK.y); placeAt(el.tile, CFG.TILE.x, CFG.TILE.y);
function setTile(k, pop = true) { el.tile.innerHTML = k ? tileHTML(k, 112, pop ? 'pop' : '') : ''; }
function setCap(t) { el.cap.textContent = t || ''; }
function setAsk(t) { el.ask.textContent = t || ''; }
function setHud(label, i, n, score) {
  el.hudPhase.textContent = label + (n ? `  ·  ${i} / ${n}` : '');
  el.hudFill.style.width = n ? (100 * (i - 1) / n) + '%' : '0';
  el.hudScore.textContent = score == null ? '' : fmtPts(score) + ' pts';
}
function showOverlay(html) { el.ov.innerHTML = html; stageEl.classList.add('ov'); }
function hideOverlay() { el.ov.innerHTML = ''; stageEl.classList.remove('ov'); }

/* ---------- park ring: hold the cursor inside to start a decision ---------- */
let armedFlag = false;
function armPark(tip) {
  return new Promise(res => {
    el.park.classList.add('armed'); setCap(tip || ''); armedFlag = true;
    let hold = null; el.fg.style.strokeDashoffset = 276.46;
    const tick = () => {
      if (!armedFlag) return;
      const inside = ptr.ok && Math.hypot(ptr.x - CFG.PARK.x, ptr.y - CFG.PARK.y) <= CFG.PARK.hit;
      const now = performance.now();
      if (inside) {
        if (hold == null) hold = now;
        const p = Math.min(1, (now - hold) / CFG.HOLD_MS);
        el.fg.style.strokeDashoffset = 276.46 * (1 - p);
        if (p >= 1) { armedFlag = false; el.park.classList.remove('armed'); el.fg.style.strokeDashoffset = 276.46; res(); return; }
      } else { hold = null; el.fg.style.strokeDashoffset = 276.46; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- decision engine ----------
   spec: { phase, trial, step, kind, state, showTile, ask, left:{html,id}, right:{html,id}, hw, hh,
           forced:'L'|'R'|null, correct:'L'|'R'|null, meta, tipPark, tipPick, actions:bool }              */
let seqId = 0;
async function decide(spec) {
  setTile(spec.showTile === false ? null : spec.state, true);
  setAsk(spec.ask || '');
  el.L.className = 'at tgt live'; el.R.className = 'at tgt live';
  el.L.innerHTML = ''; el.R.innerHTML = '';
  await armPark(spec.tipPark);
  // ---- reveal ----
  const hw = spec.hw, hh = spec.hh;
  const hit = { L: { cx: CFG.TGT.L.x, cy: CFG.TGT.L.y, hw, hh }, R: { cx: CFG.TGT.R.x, cy: CFG.TGT.R.y, hw, hh } };
  el.L.innerHTML = spec.left.html; el.R.innerHTML = spec.right.html;
  ['L', 'R'].forEach(s => { const n = el[s]; n.classList.add('on'); if (spec.forced) n.classList.add(spec.forced === s ? 'forced' : 'dim'); });
  setCap(spec.tipPick || '');
  const pre = performance.now() - CFG.PRE_MS;
  rec = buf.filter(s => s.t >= pre);
  let t0 = performance.now();
  requestAnimationFrame(ts => { t0 = ts; });
  let revealT = performance.now();
  const nudge = setTimeout(() => {
    const last = rec[rec.length - 1], first = rec.find(s => s.t >= t0) || rec[rec.length - 1];
    if (!last || Math.hypot(last.x - first.x, last.y - first.y) < CFG.INIT_PX) { nudged = true; el.L.classList.add('nudge'); el.R.classList.add('nudge'); }
  }, CFG.NUDGE_MS);
  let nudged = false, wrongClicks = 0, missClicks = 0;
  return new Promise(resolve => {
    const onDown = e => {
      if (e.pointerType === 'touch' && ptr.ok === false) return;
      const r = stageEl.getBoundingClientRect();
      const x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
      const side = ['L', 'R'].find(s => Math.abs(x - hit[s].cx) <= hit[s].hw && Math.abs(y - hit[s].cy) <= hit[s].hh);
      if (!side) { missClicks++; return; }
      if (spec.forced && side !== spec.forced) { wrongClicks++; return; }
      window.removeEventListener('pointerdown', onDown, true); clearTimeout(nudge);
      const ts = e.timeStamp; rec.push({ t: ts, x, y });
      const samples = rec; rec = null;
      const r1 = v => Math.round(v * 10) / 10;
      const dec = {
        i: ++seqId, phase: spec.phase, trial: spec.trial, step: spec.step ?? 0, kind: spec.kind, state: spec.state || null,
        forced: spec.forced || null, chosen: side, chosenId: spec[side === 'L' ? 'left' : 'right'].id,
        leftId: spec.left.id, rightId: spec.right.id, correctSide: spec.correct || null,
        correct: spec.correct ? side === spec.correct : null, rt: r1(ts - t0), nudged, wrongClicks, missClicks,
        meta: spec.meta || {}, hit,
        tr: { t: samples.map(s => r1(s.t - t0)), x: samples.map(s => r1(s.x)), y: samples.map(s => r1(s.y)) },
        tAbs: r1(t0)
      };
      dec.m = computeMetrics(dec);
      el[side].classList.add('hit');
      setTimeout(() => { el.L.classList.remove('on'); el.R.classList.remove('on'); }, 0);
      setCap('');
      resolve(dec);
    };
    window.addEventListener('pointerdown', onDown, true);
  });
}

/* ---------- metrics (VCAT-style split times + path shape) ---------- */
function computeMetrics(d) {
  const { t, x, y } = d.tr, n = t.length;
  const C = CFG, side = d.chosen, other = side === 'L' ? 'R' : 'L', sign = side === 'R' ? 1 : -1;
  let i0 = 0; for (let i = 0; i < n; i++) { if (t[i] <= 0) i0 = i; else break; }
  const sx = x[i0], sy = y[i0], rt = t[n - 1];
  const inH = (h, px, py) => Math.abs(px - h.cx) <= h.hw && Math.abs(py - h.cy) <= h.hh;
  let init = null, iInit = null, heading = null, enter = null, otherEnter = null, exits = 0, wasIn = false;
  for (let i = i0; i < n; i++) {
    const dx = x[i] - sx, dy = y[i] - sy;
    if (init === null && Math.hypot(dx, dy) > C.INIT_PX) { init = t[i]; iInit = i; }
    if (init !== null && heading === null && Math.abs(dx) >= C.HEAD_PX && Math.sign(dx) === sign) heading = t[i];
    const inC = inH(d.hit[side], x[i], y[i]);
    if (inC && enter === null) enter = t[i];
    if (wasIn && !inC) exits++;
    wasIn = inC;
    if (otherEnter === null && inH(d.hit[other], x[i], y[i])) otherEnter = t[i];
  }
  const m = { rt, init, heading, enter, dwell: enter != null ? rt - enter : null, exits, visitedOther: otherEnter != null, otherEnter, nSamples: n - i0 };
  // clamp the split order
  if (init != null && heading != null && heading < init) heading = init;
  if (heading != null && enter != null && enter < heading) heading = enter;
  m.sInit = init; m.sMove = init != null && heading != null ? heading - init : null;
  m.sApproach = heading != null && enter != null ? enter - heading : null; m.sDwell = m.dwell;
  m.heading = heading;
  // sampling rate estimate
  const dts = []; for (let i = i0 + 1; i < n; i++) dts.push(t[i] - t[i - 1]);
  m.medDt = median(dts);
  if (iInit == null) { Object.assign(m, { hoverTime: 0, hovers: 0, hoverOn: 0, hoverBefore: 0, flips: 0, mad: null, auc: null, pathLen: 0, straight: null, velPeak: null, velPeakT: null }); return m; }
  // hovers: stationary windows (cursor within HOVER_PX of an anchor for >= HOVER_MS) between first movement and click
  let hoverTime = 0, hovers = 0, hoverOn = 0, a = iInit;
  for (let k = iInit + 1; k < n; k++) {
    if (Math.hypot(x[k] - x[a], y[k] - y[a]) > C.HOVER_PX) {
      const dur = t[k] - t[a];
      if (dur >= C.HOVER_MS) { hoverTime += dur; hovers++; if (inH(d.hit[side], x[a], y[a])) hoverOn += dur; }
      a = k;
    }
  }
  const durEnd = t[n - 1] - t[a];
  if (durEnd >= C.HOVER_MS) { hoverTime += durEnd; hovers++; if (inH(d.hit[side], x[a], y[a])) hoverOn += durEnd; }
  m.hoverTime = Math.round(hoverTime); m.hovers = hovers; m.hoverOn = Math.round(hoverOn); m.hoverBefore = Math.round(hoverTime - hoverOn);
  // horizontal reversals with hysteresis
  let dir = 0, ext = x[iInit], flips = 0;
  for (let i = iInit; i < n; i++) {
    const v = x[i];
    if (dir === 0) { if (v > ext + C.FLIP_PX) { dir = 1; ext = v; } else if (v < ext - C.FLIP_PX) { dir = -1; ext = v; } }
    else if (dir === 1) { if (v > ext) ext = v; else if (v < ext - C.FLIP_PX) { dir = -1; flips++; ext = v; } }
    else { if (v < ext) ext = v; else if (v > ext + C.FLIP_PX) { dir = 1; flips++; ext = v; } }
  }
  m.flips = flips;
  // path length, speed
  let len = 0, vp = 0, vpT = null;
  for (let i = iInit + 1; i < n; i++) {
    const dd = Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]); len += dd;
    const dt = t[i] - t[i - 1];
    if (dt >= 6) { const v = dd / dt * 1000; if (v > vp) { vp = v; vpT = t[i]; } }
  }
  m.pathLen = Math.round(len); m.velPeak = Math.round(vp); m.velPeakT = vpT;
  const ex = x[n - 1], ey = y[n - 1], L = Math.hypot(ex - sx, ey - sy) || 1;
  m.straight = Math.round(len / L * 1000) / 1000;
  // deviation toward the unchosen side: max and area (time-normalised, init -> click)
  const ux = (ex - sx) / L, uy = (ey - sy) / L;
  let px = -uy, py = ux; if (Math.sign(px) !== -sign) { px = -px; py = -py; }
  const N = 100, devs = [];
  const t1 = t[iInit], t2 = t[n - 1]; let j = iInit;
  for (let k = 0; k <= N; k++) {
    const tt = t1 + (t2 - t1) * k / N; while (j < n - 2 && t[j + 1] < tt) j++;
    const f = t[j + 1] > t[j] ? Math.min(1, Math.max(0, (tt - t[j]) / (t[j + 1] - t[j]))) : 0;
    const qx = x[j] + (x[j + 1] - x[j]) * f, qy = y[j] + (y[j + 1] - y[j]) * f;
    devs.push((qx - sx) * px + (qy - sy) * py);
  }
  m.mad = Math.round(Math.max(...devs) * 10) / 10;
  m.auc = Math.round(devs.reduce((s, v) => s + v, 0) * L / N);
  return m;
}
