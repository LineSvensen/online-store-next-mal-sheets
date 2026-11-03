"use client";

import { useCallback, useEffect, useState } from "react";

import CartItem from "@/components/CartItem";
import Loader from "@/components/Loader";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  const [validated, setValidated] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Endres når produkter legges til eller fjernes
  const cartIds = items.map((item) => item.id).join(",");

  const validateCart = useCallback(async (cartItems) => {
    const response = await fetch("/api/cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        items: cartItems.map((item) => ({ id: item.id })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not validate cart");
    }

    return data.items;
  }, []);

  // Sjekk handlekurven ved åpning og når produkter endres
  useEffect(() => {
    if (!hasHydrated) return;

    let active = true;

    async function check() {
      if (items.length === 0) {
        setValidated([]);
        return;
      }

      setIsChecking(true);
      setValidated(null);
      setError("");

      try {
        const result = await validateCart(items);
        if (active) setValidated(result);
      } catch {
        if (active) {
          setError("Could not check product availability.");
        }
      } finally {
        if (active) setIsChecking(false);
      }
    }

    check();

    function handleFocus() {
      check();
    }

    function handlePageShow() {
      setIsLoading(false);
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [hasHydrated, cartIds, validateCart]);

  const checkedItems = items.map((item) => {
    const current = validated?.find(
      (product) => Number(product.id) === Number(item.id),
    );

    return {
      ...item,
      current,
      unavailable: !current?.available,
      priceChanged: current?.available && Number(item.price) !== current.price,
    };
  });

  const hasUnavailable = checkedItems.some((item) => item.unavailable);

  const total = checkedItems.reduce((sum, item) => {
    if (!item.current?.available) return sum;

    return sum + item.current.price * item.quantity;
  }, 0);

  async function handleCheckout() {
    if (isLoading || isChecking || !validated || hasUnavailable) {
      return;
    }

    setIsLoading(true);
    setError("");

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      // Kontroller én gang til rett før betaling
      const latest = await validateCart(items);
      setValidated(latest);

      if (latest.some((product) => !product.available)) {
        setError(
          "Some products are no longer available. Please update your cart.",
        );
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("Checkout is not configured yet.");
        }

        throw new Error(data.error || "Checkout failed");
      }

      if (!data.url) {
        throw new Error("No checkout URL received");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed:", err);

      setError(
        err.name === "AbortError"
          ? "Checkout took too long. Please try again."
          : err.message,
      );
    } finally {
      clearTimeout(timeout);
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
            {checkedItems.map((item) => (
              <div key={item.id}>
                <CartItem
                  item={{
                    ...item,
                    price: item.current?.available
                      ? item.current.price
                      : item.price,
                  }}
                />

                {validated && item.unavailable && (
                  <div className="mt-2 rounded bg-red-50 p-3">
                    <p className="text-sm text-red-700">
                      This product is no longer available.
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-2 cursor-pointer text-sm font-medium text-red-700 underline"
                    >
                      Remove unavailable product
                    </button>
                  </div>
                )}

                {item.priceChanged && (
                  <p className="mt-2 text-sm text-amber-700">
                    Price updated: {item.price} kr → {item.current.price} kr
                  </p>
                )}
              </div>
            ))}

            {isChecking && (
              <p className="text-sm text-gray-500">
                Checking product availability...
              </p>
            )}

            <div className="mt-8 flex justify-between border-t border-gray-300 pt-4">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-lg font-semibold">
                {validated ? `${total} kr` : "Checking..."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isLoading || isChecking || !validated || hasUnavailable}
              className="mt-6 flex min-h-[48px] w-full cursor-pointer items-center justify-center bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader />
              ) : hasUnavailable && validated ? (
                "Remove unavailable products"
              ) : (
                "Go to checkout"
              )}
            </button>

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
