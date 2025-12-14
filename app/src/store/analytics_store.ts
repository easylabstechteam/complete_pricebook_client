import { create } from 'zustand';

const useAnalyticsState = create((set) => ({  
  // supplier performance state
  supplierRankings: null,
  comparisonPerformance: null,
  // performance actions
  setSupplierPerformance: (data: any) => set({ supplierPerformance: data }),
  setComparisonPerformance: (data: any) => set({ comparisonPerformance: data }),
}));

export {useAnalyticsState}