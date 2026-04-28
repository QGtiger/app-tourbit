import { tourbitTable } from "../../../../schema/index.js";
import { withCommonParams } from "../../../../utils/withCommonParams.js";
import { eq } from "drizzle-orm";

/**
 * POST /tourbit/:key/update
 * 更新 tourbit 的 status 和/或 schemaJSON
 */
export const method = "POST";

export default withCommonParams(async ({ userId, db }, c) => {
  const { key } = c.get("params");
  const body = await c.req.json();
  const { status, schemaJSON } = body;

  // 查询原记录，校验存在性
  const [existing] = await db
    .select()
    .from(tourbitTable)
    .where(eq(tourbitTable.key, key))
    .limit(1);

  if (!existing) {
    throw new Error("Tourbit not found");
  }

  // 构建更新字段
  const updateData: Record<string, any> = {};

  if (status !== undefined) {
    if (!["draft", "published"].includes(status)) {
      throw new Error("status must be 'draft' or 'published'");
    }
    updateData.status = status;
  }
  if (schemaJSON !== undefined) {
    updateData.schemaJSON = schemaJSON;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  const [updated] = await db
    .update(tourbitTable)
    .set(updateData)
    .where(eq(tourbitTable.key, key))
    .returning();

  return updated;
});
