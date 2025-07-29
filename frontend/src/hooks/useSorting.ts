import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { setSort } from '../store/operationsSlice';

const useSorting = () => {
  const dispatch = useDispatch();
  const sortCol = useSelector((state: RootState) => state.operations.sortColumn);
  const sortAsc = useSelector((state: RootState) => state.operations.sortAscending);
  const setSorting = (col: string, ascending: boolean) =>
    dispatch(setSort({ column: col, ascending }));
  return { sortCol, sortAsc, setSorting };
};

export default useSorting;