import { getAccessToken } from "@/api/common";
import { lightfishRequest } from "@/api/lightfishApi";
import { createCustomModel } from "@/common/createModel";
import { jumpToLogin } from "@/utils/url";
import { useMount, useReactive, useRequest } from "ahooks";
import { Spin } from "antd";
import axios from "axios";
import type { PropsWithChildren } from "react";

interface UserInfo {
  id: number;
  username: string;
}

export const UserModel = createCustomModel(() => {
  const userViewModel = useReactive<UserInfo>({
    id: 0,
    username: "",
  });

  const { loading: queryUserInfoLoading } = useRequest(async () => {
    const token = getAccessToken();
    if (token) {
      const { data } = await axios.request<{ data: UserInfo }>({
        url: "http://api.lightfish.top/api/account/info",
        method: "get",
        headers: {
          "X-User-Id": token,
          "X-App-Name": "frontend-account",
          "X-Version": "10",
        },
      });

      Object.assign(userViewModel, data.data);
    }
    return userViewModel;
  });

  return {
    queryUserInfoLoading,
    userInfo: userViewModel,
  };
});

const AuthLoginLayout = ({ children }: PropsWithChildren) => {
  const token = getAccessToken();
  const { queryUserInfoLoading } = UserModel.useModel();

  useMount(() => {
    if (!token) {
      jumpToLogin();
    }
  });

  if (!token || queryUserInfoLoading) {
    return <Spin spinning fullscreen />;
  }
  return children;
};

export function UserModelProvider({ children }: PropsWithChildren) {
  return (
    <UserModel.Provider>
      <AuthLoginLayout>{children}</AuthLoginLayout>
    </UserModel.Provider>
  );
}
