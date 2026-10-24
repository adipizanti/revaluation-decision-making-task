// Builds dist/index.html (one self-contained file) from src/.
// Usage: node scripts/build.mjs [--version-from-package]
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rd = p => readFileSync(join(root, p), 'utf8');
const pkg = JSON.parse(rd('package.json'));

const demo = process.argv.includes('--demo');
const js0 = readdirSync(join(root, 'src/js')).filter(f => f.endsWith('.js')).sort()
  .map(f => rd('src/js/' + f)).join('\n');
const js = (demo ? js0 + '\n' + rd('src/demo/demo.js') : js0).replaceAll('__TASK_VERSION__', pkg.version + (demo ? '-demo' : ''));

const html = [
  '<!doctype html><html lang="en"><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  `<meta name="task-version" content="${pkg.version}${demo ? '-demo' : ''}">`,
  rd('src/head.html').trimEnd(),
  '<style>', rd('src/styles.css').trimEnd(), '</style></head><body>',
  rd('src/markup.html').trimEnd(),
  '<script>', js, '</script></body></html>', ''
].join('\n');

mkdirSync(join(root, 'dist'), { recursive: true });
const out = demo ? 'dist/demo.html' : 'dist/index.html';
writeFileSync(join(root, out), html);
console.log(`built ${out}  v${pkg.version}  ${(html.length / 1024).toFixed(1)} KB`);
