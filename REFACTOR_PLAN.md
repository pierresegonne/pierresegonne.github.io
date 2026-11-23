# Website refactor outline

Status: draft, written 2026-11-23. The visual design comes from the **Navy & Ember** guide in [`docs/design/`](docs/design/README.md). Its problem checklist ([`issues-to-fix.md`](docs/design/issues-to-fix.md)) is referenced below by ID (A1, C1, P1…).

Goals:
1. Remove the carbon-aware integration, and add a note to its post saying it was discontinued.
2. A more minimal, faster, sleeker design: Navy & Ember (see `docs/design/`).
3. A current tech stack instead of the Jekyll Now theme from ~2018.

---

## 1. Current state

### Stack and hosting
- **Jekyll Now v1.2.0** theme (barryclark/jekyll-now), built by **GitHub Pages "legacy" build** from `master` / root. The `github-pages` gem pins the Jekyll and plugin versions, and there is no CI of our own.
- Plugins: `jekyll-sitemap`, `jekyll-feed` (→ `/feed.xml`).
- Custom domain `pierresegonne.com` (`CNAME`), HTTPS enforced.
- Local dev needs rbenv + bundler + `webrick` workarounds (see README). `Gemfile` is in `.gitignore` but also tracked.

### Content
| Type | Files | Notes |
|---|---|---|
| Posts | 13 in `_posts/` (2018 → 2025) | Kramdown GFM. URLs are `/:title/` built from the filename slug, e.g. `/Normalizing_flows/`, and are **case-sensitive**. |
| Pages | `index.html` (post list), `about.md`, `talks.md`, `404.md`, `photography.md` | Photography is a Tumblr embed and is already hidden from the nav. `_layouts/about.html` is an unused TODO. |
| Hidden share pages | `Karavshin-expedition-report-2026.html`, `Pensees-kirghizes.html` | `noindex` redirects to `resources/share/*` and are kept out of the sitemap. **They must keep working.** |
| Assets | `resources/posts/<date>/…` (~110 files), `resources/*.pdf` (CV), `images/` (favicon, header/footer bg, avatar, 404) | Posts link to them with relative `../../resources/...` paths. |

Per-post features in use:
- **Math** (`$$…$$`) in 6 posts. It is rendered **client-side by MathJax** loaded from `cdn.mathjax.org`, a CDN that was retired in 2017 and only survives as a redirect stub.
- **Figures** are written as repeated inline HTML blocks (`<div id="html" markdown="0" style=…><img …><span …caption…></span></div>`): duplicate `id`s and inline styles everywhere.
- **Iframes**: Google Slides embed (Trains post).
- `canonical_url` front matter on 4 posts that were cross-posted to electricitymaps.com. **Keep it.**
- `comments: True` / `share: True` on every post.
- Code highlighting with Rouge (`_sass/_highlights.scss`).

### Third-party weight and problems (every page)
- `js/carbon-aware.js` (~450 lines) + `storage.googleapis.com/.../frontend.js` load on **every page**. The script is included twice (`default.html` and `meta.html`). It rewrites all images through canvas, applies `filter: grayscale` to every DOM node, and injects an overlay into the header.
- **Disqus** comments (heavy, with ad trackers) on every post.
- **Google Analytics twice**: the retired Universal Analytics `analytics.js` *and* gtag.
- **Font Awesome 4.2** from `maxcdn.bootstrapcdn.com`, used only for two share-button icons.
- The **MathJax** CDN script runs on every page, even ones with no math.
- Fonts `Merriweather` / `Montserrat` are declared in SCSS but **never loaded**, so the site actually renders in Georgia / the system sans font.
- Header and footer use background JPEGs. The avatar is 254 KB.
- **Unoptimised images**: several post PNGs are 5–10 MB (`2024-04-10/*`, `2022-01-20/meme_jupyter_name.png`, …), with no responsive sizes, no WebP/AVIF and no lazy-loading.
- HTML problems: `<script>` tags sit *before* `<head>`, there is no `lang` attribute, the IE8 html5shiv is still there, and `maximum-scale=1.0` blocks pinch-zoom (an accessibility problem).
- The repo is 353 MB on disk (134 MB `.git`), mostly from the images.

