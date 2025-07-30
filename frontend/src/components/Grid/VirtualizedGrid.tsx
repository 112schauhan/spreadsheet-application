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
      const endRow = Math.min(startRow + visibleRowCount, Math.min(grid.rows, 100)); // Limit to 100 rows
      const startCol = Math.floor(scrollLeft / CELL_WIDTH);
      const endCol = Math.min(startCol + visibleColCount, Math.min(grid.columns - 1, 25)); // Limit to 26 columns (0-25)

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
    // Limit to 26 columns (A-Z)
    if (colIndex >= 26) return 'Z';
    return String.fromCharCode(65 + colIndex);
  };

  const parseColLetter = useCallback((colStr: string) => {
    // Simple A-Z parsing for 26 columns max
    if (colStr.length === 1) {
      return colStr.charCodeAt(0) - 65; // A=0, B=1, ..., Z=25
    }
    return 25; // Default to Z (25) if invalid
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
  // Enforce limits: max 100 rows, max 26 columns
  const maxRows = Math.min(grid.rows, 100);
  const maxCols = Math.min(grid.columns, 26);
  
  const startRow = Math.max(1, visibleRange.rows[0] - OVERSCAN_COUNT);
  const endRow = Math.min(maxRows, visibleRange.rows[1] + OVERSCAN_COUNT);
  const startCol = Math.max(0, visibleRange.cols[0] - OVERSCAN_COUNT);
  const endCol = Math.min(maxCols - 1, visibleRange.cols[1] + OVERSCAN_COUNT);

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
      className="h-full w-full bg-white relative spreadsheet-scroll"
      style={{
        overflow: 'auto', // Auto scrollbars when content overflows
        scrollbarWidth: 'auto', // For Firefox - show full scrollbars
        scrollbarColor: '#374151 #D1D5DB', // For Firefox - thumb and track colors
        maxHeight: 'calc(100vh - 300px)', // Ensure container has limited height
        maxWidth: '100%', // Ensure container has limited width
      }}
    >
      {/* Enhanced scrollbar styles for WebKit browsers */}
      <style>{`
        .spreadsheet-scroll {
          scrollbar-width: auto !important;
          scrollbar-color: #374151 #D1D5DB !important;
          scrollbar-gutter: stable;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar {
          width: 16px !important;
          height: 16px !important;
          background-color: #D1D5DB !important;
          display: block !important;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-track {
          background: #D1D5DB !important;
          border-radius: 4px !important;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-thumb {
          background: #374151 !important;
          border-radius: 4px !important;
          border: 2px solid #D1D5DB !important;
          min-height: 30px !important;
          min-width: 30px !important;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-thumb:hover {
          background: #1F2937 !important;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-thumb:active {
          background: #111827 !important;
        }
        
        .spreadsheet-scroll::-webkit-scrollbar-corner {
          background: #D1D5DB !important;
        }
      `}</style>
      
      {/* Total scrollable area - Create a large content area to trigger scrollbars */}
      <div
        className="relative bg-gray-50"
        style={{
          width: '2600px', // 26 columns × 100px - larger than any typical container
          height: '2800px', // 100 rows × 28px - larger than any typical container
          border: '1px solid red', // Debug: visible border to see the content area
        }}
      >
        {/* Debug: Corner markers to show content boundaries */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', backgroundColor: 'green' }}></div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', backgroundColor: 'blue' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '10px', height: '10px', backgroundColor: 'orange' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', backgroundColor: 'purple' }}></div>
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
