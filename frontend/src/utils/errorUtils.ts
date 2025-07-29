export function getFriendlyErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unknown error occurred.';
}

export function reportError(err: unknown): void {
  console.error(err);
}
