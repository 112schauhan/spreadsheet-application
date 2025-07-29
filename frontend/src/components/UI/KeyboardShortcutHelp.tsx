import React from "react"

interface KeyboardShortcutsHelpProps {
  open: boolean
  onClose: () => void
}

const SHORTCUTS = [
  { keys: "Tab / Shift+Tab", action: "Navigate cells horizontally" },
  { keys: "Enter / Shift+Enter", action: "Navigate cells vertically" },
  { keys: "Ctrl+Z / Ctrl+Y", action: "Undo / Redo" },
  { keys: "Ctrl+C / Ctrl+V", action: "Copy / Paste selected cells" },
  { keys: "Ctrl+A", action: "Select all cells" },
  { keys: "Esc", action: "Cancel cell edit" },
  { keys: "F2 or Double-click", action: "Edit cell" },
]

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-lg text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4 text-blue-700">
          Keyboard Shortcuts
        </h2>
        <ul className="space-y-1">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.keys} className="flex justify-between">
              <span className="font-mono text-blue-600">{shortcut.keys}</span>
              <span>{shortcut.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default KeyboardShortcutsHelp