---

## 2. Target tech stack

**Recommendation: [Astro](https://astro.build) (static output) deployed with GitHub Actions to GitHub Pages.**

Why Astro for this site:
- **Ships zero JS by default.** Pages are pure HTML + CSS, and JS is opt-in per component. That fits "minimal and fast".
- **Content collections**: Markdown/MDX posts with typed, validated front matter (title, date, canonical, description, draft, updated).
- **Build-time math**: `remark-math` + `rehype-katex` render equations to HTML/CSS at build, with no runtime JS. The KaTeX CSS and fonts are only loaded on pages that contain math.
- **Build-time syntax highlighting** with Shiki (no CSS theme file to maintain, light/dark themes).
- **Image pipeline** (`astro:assets`): resizes, converts to AVIF/WebP, adds `srcset`, `width`/`height` and lazy-loading. That solves the 10 MB PNG problem without editing the originals.
- Official `@astrojs/rss` and `@astrojs/sitemap` integrations.
- Node toolchain (`pnpm`), with no Ruby/rbenv/webrick setup.

Alternatives considered:
- **Hugo**: a single binary, very fast builds, also zero-JS. A good choice if you want no Node at all. Its image processing and Markdown render hooks also work, but the templating (Go templates) is less pleasant, and components such as `<Figure>` are shortcodes.
- **Eleventy (11ty)**: closest to Jekyll's mental model (Liquid-compatible). It is lighter than Astro, but you assemble the image, math and highlighting pieces yourself.
- **Stay on Jekyll 4 + Actions**: least migration work, but it keeps Ruby and gives none of the image or perf tooling for free.

Supporting choices:
- **CSS**: one hand-written stylesheet with CSS custom properties (design tokens from the design doc), modern CSS (nesting, `clamp()`, `prefers-color-scheme`), and no Sass or framework. Astro scopes and inlines it.
- **Fonts** (design guide, fixes T1): self-hosted **IBM Plex** woff2, Latin subset, `font-display: swap`. Sans 300/400/700, Serif 400/400 italic/700, Mono 400. Preload only the Serif 400 and Sans 700 files. Use `@fontsource/ibm-plex-*` or subset with `glyphhanger`/`pyftsubset`. Drop any weight that ends up unused (e.g. Sans 400 if the tagline goes to 300).
- **Icons**: inline SVGs for the handful of footer links (GitHub, LinkedIn, email, RSS). No icon font.
- **Comments**: drop Disqus. Options are no comments with a "reply by email" link (fastest), or **giscus** (GitHub Discussions, lazy-loaded only on click). Your call.
- **Analytics**: drop GA. Options are none, or a cookieless script under 1 KB (GoatCounter, Plausible, Cloudflare Web Analytics). Your call.
- **Share buttons**: drop them (Twitter intent and FA icons). Optionally keep a plain "copy link" button or text links.
- **Tooling**: Prettier, `astro check` (types), plus a link checker (`lychee`) and Lighthouse CI in the Actions workflow.

Performance budget, to enforce in CI:
- Home page under **30 KB** transferred for HTML + CSS, **0 KB JS**. Fonts are budgeted separately: at most ~120 KB for the preloaded and first-paint weights, and at most ~200 KB for the full Plex set. The frame photo is under 40 KB as AVIF/WebP.
- A post without images under 50 KB. Images lazy-loaded below the fold.
- Lighthouse 100 for Accessibility, Best Practices and SEO, and at least 95 for Performance, on home + 2 representative posts. axe shows zero serious issues (design guide, "How to check your rebuild").

---

## 3. Refactor steps

### Phase 0: Quick wins on the current Jekyll site (ships on its own)
Fix the broken integration and the cheapest checklist items now, without waiting for the rewrite.
1. Remove the carbon-aware integration: `js/carbon-aware.js`, `_layouts/carbon-aware.html`, `resources/location-dot.svg`, both `frontend.js` script tags (`default.html` and `meta.html`, which also fixes P3) and the `#carbon-aware-widget` div. This retires L1, C4 and A7 together with the widget.
2. Edit `_posts/2025-08-22-This_website_is_carbon_aware.md`:
   - Add a dated "discontinued" note at the top.
   - Change the "you should notice / test it out" parts to the past tense.
   - Keep the code samples (they are fenced and escaped) as a record of how the integration worked.
   - Keep the screenshots as historical illustration, and keep the URL.
3. Drop the retired Universal Analytics snippet. Keep gtag for now, and decide its future in Phase 3 (P4).
4. Cheap checklist fixes in `default.html` / `meta.html` / `_config.yml`:
   - A1: allow pinch-zoom.
   - A3: `<html lang="en">`.
   - Move the stray `<script>`/`<link>` tags into `<head>` and drop the IE8 html5shiv.
   - P1: point MathJax at a pinned cdnjs 2.7.9 URL with the same config, so rendering is unchanged.
   - S1: `url: https://pierresegonne.com`, which fixes canonical links, the feed and the sitemap.
   - S2: HTTPS Stack Overflow link.
   - Exclude `docs/` and `REFACTOR_PLAN.md` from the Jekyll build.
5. Build locally, check the home page, the carbon-aware post and a maths post, then open a PR.

### Phase 1: Scaffold the new project
1. Create a branch `rewrite-astro`. Scaffold Astro (minimal template, TypeScript strict) in the repo root, with pnpm and a `.nvmrc`/`engines` pin.
2. Add integrations: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `remark-math`, `rehype-katex`.
3. `astro.config.mjs`: `site: 'https://pierresegonne.com'`, `trailingSlash: 'always'`, `build.format: 'directory'` (matches the current `/Slug/` URLs).
4. Move `CNAME`, favicons, `resources/*.pdf` and `resources/share/*` to `public/` **at the same paths**.
5. Update `.gitignore` (`node_modules`, `dist`, `.astro`) and stop ignoring `package.json`.

Done on `rewrite-astro` with Astro 7.4. Notes:
- Astro 7's default Markdown processor (Satteri) has no maths support. The config uses `unified()` from `@astrojs/markdown-remark` so remark-math and rehype-katex run.
- `astro check` doesn't support TypeScript 7 yet, so TypeScript is pinned to 6.
- **Don't merge `rewrite-astro` into `master` before Phase 5.** Jekyll still deploys from `master`, and `CNAME`, the favicons, the CVs and the share files now live in `public/`.

### Phase 2: Migrate content
1. Define a `posts` content collection schema: `title`, `date`, `updated?`, `description?`, `canonical?`, `draft?`, `math?` (auto-detected is fine too).
2. Move the 13 posts to `src/content/posts/`. For each post:
   - Set `date` explicitly (Jekyll took it from the filename).
   - Set the **slug explicitly** to the current one (e.g. `slug: Normalizing_flows`) so URLs do not change. Add a test that compares the old sitemap URLs with the new ones.
   - Rename `canonical_url` to `canonical`. Drop `layout`, `comments` and `share`.
   - Move the images next to the post (`src/content/posts/<slug>/…`) or into `src/assets/posts/<date>/`, so `astro:assets` optimises them.
   - Replace the inline-HTML figure blocks with a `<Figure src alt caption width />` MDX component, or with plain Markdown images plus a small remark plugin for captions. A script can do most of this, since the pattern is very regular.
   - Add `alt` text to every image (currently missing almost everywhere).
   - Check the `$$…$$` math in the 6 math posts. Kramdown treats `$$` inline and as a block depending on context, while remark-math needs `$…$` for inline. Convert the inline cases.
   - Keep the Google Slides iframe (Trains post), lazy-loaded with `loading="lazy"`, or replace it with a link plus a static preview image.
3. Pages: About (rewrite the inline styles, and move the avatar to an optimised `<Image>`), Talks, 404. Decide whether **Photography** is dropped or rebuilt as a static gallery. It is currently hidden and Tumblr-dependent, so dropping it is recommended.
4. Hidden share pages: rebuild `/Karavshin-expedition-report-2026/` and `/Pensees-kirghizes/` as `noindex` redirect pages excluded from the sitemap (sitemap `filter`). Their files stay at `/resources/share/...`.
5. Old CV PDF (`CV_PierreSegonne_old.pdf`): keep it if anything links to it, otherwise delete it.

Done on `rewrite-astro`. Notes:
- Posts live in `src/content/posts/<Slug>/index.md`, with their images next to them. Filenames were made ASCII-safe (e.g. `Adolph_Steens_Alle_*.png`).
- Figures use `:::figure{width="60%"}` directives (`src/plugins/remark-figures.mjs`): a paragraph of images forms a row, and other paragraphs form the caption. There are also `:::callout` (boxed aside) and `:::meta` (small muted note, used for footnotes and "last updated" lines).
- The plugin sets an accurate `sizes` on every image. With `image.layout: 'constrained'`, images get a srcset, so phones no longer download 3000px originals. Animated GIFs become animated WebP.
- Maths uses kramdown semantics (`$$` inline or block, a lone `$` is literal). Inline-fenced display blocks were split onto their own lines. KaTeX output matches the Jekyll MathJax count on every post. Attractors' two equations are now display equations, as intended.
- Hand-fixed: the Attractors and Tutorial side-by-side blocks (now stacked image then text), the footnotes, the tables (styles dropped), the Colab badges, the meetings email template, and the carbon-aware update note (now a callout).
- Alt text is derived from captions. The four uncaptioned photos (three in Tech_lead, the Granular header) have hand-written descriptions.
- Unreferenced files moved along but not deployed (they could be deleted): `thats_all_folk.jpeg`, the Attractors `*.json`, `principles_header.jpeg`, `roles.excalidraw`, `emissions_all.png`, two `tanya-pro-*` variants, `Colab_queue_chang_runtime.png`.
- About is MDX (the portrait goes through `<Image>`; the commented-out work history is kept as an MDX comment, so it is no longer shipped). Talks is Markdown, and 404 is an Astro page. Photography is gone (`/photography/` now returns a 404).
- The share pages are plain HTML in `public/`, so their URLs are unchanged and they stay out of the sitemap.
- Every URL from the old sitemap resolves in the new build, except `/photography/`.
- After editing a remark/rehype plugin, delete `.astro/`. Astro caches rendered Markdown there.
- KaTeX CSS currently loads on every post. Load it only on posts with maths (Phase 3).
- Jekyll can no longer build on this branch (it trips over `node_modules`). That's fine: Phase 5 removes it.

### Phase 3: Layout and design system (Navy & Ember)
Source: `docs/design/README.md`, `renewal-outline.md`, `components/*`, `tokens.css`.

1. **Tokens**: start `src/styles/tokens.css` from `docs/design/tokens.css`, with these changes:
   - Keep only the `link-accessible*` blues and remove `link`/`link-hover` (C1, C2).
   - Drop the `grid-*`, `shadow-button`, `radius-xs` and `read-more` tokens. They belonged to the removed carbon widget and share bar.
   - Use the PROPOSED type values: body line-height 1.6 (T4), heading line-height 1.25 (T5), code 15px (T3), site name weight 400 (C5).
   - Prefer `rem` over `px` for the type scale, so 200% browser zoom behaves.
2. **Frame image: A/B test at the end of Phase 3.** The current images are `images/header.jpg` (1134×129, navy field with thin red streaks) and `images/footer.jpg` (1134×192, a different image: a false-colour satellite coastline with red land). Both look like false-colour satellite imagery. At 1134px they are soft when stretched across wide or high-DPI screens. Build both variants behind the same CSS hook (`--frame-image`) and let Pierre pick:
   - **A: Re-crop the originals from the source.** Both images are crops of the ESA image *Holbox Island, Mexico* (Copernicus Sentinel-2, false colour, captured 6 July 2019, https://www.esa.int/media/holbox-island-mexico). Template matching against the 2000×1462 preview JPG gives:
     - Header: x=7, y=196, w=1984, h=226 (the current file is this crop at 0.57×).
     - Footer: x=7, y=591, w=1994, h=338 (same scale).
     - Scale these coordinates for the full-resolution source TIFF (88.8 MB, dimensions not stated), re-crop, and export 1× and 2× AVIF/WebP. The preview JPG alone already gives 1.75× the current resolution. The TIFF should be enough for 2× on wide screens, so no upscaler is needed.
     - Keep the source TIFF out of git; commit only the exported crops.
     - **Licence:** "CC BY-SA 3.0 IGO or ESA Standard Licence". The credit line is "contains modified Copernicus Sentinel data (2019), processed by ESA". It needs a visible credit (footer or About), and the crops are shared under the same licence. The current site has no credit at all.
   - **B: Generated look-alike.**
     - A new image with the same features: a dark ultramarine field (`#000040`–`#000090`, fine noise texture) crossed by a few thin red-orange filaments (`ember-glow` → `ember`).
     - Generate it with a small seeded script (noise field + flow-line filaments), output as SVG or as a 2×-wide AVIF.
     - It is sharp at any width and has no licence question. It can also be tuned so no streak sits behind the site name (C5).
     - The footer uses the same generator with a higher density of red.
   - For both: `on-night` text stays at least 4.5:1, and the name's contrast is checked against the lightest pixels behind it. The image is under 40 KB per variant. The page shows a flat `night` colour until the image loads.
3. **Components** (Astro, plain-element CSS so Markdown output needs no classes):
   - `BaseLayout`: skip link (A6), `<header>` → `Masthead`, `<main id="content">` (A6), `Footer`. Exactly one `<h1>` per page, and the site name is not a heading (A5).
   - `Masthead`: name in `ember`, tagline, nav on the right, all in flex/grid (L2). At 640px or narrower it is centred, with the nav below at 16px, still `nav-on-night` (C3). Focus outline in `on-night` (A4).
   - `PostList` (home page = post list): `post-meta` date, then an `heading-2` title link, then a `hairline`, with no rule after the last item. Dates are required by the content schema (S3).
   - `Prose` / `PostLayout`: page title, italic date ("Updated …" when `updated` is set), body, quotes with a 2px `ink-muted` left rule, GitHub-light Shiki theme on a white ground with `code-border`, and `overflow-x: auto` (L3).
   - `Figure`: image at full measure, 16px vertical margin, caption in `ink-muted`.
   - `Footer`: centred row of inline-SVG brand marks with an `aria-label` on each (A2, P5). Links: email, GitHub, LinkedIn.
   - `About`: intro beside a circular **greyscale** portrait, then h2 sections (Education, Publications, Contact). The guide says h3; use h2 to keep the heading order (A5).
4. **Global CSS**: `a:focus-visible` outline (A4), underline on hover (C2), a `prefers-reduced-motion` reset (A7), `::selection` in `hairline`/`ink-max`. One breakpoint at 640px.
5. **Head/SEO**: viewport without `maximum-scale` (A1), `lang` (A3), per-page HTTPS canonical with the front-matter override (S1), meta description, Open Graph and Twitter cards, RSS `<link>`, `theme-color` = `night`.
6. **Light mode only** (decided). No dark theme. Set `color-scheme: light` so browsers don't auto-darken form controls.
7. **Signature behaviour** (guide principle 8): the carbon-aware widget is gone. If you want a replacement, pick something static and zero-JS; otherwise none. **Your call.**
8. **Checks**: tick every box in `docs/design/issues-to-fix.md`, then do the squint test and check widths of 375, 640, 1024 and 1440px plus 200% zoom.

Done on `rewrite-astro`. Notes:
- IBM Plex is self-hosted through Astro 7's Fonts API (Fontsource provider, Latin subset, metric-matched fallbacks). That's 8 files, 176 KB in total, with Serif 400 and Sans 700 preloaded.
- Site CSS is inlined in every page (`build.inlineStylesheets: 'always'`), and pages ship no JavaScript.
- KaTeX CSS and fonts are copied to `public/katex/` (git-ignored) by `src/integrations/katex-assets.mjs`. They load only on the 6 posts with maths, which also preload exactly the KaTeX fonts each post uses (`src/utils/katex-fonts.ts`).
- Shiki uses `github-light-default`, whose colours match the design tokens and all pass AA. The old `github-light` orange (3.5:1) failed.
- Links in running text are underlined, at reduced opacity until hover. Lighthouse flagged colour-only links (WCAG 1.4.1).
- Content fixes: heading levels (Load_shifting, Tech_lead had an in-body `#`, Principles), four "here" links reworded, three links moved to https, and the moved Kosiorek article link updated. The sjvgeology link stays http (no https available).
- Lighthouse (mobile, simulated slow 4G):
  - 100/100/100/100 on home, Talks and About.
  - 97–99 performance on content posts.
  - Normalizing_flows is the exception at 88–93: in 2 of 3 runs a CLS of 0.127 appears when KaTeX fonts land after first paint. Accepted.
  - Load_shifting's EV photo is only 275px wide at the source (best practices 96).
- Checklist (`docs/design/issues-to-fix.md`):
  - Done: A1–A7, C1–C3, C5, T1, T3–T5, L2, L3, P1–P6, S1–S3.
  - No longer applicable: C4, L1 and T2 (the carbon widget and share bar are gone).
- **Frame image: B chosen** after the A/B test. The A/B compared ESA Sentinel-2 crops against a generated look-alike.
  - The bands are generated by `scripts/generate-frame.py`, which is seeded and reproducible, and written to `src/assets/frame/`.
  - They need no credit, so the ESA crops, the `PUBLIC_FRAME` switch and the footer credit are gone.
  - They are AVIF, 12 KB (header) and 20 KB (footer).
  - On ≤640px the masthead image is anchored left, so nothing hot sits behind the name (C5).

### Phase 4: Feeds, SEO and URL continuity
1. RSS/Atom at **`/feed.xml`** (the same path as jekyll-feed, so existing subscribers keep working), with full content.
2. `sitemap-index.xml` + a `robots.txt` pointing to it. Exclude the hidden share pages and the 404 page.
3. URL check: crawl the live site's `sitemap.xml` and assert that every URL returns 200 on the new build. Add redirect stubs for anything that changes.

### Phase 5: CI/CD and deploy
1. Add a GitHub Actions workflow: install → `astro check` → build → lychee link check → Lighthouse CI (budget from §2) → `actions/upload-pages-artifact` → `actions/deploy-pages`.
2. Repo settings → Pages → source: **GitHub Actions** (instead of legacy branch build). The custom domain and HTTPS cert stay the same.
3. Delete the Jekyll files: `_config.yml`, `_layouts/`, `_includes/`, `_sass/`, `style.scss`, `css/`, `js/`, `index.html`, `*.md` pages, `Gemfile`.
4. Rewrite `README.md`: `pnpm i`, `pnpm dev`, how to write a post, how to add a hidden share file.
5. Merge `rewrite-astro` → `master`, then check the live site with Lighthouse and test the feed in a reader.

### Phase 6: Optional follow-ups
- Repo size: the 5–10 MB source PNGs stay in git history. If size matters, compress or replace the originals (the pipeline makes optimised copies anyway), or rewrite history with `git filter-repo`. Rewriting history is destructive, so only do it deliberately.
- Add a `/now` or `/projects` page if the design doc calls for one.
- Add a `draft: true` workflow and a post template.

---

## 4. Decisions

| Decision | Status | Choice |
|---|---|---|
| Comments | **Decided** | Dropped (Disqus removed from the Jekyll site already) |
| Analytics | **Decided** | Dropped (gtag removed from the Jekyll site already) |
| Footer links | **Decided** | Email, GitHub, LinkedIn. Twitter/X, Stack Overflow and Medium dropped; all Twitter mentions removed from the site |
| Fonts | **Decided** | IBM Plex, self-hosted (set by the design guide) |
| Carbon-aware post | **Decided** | Keep title and URL, add the update note (done) |
| Frame image | **Decided** | B: generated look-alike (`scripts/generate-frame.py`); ESA crops and credit removed |
| Static site generator | **Decided** | Astro |
| Photography page | **Decided** | Drop |
| Share buttons | **Decided** | Drop |
| Dark mode | **Decided** | Light only |
| Signature behaviour replacing the carbon widget | **Decided** | None |

## 5. Inputs still needed
- None for Phases 4-5.
