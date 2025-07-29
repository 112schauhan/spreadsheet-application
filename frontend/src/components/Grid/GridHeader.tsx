import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../store";
import { selectColumn } from "../../store/selectionSlice";
import { getColumnLetter } from "../../utils/selectionUtils";
import { CELL_WIDTH } from "../../config/constants";

const GridHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const grid = useSelector((state: RootState) => state.grid);
  const selectedColumns = useSelector((state: RootState) => state.selection.selectedColumns);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sync scrolling with main grid (this would need to be connected to the grid scroll)
  useEffect(() => {
    const gridContainer = document.querySelector('.spreadsheet-scroll');
    if (!gridContainer || !headerRef.current) return;

    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.scrollLeft = (gridContainer as HTMLElement).scrollLeft;
      }
    };

    gridContainer.addEventListener('scroll', handleScroll);
    return () => gridContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const handleColumnClick = (colIndex: number, e: React.MouseEvent) => {
    const isMultiSelect = e.ctrlKey || e.metaKey;
    const columnLetter = getColumnLetter(colIndex);
    dispatch(selectColumn({ columnLetter, isMultiSelect }));
  };

  return (
    <div 
      ref={headerRef}
      className="flex-1 bg-gray-50 border-b border-gray-300 overflow-hidden relative"
    >
      <div 
        className="flex"
        style={{ width: CELL_WIDTH * grid.columns }}
      >
        {Array.from({ length: grid.columns }).map((_, i) => {
          const columnLetter = getColumnLetter(i);
          const isSelected = selectedColumns.includes(columnLetter);
          
          return (
            <div
              key={i}
              className={`
                flex items-center justify-center border-r border-gray-300 font-semibold select-none cursor-pointer transition-colors
                ${isSelected 
                  ? 'bg-blue-200 text-blue-800 border-blue-400' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
              style={{
                width: CELL_WIDTH,
                height: 32,
                minWidth: CELL_WIDTH,
              }}
              onClick={(e) => handleColumnClick(i, e)}
              title={`Select column ${columnLetter} (Ctrl+click for multiple)`}
            >
              {columnLetter}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridHeader;
