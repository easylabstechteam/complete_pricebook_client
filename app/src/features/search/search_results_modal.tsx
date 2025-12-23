import type { SearchModalInput } from "@/types/search/SearchModalInput";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSearchModalLogic } from "@/services/search/useSearchModalLogic";

interface Props {
  onSelect: () => void;
}

function SearchResultsModal({ onSelect }: Props) {
  const { handleSelect, isPending, initialResults } = useSearchModalLogic();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const results = initialResults;

  if (results == null) return null;

  // NO RESULTS STATE
  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-black font-black uppercase tracking-tighter italic border-2 border-black border-t-0">
        No Matches Found in Registry
      </div>
    );
  }

  const onSelectionInternal = (value: SearchModalInput) => {
    handleSelect(value);
    onSelect();
  };

  return (
    <div className="w-full bg-white border-2 border-black border-t-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" role="listbox">
      {/* Brutalist Sticky Header */}
      <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white bg-black px-4 py-2 sticky top-0 z-10 flex justify-between items-center">
        <span>{isPending ? "SCANNING..." : "QUERY_MATCHES"}</span>
        <span className="font-mono tabular-nums text-[9px] opacity-70">
          {results.length} UNITS
        </span>
      </div>

      <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
        {results.map((value: SearchModalInput, key: number) => {
          const isHovered = key === hoveredId;

          return (
            <div
              key={key}
              tabIndex={0}
              className={`
                flex items-center justify-between py-4 px-4 border-b border-black last:border-b-0
                cursor-pointer transition-none outline-none
                ${isHovered ? "bg-black text-white" : "bg-white text-black"}
              `}
              onClick={() => onSelectionInternal(value)}
              onMouseEnter={() => setHoveredId(key)}
              onMouseLeave={() => setHoveredId(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectionInternal(value);
                }
              }}
              role="option"
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-3">
                   {/* Result Type Badge */}
                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 border-2 transition-colors ${
                    isHovered ? "border-white text-white" : "border-black text-black"
                  }`}>
                    {value?.type}
                  </span>
                  
                  <p className="text-sm font-black uppercase tracking-tight truncate">
                    {value?.data.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isHovered && <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">SELECT</span>}
                <ArrowRight size={16} strokeWidth={3} className={isHovered ? "text-white" : "text-black"} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResultsModal;