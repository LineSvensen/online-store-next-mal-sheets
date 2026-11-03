import "server-only";

import { unstable_cache } from "next/cache";
import { getSheetData } from "@/lib/google-sheets";
import { validateProducts } from "@/lib/validate-products";

// Cachede produkter for nettsiden
const getCachedProducts = unstable_cache(
  async () => {
    const rows = await getSheetData("Produkter");
    return validateProducts(rows);
  },
  ["kodera-sheets-products", process.env.GOOGLE_SHEET_ID ?? ""],
  {
    revalidate: 60,
    tags: ["products"],
  },
);

export async function getProducts() {
  return getCachedProducts();
}

export async function getProductBySlug(slug) {
  const products = await getProducts();

  return products.find((product) => product.slug === slug);
}

// Ferske data for betaling – uten 60-sekunderscache
export async function getFreshProducts() {
  const rows = await getSheetData("Produkter");

  return validateProducts(rows);
}
