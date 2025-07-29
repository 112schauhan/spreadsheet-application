import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../store";
import { updateCellWithHistory } from "../../store/gridSlice";
import { selectCell } from "../../store/selectionSlice";
import { setCellError, clearCellError } from "../../store/validationSlice";
import { cursorUpdate } from "../../store/collaborationSlice";
import { setCommentCount } from "../../store/commentSlice";
import { validateCellValue } from "../../services/validationService";
import { isFormula, validateFormulaInput } from "../../utils/formulaUtils";
import { isCellSelected } from "../../utils/selectionUtils";
import useFormulaEngine from "../../hooks/useFormulaEngine";
import LoadingSpinner from "../UI/LoadingSpinner";
import CellComments from "../Comments/CellComments";

interface CellProps {
  cellRef: string;
  style: React.CSSProperties;
}

const Cell: React.FC<CellProps> = React.memo(({ cellRef, style }) => {
  const dispatch = useAppDispatch();
  const cell = useSelector((state: RootState) => state.grid.cells[cellRef]);
  
  // Use the new multi-selection system to check if this cell is selected
  const selection = useSelector((state: RootState) => state.selection);
  const isSelected = isCellSelected(cellRef, selection);
  
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const errors = useSelector((state: RootState) => state.validation.errors);
  
  // Memoized selector to prevent unnecessary rerenders
  const formatting = useSelector((state: RootState) => {
    const format = state.formatting.formats[cellRef];
    return format || null; // Return null instead of {} to maintain referential equality
  });
  
  const { evaluate } = useFormulaEngine();
  const [editing, setEditing] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [inputValue, setInputValue] = useState(cell?.formula || cell?.value?.toString() || "");
  const [showComments, setShowComments] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef_element = useRef<HTMLDivElement>(null);

  // Get comment count from store cache
  const commentCount = useSelector((state: RootState) => state.comments.commentCounts[cellRef] || 0);

  useEffect(() => {
    // When the cell data changes, update the input value
    // Use formula if it exists, otherwise use the value
    const newValue = cell?.formula || cell?.value?.toString() || "";
    setInputValue(newValue);
  }, [cell?.value, cell?.formula]); // Only depend on the specific properties we care about

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  // Generate cell styles based on formatting
  const getCellStyles = (): React.CSSProperties => {
    const cellStyles: React.CSSProperties = { ...style };
    
    if (formatting?.bold) {
      cellStyles.fontWeight = 'bold';
    }
    
    if (formatting?.italic) {
      cellStyles.fontStyle = 'italic';
    }
    
    if (formatting?.underline) {
      cellStyles.textDecoration = 'underline';
    }
    
    if (formatting?.textColor) {
      cellStyles.color = formatting.textColor;
    }
    
    // Handle background color with selection priority
    if (isSelected) {
      // When selected, use a light blue background, but preserve some custom color info via border
      cellStyles.backgroundColor = '#dbeafe'; // bg-blue-100
      if (formatting?.bgColor && formatting.bgColor !== '#ffffff') {
        cellStyles.borderColor = formatting.bgColor;
        cellStyles.borderWidth = '2px';
      }
    } else if (formatting?.bgColor && formatting.bgColor !== '#ffffff') {
      cellStyles.backgroundColor = formatting.bgColor;
    }
    
    if (formatting?.textAlign) {
      cellStyles.textAlign = formatting.textAlign;
    }
    
    if (formatting?.fontSize) {
      cellStyles.fontSize = `${formatting.fontSize}px`;
    }
    
    if (formatting?.fontFamily) {
      cellStyles.fontFamily = formatting.fontFamily;
    }
    
    return cellStyles;
  };

  // Generate CSS classes, removing bg-white if custom background is set
  const getCellClasses = (): string => {
    const baseClasses = "border border-gray-200 overflow-hidden relative cursor-pointer transition-colors";
    const backgroundClass = formatting?.bgColor && formatting.bgColor !== '#ffffff' ? "" : "bg-white";
    
    // Different styles for different selection states
    let selectionClass = "";
    if (isSelected) {
      if (selection.selectedCells.length > 1 || selection.selectedRanges.length > 0) {
        // Multiple cells selected - use a different style to distinguish from single selection
        selectionClass = "outline outline-2 outline-blue-400 bg-blue-50";
      } else {
        // Single cell selected - primary selection style
        selectionClass = "outline outline-blue-500 bg-blue-100";
      }
    }
    
    const editingClass = editing ? "cursor-text" : "";
    const hoverClass = !isSelected && !editing && (!formatting?.bgColor || formatting.bgColor === '#ffffff') ? "hover:bg-gray-50" : "";
    
    return `${baseClasses} ${backgroundClass} ${selectionClass} ${editingClass} ${hoverClass}`.trim();
  };

  // Send cursor position update when cell is selected
  useEffect(() => {
    if (isSelected && currentUser && cellRef_element.current) {
      const rect = cellRef_element.current.getBoundingClientRect();
      const gridContainer = document.querySelector('.spreadsheet-scroll');
      
      if (gridContainer) {
        const gridRect = gridContainer.getBoundingClientRect();
        
        dispatch(cursorUpdate({
          userId: `auth_${currentUser.username}`,
          position: {
            cellRef,
            top: rect.top - gridRect.top + rect.height / 2,
            left: rect.left - gridRect.left + rect.width / 2,
          }
        }));
      }
    }
  }, [isSelected, currentUser, cellRef, dispatch]);

  const startEdit = () => {
    dispatch(selectCell({ cellRef }));
    setEditing(true);
  };

  const finishEdit = async () => {
    setEditing(false);
    
    // Handle the current input value vs stored value comparison
    const currentStoredValue = cell?.formula || cell?.value?.toString() || "";
    if (inputValue === currentStoredValue) {
      return; // No changes made
    }

    // Basic validation
    const expectedType = typeof cell?.value === "number" ? "number" : "text";
    const validation = validateCellValue(inputValue, expectedType);
    if (!validation.isValid) {
      dispatch(setCellError({ cellRef, error: validation.error! }));
      return;
    }
    dispatch(clearCellError(cellRef));

    let valueToSave: string | number = inputValue;
    let formula: string | undefined = undefined;

    // Check if it's a formula
    if (isFormula(inputValue)) {
      if (!validateFormulaInput(inputValue)) {
        dispatch(setCellError({ cellRef, error: "Invalid formula syntax" }));
        return;
      }
      
      formula = inputValue;
      setEvaluating(true); // Show local loading
      
      try {
        // Evaluate the formula and use the result as the display value
        const evaluatedResult = evaluate(inputValue);
        if (evaluatedResult === "#ERROR") {
          dispatch(setCellError({ cellRef, error: "Formula evaluation error" }));
          return;
        }
        valueToSave = evaluatedResult;
      } finally {
        setEvaluating(false); // Hide local loading
      }
    }

    dispatch(updateCellWithHistory({ cellRef, value: valueToSave, formula }));
    // For real-time update, send WebSocket message here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishEdit();
    } else if (e.key === "Escape") {
      setEditing(false);
      // Reset to original value (formula if it exists, otherwise the display value)
      setInputValue(cell?.formula || cell?.value?.toString() || "");
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComments(true);
  };

  const handleCommentsClose = () => {
    setShowComments(false);
    // Comment count is managed by the comments component via Redux store
  };

  const handleCommentCountChange = (count: number) => {
    dispatch(setCommentCount({ cellRef, count }));
  };

  return (
    <div
      ref={cellRef_element}
      className={getCellClasses()}
      style={getCellStyles()}
      tabIndex={0}
      title={commentCount > 0 ? `${commentCount} comment${commentCount > 1 ? 's' : ''} - Right-click to view/add` : "Right-click to add comment"}
      onClick={(e) => {
        const isMultiSelect = e.ctrlKey || e.metaKey;
        const isRangeSelect = e.shiftKey;
        dispatch(selectCell({ cellRef, isMultiSelect, isRangeSelect }));
      }}
      onDoubleClick={startEdit}
      onContextMenu={handleRightClick}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={finishEdit}
          onKeyDown={handleKeyDown}
          className="w-full h-full px-1 focus:outline-none"
          style={{
            fontWeight: formatting?.bold ? 'bold' : 'normal',
            fontStyle: formatting?.italic ? 'italic' : 'normal',
            textDecoration: formatting?.underline ? 'underline' : 'none',
            color: formatting?.textColor || 'inherit',
            textAlign: formatting?.textAlign || 'left',
            fontSize: formatting?.fontSize ? `${formatting.fontSize}px` : 'inherit',
            fontFamily: formatting?.fontFamily || 'inherit',
            backgroundColor: 'transparent'
          }}
        />
      ) : (
        <span 
          className="whitespace-nowrap overflow-hidden text-ellipsis px-1 cursor-pointer"
          style={{
            fontWeight: formatting?.bold ? 'bold' : 'normal',
            fontStyle: formatting?.italic ? 'italic' : 'normal',
            textDecoration: formatting?.underline ? 'underline' : 'none',
            color: formatting?.textColor || 'inherit',
            textAlign: formatting?.textAlign || 'left',
            fontSize: formatting?.fontSize ? `${formatting.fontSize}px` : 'inherit',
            fontFamily: formatting?.fontFamily || 'inherit'
          }}
        >
          {cell?.value ?? ""}
        </span>
      )}
      {evaluating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <LoadingSpinner size="small" message="" overlay={false} />
        </div>
      )}
      {errors[cellRef] && (
        <div className="absolute bottom-0 left-0 right-0 text-xs text-red-600 truncate">
          {errors[cellRef]}
        </div>
      )}
      {commentCount > 0 && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center text-xs text-white font-bold transform translate-x-1 -translate-y-1 shadow-sm">
          {commentCount > 9 ? '9+' : commentCount}
        </div>
      )}
      <CellComments
        cellRef={cellRef}
        sheetId="default" // TODO: Get from active sheet
        isVisible={showComments}
        onClose={handleCommentsClose}
        onCommentCountChange={handleCommentCountChange}
      />
    </div>
  );
});

export default Cell;
