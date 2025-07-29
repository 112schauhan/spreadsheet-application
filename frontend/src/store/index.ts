import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import gridReducer from "./gridSlice"
import collaborationReducer from "./collaborationSlice"
import uiReducer from "./uiSlice"
import operationsReducer from "./operationsSlice"
import formulaReducer from "./formulaSlice"
import selectionReducer from "./selectionSlice"
import historyReducer from "./historySlice"
import formattingReducer from "./formattingSlice"
import validationReducer from "./validationSlice"
import errorReducer from "./errorSlice"
import authSliceReducer from "./authSlice"
import sheetsReducer from "./sheetsSlice"
import commentReducer from "./commentSlice"
import { operationsMiddleware } from "./operationsMiddleware"

// Create the Redux store
export const store = configureStore({
  reducer: {
    grid: gridReducer,
    collaboration: collaborationReducer,
    ui: uiReducer,
    operations: operationsReducer,
    formula: formulaReducer,
    selection: selectionReducer,
    history: historyReducer,
    formatting: formattingReducer,
    validation: validationReducer,
    error: errorReducer,
    auth: authSliceReducer,
    sheets: sheetsReducer,
    comments: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(operationsMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
