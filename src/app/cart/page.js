"use client";

import { useEffect, useState } from "react";

import CartItem from "@/components/CartItem";
import Loader from "@/components/Loader";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function handlePageShow() {
      setIsLoading(false);
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  async function handleCheckout() {
    setIsLoading(true);
    setError("");

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL received");
    } catch (error) {
      clearTimeout(timeout);

      console.error("Checkout failed:", error);

      if (error.name === "AbortError") {
        setError("Checkout took too long. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }

      setIsLoading(false);
    }
  }

  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Cart</h1>

        {items.length === 0 ? (
          <p className="mt-4 text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="mt-8 space-y-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="mt-8 flex justify-between border-t border-gray-300 pt-4">
              <p className="text-lg font-semibold">Total</p>

              <p className="text-lg font-semibold">{total} kr</p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-6 flex min-h-[48px] w-full cursor-pointer items-center justify-center bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? <Loader /> : "Go to checkout"}
            </button>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </main>
  );
}
