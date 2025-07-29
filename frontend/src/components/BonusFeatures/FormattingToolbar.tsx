// frontend/src/components/BonusFeatures/FormattingToolbar.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store";
import { setCellFormatting, clearAllFormatting } from "../../store/formattingSlice";
import { type CellFormatting } from "../../types/formatting.types";

const TEXT_COLORS = [
  "#000000", // black
  "#f87171", // red-400
  "#34d399", // green-400
  "#60a5fa", // blue-400
  "#fbbf24", // yellow-400
];

const BG_COLORS = [
  "#ffffff", // white
  "#fca5a5", // red-300
  "#6ee7b7", // green-300
  "#93c5fd", // blue-300
  "#fde68a", // yellow-300
];

const FormattingToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const selection = useSelector((state: RootState) => state.selection);
  const formats = useSelector((state: RootState) => state.formatting.formats);

  // Only single cell formatting for simplicity
  const format = selection.selectedCell ? formats[selection.selectedCell] ?? {} : {};

  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  if (!selection.selectedCell) {
    return (
      <div className="p-2 text-gray-500 select-none">
        Select a cell to enable formatting
      </div>
    );
  }

  const toggleFormat = (key: keyof typeof format) => {
    dispatch(
      setCellFormatting({
        cellRef: selection.selectedCell!,
        formatting: {
          ...format,
          [key]: !format[key],
        },
      })
    );
  };

  const setFormatValue = (key: keyof CellFormatting, value: string | boolean | number) => {
    dispatch(
      setCellFormatting({
        cellRef: selection.selectedCell!,
        formatting: {
          ...format,
          [key]: value,
        },
      })
    );
  };

  const clearFormatting = () => {
    dispatch(clearAllFormatting());
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 border-b border-gray-300 select-none">
      {/* Bold */}
      <button
        onClick={() => toggleFormat("bold")}
        aria-pressed={!!format.bold}
        title="Bold"
        className={`px-3 py-1 font-bold border rounded ${
          format.bold ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
      >
        B
      </button>

      {/* Italic */}
      <button
        onClick={() => toggleFormat("italic")}
        aria-pressed={!!format.italic}
        title="Italic"
        className={`px-3 py-1 italic border rounded ${
          format.italic ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
      >
        I
      </button>

      {/* Underline */}
      <button
        onClick={() => toggleFormat("underline")}
        aria-pressed={!!format.underline}
        title="Underline"
        className={`px-3 py-1 border-b-2 rounded ${
          format.underline
            ? "border-blue-600 bg-blue-100 text-blue-700"
            : "border-transparent bg-white text-gray-700 hover:bg-gray-200"
        }`}
      >
        U
      </button>

      {/* Text Color Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setShowTextColorPicker(!showTextColorPicker);
            setShowBgColorPicker(false);
          }}
          title="Text Color"
          aria-haspopup="true"
          className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-200"
        >
          <span
            className="inline-block w-4 h-4 rounded"
            style={{ backgroundColor: format.textColor || "#000000" }}
          />
        </button>

        {showTextColorPicker && (
          <div className="absolute mt-1 grid grid-cols-5 gap-1 p-2 bg-white border border-gray-300 rounded shadow-md z-50">
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setFormatValue("textColor", color);
                  setShowTextColorPicker(false);
                }}
                aria-label={`Set text color to ${color}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Background Color Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setShowBgColorPicker(!showBgColorPicker);
            setShowTextColorPicker(false);
          }}
          title="Cell Background Color"
          aria-haspopup="true"
          className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-200"
        >
          <span
            className="inline-block w-6 h-4 rounded"
            style={{ backgroundColor: format.bgColor || "#ffffff", border: "1px solid #ccc" }}
          />
        </button>

        {showBgColorPicker && (
          <div className="absolute mt-1 grid grid-cols-5 gap-1 p-2 bg-white border border-gray-300 rounded shadow-md z-50">
            {BG_COLORS.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setFormatValue("bgColor", color);
                  setShowBgColorPicker(false);
                }}
                aria-label={`Set background color to ${color}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Text Alignment */}
      <div className="flex items-center space-x-1 border border-gray-300 rounded px-1 py-0.5 bg-white">
        <button
          onClick={() => setFormatValue("textAlign", "left")}
          title="Align Left"
          aria-pressed={format.textAlign === "left"}
          className={`px-2 py-1 rounded ${
            format.textAlign === "left"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M3 5h14a1 1 0 100-2H3a1 1 0 100 2zM3 11h8a1 1 0 100-2H3a1 1 0 100 2zM3 17h14a1 1 0 100-2H3a1 1 0 100 2z" />
          </svg>
        </button>
        <button
          onClick={() => setFormatValue("textAlign", "center")}
          title="Align Center"
          aria-pressed={format.textAlign === "center"}
          className={`px-2 py-1 rounded ${
            format.textAlign === "center"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M3 5h14a1 1 0 100-2H3a1 1 0 100 2zM6 11h8a1 1 0 100-2H6a1 1 0 100 2zM3 17h14a1 1 0 100-2H3a1 1 0 100 2z" />
          </svg>
        </button>
        <button
          onClick={() => setFormatValue("textAlign", "right")}
          title="Align Right"
          aria-pressed={format.textAlign === "right"}
          className={`px-2 py-1 rounded ${
            format.textAlign === "right"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M17 5H3a1 1 0 100 2h14a1 1 0 100-2zM10 11H3a1 1 0 000 2h7a1 1 0 100-2zM17 17H3a1 1 0 100 2h14a1 1 0 100-2z" />
          </svg>
        </button>
      </div>

      {/* Clear Formatting */}
      <button
        onClick={clearFormatting}
        title="Clear Formatting"
        className="ml-4 px-3 py-1 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 transition"
      >
        Clear
      </button>
    </div>
  );
};

export default FormattingToolbar;
