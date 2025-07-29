
import { type UserPresence } from '../types/collaboration.types';

export function assignUserColor(userId: string, colors: string[]): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

export function deduplicateUsers(users: UserPresence[]): UserPresence[] {
  const seen = new Set<string>();
  return users.filter(u => {
    if (seen.has(u.userId)) return false;
    seen.add(u.userId);
    return true;
  });
}
