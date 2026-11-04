import { create } from "zustand";

export const useProductStatusStore = create((set) => ({
  // Status is intentionally NOT persisted to localStorage.
  statuses: {},

  setStatuses: (products) =>
    set((state) => {
      const next = { ...state.statuses };

      for (const product of products) {
        next[product.id] = {
          status: product.available === true ? "available" : "unavailable",
          checkedAt: Date.now(),
        };
      }

      return { statuses: next };
    }),

  markUnknown: (ids) =>
    set((state) => {
      const next = { ...state.statuses };

      for (const id of ids) {
        next[id] = {
          status: "unknown",
          checkedAt: Date.now(),
        };
      }

      return { statuses: next };
    }),
}));
