import Image from "next/image";
import Link from "next/link";

import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }) {
  return (
    <article className="min-w-[200px] md:min-w-[300px] max-w-[330px] border border-gray-200 p-4 ">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 330px"
          />
        </div>
      </Link>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">{product.name}</h2>

        <p className="mt-2 text-gray-600">{product.description}</p>

        <p className="mt-3 font-medium">{product.price} kr</p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <Link href={`/products/${product.slug}`} className="underline">
            View product
          </Link>

          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
