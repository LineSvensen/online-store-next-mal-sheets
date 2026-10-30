"use client";

// forteller hvilken action som skal kjøres

import { useCartStore } from "@/store/cartStore";

export default function CartItem({ item }) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <div>
        <h2 className="font-semibold">{item.name}</h2>
        <p className="text-gray-600">{item.price} kr</p>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => decreaseQuantity(item.id)}
            className="border px-3 py-1 cursor-pointer"
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => increaseQuantity(item.id)}
            className="border px-3 py-1 cursor-pointer"
          >
            +
          </button>

          <button
            onClick={() => removeItem(item.id)}
            className="ml-3 text-sm underline cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>

      <p className="font-semibold">{item.price * item.quantity} kr</p>
    </div>
  );
}
