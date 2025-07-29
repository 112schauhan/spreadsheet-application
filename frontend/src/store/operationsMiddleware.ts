import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addRow, deleteRow, addColumn, deleteColumn } from "./operationsSlice";
import { setDimensions } from "./gridSlice";
import { type RootState } from "./index";

// Create middleware to sync operations with grid dimensions
export const operationsMiddleware = createListenerMiddleware();

// Listen for row operations
operationsMiddleware.startListening({
  actionCreator: addRow,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const newRows = state.operations.rows;
    const currentColumns = state.grid.columns;
    
    listenerApi.dispatch(setDimensions({
      rows: newRows,
      columns: currentColumns
    }));
  },
});

operationsMiddleware.startListening({
  actionCreator: deleteRow,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const newRows = state.operations.rows;
    const currentColumns = state.grid.columns;
    
    listenerApi.dispatch(setDimensions({
      rows: newRows,
      columns: currentColumns
    }));
  },
});

// Listen for column operations
operationsMiddleware.startListening({
  actionCreator: addColumn,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const currentRows = state.grid.rows;
    const newColumns = state.operations.columns;
    
    listenerApi.dispatch(setDimensions({
      rows: currentRows,
      columns: newColumns
    }));
  },
});

operationsMiddleware.startListening({
  actionCreator: deleteColumn,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const currentRows = state.grid.rows;
    const newColumns = state.operations.columns;
    
    listenerApi.dispatch(setDimensions({
      rows: currentRows,
      columns: newColumns
    }));
  },
});
