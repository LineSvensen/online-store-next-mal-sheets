// hva vi gjør med data/logic

import "server-only";
import { getSheetData } from "@/lib/google-sheets";

export async function getProducts() {
  const rows = await getSheetData("Produkter");

  return rows.map((product) => ({
    ...product,
    id: Number(product.id),
    price: Number(product.price),
    tilgjengelig:
      product.tilgjengelig === undefined
        ? true
        : String(product.tilgjengelig).toUpperCase() === "TRUE",
  }));
}

export async function getProductBySlug(slug) {
  const products = await getProducts();

  return products.find((product) => product.slug === slug);
}
