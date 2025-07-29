export interface UIState {
  loading: boolean
  modal: string | null
  notification: { type: "success" | "error"; message: string } | null
  theme: string
}
