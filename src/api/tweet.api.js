import { api } from "./axiosClient";

// POST /api/v1/tweets          body: { content }
export const createTweetRequest = (content) =>
  api.post("/tweets", { content });

// GET /api/v1/tweets?page=1&limit=10 — global feed, every user, newest first
export const getAllTweetsRequest = (page = 1, limit = 10) =>
  api.get("/tweets", { params: { page, limit } });

// GET /api/v1/tweets/user/:userId
export const getUserTweetsRequest = (userId) =>
  api.get(`/tweets/user/${userId}`);

// PATCH /api/v1/tweets/:tweetId   body: { content }
export const updateTweetRequest = (tweetId, content) =>
  api.patch(`/tweets/${tweetId}`, { content });

// DELETE /api/v1/tweets/:tweetId
export const deleteTweetRequest = (tweetId) =>
  api.delete(`/tweets/${tweetId}`);
