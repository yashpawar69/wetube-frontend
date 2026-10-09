import { api } from "./axiosClient";

export const getAllVideosRequest = (params) => api.get("/videos", { params });

export const getVideoByIdRequest = (videoId) => api.get(`/videos/${videoId}`);

export const publishVideoRequest = (formData) =>
  api.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
