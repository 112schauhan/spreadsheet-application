export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDate(input: string): Date | null {
  const timestamp = Date.parse(input);
  return isNaN(timestamp) ? null : new Date(timestamp);
}
