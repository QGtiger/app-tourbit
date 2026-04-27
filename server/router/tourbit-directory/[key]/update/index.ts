import { tourbitDirectoryTable } from "../../../../schema/index.js";
import { withCommonParams } from "../../../../utils/withCommonParams.js";
import { eq } from "drizzle-orm";

export const method = "POST";

export default withCommonParams(async ({ userId, db }, c) => {
  const { key } = c.get("params");
  const body = await c.req.json();
  const { title, parentKey, type } = body;

  // 查询原记录，校验存在性
  const [existing] = await db
    .select()
    .from(tourbitDirectoryTable)
    .where(eq(tourbitDirectoryTable.key, key))
    .limit(1);

  if (!existing) {
    throw new Error("Record not found");
  }

  // 构建更新字段
  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (title !== undefined) {
    if (!title) throw new Error("title cannot be empty");
    updateData.title = title;
  }
  if (parentKey !== undefined) {
    updateData.parentKey = parentKey;
  }
  if (type !== undefined) {
    if (!["folder", "tourbit"].includes(type)) {
      throw new Error("type must be 'folder' or 'tourbit'");
    }
    updateData.type = type;
  }

  const [updated] = await db
    .update(tourbitDirectoryTable)
    .set(updateData)
    .where(eq(tourbitDirectoryTable.key, key))
    .returning();

  return updated;
});
