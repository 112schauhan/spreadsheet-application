export function formatNumber(
  value: number,
  decimals: number = 2
): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function clampNumber(
  value: number,
  min = -Infinity,
  max = Infinity
): number {
  return Math.max(min, Math.min(max, value));
}
