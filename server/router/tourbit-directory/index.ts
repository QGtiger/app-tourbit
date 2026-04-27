import { tourbitDirectoryTable } from "../../schema/index.js";
import { withCommonParams } from "../../utils/withCommonParams.js";
import { asc, eq } from "drizzle-orm";

/**
 * GET /tourbit-directory
 * 查询当前用户的所有目录项，按创建时间升序排列
 */
export const method = "GET";

export default withCommonParams(async ({ userId, db }) => {
  const list = await db
    .select()
    .from(tourbitDirectoryTable)
    .where(eq(tourbitDirectoryTable.userId, userId))
    .orderBy(asc(tourbitDirectoryTable.createdAt));

  return { list };
});
