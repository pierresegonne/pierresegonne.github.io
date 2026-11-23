# PostList

The home page: a reverse-chronological list of posts, each a date and a title separated by hairlines — no excerpts, no thumbnails, no cards.

- **Page title:** `page-title` style in `ink-max`, top margin 0.75em.
- **Item:** `post-meta` date in `ink-muted`, then the title as `heading-2` in `ink-strong` (link, no underline), `space-m` below the title.
- **Separator:** 1px `hairline` under each item, `space-s` above the next; none under the last item.
- **Hover:** title turns link blue. Use `link-accessible-hover`, not the reference's `link-hover` (3.3:1).
- **Note:** with the reference's 1.7 line-height, two-line titles look loose (second item in the preview). Consider 1.25.
- **Provide:** posts with date and title, newest first. Show the date on every item (the reference's oldest post is missing one).
