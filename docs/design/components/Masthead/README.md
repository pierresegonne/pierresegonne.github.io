# Masthead

The top band of every page: a dark photo strip with the site name in the one accent colour, a one-line tagline, and the navigation.

- **Ground:** your frame photo, `background-size: cover`, over `night`. The preview draws placeholder filaments in `ember-glow` where the photo would be — replace them with your own image.
- **Name:** `site-name` style in `ember`; links home. This is the only use of `ember` on the site.
- **Tagline:** `tagline` in `on-night`, pulled up by `space-xs`.
- **Nav:** `nav-link` in `nav-on-night`, `space-l` apart, 23px from the top of the band.
- **Padding:** `space-l` top and bottom; content inside `container-max`.
- **≤ 640px:** everything centred, nav below the tagline at 16px with `space-s` spacing. The reference switches nav links to `link-hover` blue here (4.0:1 on night — FLAG); keep `nav-on-night` instead.
- **Extras:** if you add a badge or widget, give it its own slot; the reference's carbon widget overlaps the name at ~1024px.
- **Provide:** name, tagline, 3–5 nav items, the photo. Add a visible focus outline for keyboard users.
