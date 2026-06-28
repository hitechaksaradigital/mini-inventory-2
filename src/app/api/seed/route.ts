import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";

const SEED_DATA = [
  { name: 'MacBook Pro M2 - 14"', sku: "ELC-MBP-14-M2", category: "Electronics", stockLevel: 42, maxStock: 50, buyPrice: "1850.00", sellPrice: "2299.00", icon: "devices" },
  { name: "Premium Cotton T-Shirt (L)", sku: "CLO-TSH-COT-L", category: "Clothing", stockLevel: 8, maxStock: 50, buyPrice: "12.50", sellPrice: "34.99", icon: "checkroom" },
  { name: "Organic Coffee Beans (1kg)", sku: "FOD-COF-ORG-1K", category: "Food", stockLevel: 124, maxStock: 130, buyPrice: "18.20", sellPrice: "42.00", icon: "restaurant" },
  { name: "Wireless Noise Cancelling Headphones", sku: "ELC-WNC-HDP-BK", category: "Electronics", stockLevel: 15, maxStock: 50, buyPrice: "120.00", sellPrice: "249.99", icon: "headphones" },
  { name: "Ergonomic Office Chair", sku: "FUR-ERG-CHR-01", category: "Furniture", stockLevel: 33, maxStock: 40, buyPrice: "280.00", sellPrice: "549.00", icon: "chair" },
  { name: "Smart Watch Pro Series", sku: "ELC-SWP-GLD-42", category: "Electronics", stockLevel: 5, maxStock: 30, buyPrice: "180.00", sellPrice: "399.99", icon: "watch" },
  { name: "Italian Leather Belt (M)", sku: "CLO-BLT-LTH-M", category: "Clothing", stockLevel: 67, maxStock: 80, buyPrice: "22.00", sellPrice: "64.99", icon: "checkroom" },
  { name: "Extra Virgin Olive Oil (500ml)", sku: "FOD-OIL-EVO-5H", category: "Food", stockLevel: 200, maxStock: 250, buyPrice: "8.50", sellPrice: "19.99", icon: "restaurant" },
  { name: "4K Ultra HD Monitor - 27\"", sku: "ELC-MON-4K-27", category: "Electronics", stockLevel: 0, maxStock: 25, buyPrice: "350.00", sellPrice: "599.99", icon: "monitor" },
  { name: "Running Shoes Pro (Size 10)", sku: "CLO-SHO-RUN-10", category: "Clothing", stockLevel: 45, maxStock: 60, buyPrice: "65.00", sellPrice: "139.99", icon: "checkroom" },
  { name: "Standing Desk Converter", sku: "FUR-DSK-STD-01", category: "Furniture", stockLevel: 12, maxStock: 20, buyPrice: "150.00", sellPrice: "299.00", icon: "desk" },
  { name: "Bluetooth Speaker Portable", sku: "ELC-SPK-BT-RD", category: "Electronics", stockLevel: 78, maxStock: 100, buyPrice: "25.00", sellPrice: "59.99", icon: "speaker" },
  { name: "Organic Green Tea (100 bags)", sku: "FOD-TEA-GRN-1H", category: "Food", stockLevel: 3, maxStock: 50, buyPrice: "6.00", sellPrice: "14.99", icon: "restaurant" },
  { name: "Winter Parka Jacket (XL)", sku: "CLO-JKT-PRK-XL", category: "Clothing", stockLevel: 18, maxStock: 30, buyPrice: "85.00", sellPrice: "199.99", icon: "checkroom" },
  { name: "USB-C Docking Station", sku: "ELC-DCK-USC-01", category: "Electronics", stockLevel: 55, maxStock: 70, buyPrice: "45.00", sellPrice: "89.99", icon: "dock" },
  { name: "Bamboo Cutting Board Set", sku: "FUR-KIT-BCB-ST", category: "Furniture", stockLevel: 90, maxStock: 100, buyPrice: "12.00", sellPrice: "29.99", icon: "kitchen" },
  { name: "Wireless Gaming Mouse", sku: "ELC-MOU-WGM-BK", category: "Electronics", stockLevel: 2, maxStock: 40, buyPrice: "35.00", sellPrice: "79.99", icon: "mouse" },
  { name: "Dark Chocolate Bar (200g)", sku: "FOD-CHO-DRK-2H", category: "Food", stockLevel: 150, maxStock: 200, buyPrice: "3.50", sellPrice: "8.99", icon: "restaurant" },
  { name: "Cashmere Scarf (Unisex)", sku: "CLO-SCR-CSH-UN", category: "Clothing", stockLevel: 22, maxStock: 35, buyPrice: "40.00", sellPrice: "99.99", icon: "checkroom" },
  { name: "Mechanical Keyboard RGB", sku: "ELC-KBD-MEC-RG", category: "Electronics", stockLevel: 31, maxStock: 50, buyPrice: "55.00", sellPrice: "129.99", icon: "keyboard" },
  { name: "Protein Powder Vanilla (2kg)", sku: "FOD-PRO-VAN-2K", category: "Food", stockLevel: 7, maxStock: 40, buyPrice: "25.00", sellPrice: "54.99", icon: "restaurant" },
  { name: "Bookshelf 5-Tier Walnut", sku: "FUR-BSH-WLN-05", category: "Furniture", stockLevel: 9, maxStock: 15, buyPrice: "120.00", sellPrice: "249.00", icon: "shelves" },
  { name: "Webcam 1080p HD", sku: "ELC-WEB-1080-HD", category: "Electronics", stockLevel: 40, maxStock: 60, buyPrice: "30.00", sellPrice: "69.99", icon: "videocam" },
  { name: "Denim Jeans Slim Fit (32)", sku: "CLO-JNS-SLM-32", category: "Clothing", stockLevel: 56, maxStock: 80, buyPrice: "28.00", sellPrice: "69.99", icon: "checkroom" },
  { name: "Almond Butter Organic (500g)", sku: "FOD-BUT-ALM-5H", category: "Food", stockLevel: 0, maxStock: 60, buyPrice: "7.00", sellPrice: "16.99", icon: "restaurant" },
];

export async function POST() {
  try {
    // Check if products exist already
    const [existing] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);

    if (existing && existing.count > 0) {
      return NextResponse.json({
        message: `Database already has ${existing.count} products. Skipped seeding.`,
        seeded: false,
      });
    }

    await db.insert(products).values(SEED_DATA);

    return NextResponse.json({
      message: `Seeded ${SEED_DATA.length} products successfully.`,
      seeded: true,
    });
  } catch (error) {
    console.error("Error seeding:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
