# Renewal outline

A practical plan for giving my personal website this look, keeping what works in the reference and fixing what doesn't. Work through it in order; each step is small enough to ship on its own.

## 1. Decide what you keep from the reference

Keep the *structure* of the idea, make the *content* yours:

| Borrow | Make your own |
|---|---|
| Colour only in the frame; white reading column | The frame photo itself — your own image |
| One hot accent on the name | Your accent hue (take it from your photo) |
| Sans for chrome, serif for reading | The typefaces: IBM Plex Sans + IBM Plex Serif (+ Plex Mono for code) |
| Hairline-separated post list as the home page | Your sections (Posts / Projects / Talks / About…) |
| A single 720px measure, one breakpoint | — |
| A signature behaviour (carbon-aware) | Your own behaviour, or none |

## 2. Set the foundations (tokens)

1. Copy the colour tokens. Swap `night`, `night-deep`, `ember`, `ember-glow` for values sampled from **your** frame photo. Check: `on-night` text ≥4.5:1 on `night`; your accent ≥3:1 on `night` (it's only used at 28px).
2. Use `link-accessible` (#2f6ea8) and `link-accessible-hover` (#245f94) instead of the reference blues, and underline links in body text on hover.
3. **Actually load the fonts.** Self-host IBM Plex Sans (300, 400, 700), IBM Plex Serif (400, 400 italic, 700) and IBM Plex Mono (400) as woff2 with `font-display: swap`, Latin subset. Expect roughly 150–200 KB in total; drop any weight you don't use.
4. Spacing: keep the 5 / 10 / 15 / 20 / 30 / 50 steps.

## 3. Tune the type for reading

These are small changes the reference would benefit from:

- Body line-height 1.4 → **1.6** (serif text at 18px needs air).
- Heading line-height 1.7 → **1.25** for multi-line titles (1.7 makes two-line titles look like two headings).
- Code 12px → **15px**; it currently reads at two-thirds of the body size.
- Site name weight 300 → **400** if your accent is under 4.5:1 on the band; thin red on dark blue blurs.

## 4. Build the frame

- **Masthead:** one band, photo `cover` over `night`, 20px padding, name + tagline left, nav right. Under 640px: centre everything, nav below, 16px.
- **Status/badge slot:** if you add anything to the masthead (like the reference's carbon widget), give it its own column. On the reference it overlaps the name at ~1024px wide.
- **Footer:** same band, 50px below content, a centred row of inline-SVG icon links with labels.

## 5. Build the content components

- **Post list** — 14px date, 24px bold title, 15px gap, 1px `hairline`, repeat; no excerpt, no thumbnail.
- **Article** — 30px title, italic date, body, images full-measure, quotes with a 2px grey left rule, GitHub-light code blocks.
- **About** — short intro beside a circular greyscale portrait, then plain h3 sections (Education, Publications, Contact) as bulleted lists.

## 6. Fix the accessibility debts

The full list, with evidence and IDs, is in **Issues to fix**. The essentials:


- Remove `maximum-scale=1.0` from the viewport meta: the reference blocks pinch-zoom on phones.
- Contrast: replace link blues (step 2); don't use `grid-high` (#dc183c) as text on the band.
- Add visible focus styles to nav and links (e.g. 2px `link-accessible` outline, 2px offset).
- Replace the Font Awesome 4.2 icon font with labelled inline SVGs.
- Respect `prefers-reduced-motion` for the toggle transition.

## 7. Optional: modernise

- **Dark mode.** The band palette is a natural dark theme: `night-deep` page, `on-night` text, `ember` accent, a lighter link blue (#8fb4f0 is 6.3:1 on `night`). Add via `prefers-color-scheme`.
- **Drop legacy pieces:** Disqus, Open Sans in share buttons, the share bar itself if you don't use it.
- **CSS custom properties:** emit the tokens as `--paper`, `--ink`, … so the whole palette swaps in one place (also makes a greyscale/low-carbon mode trivial: `filter: grayscale(1)` on `img` and the bands).

## 8. Check before you ship

- Every box in the *Issues to fix* checklist ticked.

- Squint test: name first, then the band, then the content column.
- Contrast pass on every text/background pair (body, links, nav, tagline, dates, code comments).
- 375px, 640px, 1024px and 1440px widths.
- Fonts load on a cold cache and fall back gracefully (Georgia / system sans).
