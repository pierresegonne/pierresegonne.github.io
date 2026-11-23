// Container directives used by the posts:
//
//   :::figure{width="60%"}
//   ![alt](./a.png) ![alt](./b.png)   <- a paragraph of only images = one row
//   Caption text, *markdown* allowed  <- any other paragraph = caption
//   :::
//
//   :::callout   -> <aside class="callout">   (boxed aside)
//   :::meta      -> <div class="post-meta-note"> (small muted note)
//
// Images stay regular Markdown images, so Astro still optimises them.
// Text/leaf directives are not used: they are turned back into plain text so
// prose like "ratio:value" is never swallowed.
import { visit } from 'unist-util-visit';

/** Width of the reading column in CSS px (design token `measure`). */
const MEASURE = 720;

/** `sizes` for an image taking `fraction` of the column. */
const sizesFor = (fraction) => {
  const px = Math.round(MEASURE * fraction);
  return `(min-width: ${MEASURE + 20}px) ${px}px, ${Math.round(100 * fraction)}vw`;
};

const setSizes = (image, fraction) => {
  if (/^https?:/.test(image.url)) return; // remote images are not optimised
  image.data ??= {};
  image.data.hProperties = { sizes: sizesFor(fraction), ...(image.data.hProperties ?? {}) };
};

const isImageParagraph = (node) =>
  node.type === 'paragraph' &&
  node.children.some((c) => c.type === 'image') &&
  node.children.every((c) => c.type === 'image' || (c.type === 'text' && !c.value.trim()) || c.type === 'break');

/** An image within the first few blocks is likely above the fold: load it eagerly (LCP). */
const EAGER_WITHIN_BLOCKS = 3;

export default function remarkFigures() {
  return (tree) => {
    const early = tree.children.slice(0, EAGER_WITHIN_BLOCKS);
    let firstImage;
    visit({ type: 'root', children: early }, 'image', (img) => {
      firstImage ??= img;
    });
    if (firstImage && !/^https?:/.test(firstImage.url)) {
      firstImage.data ??= {};
      firstImage.data.hProperties = { ...(firstImage.data.hProperties ?? {}), loading: 'eager', fetchpriority: 'high' };
    }

    visit(tree, (node, index, parent) => {
      if (node.type === 'textDirective' || node.type === 'leafDirective') {
        // Restore the original text, e.g. "foo:bar" in prose.
        const text = { type: 'text', value: ':' + (node.type === 'leafDirective' ? ':' : '') + node.name };
        parent.children.splice(index, 1, text, ...(node.children ?? []));
        return index;
      }
      if (node.type === 'image') {
        setSizes(node, 1); // no-op if a figure already set it (figures are visited first)
        return;
      }
      if (node.type !== 'containerDirective') return;
      const data = (node.data ??= {});
      const attrs = node.attributes ?? {};

      if (node.name === 'figure') {
        const rows = [];
        const caption = [];
        const width = attrs.width?.endsWith('%') ? Math.min(parseFloat(attrs.width) / 100, 1) : 1;
        for (const child of node.children) {
          if (isImageParagraph(child)) {
            const images = child.children.filter((c) => c.type === 'image');
            images.forEach((img) => setSizes(img, width / images.length));
            rows.push({
              type: 'paragraph',
              data: { hName: 'div', hProperties: { className: ['figure-row'] } },
              children: child.children.filter((c) => c.type === 'image'),
            });
          } else {
            caption.push(child);
          }
        }
        if (caption.length) {
          rows.push({ type: 'blockquote', data: { hName: 'figcaption' }, children: caption });
        }
        node.children = rows;
        data.hName = 'figure';
        data.hProperties = {
          className: ['figure'],
          ...(attrs.width ? { style: `--figure-width: ${attrs.width}` } : {}),
        };
      } else if (node.name === 'callout') {
        data.hName = 'aside';
        data.hProperties = { className: ['callout'] };
      } else if (node.name === 'meta') {
        data.hName = 'div';
        data.hProperties = { className: ['post-meta-note'] };
      } else {
        throw new Error(`Unknown container directive :::${node.name}`);
      }
    });
  };
}
