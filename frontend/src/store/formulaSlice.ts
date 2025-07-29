import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FormulaState {
  formulaInput: string;
  errors: string | null;
}

const initialState: FormulaState = {
  formulaInput: '',
  errors: null,
};

const formulaSlice = createSlice({
  name: 'formula',
  initialState,
  reducers: {
    setFormula(state, action: PayloadAction<string>) {
      state.formulaInput = action.payload;
      // Clear errors on input change
      state.errors = null;
    },
    setFormulaError(state, action: PayloadAction<string | null>) {
      state.errors = action.payload;
    },
    clearFormula(state) {
      state.formulaInput = '';
      state.errors = null;
    },
  },
});

export const { setFormula, setFormulaError, clearFormula } = formulaSlice.actions;
export default formulaSlice.reducer;
