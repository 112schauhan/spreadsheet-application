export function isValidDate(value: string): boolean {
  return !isNaN(Date.parse(value));
}

export function isValidNumber(value: string): boolean {
  return !isNaN(Number(value));
}
