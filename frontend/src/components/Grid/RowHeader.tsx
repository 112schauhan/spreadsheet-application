import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../store";
import { selectRow } from "../../store/selectionSlice";
import { CELL_HEIGHT } from "../../config/constants";

const RowHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const grid = useSelector((state: RootState) => state.grid);
  const selectedRows = useSelector((state: RootState) => state.selection.selectedRows);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sync scrolling with main grid
  useEffect(() => {
    const gridContainer = document.querySelector('.spreadsheet-scroll');
    if (!gridContainer || !headerRef.current) return;

    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.scrollTop = (gridContainer as HTMLElement).scrollTop;
      }
    };

    gridContainer.addEventListener('scroll', handleScroll);
    return () => gridContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRowClick = (rowIndex: number, e: React.MouseEvent) => {
    const isMultiSelect = e.ctrlKey || e.metaKey;
    // Use 1-based row index to match the display
    dispatch(selectRow({ rowIndex: rowIndex + 1, isMultiSelect }));
  };

  return (
    <div 
      ref={headerRef}
      className="w-12 bg-gray-50 border-r border-gray-300 overflow-hidden shrink-0"
    >
      <div 
        style={{ height: CELL_HEIGHT * grid.rows }}
      >
        {Array.from({ length: grid.rows }).map((_, i) => {
          const rowNumber = i + 1;
          const isSelected = selectedRows.includes(rowNumber);
          
          return (
            <div
              key={i}
              className={`
                flex items-center justify-center border-b border-gray-300 font-semibold select-none text-xs cursor-pointer transition-colors
                ${isSelected 
                  ? 'bg-blue-200 text-blue-800 border-blue-400' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
              style={{
                height: CELL_HEIGHT,
                minHeight: CELL_HEIGHT,
              }}
              onClick={(e) => handleRowClick(i, e)}
              title={`Select row ${rowNumber} (Ctrl+click for multiple)`}
            >
              {rowNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RowHeader;
