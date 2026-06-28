import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  stockLevel: integer("stock_level").notNull().default(0),
  maxStock: integer("max_stock").notNull().default(100),
  buyPrice: numeric("buy_price", { precision: 12, scale: 2 }).notNull(),
  sellPrice: numeric("sell_price", { precision: 12, scale: 2 }).notNull(),
  icon: varchar("icon", { length: 100 }).notNull().default("inventory_2"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
