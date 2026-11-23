// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkFigures from './src/plugins/remark-figures.mjs';
import katexAssets from './src/integrations/katex-assets.mjs';

export default defineConfig({
  site: 'https://pierresegonne.com',
  // Matches the Jekyll URLs: /Slug/ served as /Slug/index.html
  trailingSlash: 'always',
  // Inline the (small) site CSS: no render-blocking stylesheet request.
  build: { format: 'directory', inlineStylesheets: 'always' },
  // Responsive images: srcset + sizes for every optimised image, including Markdown ones.
  image: { layout: 'constrained' },
  // IBM Plex, downloaded at build time and served from the site itself (T1).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Serif',
      cssVariable: '--font-serif',
      weights: [400, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: [300, 400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
  integrations: [
    katexAssets(),
    mdx(),
    // Hidden share pages live in public/ as plain .html files, so they never enter the sitemap.
    sitemap({ filter: (page) => new URL(page).pathname !== '/404/' }),
  ],
  markdown: {
    // Unified (remark/rehype) processor rather than Astro 7's default Satteri,
    // so maths can be pre-rendered to HTML with KaTeX at build time.
    processor: unified({
      remarkPlugins: [
        remarkDirective,
        remarkFigures,
        // Kramdown semantics: $$...$$ inline or as a block; a lone $ is a dollar sign.
        [remarkMath, { singleDollarTextMath: false }],
      ],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: { theme: 'github-light-default' },
  },
});
