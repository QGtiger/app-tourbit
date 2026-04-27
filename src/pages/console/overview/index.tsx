import {
  FolderFilled,
  FileFilled,
  RightOutlined,
  HomeOutlined,
  ReloadOutlined,
  PlusOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Modal, Input, message, Empty, Spin } from "antd";
import { useState, useMemo, useCallback } from "react";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { lightfishRequest } from "@/api/lightfishApi";

// ============ 数据类型 ============
interface DirectoryItem {
  key: string;
  title: string;
  type: "folder" | "tourbit";
  parentKey: string | null;
  createdAt: string;
}

interface BreadcrumbNode {
  key: string;
  title: string;
}

// ============ API 封装 ============
const api = {
  getList: () =>
    lightfishRequest<{ list: DirectoryItem[] }>("/tourbit-directory"),

  create: (data: {
    title: string;
    parentKey: string | null;
    type: "folder" | "tourbit";
  }) =>
    lightfishRequest<DirectoryItem>("/tourbit-directory/create", {
      method: "POST",
      data,
    }),

  getByKey: (key: string) =>
    lightfishRequest<DirectoryItem>(`/tourbit-directory/${key}`),

  update: (
    key: string,
    data: {
      title?: string;
      parentKey?: string | null;
      type?: "folder" | "tourbit";
    }
  ) =>
    lightfishRequest<DirectoryItem>(`/tourbit-directory/${key}/update`, {
      method: "POST",
      data,
    }),

  delete: (key: string) =>
    lightfishRequest<{ deleted: number; keys: string[] }>(
      `/tourbit-directory/${key}/delete`,
      { method: "POST" }
    ),
};

