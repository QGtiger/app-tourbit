import type { ContextWithDb } from "@lightfish/server";
import { ServerError } from "@lightfish/server/shared";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

type CommonParams = {
  userId: number;
  db: NodePgDatabase;
};

type HandlerWithCommonParams = (
  params: CommonParams,
  c: ContextWithDb
) => Promise<Record<string, any>>;

/**
 * 高阶函数：自动从请求头提取公共参数并注入到 handler
 * 后续扩展公共参数只需在此处添加提取逻辑即可
 *
 * @example
 * export default withCommonParams(async ({ userId }, c) => {
 *   // 直接使用 userId
 * });
 */
export function withCommonParams(handler: HandlerWithCommonParams) {
  return async (c: ContextWithDb) => {
    const userIdHeader = c.req.header("X-User-Id");

    const db = c.get("db");

    if (!db) {
      throw new ServerError("Database not configured", 500);
    }

    if (!userIdHeader) {
      throw new ServerError("Missing X-User-Id header", 401);
    }

    const userId = Number(userIdHeader);

    if (Number.isNaN(userId)) {
      throw new ServerError("Invalid X-User-Id header", 401);
    }

    return handler({ userId, db }, c);
  };
}
