// src/components/Auth/LoginForm.tsx
import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth"

const LoginForm: React.FC = () => {
  const { status, error, login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    await login(username, password)
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Header with logo */}
        <div className="w-48 h-32 bg-black rounded-lg mb-6 relative flex items-center justify-center mx-auto">
          <div className="w-10 h-16 bg-white rounded-full"></div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-1">Welcome Back</h1>
        <p className="text-center text-gray-600 mb-6">Please sign in to your account</p>

        {/* Demo Accounts */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Demo Accounts (Click to auto-fill)</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setUsername("user1");
                setPassword("password1");
              }}
              className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded hover:bg-blue-50 transition-colors"
              disabled={status === "loading" || submitted}
            >
              � User 1
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername("user2");
                setPassword("password2");
              }}
              className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded hover:bg-blue-50 transition-colors"
              disabled={status === "loading" || submitted}
            >
              � User 2
            </button>
            <button
              type="button"
              onClick={() => {
                setUsername("user3");
                setPassword("password3");
              }}
              className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded hover:bg-blue-50 transition-colors"
              disabled={status === "loading" || submitted}
            >
              � User 3
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            💡 Test collaboration by opening multiple tabs and logging in as different users
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                required
                placeholder="Enter your username"
                className="
                  w-full px-4 py-3 pl-9
                  bg-white border border-gray-200
                  rounded-md
                  text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={status === "loading" || submitted}
                autoFocus
                autoComplete="username"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                className="
                  w-full px-4 py-3 pl-9 pr-10
                  bg-white border border-gray-200
                  rounded-md
                  text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === "loading" || submitted}
                autoComplete="current-password"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border border-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === "loading" || submitted}
          >
            {status === "loading" || submitted ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm text-gray-600">
          &copy; 2025 Spreadsheet App. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default LoginForm
