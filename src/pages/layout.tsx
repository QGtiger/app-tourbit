import { ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import { setAccessToken } from "@/api/common";

const searchParams = new URLSearchParams(location.search);
const token = searchParams.get("token");
if (token) {
  setAccessToken(token);
  // 清除链接上的token
  history.replaceState(
    null,
    "",
    location.pathname + location.search.replace(`token=${token}`, "")
  );
}

export default function GlobalLayout() {
  return (
    <ConfigProvider locale={zhCN}>
      <Outlet />
    </ConfigProvider>
  );
}
