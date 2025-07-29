import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import Cell from "./Cell";
import SelectionOverlay from "./SelectionOverlay";
import { setVisibleRange } from "../../store/gridSlice";
import { CELL_WIDTH, CELL_HEIGHT } from "../../config/constants";

const OVERSCAN_COUNT = 5; // Extra rows/cols to render for smooth scrolling

const VirtualizedGrid: React.FC = () => {
  const grid = useSelector((state: RootState) => state.grid);
  const selection = useSelector((state: RootState) => state.selection);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate visible rows and columns based on container size
  const visibleRowCount = Math.ceil(containerSize.height / CELL_HEIGHT) + OVERSCAN_COUNT;
  const visibleColCount = Math.ceil(containerSize.width / CELL_WIDTH) + OVERSCAN_COUNT;

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const scrollLeft = containerRef.current.scrollLeft;

      const startRow = Math.floor(scrollTop / CELL_HEIGHT) + 1;
      const endRow = Math.min(startRow + visibleRowCount, grid.rows);
      const startCol = Math.floor(scrollLeft / CELL_WIDTH);
      const endCol = Math.min(startCol + visibleColCount, grid.columns - 1);

      dispatch(
        setVisibleRange({
          rows: [startRow, endRow],
          cols: [startCol, endCol],
        })
      );
    };

    const div = containerRef.current;
    div?.addEventListener("scroll", onScroll);
    // Initialize visible range on mount
    onScroll();
    return () => div?.removeEventListener("scroll", onScroll);
  }, [dispatch, grid.rows, grid.columns, visibleRowCount, visibleColCount]);

  const getColLetter = (colIndex: number) => {
    let result = '';
    let num = colIndex;
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    }
    return result;
  };

  const parseColLetter = useCallback((colStr: string) => {
    let colIndex = 0;
    for (let i = 0; i < colStr.length; i++) {
      colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 65 + 1);
    }
    return colIndex - 1; // Convert to 0-based index
  }, []);

  const parseCellRef = useCallback((cellRef: string) => {
    const match = cellRef.match(/^([A-Z]+)([1-9][0-9]*)$/);
    if (!match) return null;
    return {
      col: parseColLetter(match[1]),
      row: parseInt(match[2], 10) - 1, // Convert to 0-based
    };
  }, [parseColLetter]);

  // Effect to scroll to selected cell when selection changes
  useEffect(() => {
    const lastSelectedCell = selection.lastSelectedCell;
    if (!lastSelectedCell || !containerRef.current) return;

    const coords = parseCellRef(lastSelectedCell);
    if (!coords) return;

    const container = containerRef.current;
    const { scrollTop, scrollLeft, clientHeight, clientWidth } = container;

    // Calculate cell position
    const cellTop = coords.row * CELL_HEIGHT;
    const cellLeft = coords.col * CELL_WIDTH;
    const cellBottom = cellTop + CELL_HEIGHT;
    const cellRight = cellLeft + CELL_WIDTH;

    // Calculate visible area
    const visibleTop = scrollTop;
    const visibleLeft = scrollLeft;
    const visibleBottom = scrollTop + clientHeight;
    const visibleRight = scrollLeft + clientWidth;

    // Check if cell is outside visible area and scroll if needed
    let newScrollTop = scrollTop;
    let newScrollLeft = scrollLeft;

    if (cellTop < visibleTop) {
      // Cell is above visible area
      newScrollTop = cellTop;
    } else if (cellBottom > visibleBottom) {
      // Cell is below visible area
      newScrollTop = cellBottom - clientHeight;
    }

    if (cellLeft < visibleLeft) {
      // Cell is to the left of visible area
      newScrollLeft = cellLeft;
    } else if (cellRight > visibleRight) {
      // Cell is to the right of visible area
      newScrollLeft = cellRight - clientWidth;
    }

    // Scroll if needed
    if (newScrollTop !== scrollTop || newScrollLeft !== scrollLeft) {
      container.scrollTo({
        top: Math.max(0, newScrollTop),
        left: Math.max(0, newScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [selection.lastSelectedCell, parseCellRef]);

  const { visibleRange } = grid;
  const startRow = Math.max(1, visibleRange.rows[0] - OVERSCAN_COUNT);
  const endRow = Math.min(grid.rows, visibleRange.rows[1] + OVERSCAN_COUNT);
  const startCol = Math.max(0, visibleRange.cols[0] - OVERSCAN_COUNT);
  const endCol = Math.min(grid.columns - 1, visibleRange.cols[1] + OVERSCAN_COUNT);

  const rows = Array.from(
    { length: endRow - startRow + 1 },
    (_, i) => startRow + i
  );
  const cols = Array.from(
    { length: endCol - startCol + 1 },
    (_, i) => startCol + i
  );

  return (
    <div
      ref={containerRef}
      className="overflow-auto h-full w-full bg-white relative spreadsheet-scroll"
      style={{
        scrollbarWidth: 'auto', // For Firefox
        scrollbarColor: '#CBD5E0 #F7FAFC', // For Firefox
      }}
    >
      {/* Custom scrollbar styles for WebKit browsers */}
      <style>{`
        .spreadsheet-scroll::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-track {
          background: #F7FAFC;
          border-radius: 6px;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 6px;
          border: 2px solid #F7FAFC;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-corner {
          background: #F7FAFC;
        }
      `}</style>
      
      {/* Total scrollable area */}
      <div
        className="relative"
        style={{
          width: CELL_WIDTH * grid.columns,
          height: CELL_HEIGHT * grid.rows,
        }}
      >
        {/* Render only visible cells */}
        {rows.map((row) =>
          cols.map((col) => {
            const cellRef = `${getColLetter(col)}${row}`;
            return (
              <Cell
                key={cellRef}
                cellRef={cellRef}
                style={{
                  position: "absolute",
                  top: (row - 1) * CELL_HEIGHT,
                  left: col * CELL_WIDTH,
                  width: CELL_WIDTH,
                  height: CELL_HEIGHT,
                }}
              />
            );
          })
        )}
        
        {/* Selection overlay for ranges, rows, and columns */}
        <SelectionOverlay />
      </div>
    </div>
  );
};

export default VirtualizedGrid;
