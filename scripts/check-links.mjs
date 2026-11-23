// Offline check of internal links: every href/src/srcset pointing into the site from the built
// HTML (and the feed) must resolve to a file in dist/, the way GitHub Pages serves it.
// External links are not fetched. Usage: node scripts/check-links.mjs [distDir]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const SITE = 'https://pierresegonne.com';

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
const isFile = (p) => existsSync(p) && statSync(p).isFile();
const resolves = (path) => {
  const p = join(dist, decodeURIComponent(path));
  return isFile(p) || isFile(join(p, 'index.html')) || isFile(p.replace(/\/$/, '') + '.html');
};

const pages = walk(dist).filter((f) => f.endsWith('.html') || f.endsWith('feed.xml'));
const broken = [];
let checked = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
    ...[...html.matchAll(/url\("?([^")]+)"?\)/g)].map((m) => m[1]),
  ];
  for (let ref of refs) {
    ref = ref.replace(/&amp;/g, '&');
    if (ref.startsWith(SITE)) ref = ref.slice(SITE.length) || '/';
    if (!ref.startsWith('/') || ref.startsWith('//')) continue; // external, mailto:, #fragment, data:
    const path = ref.split(/[?#]/)[0];
    checked++;
    if (!resolves(path)) broken.push(`${relative(dist, file)} -> ${ref}`);
  }
}
if (broken.length) {
  console.error(`✗ ${broken.length} broken internal links:`);
  for (const b of [...new Set(broken)]) console.error(`  ${b}`);
  process.exit(1);
}
console.log(`✓ ${checked} internal links in ${pages.length} files all resolve`);
