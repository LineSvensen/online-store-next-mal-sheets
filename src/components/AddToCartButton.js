"use client";

//add to cart button , frontend snakker med backend

import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart() {
    addItem(product);

    console.log("Cart now:", useCartStore.getState().items);
  }

  return (
    <button
      onClick={handleAddToCart}
      className="mt-8 bg-black px-6 py-3 text-white cursor-pointer"
    >
      Add to cart
    </button>
  );
}
