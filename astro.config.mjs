// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Hidden share pages are reachable by direct link only: keep them out of the sitemap.
const HIDDEN_PATHS = ['/Karavshin-expedition-report-2026/', '/Pensees-kirghizes/'];

export default defineConfig({
  site: 'https://pierresegonne.com',
  // Matches the Jekyll URLs: /Slug/ served as /Slug/index.html
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !HIDDEN_PATHS.some((p) => new URL(page).pathname === p),
    }),
  ],
  markdown: {
    // Unified (remark/rehype) processor rather than Astro 7's default Satteri,
    // so maths can be pre-rendered to HTML with KaTeX at build time.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
