// Atom feed at /feed.xml, the path jekyll-feed used, so existing subscribers keep working.
// Entry ids are kept identical to the Jekyll ones (https://pierresegonne.com/<Slug>, no trailing
// slash) so feed readers don't show every post again as new.
import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection, render } from 'astro:content';
import { SITE } from '../site';
import { excerpt } from '../utils/excerpt';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Remove a balanced <span class="katex-html">…</span>, keeping KaTeX's MathML for readers. */
function stripKatexHtml(html: string): string {
  const open = '<span class="katex-html"';
  let out = html;
  for (let i = out.indexOf(open); i !== -1; i = out.indexOf(open, i)) {
    let depth = 0;
    const tag = /<span\b|<\/span>/g;
    tag.lastIndex = i;
    for (let m = tag.exec(out); m; m = tag.exec(out)) {
      depth += m[0] === '</span>' ? -1 : 1;
      if (depth === 0) {
        out = out.slice(0, i) + out.slice(m.index + m[0].length);
        break;
      }
    }
  }
  return out;
}

/** Make post HTML self-contained for feed readers. */
function forFeed(html: string, site: URL): string {
  return stripKatexHtml(html)
    .replace(/\s(srcset|sizes|loading|decoding|fetchpriority|data-astro-[a-z-]+)="[^"]*"/g, '')
    .replace(/\s(src|href)="\/(?!\/)/g, (_, attr) => ` ${attr}="${new URL('/', site).href}`)
    .replace(/]]>/g, ']]]]><![CDATA[>');
}

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://pierresegonne.com');
  const container = await AstroContainer.create();
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const entries = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = forFeed(await container.renderToString(Content), base);
      const url = new URL(`/${post.id}/`, base).href;
      const updated = post.data.updated ?? post.data.date;
      const summary = post.data.description ?? excerpt(post.body);
      return `  <entry>
    <title type="html">${escapeXml(post.data.title)}</title>
    <link href="${url}" rel="alternate" type="text/html" title="${escapeXml(post.data.title)}" />
    <id>${new URL(`/${post.id}`, base).href}</id>
    <published>${post.data.date.toISOString()}</published>
    <updated>${updated.toISOString()}</updated>
    <author><name>${escapeXml(SITE.name)}</name></author>
    ${summary ? `<summary type="html">${escapeXml(summary)}</summary>` : ''}
    <content type="html" xml:base="${url}"><![CDATA[${html}]]></content>
  </entry>`;
    }),
  );

  const lastUpdated = new Date(
    Math.max(...posts.map((p) => (p.data.updated ?? p.data.date).valueOf())),
  ).toISOString();
  const feedUrl = new URL('/feed.xml', base).href;

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <link href="${feedUrl}" rel="self" type="application/atom+xml" />
  <link href="${new URL('/', base).href}" rel="alternate" type="text/html" />
  <updated>${lastUpdated}</updated>
  <id>${feedUrl}</id>
  <title type="html">${escapeXml(SITE.name)}</title>
  <subtitle>${escapeXml(SITE.tagline)}</subtitle>
  <author><name>${escapeXml(SITE.name)}</name></author>
${entries.join('\n')}
</feed>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
