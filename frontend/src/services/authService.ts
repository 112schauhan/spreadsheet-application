import { API_BASE_URL } from '../config/environment';

export interface User {
  username: string;
  color: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  color: string;
}

/**
 * Login with username and password
 */
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return await response.json();
}

/**
 * Get current user information using the stored token
 * This calls the /api/auth/users/me endpoint
 */
export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/users/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Authentication token expired");
    }
    const error = await response.json();
    throw new Error(error.detail || "Failed to get user information");
  }

  return await response.json();
}

/**
 * Verify if the current token is still valid
 * Returns true if valid, false if invalid/expired
 */
export async function verifyToken(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    console.warn("Token verification failed:", error);
    return false;
  }
}

/**
 * Generic authenticated API call helper
 * Use this for any API endpoint that requires authentication
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("Authentication token expired");
  }

  return response;
}
