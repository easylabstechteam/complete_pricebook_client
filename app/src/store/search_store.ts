import { create } from "zustand";

const useGlobalState = create((set) => ({
  // initial states
  initialResults: null,
  tableResults: null,

  // --- ACTIONS ---
  setInitialResults: (results: any) => set({ initialResults: results }),
  clearInitialResults: () => set({ initialResults: null }),
  setTableResults: (results: any) => set({ tableResults: results }),
  clearTableResults: () => set({ tableResults: null }),
}));

export { useGlobalState };
