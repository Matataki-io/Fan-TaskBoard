import client from "./index";
import clientMtkApi from "./mtkApi";

export interface questInterface {
  id?: number,
  uid?: number,
  type: number,
  twitter_id: string,
  token_id: number,
  reward_people: string,
  reward_price: string,
  create_time?: string,
  update_time?: string,
}

export interface receiveProps {
  qid: number
}

// =========== MTK ===========
// 获取用户信息
export function getUserProfile() {
  return clientMtkApi.get(`/user/stats`);
}

// =========== BE ===========
// 获取所有任务列表
export function getAllQuests() {
  return client.get(`/quest`);
}
// 创建任务
export function createQuest(data: questInterface) {
  return client.post(`/quest`, data);
}

// 创建任务
export function receive(data: receiveProps) {
  return client.post(`/receive`, data);
}
export function twitterUsersSearch(q: string, count: number = 5) {
  return client.get(`/users/search/twitter`, { params: { q, count } })
}

export function getTokenList(page = 1, pagesize = 20, search?: string) {
  return client.get(`/token/list`, { params: { page, pagesize, search } })
}
