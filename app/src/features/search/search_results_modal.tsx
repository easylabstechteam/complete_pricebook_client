import type { SearchModalInput } from "@/types/search/SearchModalInput";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useSearchModalLogic } from "@/services/search/useSearchModalLogic";

interface Props {
  onSelect: () => void;
}

function SearchResultsModal({ onSelect }: Props) {
  const { handleSelect, isPending, initialResults } = useSearchModalLogic();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const results = initialResults;

  if (results == null) return null;

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 md:p-12 text-black font-black uppercase tracking-tighter italic border-2 border-black border-t-0 bg-white">
        No Matches Found in Registry
      </div>
    );
  }

  const onSelectionInternal = (value: SearchModalInput) => {
    handleSelect(value);
    onSelect();
  };

  return (
    <div className="w-full bg-white border-2 border-black border-t-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col" role="listbox">
      {/* Brutalist Sticky Header */}
      <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white bg-black px-4 py-2 sticky top-0 z-20 flex justify-between items-center">
        <span>{isPending ? "SCANNING..." : "QUERY_MATCHES"}</span>
        <span className="font-mono tabular-nums text-[9px] opacity-70">
          {results.length} UNITS
        </span>
      </div>

      {/* Responsive Height: Smaller on mobile to leave room for the keyboard/search bar */}
      <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto overflow-x-hidden touch-pan-y">
        {results.map((value: SearchModalInput, key: number) => {
          // On mobile, we avoid hover styles as they "stick" after a tap
          const isActive = key === hoveredId;

          return (
            <div
              key={key}
              tabIndex={0}
              className={`
                flex items-center justify-between py-3 md:py-4 px-4 border-b border-black last:border-b-0
                cursor-pointer transition-none outline-none select-none
                ${isActive ? "bg-black text-white" : "bg-white text-black"}
                ${!isMobile ? "hover:bg-black hover:text-white" : "active:bg-black active:text-white"}
              `}
              onClick={() => onSelectionInternal(value)}
              onMouseEnter={() => !isMobile && setHoveredId(key)}
              onMouseLeave={() => !isMobile && setHoveredId(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectionInternal(value);
                }
              }}
              role="option"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-2 md:gap-3">
                   {/* Result Type Badge - Scaled for Mobile */}
                   <span className={`text-[8px] md:text-[9px] font-black uppercase px-1.5 md:px-2 py-0.5 border-2 transition-colors shrink-0 ${
                    isActive ? "border-white text-white" : "border-black text-black"
                  }`}>
                    {value?.type}
                  </span>
                  
                  <p className="text-xs md:text-sm font-black uppercase tracking-tight truncate">
                    {value?.data.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {/* Text hidden on small mobile to prevent overlap */}
                {isActive && !isMobile && <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">SELECT</span>}
                <ArrowRight size={isMobile ? 14 : 16} strokeWidth={3} className={isActive ? "text-white" : "text-black"} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResultsModal;