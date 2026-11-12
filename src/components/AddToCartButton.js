"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useProductStatusStore } from "@/store/productStatusStore";

export default function AddToCartButton({ product }) {
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  const quantityInCart = useCartStore(
    (state) =>
      state.items.find((item) => item.id === product.id)?.quantity ?? 0,
  );

  const addItem = useCartStore((state) => state.addItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const status = useProductStatusStore(
    (state) => state.statuses[product.id]?.status,
  );

  const setStatuses = useProductStatusStore((state) => state.setStatuses);

  const markUnknown = useProductStatusStore((state) => state.markUnknown);

  const [isChecking, setIsChecking] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [stock, setStock] = useState(null);

  const addingRef = useRef(false);

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

        if (!active || controller.signal.aborted) return;

        setStatuses([current]);
        setStock(current.lager ?? null);
      } catch (error) {
        if (!active || error.name === "AbortError") return;

        markUnknown([product.id]);
        setStock(null);
      } finally {
        if (active && !controller.signal.aborted) {
          setIsChecking(false);
        }
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

  // Lagergrense fra Google Sheets, maks 99.
  const maxQuantity = Number.isSafeInteger(stock) ? Math.min(stock, 99) : 99;

  const stockLimitReached = quantityInCart >= maxQuantity;

  const canIncrease =
    hasHydrated &&
    isAvailable &&
    !isChecking &&
    !isUpdating &&
    !stockLimitReached;

  const canDecrease = hasHydrated && isAvailable && quantityInCart > 0;

  async function handleIncrease() {
    if (!canIncrease || addingRef.current) return;

    addingRef.current = true;
    setIsUpdating(true);
    setMessage("");

    try {
      // Kontroller ferske lagerdata før hver økning.
      const current = await checkAvailability();

      setStatuses([current]);
      setStock(current.lager ?? null);

      if (!current.available) {
        setMessage("This product is no longer available.");
        return;
      }

      const cart = useCartStore.getState();

      if (!cart._hasHydrated) {
        setMessage("Cart is still loading. Please try again.");
        return;
      }

      const latestMax = Number.isSafeInteger(current.lager)
        ? Math.min(current.lager, 99)
        : 99;

      const existingQuantity =
        cart.items.find((item) => item.id === product.id)?.quantity ?? 0;

      if (existingQuantity >= latestMax) {
        setMessage("Maximum available quantity reached.");
        return;
      }

      if (existingQuantity === 0) {
        // Første produkt legges i handlekurven.
        addItem(
          {
            ...product,
            name: current.name,
            price: current.price,
            tilgjengelig: true,
          },
          latestMax,
          1,
        );
      } else {
        // Produktet finnes allerede: øk med 1.
        increaseQuantity(product.id, latestMax);
      }
    } catch {
      markUnknown([product.id]);
      setStock(null);
      setMessage("Could not check availability. Try again.");
    } finally {
      addingRef.current = false;
      setIsUpdating(false);
    }
  }

  function handleDecrease() {
    if (!canDecrease) return;

    if (quantityInCart === 1) {
      removeItem(product.id);
    } else {
      decreaseQuantity(product.id);
    }

    setMessage("");
  }

  async function handleRetry() {
    setIsChecking(true);
    setMessage("");

    try {
      const current = await checkAvailability();

      setStatuses([current]);
      setStock(current.lager ?? null);
    } catch {
      markUnknown([product.id]);
      setStock(null);
      setMessage("Could not check availability. Try again.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {isChecking ? (
        <p className="text-sm text-gray-500">Checking availability...</p>
      ) : !isAvailable ? (
        <>
          <p className="text-sm font-medium text-gray-600">
            {status === "unavailable" ? "Out of stock" : "Availability unknown"}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="cursor-pointer text-sm underline"
          >
            Check availability
          </button>
        </>
      ) : (
        <>
          {/* Antallsvelger: viser faktisk antall i cart */}
          <div className="flex items-center  border border-gray-300">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={!canDecrease}
              className="
                px-3 py-3
                enabled:cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span className="min-w-8 text-center" aria-live="polite">
              {quantityInCart}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={!canIncrease}
              className="
                px-3 py-3
                enabled:cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* {stock !== null && (
            <p className="text-sm text-gray-600">{stock} in stock</p>
          )} */}

          {hasHydrated && stockLimitReached && (
            <p className="text-[10px] text-gray-400 ">Max quantity reached</p>
          )}

          {isUpdating && (
            <p className="text-sm text-gray-500">Updating cart...</p>
          )}
        </>
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

// import { useCallback, useEffect, useRef, useState } from "react";
// import { useCartStore } from "@/store/cartStore";
// import { useProductStatusStore } from "@/store/productStatusStore";

// export default function AddToCartButton({ product }) {
//   const addItem = useCartStore((state) => state.addItem);
//   const hasHydrated = useCartStore((state) => state._hasHydrated);

//   const quantityInCart = useCartStore(
//     (state) =>
//       state.items.find((item) => item.id === product.id)?.quantity ?? 0,
//   );

//   const status = useProductStatusStore(
//     (state) => state.statuses[product.id]?.status,
//   );

//   const setStatuses = useProductStatusStore((state) => state.setStatuses);

//   const markUnknown = useProductStatusStore((state) => state.markUnknown);

//   const [isChecking, setIsChecking] = useState(true);
//   const [message, setMessage] = useState("");
//   const [stock, setStock] = useState(null);
//   const [selectedQuantity, setSelectedQuantity] = useState(1);

//   // Hindrer flere samtidige Add to cart-klikk.
//   const addingRef = useRef(false);

//   const checkAvailability = useCallback(
//     async (signal) => {
//       const response = await fetch("/api/cart/validate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         cache: "no-store",
//         body: JSON.stringify({
//           items: [{ id: product.id }],
//         }),
//         signal,
//       });

//       if (!response.ok) {
//         throw new Error("Could not check availability");
//       }

//       const data = await response.json();

//       const current = data.items?.find((item) => item.id === product.id);

//       if (!current) {
//         throw new Error("Missing product status");
//       }

//       return current;
//     },
//     [product.id],
//   );

//   useEffect(() => {
//     let active = true;
//     let controller;

//     async function refresh() {
//       controller?.abort();
//       controller = new AbortController();

//       setIsChecking(true);

//       try {
//         const current = await checkAvailability(controller.signal);

//         if (!active || controller.signal.aborted) return;

//         setStatuses([current]);
//         setStock(current.lager ?? null);
//       } catch (error) {
//         if (!active || error.name === "AbortError") return;

//         markUnknown([product.id]);
//         setStock(null);
//       } finally {
//         if (active && !controller.signal.aborted) {
//           setIsChecking(false);
//         }
//       }
//     }

//     refresh();
//     window.addEventListener("focus", refresh);

//     return () => {
//       active = false;
//       controller?.abort();
//       window.removeEventListener("focus", refresh);
//     };
//   }, [product.id, checkAvailability, setStatuses, markUnknown]);

//   const isAvailable = status === "available";

//   // Lagergrense fra Google Sheets, maks 99.
//   const maxQuantity = Number.isSafeInteger(stock) ? Math.min(stock, 99) : 99;

//   // Hvor mange flere kan legges i handlekurven?
//   const remaining = Math.max(0, maxQuantity - quantityInCart);

//   const stockLimitReached = remaining === 0;

//   // Juster vist antall dersom lageret har blitt redusert.
//   const quantityToAdd =
//     remaining > 0 ? Math.min(selectedQuantity, remaining) : 0;

//   const canAdd =
//     hasHydrated && isAvailable && !isChecking && !stockLimitReached;

//   function decreaseSelected() {
//     setSelectedQuantity((quantity) => Math.max(1, quantity - 1));
//     setMessage("");
//   }

//   function increaseSelected() {
//     setSelectedQuantity((quantity) => Math.min(quantity + 1, remaining));
//     setMessage("");
//   }

//   async function handleAddToCart() {
//     if (!canAdd || addingRef.current) return;

//     addingRef.current = true;
//     setIsChecking(true);
//     setMessage("");

//     try {
//       // Kontroller ferske data før vi legger til.
//       const current = await checkAvailability();

//       setStatuses([current]);
//       setStock(current.lager ?? null);

//       if (!current.available) {
//         setMessage("This product is no longer available.");
//         return;
//       }

//       if (!useCartStore.getState()._hasHydrated) {
//         setMessage("Cart is still loading. Please try again.");
//         return;
//       }

//       const latestMax = Number.isSafeInteger(current.lager)
//         ? Math.min(current.lager, 99)
//         : 99;

//       // Hent faktisk antall etter async-valideringen.
//       const existingQuantity =
//         useCartStore.getState().items.find((item) => item.id === product.id)
//           ?.quantity ?? 0;

//       const latestRemaining = Math.max(0, latestMax - existingQuantity);

//       if (latestRemaining === 0) {
//         setMessage("Maximum available quantity reached.");
//         return;
//       }

//       // Ikke legg til mer enn lageret tillater.
//       if (quantityToAdd > latestRemaining) {
//         setSelectedQuantity(latestRemaining);
//         setMessage(`Only ${latestRemaining} more available. Please try again.`);
//         return;
//       }

//       addItem(
//         {
//           ...product,
//           name: current.name,
//           price: current.price,
//           tilgjengelig: true,
//         },
//         latestMax,
//         quantityToAdd,
//       );

//       setSelectedQuantity(1);
//       setMessage("Added to cart.");
//     } catch {
//       markUnknown([product.id]);
//       setStock(null);
//       setMessage("Could not check availability. Try again.");
//     } finally {
//       addingRef.current = false;
//       setIsChecking(false);
//     }
//   }

//   async function handleRetry() {
//     setIsChecking(true);
//     setMessage("");

//     try {
//       const current = await checkAvailability();

//       setStatuses([current]);
//       setStock(current.lager ?? null);
//     } catch {
//       markUnknown([product.id]);
//       setStock(null);
//       setMessage("Could not check availability. Try again.");
//     } finally {
//       setIsChecking(false);
//     }
//   }

// const label = isChecking
//   ? "Checking..."
//   : status === "unavailable"
//     ? "Out of stock"
//     : status !== "available"
//       ? "Availability unknown"
//       : "Add to cart";

//   return (
//     <div className="flex flex-col items-start gap-2">
//       {isChecking ? (
//         <p className="text-sm text-gray-500">Checking availability...</p>
//       ) : !isAvailable ? (
//         <>
//           <p className="text-sm font-medium text-gray-600">
//             {status === "unavailable" ? "Out of stock" : "Availability unknown"}
//           </p>

//           <button
//             type="button"
//             onClick={handleRetry}
//             className="cursor-pointer text-sm underline"
//           >
//             Check availability
//           </button>
//         </>
//       ) : (
//         <>
//           {!stockLimitReached && (
//             <div className="flex flex-wrap items-center gap-3">
//               {/* Antallsvelger */}
//               <div className="flex items-center border border-gray-300">
//                 <button
//                   type="button"
//                   onClick={decreaseSelected}
//                   disabled={!canAdd || quantityToAdd <= 1}
//                   className="
//                 px-3 py-3
//                 enabled:cursor-pointer
//                 disabled:cursor-not-allowed
//                 disabled:opacity-40
//               "
//                   aria-label="Decrease quantity"
//                 >
//                   −
//                 </button>

//                 <span className="min-w-8 text-center">{quantityToAdd}</span>

//                 <button
//                   type="button"
//                   onClick={increaseSelected}
//                   disabled={!canAdd || quantityToAdd >= remaining}
//                   className="
//                 px-3 py-3
//                 enabled:cursor-pointer
//                 disabled:cursor-not-allowed
//                 disabled:opacity-40
//               "
//                   aria-label="Increase quantity"
//                 >
//                   +
//                 </button>
//               </div>

//               {/* Add to cart */}
//               <button
//                 type="button"
//                 onClick={handleAddToCart}
//                 disabled={!canAdd}
//                 className={`px-6 py-3 transition-colors ${
//                   canAdd
//                     ? "cursor-pointer bg-black text-white hover:bg-gray-800"
//                     : "cursor-not-allowed bg-gray-300 text-gray-500"
//                 }`}
//               >
//                 Add to cart
//               </button>
//             </div>
//           )}

//           {stock !== null && (
//             <p className="text-sm text-gray-600">{stock} in stock</p>
//           )}

//           {hasHydrated && stockLimitReached && (
//             <p className="text-sm text-gray-600">
//               Maximum available quantity added to cart.
//             </p>
//           )}
//         </>
//       )}

//       {message && (
//         <p role="status" className="text-sm text-gray-600">
//           {message}
//         </p>
//       )}
//     </div>
//   );
// }
