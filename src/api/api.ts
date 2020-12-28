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
  qid: string|number
}

export interface getAllQuestsProps {
  page: number,
  size: number,
  sort: string,
  token: string|number
  filter: string
}
export interface getQuestDetailProps {
  type: string|number
}

export interface tokenListProps {
  pagesize: number
  order: number
}

// =========== MTK ===========
// 获取用户信息
export function getUserProfile() {
  return client.get(`/user/stats`);
}
// 用户绑定信息
export function getAccountList() {
  return client.get(`/account/list`);
}
// 用户token余额
export function tokenTokenList(params: tokenListProps) {
  return client.get(`/token/tokenlist`, { params });
}

// =========== BE ===========
// 获取所有任务列表
export function getAllQuests(params: getAllQuestsProps) {
  return client.get(`/quest`, { params });
}
// 获取任务详情
export function getQuestDetail(id: string|number) {
  return client.get(`/quest/${id}`);
}
// 获取任务统计
export function getQuestCount() {
  return client.get(`/quest/count`);
}
// 获取任务详情列表
export function getQuestDetailList(id: string|number, params: getQuestDetailProps) {
  return client.get(`/quest/${id}/list`, { params });
}
// 获取任务详情申请列表
export function getQuestDetailApplyList(id: string|number) {
  return client.get(`/apply/${id}/list`);
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
