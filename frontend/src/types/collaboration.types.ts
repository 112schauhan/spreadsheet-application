export interface User {
  userId: string;
  username: string;
  color: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: number;
}

export interface CursorPosition {
  cellRef: string;
  top: number;
  left: number; 
}

export interface CollaborationState {
  users: Record<string, User>;
  cursors: Record<string, CursorPosition>;
  conflicts: Record<string, boolean>;
  actions: Record<string, string>; // Actions like 'edit', 'delete', etc.
}

export interface UserPresence {
  userId: string;
  username: string;
  color: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: number;
}

export interface UserCursor {
  userId: string;
  position: CursorPosition;
}
