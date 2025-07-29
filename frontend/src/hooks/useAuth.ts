import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../store"
import { useCallback } from "react"
import {
  authStart,
  authFail,
  authSuccess,
  logout as logoutAction,
} from "../store/authSlice"
import { addAuthenticatedUser, resetCollaboration } from "../store/collaborationSlice"
import { setLoading } from "../store/uiSlice"
import { loginUser, getCurrentUser, verifyToken } from "../services/authService"

export function useAuth() {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)

  const logout = useCallback(() => {
    dispatch(logoutAction())
    dispatch(resetCollaboration()) // Clear collaboration state on logout
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }, [dispatch])

  const login = useCallback(async (username: string, password: string) => {
    dispatch(authStart())
    dispatch(setLoading(true)) // Show global loading
    try {
      const data = await loginUser(username, password);
      
      // Create user object from response data
      const user = {
        username: data.username,
        color: data.color
      }
      dispatch(authSuccess({ user, token: data.access_token }))
      
      // Add user to collaboration state
      dispatch(addAuthenticatedUser({
        userId: `auth_${data.username}`,
        username: data.username,
        color: data.color
      }))
      
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(user))
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error or server unavailable";
      dispatch(authFail(errorMessage))
      return false
    } finally {
      dispatch(setLoading(false)) // Hide loading regardless of outcome
    }
  }, [dispatch])

  // Verify current user using /api/auth/users/me endpoint
  const verifyCurrentUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      dispatch(authSuccess({ user, token: localStorage.getItem("token") || "" }))
      
      // Add user to collaboration state
      dispatch(addAuthenticatedUser({
        userId: `auth_${user.username}`,
        username: user.username,
        color: user.color
      }))
      
      // Update local storage with fresh user data
      localStorage.setItem("user", JSON.stringify(user))
      return true;
    } catch (error) {
      console.error("User verification failed:", error);
      logout(); // Clear invalid session
      return false;
    }
  }, [dispatch, logout])

  // Check if token is still valid
  const checkTokenValidity = useCallback(async () => {
    const isValid = await verifyToken();
    if (!isValid) {
      logout(); // Clear invalid session
    }
    return isValid;
  }, [logout])

  // Restore session on mount with server verification
  const restore = useCallback(async () => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    
    if (token && user) {
      try {
        // Verify with server using /api/auth/users/me
        const serverUser = await getCurrentUser();
        
        dispatch(authSuccess({ user: serverUser, token }))
        
        // Add user to collaboration state on restore
        dispatch(addAuthenticatedUser({
          userId: `auth_${serverUser.username}`,
          username: serverUser.username,
          color: serverUser.color
        }))
        
        // Update local storage with fresh data from server
        localStorage.setItem("user", JSON.stringify(serverUser))
      } catch (error) {
        console.warn("Session restore failed, clearing local data:", error);
        logout(); // Clear invalid session
      }
    }
  }, [dispatch, logout])

  return { 
    ...auth, 
    login, 
    logout, 
    restore, 
    verifyCurrentUser, 
    checkTokenValidity 
  }
}
