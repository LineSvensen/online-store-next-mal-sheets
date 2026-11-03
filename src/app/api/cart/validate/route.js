import { getSheetData } from "@/lib/google-sheets";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { items } = await request.json();

    if (
      !Array.isArray(items) ||
      items.length > 100 ||
      items.some((item) => !Number.isSafeInteger(Number(item?.id)))
    ) {
      return Response.json({ error: "Invalid cart" }, { status: 400 });
    }

    // Direkte fra Google Sheets, uten produktcachen
    const rows = await getSheetData("Produkter");

    const products = rows.map((product) => ({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      available: String(product.tilgjengelig).toUpperCase() === "TRUE",
    }));

    const validatedItems = items.map((item) => {
      const product = products.find(
        (product) => product.id === Number(item.id),
      );

      if (!product) {
        return {
          id: item.id,
          available: false,
          reason: "Product no longer exists",
        };
      }

      const validPrice = Number.isFinite(product.price) && product.price > 0;

      return {
        ...product,
        available: product.available && validPrice,
      };
    });

    return Response.json(
      { items: validatedItems },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Cart validation failed:", error);

    return Response.json({ error: "Could not validate cart" }, { status: 500 });
  }
}
