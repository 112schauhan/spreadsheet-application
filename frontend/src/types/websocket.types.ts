export interface WSMessageBase {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface WSJoinMessage extends WSMessageBase {
  type: 'join';
  username: string;
}

export interface WSCellUpdateMessage extends WSMessageBase {
  type: 'cell_update';
  cellRef: string;
  value: string | number;
  formula?: string;
  version: number;
  userId: string;
}

export interface WSCursorUpdateMessage extends WSMessageBase {
  type: 'cursor_update';
  userId: string;
  position: {
    cellRef: string;
    top: number;
    left: number;
  };
}

export interface WSUserPresenceMessage extends WSMessageBase {
  type: 'user_presence';
  users: {
    userId: string;
    username: string;
    color: string;
  }[];
}
