import { create } from "zustand";

const useUploadState = create((set) => ({
  excelFile: null,
  setSaveData: (file: File) => set({ excelFile: file }),
  clearUpload: ()=>set({excelFile:null})
}));

export {useUploadState}; 
