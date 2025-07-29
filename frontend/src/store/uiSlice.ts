import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UIState } from "../types/index";

/**
 * UI state slice: dialogs, loading, modal, notifications, active theme.
 */
const initialState: UIState = {
  loading: false,
  modal: null,
  notification: null,
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setModal(state, action: PayloadAction<string | null>) {
      state.modal = action.payload;
    },
    setNotification(state, action: PayloadAction<{ type: "success" | "error"; message: string } | null>) {
      state.notification = action.payload;
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
    },
  },
});

export const { setLoading, setModal, setNotification, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
