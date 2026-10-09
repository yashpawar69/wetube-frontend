import { api } from "./axiosClient";

// POST /api/v1/playlist          body: { name, description }
export const createPlaylistRequest = (name, description) =>
  api.post("/playlist", { name, description });

// GET /api/v1/playlist/user/:userId
export const getUserPlaylistsRequest = (userId) =>
  api.get(`/playlist/user/${userId}`);

// GET /api/v1/playlist/:playlistId
export const getPlaylistByIdRequest = (playlistId) =>
  api.get(`/playlist/${playlistId}`);

// PATCH /api/v1/playlist/add/:videoId/:playlistId
export const addVideoToPlaylistRequest = (videoId, playlistId) =>
  api.patch(`/playlist/add/${videoId}/${playlistId}`);

// PATCH /api/v1/playlist/remove/:videoId/:playlistId
export const removeVideoFromPlaylistRequest = (videoId, playlistId) =>
  api.patch(`/playlist/remove/${videoId}/${playlistId}`);

// DELETE /api/v1/playlist/:playlistId
export const deletePlaylistRequest = (playlistId) =>
  api.delete(`/playlist/${playlistId}`);

// PATCH /api/v1/playlist/:playlistId   body: { name, description }
export const updatePlaylistRequest = (playlistId, name, description) =>
  api.patch(`/playlist/${playlistId}`, { name, description });
