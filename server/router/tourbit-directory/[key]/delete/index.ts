import { tourbitDirectoryTable } from "../../../../schema/index.js";
import { withCommonParams } from "../../../../utils/withCommonParams.js";
import { eq, inArray } from "drizzle-orm";

export const method = "POST";

export default withCommonParams(async ({ userId, db }, c) => {
  const { key } = c.get("params");

  // 查询要删除的记录
  const [record] = await db
    .select()
    .from(tourbitDirectoryTable)
    .where(eq(tourbitDirectoryTable.key, key))
    .limit(1);

  if (!record) {
    throw new Error("Record not found");
  }

  // 递归收集所有子节点的 key
  const keysToDelete = await collectChildKeys(db, key);

  // 批量删除
  await db
    .delete(tourbitDirectoryTable)
    .where(inArray(tourbitDirectoryTable.key, keysToDelete));

  return {
    deleted: keysToDelete.length,
    keys: keysToDelete,
  };
});

/**
 * 递归收集所有子节点的 key（包含自身）
 */
async function collectChildKeys(db: any, parentKey: string): Promise<string[]> {
  const keys: string[] = [parentKey];

  const children = await db
    .select({ key: tourbitDirectoryTable.key })
    .from(tourbitDirectoryTable)
    .where(eq(tourbitDirectoryTable.parentKey, parentKey));

  for (const child of children) {
    const childKeys = await collectChildKeys(db, child.key);
    keys.push(...childKeys);
  }

  return keys;
}
