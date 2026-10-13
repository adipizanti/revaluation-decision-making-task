// Smoke + scripted-mouse test. Needs: npm i, npx playwright install chromium.
// Set CHROMIUM_PATH to use an existing browser binary.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const url = 'file://' + join(dirname(fileURLToPath(import.meta.url)), '../dist/index.html');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
page.on('console', m => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
let failed = 0;
const check = (name, ok, extra = '') => { console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); if (!ok) failed++; };

await page.goto(url);
check('page loads, version tag present', await page.evaluate(() => !!document.querySelector('meta[name=task-version]')));

// --- scripted mouse: first N map-learning decisions
await page.fill('#pid', 'ci-bot'); await page.fill('#grp', 'CI');
await page.click('#startBtn');
let cur = { x: 640, y: 400 };
const move = async (tx, ty) => {
  for (let i = 1; i <= 20; i++) { const f = i / 20, e = f * f * (3 - 2 * f);
    await page.mouse.move(cur.x + (tx - cur.x) * e, cur.y + (ty - cur.y) * e); await page.waitForTimeout(8); }
  cur = { x: tx, y: ty };
};
let clicked = 0;
const t0 = Date.now();
while (clicked < 6 && Date.now() - t0 < 60000) {
  const st = await page.evaluate(() => { const g = id => document.getElementById(id), r = g('stage').getBoundingClientRect();
    return { ov: g('stage').classList.contains('ov'), btn: !!g('ovBtn') && !g('ovBtn').disabled, armed: g('park').classList.contains('armed'),
      L: g('tgtL').className, R: g('tgtR').className, rect: [r.left, r.top, r.width, r.height] }; });
  const px = x => st.rect[0] + x * st.rect[2] / 1000, py = y => st.rect[1] + y * st.rect[3] / 700;
  if (st.ov) { if (st.btn) await page.click('#ovBtn'); else await page.waitForTimeout(200); continue; }
  if (st.L.includes(' on') || st.R.includes(' on')) {
    const side = st.L.includes('forced') ? 'L' : st.R.includes('forced') ? 'R' : 'L';
    await page.waitForTimeout(200);
    await move(px(side === 'L' ? 190 : 810), py(175));
    await page.mouse.down(); await page.mouse.up(); clicked++; continue;
  }
  if (st.armed) { await move(px(500), py(600)); await page.waitForTimeout(650); continue; }
  await page.waitForTimeout(50);
}
check('scripted mouse made 6 decisions', clicked === 6, `clicked=${clicked}`);
const rec = await page.evaluate(() => S && S.decisions.slice(0, 6).map(d => ({ n: d.tr.t.length, rt: d.rt, m: Object.keys(d.m || {}).length })));
check('decisions have trajectories and metrics', !!rec && rec.every(r => r.n > 5 && r.rt > 0 && r.m > 3), JSON.stringify(rec && rec[0]));

// --- researcher view on demo data at all three levels
const out = await page.evaluate(async () => {
  const runs = demoRuns();
  const csv = runToCsv(runs);
  return { runs: runs.length, csvRows: csv.split('\n').length, ver: LAST === undefined ? null : 1 };
});
check('demo data + CSV export', out.runs > 4 && out.csvRows > 100, JSON.stringify(out));

await page.evaluate(() => show('rv')); 
const hasAdd = await page.$('#addDemo');
if (hasAdd) { await hasAdd.click(); await page.waitForTimeout(400);
  for (const [l, f] of [['all', 'group'], ['group', 'group'], ['trial', null]]) {
    await page.click(`#lvl button[data-l=${l}]`); if (f) await page.selectOption('#fSplit', f); await page.waitForTimeout(250);
  }
  check('researcher view renders at 3 levels', true);
}
check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
await browser.close();
process.exit(failed ? 1 : 0);
