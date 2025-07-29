import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { CELL_WIDTH, CELL_HEIGHT } from "../../config/constants";

const ScrollIndicator: React.FC = () => {
  const grid = useSelector((state: RootState) => state.grid);
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const gridContainer = document.querySelector('.spreadsheet-scroll');
    if (!gridContainer) return;

    let hideTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const element = gridContainer as HTMLElement;
      const scrollTop = element.scrollTop;
      const scrollLeft = element.scrollLeft;
      
      setScrollPosition({ top: scrollTop, left: scrollLeft });
      setIsVisible(true);

      // Hide indicator after scroll stops
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    gridContainer.addEventListener('scroll', handleScroll);
    return () => {
      gridContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimeout);
    };
  }, []);

  const getColLetter = (colIndex: number) => {
    let result = '';
    let num = colIndex;
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    }
    return result;
  };

  const currentCol = Math.floor(scrollPosition.left / CELL_WIDTH);
  const currentRow = Math.floor(scrollPosition.top / CELL_HEIGHT) + 1;
  const totalCols = grid.columns;
  const totalRows = grid.rows;

  const horizontalProgress = Math.min(100, Math.max(0, (scrollPosition.left / (CELL_WIDTH * totalCols - (window.innerWidth || 1000))) * 100));
  const verticalProgress = Math.min(100, Math.max(0, (scrollPosition.top / (CELL_HEIGHT * totalRows - (window.innerHeight || 800))) * 100));

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm transition-opacity duration-300">
      <div className="flex flex-col space-y-1">
        <div>
          Position: {getColLetter(currentCol)}{currentRow}
        </div>
        <div className="flex space-x-4 text-xs text-gray-300">
          <span>H: {Math.round(horizontalProgress)}%</span>
          <span>V: {Math.round(verticalProgress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
