import client from "./index";

export function getUserProfile() {
  return client.get(`/user/stats`);
}
