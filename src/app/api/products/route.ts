import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ilike, and, sql, lte, gt, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const stockStatus = searchParams.get("stockStatus") || "";

    const conditions = [];

    if (search) {
      conditions.push(
        sql`(${ilike(products.name, `%${search}%`)} OR ${ilike(products.sku, `%${search}%`)})`
      );
    }

    if (category) {
      conditions.push(eq(products.category, category));
    }

    if (stockStatus === "out_of_stock") {
      conditions.push(eq(products.stockLevel, 0));
    } else if (stockStatus === "low_stock") {
      conditions.push(
        and(
          gt(products.stockLevel, 0),
          lte(products.stockLevel, sql`${products.maxStock} * 0.2`)
        )!
      );
    } else if (stockStatus === "in_stock") {
      conditions.push(gt(products.stockLevel, sql`${products.maxStock} * 0.2`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereClause);

    const totalCount = countResult?.count ?? 0;

    const items = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    // Also get stats
    const [statsResult] = await db
      .select({
        total: sql<number>`count(*)::int`,
        lowStock: sql<number>`count(*) filter (where ${products.stockLevel} > 0 and ${products.stockLevel} <= ${products.maxStock} * 0.2)::int`,
      })
      .from(products);

    // Get unique categories
    const categoriesResult = await db
      .selectDistinct({ category: products.category })
      .from(products);

    return NextResponse.json({
      products: items,
      totalCount,
      stats: {
        total: statsResult?.total ?? 0,
        lowStock: statsResult?.lowStock ?? 0,
      },
      categories: categoriesResult.map((c) => c.category),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const [newProduct] = await db
      .insert(products)
      .values({
        name: body.name,
        sku: body.sku,
        category: body.category,
        stockLevel: body.stockLevel || 0,
        maxStock: body.maxStock || 100,
        buyPrice: body.buyPrice,
        sellPrice: body.sellPrice,
        icon: body.icon || "inventory_2",
        description: body.description || null,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "A product with this SKU already exists"
        : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
