/* Demo-only overrides. Appended by `node scripts/build.mjs --demo` into dist/demo.html. Not part of the real task. */
Object.assign(CFG, { SL_BLOCKS: 1, MAP_PATHS: 2, QUIZ_N: 2, QUIZ_PASS: 0, VL_FORCED: 2, VL_FREE: 2, QUERY_D: [12], REVAL_MIN_MS: 2000 });
(() => {
  const lede = document.querySelector('#intro .lede');
  if (lede) lede.innerHTML = 'Proof-of-concept demo, shortened to about 1 minute (18 decisions). Learn a small map, collect points, then choose again after the values change. ' +
    'Your mouse path is recorded on every choice. <b>When you finish</b>, open the researcher view: it loads 12 demo participants so you can see the heat maps.';
  const warn = document.createElement('div');
  warn.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:50;background:#344158;color:#e8ecf3;font:600 12px system-ui;text-align:center;padding:5px 8px;letter-spacing:.04em';
  warn.textContent = 'DEMO BUILD - shortened version, demo data is synthetic';
  document.body.appendChild(warn); document.body.style.paddingTop = '30px';
  const to = document.getElementById('endToRv');
  if (to) to.addEventListener('click', () => setTimeout(() => { const a = document.getElementById('addDemo'); if (a) a.click(); }, 150));
})();
