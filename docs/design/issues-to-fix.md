# Issues to fix

These are problems found on pierresegonne.com on 23 Nov 2026. They come from reading the site's CSS and HTML and checking the live page at 1024px and 375px. **Don't carry them into your rebuild.** Each one lists what's wrong, the evidence, the fix, and how to check that it's fixed. The IDs (A1, C2…) let you track them in commits or issues.

**Priority:** 🔴 must fix (accessibility or broken) · 🟠 should fix (quality, performance) · ⚪ nice to have

## Quick checklist

- [ ] A1 🔴 Allow pinch-zoom (remove `maximum-scale=1.0`)
- [ ] A2 🔴 Name the footer icon links
- [ ] A3 🔴 Add `lang` to `<html>`
- [ ] A4 🔴 Add visible focus styles
- [ ] A5 🟠 Use one `<h1>` per page
- [ ] A6 🟠 Use a `<main>` landmark and add a skip link
- [ ] A7 🟠 Respect `prefers-reduced-motion`
- [ ] C1 🔴 Use a darker link blue
- [ ] C2 🔴 Use a darker hover blue, and underline links on hover
- [ ] C3 🔴 Fix the mobile nav link colour
- [ ] C4 🟠 Don't use `grid-high` red for small text
- [ ] C5 🟠 Make the site name readable on the photo
- [ ] T1 🔴 Actually load the web fonts
- [ ] T2 🟠 Use one font family for share buttons
- [ ] T3 🟠 Increase code size from 12px
- [ ] T4 ⚪ Increase body line-height
- [ ] T5 ⚪ Tighten heading line-height
- [ ] L1 🔴 Stop the widget covering the site name
- [ ] L2 ⚪ Replace float layout with flex/grid
- [ ] L3 ⚪ Hide code-block scrollbars when not needed
- [ ] P1 🔴 Remove the dead MathJax CDN request
- [ ] P2 🟠 Load MathJax only on pages with maths
- [ ] P3 🟠 Remove the duplicate carbon-aware script
- [ ] P4 🟠 Remove the retired Universal Analytics script
- [ ] P5 🟠 Replace the Font Awesome 4.2 icon font
- [ ] P6 ⚪ Remove unused inline CSS and dead styles
- [ ] S1 🟠 Fix the canonical URL
- [ ] S2 ⚪ Use HTTPS for every link
- [ ] S3 ⚪ Show a date on every post

---

## Accessibility

