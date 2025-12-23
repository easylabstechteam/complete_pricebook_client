import { create } from "zustand";

const useAnalyticsState = create((set) => ({
  supplierRankings: null,
  productImpact: null,

  // FIX: Ensure the key matches the state variable name
  setSupplierRankings: (data: any) => set({ supplierRankings: data }),
  setProductImpact: (data: any) => set({ productImpact: data }),
}));

export {useAnalyticsState}