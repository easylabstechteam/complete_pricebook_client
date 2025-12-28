import { create } from "zustand";

const useGlobalErrorState = create((set) => ({
  // --- ERROR STATES ---
  // This holds the object that triggers your ErrorCard
  activeError: null,
  clearError: () => set({ activeError: null }),
  setError: (error: any) => set({ activeError: error }),
}));

export { useGlobalErrorState };
