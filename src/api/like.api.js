import { api } from "./axiosClient";

// POST /api/v1/likes/toggle/v/:videoId
export const toggleVideoLikeRequest = (videoId) =>
  api.post(`/likes/toggle/v/${videoId}`);

// POST /api/v1/likes/toggle/c/:commentId
export const toggleCommentLikeRequest = (commentId) =>
  api.post(`/likes/toggle/c/${commentId}`);

// POST /api/v1/likes/toggle/t/:tweetId
export const toggleTweetLikeRequest = (tweetId) =>
  api.post(`/likes/toggle/t/${tweetId}`);

// GET /api/v1/likes/videos  — all videos the current user has liked
// Returns: array of Like docs where each has a `videoDetails` object
// (see like.controller.js getLikedVideos aggregate)
export const getLikedVideosRequest = () => api.get("/likes/videos");
