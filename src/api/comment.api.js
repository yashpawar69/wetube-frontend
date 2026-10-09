import { api } from "./axiosClient";

// GET /api/v1/comments/:videoId?page=1&limit=10
export const getCommentsRequest = (videoId, page = 1, limit = 10) =>
  api.get(`/comments/${videoId}`, { params: { page, limit } });

// POST /api/v1/comments/:videoId   body: { content }
export const addCommentRequest = (videoId, content) =>
  api.post(`/comments/${videoId}`, { content });

// DELETE /api/v1/comments/c/:commentId
export const deleteCommentRequest = (commentId) =>
  api.delete(`/comments/c/${commentId}`);

// PATCH /api/v1/comments/c/:commentId   body: { content }
export const updateCommentRequest = (commentId, content) =>
  api.patch(`/comments/c/${commentId}`, { content });
