import { tourbitDirectoryTable } from "../../../schema/index.js";
import { withCommonParams } from "../../../utils/withCommonParams.js";
import { eq } from "drizzle-orm";

/**
 * GET /tourbit-directory/:key
 * 根据 key 查询单条目录项
 */
export const method = "GET";

export default withCommonParams(async ({ userId, db }, c) => {
  const { key } = c.get("params");

  const [record] = await db
    .select()
    .from(tourbitDirectoryTable)
    .where(eq(tourbitDirectoryTable.key, key))
    .limit(1);

  if (!record) {
    throw new Error("Record not found");
  }

  return record;
});
