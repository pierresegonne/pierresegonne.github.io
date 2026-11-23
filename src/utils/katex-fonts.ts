/**
 * KaTeX fonts a rendered page actually needs, beyond the two always preloaded
 * (Main-Regular, Math-Italic). Preloading them avoids maths reflowing when they arrive.
 */
const RULES: Array<[RegExp, string]> = [
  [/\blarge-op\b/, 'KaTeX_Size2-Regular'],
  [/\bsmall-op\b/, 'KaTeX_Size1-Regular'],
  [/\bdelimsizing size1\b/, 'KaTeX_Size1-Regular'],
  [/\bdelimsizing size2\b/, 'KaTeX_Size2-Regular'],
  [/\bdelimsizing size3\b/, 'KaTeX_Size3-Regular'],
  [/\bdelimsizing size4\b/, 'KaTeX_Size4-Regular'],
  [/\b(mathbb|amsrm)\b/, 'KaTeX_AMS-Regular'],
  [/\bmathcal\b/, 'KaTeX_Caligraphic-Regular'],
  [/\bmathbf\b/, 'KaTeX_Main-Bold'],
  [/\bboldsymbol\b/, 'KaTeX_Math-BoldItalic'],
];

export function extraKatexFonts(html: string | undefined): string[] {
  if (!html) return [];
  return [...new Set(RULES.filter(([re]) => re.test(html)).map(([, font]) => font))];
}
