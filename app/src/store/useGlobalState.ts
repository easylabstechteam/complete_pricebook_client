import { create } from "zustand";

interface ErrorData {
  title: string;
  message: string;
  code?: string | number;
}

const useGlobalState = create((set) => ({
  // --- DATA STATES ---
  initialResults: null,
  tableResults: null,

  // --- ERROR STATES ---
  // This holds the object that triggers your ErrorCard
  activeError: null as ErrorData | null,

  // --- DATA ACTIONS ---
  setInitialResults: (results: any) => set({ initialResults: results }),
  clearInitialResults: () => set({ initialResults: null }),
  setTableResults: (results: any) => set({ tableResults: results }),
  clearTableResults: () => set({ tableResults: null }),

  // --- ERROR ACTIONS ---
  /**
   * Triggers the global ErrorCard modal
   */
  triggerError: (title: string, message: string, code?: string | number) => 
    set({ activeError: { title, message, code } }),

  /**
   * Hides the ErrorCard modal
   */
  clearError: () => set({ activeError: null }),

  /**
   * Resets everything back to a clean state
   */
  resetAll: () => set({ 
    initialResults: null, 
    tableResults: null, 
    activeError: null 
  }),
}));

export { useGlobalState };