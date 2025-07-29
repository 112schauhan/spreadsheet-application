import React from "react"

// Example actions. Wire these up as needed in your app.
const MENU_ITEMS = [
  { label: "Copy", action: "copy" },
  { label: "Paste", action: "paste" },
  { label: "Insert Row", action: "insertRow" },
  { label: "Delete Row", action: "deleteRow" },
  { label: "Insert Column", action: "insertColumn" },
  { label: "Delete Column", action: "deleteColumn" },
]

interface ContextMenuProps {
  visible: boolean
  x: number
  y: number
  onAction: (action: string) => void
  onClose: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  onAction,
  onClose,
}) => {
  if (!visible) return null
  return (
    <ul
      className="fixed z-50 bg-white border border-gray-300 rounded shadow-md py-1 text-sm"
      style={{ top: y, left: x, minWidth: 150 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {MENU_ITEMS.map((item) => (
        <li
          key={item.action}
          className="px-4 py-2 cursor-pointer hover:bg-blue-100"
          onClick={() => {
            onAction(item.action)
            onClose()
          }}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export default ContextMenu