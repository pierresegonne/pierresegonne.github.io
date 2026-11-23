// Fails if any URL from the old Jekyll site (scripts/legacy-urls.txt) no longer resolves to a
// file in the build output, the way GitHub Pages resolves it (exact file, /index.html, or .html).
// Usage: node scripts/check-urls.mjs [distDir]
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const list = new URL('./legacy-urls.txt', import.meta.url);
const urls = readFileSync(list, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));

const isFile = (p) => existsSync(p) && statSync(p).isFile();
const resolves = (url) => {
  const p = join(dist, decodeURIComponent(url));
  return isFile(p) || isFile(join(p, 'index.html')) || isFile(p.replace(/\/$/, '') + '.html');
};

const missing = urls.filter((u) => !resolves(u));
if (missing.length) {
  console.error(`✗ ${missing.length} of ${urls.length} legacy URLs are missing from ${dist}/:`);
  for (const u of missing) console.error(`  ${u}`);
  process.exit(1);
}
console.log(`✓ all ${urls.length} legacy URLs resolve in ${dist}/`);
