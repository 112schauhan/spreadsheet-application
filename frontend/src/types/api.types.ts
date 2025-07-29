export interface Comment {
  commentId: string;
  userId: string;
  cellRef: string;
  text: string;
  timestamp: number;
}

export interface CommentResponse {
  comments: Comment[];
}

export interface CSVImportResponse {
  message: string;
}

export interface APIErrorResponse {
  error: string;
}