// ============ 图标组件 ============
function FolderIcon() {
  return (
    <div className="w-20 h-20 flex items-center justify-center">
      <div className="relative">
        <svg width="72" height="54" viewBox="0 0 72 54" fill="none">
          <path
            d="M4 12C4 9.79086 5.79086 8 8 8H28.5L32.5 14H64C66.2091 14 68 15.7909 68 18V46C68 48.2091 66.2091 50 64 50H8C5.79086 50 4 48.2091 4 46V12Z"
            fill="#4B8BF5"
            opacity="0.3"
          />
          <path
            d="M2 14C2 11.7909 3.79086 10 6 10H26.5L30.5 16H62C64.2091 16 66 17.7909 66 20V48C66 50.2091 64.2091 52 62 52H6C3.79086 52 2 50.2091 2 48V14Z"
            fill="#4B8BF5"
          />
          <path
            d="M2 14C2 11.7909 3.79086 10 6 10H26.5L30.5 16H62C64.2091 16 66 17.7909 66 20V22H2V14Z"
            fill="#6BA0FF"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}

function WorkflowIcon() {
  return (
    <div className="w-20 h-20 flex items-center justify-center">
      <svg width="60" height="68" viewBox="0 0 60 68" fill="none">
        <path
          d="M4 4C4 1.79086 5.79086 0 8 0H38L56 18V64C56 66.2091 54.2091 68 52 68H8C5.79086 68 4 66.2091 4 64V4Z"
          fill="white"
          stroke="#E5E7EB"
          strokeWidth="2"
        />
        <path
          d="M38 0V12C38 14.2091 39.7909 16 42 16H56L38 0Z"
          fill="#F3F4F6"
          stroke="#E5E7EB"
          strokeWidth="2"
        />
        <rect x="14" y="28" width="32" height="3" rx="1.5" fill="#D1D5DB" />
        <rect x="14" y="36" width="28" height="3" rx="1.5" fill="#D1D5DB" />
        <rect x="14" y="44" width="24" height="3" rx="1.5" fill="#D1D5DB" />
        <circle cx="14" cy="56" r="4" fill="#4B8BF5" />
      </svg>
    </div>
  );
}

// ============ 主组件 ============
export default function Overview() {
  const [pathStack, setPathStack] = useState<BreadcrumbNode[]>([
    { key: "root", title: "全部 Tourbit" },
  ]);

  // 新建模态框
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<"folder" | "tourbit">("folder");
  const [createTitle, setCreateTitle] = useState("");

  // 当前所在目录的 key
  const currentParentKey = useMemo(() => {
    const last = pathStack[pathStack.length - 1];
    return last.key === "root" ? null : last.key;
  }, [pathStack]);

  // ===== 获取列表 =====
  const { data: listData, loading, refresh } = useRequest(api.getList);

  // 根据当前目录过滤
  const currentItems = useMemo(() => {
    if (!listData?.list) return [];
    return listData.list.filter((item) => item.parentKey === currentParentKey);
  }, [listData, currentParentKey]);

  // ===== 创建 =====
  const { run: handleCreate } = useRequest(
    async () => {
      if (!createTitle.trim()) {
        message.warning("请输入名称");
        return;
      }
      await api.create({
        title: createTitle.trim(),
        parentKey: currentParentKey,
        type: createType,
      });
      message.success(
        `已创建${
          createType === "folder" ? "文件夹" : "Tourbit"
        }：${createTitle}`
      );
      setCreateModalOpen(false);
      setCreateTitle("");
      refresh();
    },
    { manual: true }
  );

  // ===== 删除 =====
  const { run: handleDelete } = useRequest(
    async (item: DirectoryItem) => {
      await api.delete(item.key);
      message.success(`已删除：${item.title}`);
      refresh();
    },
    { manual: true }
  );

  // ===== 重命名 =====
  const { run: handleRename } = useRequest(
    async (item: DirectoryItem) => {
      // 简单实现：弹窗输入新名称
      // 实际可做 inline 编辑
      message.info(`重命名功能待完善：${item.title}`);
    },
    { manual: true }
  );

  // ===== 移动到 =====
  const { run: handleMove } = useRequest(
    async (item: DirectoryItem) => {
      message.info(`移动功能待完善：${item.title}`);
    },
    { manual: true }
  );

  // 进入目录
  const enterFolder = useCallback((item: DirectoryItem) => {
    setPathStack((prev) => [...prev, { key: item.key, title: item.title }]);
  }, []);

  // 面包屑导航
  const navigateTo = useCallback((index: number) => {
    setPathStack((prev) => prev.slice(0, index + 1));
  }, []);

  // 返回上一级
  const goBack = useCallback(() => {
    if (pathStack.length > 1) {
      setPathStack((prev) => prev.slice(0, -1));
    }
  }, [pathStack]);

  // 打开创建模态框
  const openCreateModal = useCallback((type: "folder" | "tourbit") => {
    setCreateType(type);
    setCreateTitle("");
    setCreateModalOpen(true);
  }, []);

  // 双击打开
  const handleDoubleClick = useCallback(
    (item: DirectoryItem) => {
      if (item.type === "folder") {
        enterFolder(item);
      } else {
        message.info(`打开 Tourbit：${item.title}`);
      }
    },
    [enterFolder]
  );

  // 右键菜单
  const contextMenuItems = useCallback(
    (item: DirectoryItem) => [
      {
        key: "rename",
        label: "重命名",
        onClick: () => handleRename(item),
      },
      {
        key: "move",
        label: "移动到",
        onClick: () => handleMove(item),
      },
      {
        key: "delete",
        label: "删除",
        danger: true,
        onClick: () => handleDelete(item),
      },
    ],
    [handleRename, handleMove, handleDelete]
  );

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa]">
      {/* ===== 顶部操作栏 ===== */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-0 min-w-0">
          <div className="flex items-center gap-0 mr-3 pr-3 border-r border-gray-200">
            <Button
              type="text"
              size="small"
              icon={<HomeOutlined />}
              disabled={pathStack.length <= 1}
              onClick={() => navigateTo(0)}
              className="text-gray-400 hover:text-gray-600!"
            />
            <Button
              type="text"
              size="small"
              icon={<RightOutlined className="rotate-180 text-xs" />}
              disabled={pathStack.length <= 1}
              onClick={goBack}
              className="text-gray-400 hover:text-gray-600!"
            />
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={refresh}
              className="text-gray-400 hover:text-gray-600!"
            />
          </div>

          <div className="flex items-center gap-1.5 text-sm min-w-0">
            {pathStack.map((node, index) => (
              <div key={node.key} className="flex items-center gap-1.5">
                {index > 0 && (
                  <RightOutlined className="text-[10px] text-gray-300" />
                )}
                <span
                  className={`cursor-pointer truncate inline-block max-w-[120px] leading-none ${
                    index === pathStack.length - 1
                      ? "text-gray-800 font-semibold"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => navigateTo(index)}
                >
                  {index === 0 && <HomeOutlined className="mr-1" />}
                  {node.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dropdown
            menu={{
              items: [
                {
                  key: "folder",
                  icon: <FolderAddOutlined />,
                  label: "新建文件夹",
                  onClick: () => openCreateModal("folder"),
                },
                {
                  key: "tourbit",
                  icon: <FileFilled />,
                  label: "新建 Tourbit",
                  onClick: () => openCreateModal("tourbit"),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              新建
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* ===== 文件区域 ===== */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : currentItems.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-gray-400">
                  <p>此目录为空</p>
                  <p className="text-sm mt-1">
                    点击上方「新建」按钮创建文件夹或 Tourbit
                  </p>
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {currentItems.map((item) => (
              <Dropdown
                key={item.key}
                menu={{ items: contextMenuItems(item) }}
                trigger={["contextMenu"]}
              >
                <div
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer
                    hover:bg-blue-50/60 hover:shadow-sm
                    transition-all duration-200 ease-out
                    active:scale-95"
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  <div className="relative">
                    {item.type === "folder" ? <FolderIcon /> : <WorkflowIcon />}
                    <span
                      className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium
                        ${
                          item.type === "folder"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                    >
                      {item.type === "folder" ? "文件夹" : "Tourbit"}
                    </span>
                  </div>

                  <div className="w-full text-center">
                    <p className="text-sm text-gray-700 font-medium truncate px-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
                    </p>
                  </div>
                </div>
              </Dropdown>
            ))}
          </div>
        )}
      </div>

      {/* ===== 底部状态栏 ===== */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-t border-gray-200 text-xs text-gray-400">
        <span>当前位置：{pathStack.map((n) => n.title).join(" / ")}</span>
        <span>
          共 {currentItems.length} 项
          {currentItems.filter((i) => i.type === "folder").length > 0 &&
            ` · ${
              currentItems.filter((i) => i.type === "folder").length
            } 个文件夹`}
          {currentItems.filter((i) => i.type === "tourbit").length > 0 &&
            ` · ${
              currentItems.filter((i) => i.type === "tourbit").length
            } 个 Tourbit`}
        </span>
      </div>

      {/* ===== 新建模态框 ===== */}
      <Modal
        title={createType === "folder" ? "新建文件夹" : "新建 Tourbit"}
        open={createModalOpen}
        onOk={handleCreate}
        onCancel={() => setCreateModalOpen(false)}
        okText="创建"
        cancelText="取消"
        destroyOnClose
      >
        <div className="py-4">
          <Input
            autoFocus
            placeholder={
              createType === "folder"
                ? "请输入文件夹名称"
                : "请输入 Tourbit 名称"
            }
            value={createTitle}
            onChange={(e) => setCreateTitle(e.target.value)}
            onPressEnter={handleCreate}
            variant="filled"
            size="large"
          />
        </div>
      </Modal>
    </div>
  );
}
