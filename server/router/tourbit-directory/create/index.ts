import { customAlphabet } from "nanoid";
import { tourbitDirectoryTable, tourbitTable } from "../../../schema/index.js";
import { withCommonParams } from "../../../utils/withCommonParams.js";

// 纯数字随机 key，浏览器友好
const generateKey = customAlphabet("0123456789", 16);

export const method = "POST";

export default withCommonParams(async ({ userId, db }, c) => {
  const body = await c.req.json();
  const { title, parentKey, type } = body;

  if (!title) {
    throw new Error("title is required");
  }

  const nodeType = type === "tourbit" ? "tourbit" : "folder";
  const newKey = generateKey();

  await db.insert(tourbitDirectoryTable).values({
    userId,
    title,
    key: newKey,
    parentKey: parentKey || null,
    type: nodeType,
  });

  // 如果是 tourbit 类型，同步创建默认业务记录
  // if (nodeType === "tourbit") {
  //   await db.insert(tourbitTable).values({
  //     key: newKey,
  //     userId,
  //   });
  // }

  return { title, key: newKey, parentKey: parentKey || null, type: nodeType };
});
