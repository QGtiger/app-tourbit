import { lightfishApiClient } from "@lightfish/server/api";
import { getAccessToken, removeAccessToken } from "./common";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { message } from "antd";
import { jumpToLogin } from "@/utils/url";

const messageList = [
  "哎呀，我们的小接口好像有点害羞，暂时不想和大家见面呢。",
  "呜哇，接口宝宝好像闹脾气了，我们正在努力哄它开心哦！",
  "哎呀，接口好像在睡懒觉，我们轻轻地叫醒它吧。",
  "接口正在做瑜伽，可能需要一点时间来调整呼吸哦。",
  "接口可能在享受下午茶，稍等片刻，它会回来的。",
  "接口正在和bug捉迷藏，我们很快就能找到它。",
  "接口可能迷路了，我们正在用地图帮它找回家的路。",
  "接口正在充电中，请稍候片刻，它很快就会满血复活。",
];
function getCuteMessage() {
  return messageList[Math.floor(Math.random() * messageList.length)];
}

lightfishApiClient.interceptors.request.use((config: any) => {
  config.headers["X-User-Id"] = getAccessToken();
  return config;
});

interface BaseResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message?: string;
}

(lightfishApiClient as AxiosInstance).interceptors.response.use(
  async (res) => {
    const responseData: BaseResponse<any> = res.data;
    if (!responseData.success) {
      message.error(responseData.message || getCuteMessage());
      if (responseData.code === 401) {
        // 未登录
        removeAccessToken();

        jumpToLogin();
      }
      return Promise.reject(responseData);
    }
    // 统一后端网关处理
    return responseData.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const lightfishRequest = async <T = any>(
  path: string,
  options?: AxiosRequestConfig
): Promise<T> => {
  return (lightfishApiClient as AxiosInstance)({
    url: path,
    ...options,
  });
};
