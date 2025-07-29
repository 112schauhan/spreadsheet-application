import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  user: { username: string; color?: string } | null
  token: string | null
  status: "idle" | "loading" | "authenticated" | "error"
  error?: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.status = "loading"
      state.error = null
    },
    authSuccess(
      state,
      action: PayloadAction<{ user: { username: string; color?: string }; token: string }>
    ) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = "authenticated"
      state.error = null
    },
    authFail(state, action: PayloadAction<string>) {
      state.status = "error"
      state.error = action.payload
      state.user = null
      state.token = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.status = "idle"
      state.error = null
    },
  },
})

export const { authStart, authSuccess, authFail, logout } = authSlice.actions
export default authSlice.reducer
