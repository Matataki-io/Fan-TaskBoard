import client from "./index";
import clientMtkApi from "./mtkApi";

export interface questInterface {
  id?: number,
  uid?: number,
  type: number,
  twitter_id: number,
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
