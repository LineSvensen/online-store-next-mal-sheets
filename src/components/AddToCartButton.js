"use client";

import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const isAvailable = product.tilgjengelig !== false;

  function handleAddToCart() {
    if (!isAvailable) return;

    addItem(product);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!isAvailable}
      className={`
        mt-8 px-6 py-3 transition-colors
        ${
          isAvailable
            ? "bg-black text-white cursor-pointer hover:bg-gray-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
    >
      {isAvailable ? "Add to cart" : "Out of stock"}
    </button>
  );
}
