import { AlertTriangle, X, ArrowRight, ShieldAlert } from "lucide-react";
import type { ErrorCardProps } from "@/types/error/errorInputs";

function ErrorCard({ activeError, clearError }: ErrorCardProps) {
  // If there's no error in the global state, don't show the modal
  if (!activeError) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
      {/* 1. BLURRED BACKDROP - Clicking this clears the error */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={clearError}
      />

      {/* 2. THE MESSAGE BOX */}
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Warning Header */}
        <div className="bg-amber-50 p-8 flex items-center justify-between border-b border-amber-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-900 uppercase tracking-[0.2em]">
                System Alert
              </h3>
              {/* Uses the 'code' from activeError */}
              <p className="text-xs text-amber-700 font-medium">
                Error Code: {activeError.code || "ERR_FILE_PARSE"}
              </p>
            </div>
          </div>
          <button 
            onClick={clearError}
            className="p-2 hover:bg-amber-200/50 rounded-xl transition-colors text-amber-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-10">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight mb-4">
            {activeError.title || "Input Validation Failed"}
          </h2>
          <p className="text-stone-500 leading-relaxed mb-8">
            {activeError.message}
          </p>

          <div className="space-y-3">
            <button
              onClick={clearError}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl flex items-center justify-center group transition-all active:scale-[0.98]"
            >
              <span>RETURN TO UPLOAD</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest pt-2">
              <ShieldAlert className="w-3 h-3" />
              <span>Secure File Processing Layer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorCard;