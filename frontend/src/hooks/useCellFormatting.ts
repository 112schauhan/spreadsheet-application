/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from 'react-redux';
import { setCellFormatting, clearCellFormatting } from '../store/formattingSlice';
import { useCallback } from 'react';

const useCellFormatting = () => {
  const dispatch = useDispatch();
  const applyFormatting = useCallback((cellRef: string, formatting: any) => {
    dispatch(setCellFormatting({ cellRef, formatting }));
  }, [dispatch]);
  const clearFormattingHandler = useCallback((cellRef: string) => {
    dispatch(clearCellFormatting(cellRef));
  }, [dispatch]);
  return { applyFormatting, clearFormatting: clearFormattingHandler };
};

export default useCellFormatting;
