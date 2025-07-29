import { type Comment } from "../types/api.types";
import { API_BASE_URL } from "../config/environment";

// Backend comment response structure
interface BackendComment {
  comment_id: string;
  user_id: string;
  cell_ref: string;
  text: string;
  timestamp: number;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

export async function fetchCellComments(sheetId: string, cellRef: string): Promise<Comment[]> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/comments/${sheetId}/${cellRef}`);
    
    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Failed to fetch comments: ${errMsg}`);
    }
    
    const data: BackendComment[] = await response.json();
    
    // Transform backend response to match frontend types
    return data.map((comment: BackendComment) => ({
      commentId: comment.comment_id,
      userId: comment.user_id,
      cellRef: comment.cell_ref,
      text: comment.text,
      timestamp: comment.timestamp
    })) as Comment[];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

/**
 * Posts a new comment to a cell.
 * Note: The backend expects the comment text as a query parameter, not in the body.
 */
export async function addCellComment(
  sheetId: string,
  cellRef: string,
  userId: string,
  text: string
): Promise<Comment> {
  try {
    // The backend expects text as a query parameter, not in the body
    const url = `${API_BASE_URL}/api/comments/${sheetId}/${cellRef}/${userId}?text=${encodeURIComponent(text)}`;
    
    const response = await authenticatedFetch(url, {
      method: "POST",
    });
    
    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Failed to add comment: ${errMsg}`);
    }
    
    const data = await response.json();
    
    // Create a proper Comment object since backend only returns partial data
    return {
      commentId: data.comment_id,
      userId: userId,
      cellRef: cellRef,
      text: data.text,
      timestamp: Date.now() / 1000 // Current timestamp in seconds
    } as Comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}
