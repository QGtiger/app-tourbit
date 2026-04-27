import { UserModelProvider } from "@/models/UserModel";
import { ApartmentOutlined, SearchOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate, useOutlet } from "react-router-dom";

const { Sider, Content } = Layout;

function ConsoleMenu() {
  const navigate = useNavigate();
  return (
    <Menu
      onClick={console.log}
      style={{ width: "100%" }}
      mode="inline"
      inlineCollapsed
      selectedKeys={[location.pathname.split("/").slice(0, 3).join("/")]}
      // 点击路由跳转
      onSelect={(item) => {
        navigate(item.key);
      }}
      className=" border-none!"
      items={[
        {
          key: "/console/workflow",
          icon: <SearchOutlined />,
          label: "Flow 管理",
        },
      ]}
    />
  );
}

export default function ConsoleLayout() {
  const outlet = useOutlet();
  return (
    <UserModelProvider>
      <Layout className="h-screen">
        <Sider
          width={68}
          className=" bg-white! border-0 border-r! border-gray-200! border-solid!"
        >
          <div className="flex h-full flex-col">
            <div className="p-4 flex justify-between items-center border-0 border-b border-gray-200 border-solid">
              <div className="flex gap-2 items-center">
                <div className="bg-[#4878f3] rounded-md w-8 h-8 flex items-center justify-center">
                  <ApartmentOutlined className=" text-white!" />
                </div>
              </div>
            </div>
            <ConsoleMenu />
          </div>
        </Sider>
        <Layout className=" bg-[#f8f9fa82]!">
          <Content className="">{outlet}</Content>
        </Layout>
      </Layout>
    </UserModelProvider>
  );
}
