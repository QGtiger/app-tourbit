import {
  pgSchema,
  integer,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

// 使用应用名称作为schema前缀
const appSchema = pgSchema("app-tourbit");

/**
 * Workflow 目录树表
 * 用于存储 tourbit 的目录结构，支持多级嵌套
 * type: 'folder' - 文件夹，'tourbit' - Tourbit文件（可通过 key 路由跳转）
 */
export const tourbitDirectoryTable = appSchema.table("tourbit_directory", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(), // 用户ID，用于隔离不同用户的目录
  title: varchar({ length: 255 }).notNull(),
  key: varchar({ length: 255 }).notNull().unique(),
  parentKey: varchar({ length: 255 }), // 父节点 key，null 表示根节点
  type: varchar({ length: 20 }).notNull().default("folder"), // 'folder' | 'tourbit'
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

/**
 * Tourbit 业务数据表
 * 存储 tourbit 的状态和 schemaJSON，与目录树表通过 key 1:1 关联
 */
export const tourbitTable = appSchema.table("tourbit", {
  key: varchar({ length: 255 }).primaryKey(),
  userId: integer().notNull(),
  status: varchar({ length: 20 }).notNull().default("draft"), // 'draft' | 'published'
  schemaJSON: text().notNull().default("{}"),
});
