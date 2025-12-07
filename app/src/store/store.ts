import { create } from 'zustand';

const PAGE_STEPS = {
  INITIAL: "INITIAL",
  MODAL_OPEN: "MODAL_OPEN", 
  TABLE_VIEW: "TABLE_VIEW", 
};

export const useGlobalState = create((set) => ({
  
  pageState: PAGE_STEPS.INITIAL, // 👈 New pageState, set to initial value

  // initial states
  initialResults: null,
  tableResults: null,
  
  // supplier performance state
  supplierPerformance: null,
  comparisonPerformance: null,

  // --- ACTIONS ---

  // page state action
  setPageState: (state: typeof PAGE_STEPS[keyof typeof PAGE_STEPS]) => set({ pageState: state }), // 👈 New action

  // results actions
  setInitialResults: (results: any) => set({ initialResults: results }),
  setTableResults: (results: any) => set({ tableResults: results }),

  // performance actions
  setSupplierPerformance: (data: any) => set({ supplierPerformance: data }),
  setComparisonPerformance: (data: any) => set({ comparisonPerformance: data }),
}));