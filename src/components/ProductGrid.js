// components/ProductGrid.js

import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default function ProductGrid() {
  const products = getProducts();

  return (
    <section className="flex justify-center items-center mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-6 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
