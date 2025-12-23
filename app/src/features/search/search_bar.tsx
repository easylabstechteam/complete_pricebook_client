import { Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchLogic } from "@/services/search/useSearchLogic";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  stage: "idle" | "searching" | "results";
  onTypingStop: () => void;
  onClear: () => void;
}

function SearchBar({ stage, onTypingStop, onClear }: SearchBarProps) {
  const { value, onChange, onKeyDown, handleSearch, isQueryEmpty } = useSearchLogic();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (value.trim() === "") {
      onClear();
      return;
    }

    const timer = setTimeout(() => {
      if (value.trim().length > 1 && stage === "idle") {
        handleSearch();
        onTypingStop();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, stage]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
      <div 
        className={cn(
          "relative flex items-center bg-white rounded-xl border-2 transition-all duration-200 px-1 py-1",
          // BORDER VISIBILITY: Solid gray-400 when not selected, pure black when selected
          "border-gray-400 shadow-sm", 
          "focus-within:border-black focus-within:shadow-md"
        )}
      >
        {/* Icon section - High contrast Black */}
        <div className="pl-4 pr-1 text-black shrink-0">
          {stage === "searching" ? (
            <Loader2 className="animate-spin" size={isMobile ? 20 : 22} />
          ) : (
            <Search size={isMobile ? 20 : 22} strokeWidth={2.5} />
          )}
        </div>

        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={
            isMobile ? "Search..." : "Search trade code, supplier, or product..."
          }
          className="w-full py-4 sm:py-5 px-3 text-black bg-transparent focus:outline-none placeholder:text-gray-400 font-medium text-sm sm:text-base"
        />

        {/* Action Button - Strict Monochrome */}
        <div className="pr-1 shrink-0">
          <button
            onClick={() => {
              handleSearch();
              onTypingStop();
            }}
            disabled={isQueryEmpty}
            className={cn(
              "px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200",
              isQueryEmpty
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-black text-white hover:bg-zinc-800 active:scale-95 shadow-sm"
            )}
          >
            {isMobile ? "GO" : "SEARCH"}
          </button>
        </div>

        {/* Dynamic Status Label */}
        {value.length > 0 && (
          <div className="absolute -bottom-7 left-4">
             <span className="text-[9px] font-bold text-black uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
               Registry Scan Active
             </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;