### A1 🔴 Zoom is blocked on phones
- **Evidence:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">`
- **Fix:** `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Done when:** you can pinch-zoom the page on a phone.

### A2 🔴 Footer icon links have no accessible name
- **Evidence:** all 6 footer links (email, GitHub, LinkedIn, Twitter, Stack Overflow, Medium) contain only an icon-font glyph, with no text or `aria-label`. A screen reader announces them as "link" or reads the URL.
- **Fix:** `<a href="…" aria-label="GitHub"><svg aria-hidden="true">…</svg></a>`, or add visually hidden text.
- **Done when:** the browser's accessibility tree shows a name for every link.

### A3 🔴 The page language isn't declared
- **Evidence:** `<html>` has no `lang` attribute.
- **Fix:** `<html lang="en">`. Set it per page if you write in Danish too.
- **Done when:** `document.documentElement.lang` returns a value.

### A4 🔴 No focus styles
- **Evidence:** the site's own CSS has no `:focus` or `:focus-visible` rules. Links rely on browser defaults, which are barely visible on the navy band. MathJax's CSS also sets `outline: none` on its menus.
- **Fix:** `a:focus-visible { outline: 2px solid var(--link-accessible); outline-offset: 2px; }`. On the band, use an `on-night` outline instead.
- **Done when:** you can tab through header, content and footer and always see where you are.

### A5 🟠 Two `<h1>`s on every page
- **Evidence:** the site name is an `<h1>`, and so is the page title ("Posts", or the article title).
- **Fix:** make the site name a `<p>` or `<a>` inside `<header>`, and keep the single `<h1>` for the page's own title. Heading order should be h1 → h2 → h3 with no skipped levels.
- **Done when:** `document.querySelectorAll('h1').length === 1` on every page.

### A6 🟠 No `<main>` landmark and no skip link
- **Evidence:** content sits in `<div id="main">`, and there is no "skip to content" link.
- **Fix:** use `<main id="content">` and put `<a class="skip" href="#content">Skip to content</a>` first in `<body>`. Keep it visually hidden until it receives focus.
- **Done when:** pressing Tab once on page load shows the skip link.

### A7 🟠 Motion ignores user settings
- **Evidence:** the toggle animates for 0.4s, and the CSS has no `prefers-reduced-motion` rule.
- **Fix:** `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }`

## Colour and contrast

### C1 🔴 Link blue fails contrast
- **Evidence:** `a { color: #4183c4 }` on white is **3.99:1**. Body text needs 4.5:1.
- **Fix:** use `#2f6ea8` (5.36:1), the `link-accessible` token.

### C2 🔴 Hover blue is even lighter
- **Evidence:** `a:hover { color: #4a8fe7 }` is **3.29:1** on white. The hover is signalled only by colour.
- **Fix:** use `#245f94` (6.69:1, the `link-accessible-hover` token) and add `text-decoration: underline` on hover.

### C3 🔴 Mobile nav links fail on the band
- **Evidence:** under 640px, `nav a { color: #4a8fe7 }` sits on the navy band (#142c66): **4.03:1**.
- **Fix:** keep `#eeeeee` (`nav-on-night`, 11.4:1) at every width.

### C4 🟠 High-carbon red text is unreadable
- **Evidence:** `.intensity-high { color: #dc183c }` on navy is **2.68:1**, at 12px.
- **Fix:** use `#f44336` (3.6:1) or lighter for text. Better still, pair the colour with a text label, so the level doesn't depend on colour alone.

### C5 🟠 The site name is hard to read on the photo
- **Evidence:** red `#e72833` at weight 300 on the band scores 3.0:1 against the #142c66 fallback and about 4.3:1 against the photo's darkest pixels. The photo itself contains red streaks that run behind the name.
- **Fix:** use weight 400 or more, keep it at 24px or larger, and position or darken the photo so no hot streak sits behind the text. Check contrast against the lightest part of the photo behind the name.

## Typography

### T1 🔴 The fonts never load
- **Evidence:** CSS asks for `Merriweather` and `Montserrat`, but there is no `@font-face` and no Google Fonts `<link>`. `document.fonts` lists only FontAwesome. Visitors see Georgia and Helvetica/Arial instead.
- **Fix:** your rebuild uses IBM Plex instead. Self-host woff2 files for IBM Plex Sans 300, 400 and 700, IBM Plex Serif 400, 400 italic and 700, and IBM Plex Mono 400. Use `font-display: swap` and `<link rel="preload">` for the two most-used weights, with a Latin subset.
- **Done when:** in DevTools → Rendered Fonts, the body shows IBM Plex Serif, the headings IBM Plex Sans and code IBM Plex Mono.

### T2 🟠 Share buttons use a third font family
- **Evidence:** `.share-button { font-family: "Open Sans", … }`, which is also never loaded.
- **Fix:** use the `sans` family, or drop the share bar entirely.

### T3 🟠 Code is too small
- **Evidence:** `.highlight { font-size: 12px }` against 18px body text.
- **Fix:** use 15px, or `0.85em`.

### T4 ⚪ Body text is tight
- **Evidence:** `font: 18px/1.4` with a serif face.
- **Fix:** use a line-height of 1.6.

### T5 ⚪ Headings are loose
- **Evidence:** `h1…h6 { line-height: 1.7 }`. Two-line post titles read like two separate headings.
- **Fix:** use a line-height of 1.2–1.3 for headings.

## Layout

### L1 🔴 The carbon widget covers the site name
- **Evidence:** the overlay is `position: absolute; top: 0; left: 0`. At 1024px it sits on top of "Pierre Segonne". At 375px its box (0–318 × 18–88px) almost completely covers the name's box (10–365 × 20–59px).
- **Fix:** give the widget its own row or column in the header grid instead of absolute positioning. On mobile, collapse it to just the dot and put the details in a `<details>` element.
- **Done when:** at 375, 640, 1024 and 1440px nothing overlaps the name.

### L2 ⚪ The layout is built on floats
- **Evidence:** `.site-info`, `nav` and the avatar use `float` together with clearfix hacks.
- **Fix:** use `display: flex` or `grid` on the header, and flip it to a column below 640px.

### L3 ⚪ Code blocks always show scrollbars
- **Evidence:** `.highlight { overflow: scroll }`
- **Fix:** use `overflow-x: auto`.

## Performance and dependencies

### P1 🔴 Request to a retired MathJax CDN
- **Evidence:** a script loads from `cdn.mathjax.org/mathjax/latest/…`. That CDN was retired in 2017, and the request transfers 0 KB.
- **Fix:** delete that tag. If you need maths, use a pinned MathJax 3 or KaTeX build.

### P2 🟠 MathJax loads on every page
- **Evidence:** MathJax 2.7.1 from cdnjs (about 75 KB) loads on the home page, which has no maths. That's most of the page's ~80 KB of third-party weight.
- **Fix:** load it only on posts that need it, for example with a front-matter flag. Or pre-render the maths at build time.

### P3 🟠 The carbon-aware script loads twice
- **Evidence:** `storage.googleapis.com/carbon-aware-websites-javascript/frontend.js` appears twice in the page's scripts.
- **Fix:** include it once, with `defer`.

### P4 🟠 Two analytics scripts, one of them dead
- **Evidence:** both `google-analytics.com/analytics.js` (Universal Analytics, which stopped processing data in 2023) and `googletagmanager.com/gtag/js` are loaded.
- **Fix:** drop `analytics.js`. Consider whether you need Google Analytics at all: a cookieless tool (Plausible, GoatCounter) can avoid a cookie-consent banner under GDPR.

### P5 🟠 A whole icon font for six icons
- **Evidence:** Font Awesome **4.2.0** from `maxcdn.bootstrapcdn.com`, which is a legacy CDN, plus its font files.
- **Fix:** use six inline SVGs (official brand marks) with `aria-hidden="true"` and a label on the link.

### P6 ⚪ Unused CSS shipped inline
- **Evidence:** about 17 KB of `<style>` in the `<head>`. This includes the full `.emaps-widget` badge styles even though the badge is `display: none`. `posts.css` also styles share buttons for Google+, which shut down in 2019, as well as Pinterest, Tumblr and others that aren't used.
- **Fix:** move the styles into one stylesheet and delete the unused rules.

## SEO and content

### S1 🟠 The canonical URL points elsewhere
- **Evidence:** `<link rel="canonical" href="http://pierresegonne.github.io/">` on a page served from `https://pierresegonne.com/`, over HTTP and on a different host.
- **Fix:** give each page its own canonical URL on your real domain, over HTTPS.

### S2 ⚪ An HTTP link remains
- **Evidence:** the Stack Overflow footer link uses `http://`.
- **Fix:** use `https://` everywhere.

### S3 ⚪ A post without a date
- **Evidence:** the oldest post in the list ("Tutorial | Creating a form…") shows no date.
- **Fix:** make the date required in your post template, so the build fails without one.

---

## How to check your rebuild

1. Run **Lighthouse** (Chrome DevTools) on the home page and one article: aim for 100 on Accessibility and over 95 on Performance.
2. Run the **axe DevTools** extension: zero serious issues.
3. Navigate the whole site with the keyboard only.
4. Check every text colour against its background with a contrast checker (WebAIM).
5. Test at 375, 640, 1024 and 1440px, and with 200% browser zoom.
