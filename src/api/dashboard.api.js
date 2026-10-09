import { api } from "./axiosClient";

// GET /api/v1/dashboard/stats
// Returns: { totalViews, totalSubscribers, totalVideos, totalLikes }
export const getDashboardStatsRequest = () => api.get("/dashboard/stats");

// GET /api/v1/dashboard/videos
// Returns paginated list of the owner's own videos (published + unpublished)
export const getDashboardVideosRequest = () => api.get("/dashboard/videos");
