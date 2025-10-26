import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scanHistory = pgTable("scan_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barcode: text("barcode").notNull(),
  productName: text("product_name").notNull(),
  brand: text("brand"),
  imageUrl: text("image_url"),
  calories: real("calories"),
  scannedAt: timestamp("scanned_at").notNull().defaultNow(),
});

export const insertScanHistorySchema = createInsertSchema(scanHistory).omit({
  id: true,
  scannedAt: true,
});

export type InsertScanHistory = z.infer<typeof insertScanHistorySchema>;
export type ScanHistory = typeof scanHistory.$inferSelect;

export interface ProductNutrients {
  energy_100g?: number;
  fat_100g?: number;
  saturated_fat_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  proteins_100g?: number;
  fiber_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
}

export interface Product {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  categories?: string;
  nutriments?: ProductNutrients;
  serving_size?: string;
  quantity?: string;
}

export interface OpenFoodFactsResponse {
  status: number;
  product?: Product;
  status_verbose?: string;
}
