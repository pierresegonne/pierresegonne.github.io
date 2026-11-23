/** "22 August 2025" (long) or "22 Aug 2025" (short), in UTC so dates never shift. */
export const formatDate = (d: Date, month: 'long' | 'short' = 'long') =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
