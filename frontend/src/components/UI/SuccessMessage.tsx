import React from "react"

interface SuccessMessageProps {
  message: string
  onClose?: () => void
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
}) => (
  <div className="fixed bottom-20 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50 flex items-center animate-fade-in">
    <span className="font-medium">{message}</span>
    {onClose && (
      <button
        className="ml-3 text-white rounded px-2 py-1 hover:bg-green-700"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    )}
  </div>
)

export default SuccessMessage
