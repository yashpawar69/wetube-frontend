import { api } from "./axiosClient";

// POST /api/v1/subscriptions/c/:channelId  (toggles sub on/off)
export const toggleSubscriptionRequest = (channelId) =>
  api.post(`/subscriptions/c/${channelId}`);

// GET /api/v1/subscriptions/c/:channelId  — subscribers of a channel
export const getChannelSubscribersRequest = (channelId) =>
  api.get(`/subscriptions/c/${channelId}`);

// GET /api/v1/subscriptions/u/:subscriberId  — channels a user subscribes to
export const getSubscribedChannelsRequest = (subscriberId) =>
  api.get(`/subscriptions/u/${subscriberId}`);
