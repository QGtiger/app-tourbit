import { tourbitTable } from "../../../schema/index.js";
import { withCommonParams } from "../../../utils/withCommonParams.js";
import { eq } from "drizzle-orm";

/**
 * GET /tourbit/:key
 * 根据 key 查询单个 tourbit 详情（含 schemaJSON）
 */
export const method = "GET";

export default withCommonParams(async ({ userId, db }, c) => {
  const { key } = c.get("params");

  const [record] = await db
    .select()
    .from(tourbitTable)
    .where(eq(tourbitTable.key, key))
    .limit(1);

  if (!record) {
    throw new Error("Tourbit not found");
  }

  return record;
});
