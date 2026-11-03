import "server-only";

export function validateProducts(rows) {
  const products = [];
  const usedIds = new Set();
  const usedSlugs = new Set();

  rows.forEach((row, index) => {
    // Rad 1 i regnearket inneholder kolonneoverskriftene
    const rowNumber = index + 2;

    const id = Number(row.id);
    const name = String(row.name ?? "").trim();
    const slug = String(row.slug ?? "").trim();
    const description = String(row.description ?? "").trim();
    const image = String(row.image ?? "").trim();

    // Støtt både 299.50 og 299,50
    const priceText = String(row.price ?? "")
      .trim()
      .replace(",", ".");

    const price = Number(priceText);
    const amountInOre = Math.round(price * 100);

    const availability = String(row.tilgjengelig ?? "")
      .trim()
      .toUpperCase();

    const errors = [];

    if (!Number.isSafeInteger(id) || id <= 0) {
      errors.push("Invalid ID");
    }

    if (!name) {
      errors.push("Missing product name");
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.push("Invalid or missing slug");
    }

    if (
      !priceText ||
      !/^\d+(?:\.\d{1,2})?$/.test(priceText) ||
      !Number.isSafeInteger(amountInOre) ||
      amountInOre <= 0
    ) {
      errors.push("Invalid price");
    }

    if (usedIds.has(id)) {
      errors.push("Duplicate product ID");
    }

    if (usedSlugs.has(slug)) {
      errors.push("Duplicate slug");
    }

    // I denne templaten bruker vi lokale bildestier
    if (
      image &&
      !/^\/images\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|svg)$/i.test(image)
    ) {
      errors.push("Invalid image path");
    }

    if (!["TRUE", "FALSE"].includes(availability)) {
      console.warn(
        `Google Sheets row ${rowNumber}: Invalid availability value. Product will be unavailable.`,
      );
    }

    if (errors.length > 0) {
      console.warn(`Google Sheets row ${rowNumber}: ${errors.join(", ")}`);

      // Ikke send ugyldige produkter videre
      return;
    }

    usedIds.add(id);
    usedSlugs.add(slug);

    products.push({
      id,
      name,
      slug,
      description,
      price: amountInOre / 100,
      image,
      tilgjengelig: availability === "TRUE",
      kategori: String(row.kategori ?? "").trim(),
    });
  });

  return products;
}
