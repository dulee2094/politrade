/**
 * Format numbers as localized points with P suffix
 */
export function formatPoints(amount: number): string {
  return `${Math.round(amount).toLocaleString()} P`;
}

/**
 * Format percentages with + or - sign
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}

/**
 * Format large trade volumes (e.g. 3,450만 P)
 */
export function formatVolume(volume: number): string {
  if (volume >= 100000000) {
    return `${(volume / 100000000).toFixed(1)}억 P`;
  }
  if (volume >= 10000) {
    return `${(volume / 10000).toFixed(0)}만 P`;
  }
  return formatPoints(volume);
}
