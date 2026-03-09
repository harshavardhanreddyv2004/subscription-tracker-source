import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CURRENCIES = [
  { code: "USD", label: "US Dollar ($)", symbol: "$" },
  { code: "INR", label: "Rupees (₹)", symbol: "₹" },
  { code: "EUR", label: "Euro (€)", symbol: "€" },
  { code: "GBP", label: "British Pound (£)", symbol: "£" }
];

export const useCurrencyStore = create(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency })
    }),
    { name: "currency-storage" }
  )
);
