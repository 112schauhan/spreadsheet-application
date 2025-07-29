import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CommentState {
  commentCounts: Record<string, number>; // cellRef -> comment count
}

const initialState: CommentState = {
  commentCounts: {},
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setCommentCount: (state, action: PayloadAction<{ cellRef: string; count: number }>) => {
      state.commentCounts[action.payload.cellRef] = action.payload.count;
    },
    clearCommentCounts: (state) => {
      state.commentCounts = {};
    },
    removeCommentCount: (state, action: PayloadAction<string>) => {
      delete state.commentCounts[action.payload];
    },
  },
});

export const { setCommentCount, clearCommentCounts, removeCommentCount } = commentSlice.actions;
export default commentSlice.reducer;
