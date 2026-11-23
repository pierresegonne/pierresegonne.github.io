# Navy & Ember

A design outline for refreshing my personal website, distilled from **pierresegonne.com** (inspected 23 Nov 2026: its `style.css`, `css/posts.css`, inline styles and the computed styles of the live pages). Values in this system are the reference's exact values unless a token's note says **PROPOSED**. Places where the reference falls short are marked **FLAG**. Every problem found on the reference site, with evidence and a fix, is listed in **Issues to fix**: work through that checklist when you recode.

The reference is a classic engineer's blog: a Jekyll-style single column, a photographic band at the top and bottom, and a quiet white reading area in between. Its character comes from a few strong choices rather than many decorations.

## The look in one paragraph

A deep ultramarine photo band with thin red-hot filaments running through it frames the page top and bottom. Inside the frame, everything is white paper and dark grey ink: a geometric sans for the chrome and headings, a sturdy serif for reading, hairline rules between items, no cards, no shadows. Exactly one thing is red — the site name. Blue appears only where you can click.

## Principles

1. **Colour lives in the frame, not the content.** All saturated colour sits in the masthead and footer bands (`night`, `night-deep`, `ember`, `ember-glow`). The reading column is `paper` + `ink` greys only. This is what makes the site feel calm and still memorable.
2. **One hot accent, used once.** `ember` (#e72833) is the site name and nothing else. Don't spend it on buttons, tags or hovers.
3. **Two families, two jobs.** `sans` (IBM Plex Sans) for anything you navigate — name, nav, headings, post titles. `serif` (IBM Plex Serif) for anything you read — body, dates, quotes. Code is IBM Plex Mono. The roles are the reference's; the typefaces are our choice (the reference names Montserrat and Merriweather). One superfamily for all three gives the site a coherent, engineered feel.
4. **Light chrome, heavy headings.** The masthead sans is weight 300 with 1px tracking (airy, technical); headings in the content are weight 700 (solid anchors). That contrast in weight is a big part of the personality.
5. **Hairlines, not boxes.** Posts are separated by a 1px `hairline` rule; the footer band ends in a 1px `rule`. No cards, no shadows (except the small share buttons).
6. **One column, one measure.** `container-max` 740px with 10px gutters gives a 720px `measure`. The home page *is* the post list: date, title, rule, repeat.
7. **A 15px rhythm.** Paragraphs, heading bottoms and list gaps all use `space-m` (15px); bands use `space-l` (20px).
8. **The site has a behaviour, not just a look.** The reference is *carbon-aware*: it detects the visitor's grid zone and, when electricity is dirty, renders in greyscale with lower-quality images or hides images entirely. A small status widget sits in the masthead. That's the kind of personal, opinionated touch worth borrowing in spirit (see *Signature behaviour*).

## Colour

| Role | Token | Value | Notes |
|---|---|---|---|
| Page | `paper` | #ffffff | Always white |
| Body text | `ink` | #333333 | 12.6:1 |
| Headings, post titles | `ink-strong` | #222222 | 15.9:1 |
| Dates, h4, quotes | `ink-muted` | #666666 | 5.7:1 |
| Separators | `hairline` / `rule` | #eeeeee / #dddddd | 1px only |
| Frame band | `night` / `night-deep` | #142c66 / #000050 | fallback colour / sampled photo tone |
| Accent | `ember` | #e72833 | site name only; 3.0:1 on night → large text only |
| Frame detail | `ember-glow` | #af3745 | sampled from the photo's filaments; decoration |
| Text on band | `on-night` / `nav-on-night` | #fffff8 / #eeeeee | tagline / nav |
| Links | `link` → `link-accessible` | #4183c4 → #2f6ea8 | **FLAG**: reference blue is 3.99:1 |

Code blocks use GitHub's light "prettylights" palette (`syntax-*`, `code-border`). The carbon widget has its own small signal set (`grid-low` slate-blue, `grid-medium` pink, `grid-high` red).

## Typography

- **Masthead** — `site-name` IBM Plex Sans 300 / 28px / 1px tracking in `ember`; `tagline` 16px in `on-night`, tucked 5px under the name; `nav-link` 300 / 18px / 1px tracking in `nav-on-night`, 20px apart, right-aligned.
- **Headings** — IBM Plex Sans 700, `ink-strong`: 30 / 24 / 20 / 18px (`page-title`, `heading-2`, `heading-3`, `heading-4`), line-height 1.7 (1.4 under 640px). h4 is the only grey heading.
- **Reading** — IBM Plex Serif 400, 18px / 1.4, `ink`. Dates are `post-meta` 14px in the list and `date-italic` 18px italic under an article title. Quotes are `blockquote` 22px italic, `ink-muted`, with a 2px `ink-muted` rule on the left.
- **Code** — IBM Plex Mono at 12px (reference size; 15px proposed), white ground, `code-border`.

**Typefaces.** This system uses **IBM Plex Sans, IBM Plex Serif and IBM Plex Mono** (free, SIL Open Font License; on Google Fonts and github.com/IBM/plex). Weights to ship: Sans 300 (name, nav), 400 (tagline, widget) and 700 (headings); Serif 400, 400 italic and 700; Mono 400. The previews load them from Google Fonts. For the live site, self-host the woff2 files (see *Issues to fix*, T1).

**FLAG — the reference's fonts never load.** It names Merriweather and Montserrat but ships no `@font-face` and no Google Fonts link, so most visitors see Georgia and their default sans. Make sure the Plex files actually load on your site.

## Layout

- Masthead band: full width, photo `background-size: cover` over `night`, 20px vertical padding. Name + tagline float left; nav floats right, 23px from the top.
- Main: centred column, `container-max` 740px, `main-min-height` 70vh.
- Post list: `post-meta` date, then `heading-2` title link (`ink-strong`, hover → link blue), 15px gap, `hairline` rule, 10px to the next item. The last item has no rule.
- Article: `page-title`, `date-italic`, body; images max-width 100% with 16px vertical margin; share bar; comments.
- Footer band: 50px below main, same photo treatment as the masthead, centred row of round icon links, 20px padding, 1px `rule` underneath.
- **One breakpoint** at 640px: masthead content centres, nav drops below the tagline at 16px with 10px spacing, avatar (if any) centres.

## Imagery

The frame photos are the identity. The masthead image (1134×129) is a dark ultramarine field (pixels sit between #000040 and #000090) crossed by thin red-orange filaments — it reads like satellite or thermal imagery of fire, which suits a blog about energy and climate. The footer is a brighter variant where the red covers ~8% of the frame (average #af3745).

For your site: **use your own photo**, not his. Pick one where a single dark hue dominates (~90%) and one hot colour appears as thin detail. Crop to a wide strip, darken it if needed so `on-night` text keeps ≥4.5:1, and take `night`/`ember` from it with an eyedropper. Portraits (About page) are circular (`radius-round`) and greyscale.

## Iconography

The footer uses Font Awesome 4.2 circular glyphs (email, GitHub, LinkedIn, Twitter, Stack Overflow, Medium) on the band. Font Awesome 4.2 is from 2014 and loads a whole icon font for six icons — replace with six inline SVGs drawn in a single ink (`on-night`), each with an accessible label.

## Signature behaviour

The carbon-aware mode is the site's most distinctive feature: a widget top-left shows the detected zone and grid intensity (dot + text in `grid-low` / `grid-medium` / `grid-high-dot`) with a "GRID-AWARE MODE" toggle (`radius-m` track, `grid-low` when on). Low intensity → full site; moderate → greyscale, reduced images; high → images and comments hidden. It is powered by a small script from Electricity Maps. You don't need to copy this — but give your redesign one behaviour that says something about you.

## Components in this system

- **Masthead** — photo band, name, tagline, nav (desktop + ≤640px).
- **PostList** — the home page list.
- **Prose** — article typography: title, date, paragraphs, link, h2, quote, list, code.
- **Footer** — band with icon links.
- **GridStatus** — the carbon-aware status widget in its three states.

## Using this system

Read the tokens by name; never paste raw hex values. Keep `ember` to the name, links to `link-accessible`, content on `paper`. The *Renewal outline* section is the step-by-step plan for applying this to your own site.
