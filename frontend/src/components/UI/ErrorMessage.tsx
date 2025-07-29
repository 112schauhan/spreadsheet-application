import React from "react"

interface ErrorMessageProps {
  message: string
  onClose?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => (
  <div className="fixed bottom-20 right-4 bg-red-600 text-white px-4 py-2 rounded shadow z-50 flex items-center space-x-2 animate-fade-in">
    <span className="font-medium">{message}</span>
    {onClose && (
      <button
        className="ml-3 text-white rounded px-2 py-1 hover:bg-red-700"
        onClick={onClose}
        aria-label="Close error"
      >
        ×
      </button>
    )}
  </div>
)

export default ErrorMessage
