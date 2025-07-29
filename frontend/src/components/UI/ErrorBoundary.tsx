/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(_error: Error, _info: React.ErrorInfo) {
    // Optionally log error
    // console.error(_error, _info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="p-6 bg-red-100 border border-red-400 rounded shadow text-red-800 max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <pre className="text-xs break-words">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
