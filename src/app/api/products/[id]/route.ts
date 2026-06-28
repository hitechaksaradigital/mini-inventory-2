import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productId = parseInt(id);

    const [updated] = await db
      .update(products)
      .set({
        name: body.name,
        sku: body.sku,
        category: body.category,
        stockLevel: body.stockLevel,
        maxStock: body.maxStock,
        buyPrice: body.buyPrice,
        sellPrice: body.sellPrice,
        icon: body.icon || "inventory_2",
        description: body.description || null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "A product with this SKU already exists"
        : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
