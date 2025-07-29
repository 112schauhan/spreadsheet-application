import React from "react"
import { useAuth } from "../../hooks/useAuth"

const LogoutButton: React.FC = () => {
  const { logout } = useAuth()
  return (
    <button
      onClick={logout}
      className="px-4 py-1 rounded-lg bg-gray-200 border border-gray-300 ml-2 text-gray-700 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
      type="button"
    >
      Logout
    </button>
  )
}

export default LogoutButton
