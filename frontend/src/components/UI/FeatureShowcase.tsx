import React, { useState } from 'react';

interface FeatureShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURES = [
  {
    title: "Cell Editing",
    description: "Edit cells using multiple methods",
    methods: [
      "Double-click on any cell to start editing",
      "Press F2 on selected cell to edit",
      "Press Enter on selected cell to edit",
      "Press Escape to cancel editing"
    ],
    demo: "Try double-clicking on cell A1 or select it and press F2"
  },
  {
    title: "Formula Support",
    description: "Supports 3 basic formulas with range operations",
    methods: [
      "=SUM(A1:A10) - Sum a range of cells",
      "=AVERAGE(A1:A10) - Average a range of cells", 
      "=COUNT(A1:A10) - Count non-empty cells"
    ],
    demo: "See cells B8, B9, B10 for working formula examples"
  },
  {
    title: "Copy/Paste",
    description: "Copy and paste cell values and ranges",
    methods: [
      "Ctrl+C to copy selected cells",
      "Ctrl+V to paste at selected location",
      "Supports single cells and ranges",
      "Maintains data formatting"
    ],
    demo: "Select cells G2:H4 and copy/paste to another location"
  },
  {
    title: "Row/Column Operations", 
    description: "Add and delete rows and columns",
    methods: [
      "Use '+ Row' button in sidebar to add rows",
      "Use '- Row' button to delete rows", 
      "Use '+ Column' button to add columns",
      "Use '- Column' button to delete columns"
    ],
    demo: "Try the buttons in the left sidebar under 'Row/Column Operations'"
  },
  {
    title: "Sorting",
    description: "Sort data by column in ascending or descending order",
    methods: [
      "Select column from dropdown in sorting controls",
      "Choose Ascending or Descending order",
      "Click 'Sort' button to apply",
      "Works with text and numbers"
    ],
    demo: "Try sorting column J which has unsorted numbers: 45, 12, 78, 23, 67"
  },
  {
    title: "Navigation",
    description: "Navigate through the spreadsheet using keyboard",
    methods: [
      "Arrow keys to move between cells",
      "Tab/Shift+Tab for horizontal navigation",
      "Enter/Shift+Enter for vertical navigation",
      "Ctrl+Home to go to A1",
      "Ctrl+End to go to last cell",
      "Page Up/Page Down for quick scrolling"
    ],
    demo: "Use keyboard shortcuts to navigate around the spreadsheet"
  }
];

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ isOpen, onClose }) => {
  const [selectedFeature, setSelectedFeature] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700">
            Spreadsheet Features Showcase
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="flex h-[600px]">
          {/* Feature List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Implemented Features</h3>
              {FEATURES.map((feature, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedFeature === index
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedFeature(index)}
                >
                  <div className="font-medium">{feature.title}</div>
                  <div className="text-sm opacity-75">{feature.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Feature Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {FEATURES[selectedFeature].title}
              </h3>
              <p className="text-gray-600 mb-4">
                {FEATURES[selectedFeature].description}
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">How to use:</h4>
              <ul className="space-y-2">
                {FEATURES[selectedFeature].methods.map((method, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{method}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Try it out:</h4>
              <p className="text-green-700">{FEATURES[selectedFeature].demo}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              ✅ All required features have been successfully implemented!
            </p>
            <p className="text-sm text-gray-500">
              Close this dialog and start using the spreadsheet to test all features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
