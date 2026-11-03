"use client";

import { useCartStore } from "@/store/cartStore";

export default function CartItem({ item }) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  // Tilgjengelighet kontrollert mot Google Sheets
  const isAvailable = item.current?.available === true;

  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <div>
        <h2 className="font-semibold">{item.name}</h2>

        <p className="text-gray-600">{item.price} kr</p>

        <div className="mt-3 flex items-center gap-3">
          {/* Reduser antall */}
          <button
            type="button"
            onClick={() => decreaseQuantity(item.id)}
            className="cursor-pointer border px-3 py-1"
            aria-label={`Reduce quantity of ${item.name}`}
          >
            -
          </button>

          <span>{item.quantity}</span>

          {/* Øk antall – kun hvis tilgjengelig */}
          <button
            type="button"
            onClick={() => increaseQuantity(item.id)}
            disabled={!isAvailable || item.quantity >= 99}
            className="
              border px-3 py-1
              enabled:cursor-pointer
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>

          {/* Fjern produktet */}
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="ml-3 cursor-pointer text-sm underline"
          >
            Remove
          </button>
        </div>
      </div>

      <p className="font-semibold">{item.price * item.quantity} kr</p>
    </div>
  );
}
