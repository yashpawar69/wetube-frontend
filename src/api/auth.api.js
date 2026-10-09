import { api } from "./axiosClient";

export const registerRequest = (formData) =>
  api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// The backend matches on $or: [{ username }, { email }], so we send the
// same typed identifier as both fields and let Mongo match whichever is
// correct.
export const loginRequest = ({ identifier, password }) =>
  api.post("/users/login", {
    username: identifier,
    email: identifier,
    password,
  });
export const logoutRequest = () => api.post("/users/logout");

export const currentUserRequest = () => api.get("/users/current-user");
export const updateUserAvatar = (formData) =>
  api.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateUserCoverImage = (formData) =>
  api.patch("/users/cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  export const changePasswordRequest = (oldPassword, newPassword) =>
    api.post("/users/change-password", {
      oldPassword,
      newPassword,
    });
  
  export const updateAccountRequest = (data) =>
    api.patch("/users/update-account", data);
  
  export const getChannelProfileRequest = (username) =>
    api.get(`/users/c/${username}`);
  
  export const getWatchHistoryRequest = () =>
    api.get("/users/history");