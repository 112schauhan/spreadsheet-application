import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  type CollaborationState,
  type UserPresence,
  type UserCursor,
} from "../types/collaboration.types"

const initialState: CollaborationState = {
  users: {}, // Start with empty users, only show authenticated active users
  cursors: {},
  conflicts: {},
  actions: {'edit': '', 'delete': ''}, // Actions like 'edit', 'delete', etc.
}

const collaborationSlice = createSlice({
  name: "collaboration",
  initialState,
  reducers: {
    userPresenceUpdate(state, action: PayloadAction<UserPresence[]>) {
      // Overwrite users with latest presence data.
      state.users = Object.fromEntries(action.payload.map((u) => [u.userId, u]))
    },
    cursorUpdate(
      state,
      action: PayloadAction<{
        userId: string
        position: UserCursor["position"]
      }>
    ) {
      const { userId, position } = action.payload
      state.cursors[userId] = position
    },
    removeUser(state, action: PayloadAction<string>) {
      delete state.users[action.payload]
      delete state.cursors[action.payload]
    },
    resetCollaboration(state) {
      state.users = {}
      state.cursors = {}
    },

    addAuthenticatedUser(state, action: PayloadAction<{ username: string; color: string; userId: string }>) {
      const { username, color, userId } = action.payload;
      state.users[userId] = {
        userId,
        username,
        color,
        status: 'online',
        lastActive: Date.now()
      };
    },

    clearConflict(state, action: PayloadAction<string>) {
      state.conflicts[action.payload] = false
    },
  },
})

export const {
  userPresenceUpdate,
  cursorUpdate,
  removeUser,
  resetCollaboration,
  addAuthenticatedUser,
  clearConflict
} = collaborationSlice.actions
export default collaborationSlice.reducer
