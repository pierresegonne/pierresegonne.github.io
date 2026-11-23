# Prose

Article typography: the single column people actually read, all in greys with blue only on links.

- **Title:** `page-title` in `ink-strong`, `space-xl` above; **date:** `date-italic` in `ink-muted` right under it.
- **Body:** `body` style in `ink`; paragraphs, lists and headings spaced by `space-m`; lists indented `space-xl`.
- **Headings:** `heading-2` / `heading-3` in `ink-strong`; `heading-4` in `ink-muted`.
- **Links:** `link-accessible`, underline on hover (`link-accessible-hover`). The reference's `link` (#4183c4) is 3.99:1 on white — FLAG.
- **Quotes:** `blockquote` style, `ink-muted`, 2px `ink-muted` left rule, margins 1.8em / 0.8em.
- **Code:** mono stack, white ground, 1.25px `code-border`, `syntax-*` colours. Reference size 12px; proposed 15px.
- **Images:** max-width 100%, 16px vertical margin, caption in `ink-muted`.
- **Provide:** Markdown-rendered HTML; the styles target plain elements so a static-site generator's output needs no classes.
