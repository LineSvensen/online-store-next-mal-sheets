import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export default async function ProductGrid() {
  let products = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Could not load products:", error);

    return (
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="text-xl font-semibold">
          Products are temporarily unavailable
        </h2>

        <p className="mt-3 text-gray-600">Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16">
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// import ProductCard from "@/components/ProductCard";
// import { getProducts } from "@/lib/products";

// export default async function ProductGrid() {
//   const products = await getProducts();

//   return (
//     <section className="flex justify-center items-center mx-auto max-w-7xl px-6 py-16">
//       <div className="grid gap-6 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </section>
//   );
// }
