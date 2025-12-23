import { create } from "zustand";

const useUploadState = create((set) => ({
  excelFile: null,
  setExcelFile: (file: File) => set({ excelFile: file }),
  clearUpload: ()=>set({excelFile:null})
}));

export {useUploadState}; 
