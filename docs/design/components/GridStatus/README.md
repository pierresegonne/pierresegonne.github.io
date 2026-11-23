# GridStatus

The reference site's signature: a small masthead widget showing the visitor's electricity-grid zone and carbon intensity, with a toggle that lets the site degrade itself when the grid is dirty.

- **Parts:** location pin + zone (`status-value`), coloured dot + intensity text (`status-label`), "GRID-AWARE MODE" label and a 50×24 toggle (`radius-m` track, 18px `paper` knob, `grid-low` when on, `grid-unknown` when off).
- **States:** low → `grid-low`, full site · moderate → `grid-medium`, greyscale + reduced images · high → `grid-high-dot`, images and comments hidden.
- **Colour:** the reference writes high-intensity text in `grid-high` (#dc183c), 2.7:1 on night — FLAG. The preview uses `grid-high-dot` for text too.
- **Placement:** top-left of the masthead, the sans family at weight 300, `space-m` padding. On the reference it overlaps the site name at ~1024px; give it its own slot.
- **How it works there:** a script from Electricity Maps detects the zone from the request and calls back with a level; the site toggles classes on `<body>`. Zone names in the preview are examples.
- **For your site:** optional. Copy the *idea* (a behaviour that expresses what you care about), not necessarily this widget.
