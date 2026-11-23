// Copies KaTeX's stylesheet and woff2 fonts into public/katex/ (git-ignored) so posts with
// maths can link them and posts without maths load nothing. Runs for dev and build.
import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export default function katexAssets() {
  return {
    name: 'katex-assets',
    hooks: {
      'astro:config:setup': ({ config }) => {
        const require = createRequire(import.meta.url);
        const dist = join(dirname(require.resolve('katex/package.json')), 'dist');
        const out = join(fileURLToPath(config.publicDir), 'katex');
        mkdirSync(join(out, 'fonts'), { recursive: true });
        cpSync(join(dist, 'katex.min.css'), join(out, 'katex.min.css'));
        for (const f of readdirSync(join(dist, 'fonts'))) {
          if (f.endsWith('.woff2')) cpSync(join(dist, 'fonts', f), join(out, 'fonts', f));
        }
      },
    },
  };
}
