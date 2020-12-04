import axios from "axios";
import { getCookie } from "../utils/cookie";

const client = axios.create({
  baseURL: process.env.REACT_APP_MATATAKI_API,
  timeout: 1000 * 30,
  headers: {},
});

// Just copy from matataki-fe
client.interceptors.request.use(
  (config) => {
    if (getCookie("x-access-token"))
      config.headers["x-access-token"] = getCookie("x-access-token");
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    // if(loadingInstance) loadingInstance.close();
    return response.data;
  },
  (error) => {
    // loadingInstance.close()
    console.log(error.message);

    if (error.message.includes("status code 401")) {
      alert("登录状态异常,请重新登录");
    }
    // 超时处理
    if (error.message.includes("timeout")) {
      alert("请求超时");
    }
    if (error.message.includes("Network Error")) {
      alert("Network Error");
    }
    return Promise.reject(error);
  }
);

export default client;
