/**
 * Format numbers as localized points with P suffix
 */
export function formatPoints(amount?: number | null): string {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `${Math.round(safeAmount).toLocaleString()} P`;
}

/**
 * Format percentages with + or - sign
 */
export function formatPercent(value?: number | null, decimals: number = 2): string {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const prefix = safeValue > 0 ? '+' : '';
  return `${prefix}${safeValue.toFixed(decimals)}%`;
}

/**
 * Format large trade volumes (e.g. 3,450만 P)
 */
export function formatVolume(volume?: number | null): string {
  const safeVol = typeof volume === 'number' && !isNaN(volume) ? volume : 0;
  if (safeVol >= 100000000) {
    return `${(safeVol / 100000000).toFixed(1)}억 P`;
  }
  if (safeVol >= 10000) {
    return `${(safeVol / 10000).toFixed(0)}만 P`;
  }
  return formatPoints(safeVol);
}
