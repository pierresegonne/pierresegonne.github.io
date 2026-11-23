/**
 * A plain-text summary of a post's Markdown body: its first real paragraph,
 * cut at a word boundary. Used for <meta name="description"> and the feed summary.
 */
export function excerpt(markdown: string | undefined, max = 160): string {
  if (!markdown) return '';
  const text = markdown
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/^:::[\s\S]*?^:::\s*$/gm, '') // figures, callouts, notes
    .replace(/\$\$[\s\S]*?\$\$/g, '') // maths
    .replace(/<[^>]+>/g, ''); // raw HTML
  const paragraph =
    text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p.length > 60 && !/^(#|[-*] |\d+\. |\||!\[|>)/.test(p)) ?? '';
  const plain = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__|\*|_|`|~~)/g, '')
    .replace(/\\(.)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
}
