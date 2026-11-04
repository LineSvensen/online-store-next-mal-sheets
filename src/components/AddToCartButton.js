"use client";

import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useProductStatusStore } from "@/store/productStatusStore";

export default function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const status = useProductStatusStore(
    (state) => state.statuses[product.id]?.status,
  );

  const setStatuses = useProductStatusStore((state) => state.setStatuses);

  const markUnknown = useProductStatusStore((state) => state.markUnknown);

  const [isChecking, setIsChecking] = useState(true);
  const [message, setMessage] = useState("");

  const checkAvailability = useCallback(
    async (signal) => {
      const response = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          items: [{ id: product.id }],
        }),
        signal,
      });

      if (!response.ok) {
        throw new Error("Could not check availability");
      }

      const data = await response.json();
      const current = data.items?.find((item) => item.id === product.id);

      if (!current) {
        throw new Error("Missing product status");
      }

      return current;
    },
    [product.id],
  );

  useEffect(() => {
    let active = true;
    let controller;

    async function refresh() {
      controller?.abort();
      controller = new AbortController();

      setIsChecking(true);

      try {
        const current = await checkAvailability(controller.signal);

        if (!active) return;

        setStatuses([current]);
      } catch (error) {
        if (!active || error.name === "AbortError") return;

        markUnknown([product.id]);
      } finally {
        if (active) setIsChecking(false);
      }
    }

    refresh();
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener("focus", refresh);
    };
  }, [product.id, checkAvailability, setStatuses, markUnknown]);

  const isAvailable = status === "available";
  const canAdd = isAvailable && !isChecking;

  async function handleAddToCart() {
    if (!canAdd) return;

    setIsChecking(true);
    setMessage("");

    try {
      // Always validate again before adding.
      const current = await checkAvailability();

      setStatuses([current]);

      if (!current.available) {
        setMessage("This product is no longer available.");
        return;
      }

      addItem({
        ...product,
        name: current.name,
        price: current.price,
        tilgjengelig: true,
      });

      setMessage("Added to cart.");
    } catch {
      markUnknown([product.id]);
      setMessage("Could not check availability. Try again.");
    } finally {
      setIsChecking(false);
    }
  }

  async function handleRetry() {
    setIsChecking(true);
    setMessage("");

    try {
      const current = await checkAvailability();
      setStatuses([current]);
    } catch {
      markUnknown([product.id]);
      setMessage("Could not check availability. Try again.");
    } finally {
      setIsChecking(false);
    }
  }

  const label = isChecking
    ? "Checking..."
    : status === "available"
      ? "Add to cart"
      : status === "unavailable"
        ? "Out of stock"
        : "Availability unknown";

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canAdd}
        className={`px-6 py-3 transition-colors ${
          canAdd
            ? "cursor-pointer bg-black text-white hover:bg-gray-800"
            : "cursor-not-allowed bg-gray-300 text-gray-500"
        }`}
      >
        {label}
      </button>

      {!isChecking && !isAvailable && (
        <button
          type="button"
          onClick={handleRetry}
          className="cursor-pointer text-sm underline"
        >
          Check availability
        </button>
      )}

      {message && (
        <p role="status" className="text-sm text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}

// "use client";

// import { useCartStore } from "@/store/cartStore";

// export default function AddToCartButton({ product }) {
//   const addItem = useCartStore((state) => state.addItem);

//   // Only the boolean true means available
//   const isAvailable = product.tilgjengelig === true;

//   function handleAddToCart() {
//     if (!isAvailable) return;

//     addItem(product);
//   }

//   return (
//     <button
//       type="button"
//       onClick={handleAddToCart}
//       disabled={!isAvailable}
//       className={`
//         mt-8 px-6 py-3 transition-colors
//         ${
//           isAvailable
//             ? "bg-black text-white cursor-pointer hover:bg-gray-800"
//             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//         }
//       `}
//     >
//       {isAvailable ? "Add to cart" : "Out of stock"}
//     </button>
//   );
// }
