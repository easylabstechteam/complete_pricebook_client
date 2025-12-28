import type { SearchModalInput } from "@/types/search/SearchModalInput";
import { useState, useEffect } from "react";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import { useSearchModalLogic } from "@/services/search/useSearchModalLogic";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-xl mt-2 animate-in fade-in zoom-in-95 duration-200">
        <Search className="w-8 h-8 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-900">No results found</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms</p>
      </div>
    );
  }

  const onSelectionInternal = (value: SearchModalInput) => {
    handleSelect(value);
    onSelect();
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col mt-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300" role="listbox">
      {/* Refined Professional Header */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {isPending ? "Updating Results" : "Top Matches"}
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          {results.length} results found
        </span>
      </div>

      {/* Results List */}
      <div className="max-h-[300px] md:max-h-[420px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200">
        {results.map((value: SearchModalInput, key: number) => {
          const isHovered = key === hoveredId;

          return (
            <div
              key={key}
              tabIndex={0}
              className={cn(
                "flex items-center justify-between py-3 px-4 cursor-pointer outline-none transition-all duration-150",
                isHovered ? "bg-slate-50" : "bg-white",
                "border-b border-slate-50 last:border-b-0"
              )}
              onClick={() => onSelectionInternal(value)}
              onMouseEnter={() => !isMobile && setHoveredId(key)}
              onMouseLeave={() => !isMobile && setHoveredId(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelectionInternal(value);
              }}
              role="option"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Semantic Type Badge */}
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-[9px] px-1.5 py-0 rounded font-bold uppercase tracking-wide shrink-0",
                    value?.type === 'product' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                  )}
                >
                  {value?.type}
                </Badge>
                
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    {value?.data.name}
                  </span>
                  {/* Added a metadata line for a more professional feel */}
                  <span className="text-[10px] text-slate-400 truncate">
                    ID: {value?.data.name || 'N/A'} • Registry Entry
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {isHovered && !isMobile && (
                  <span className="text-[10px] font-semibold text-blue-600 animate-in fade-in slide-in-from-right-1">
                    Select
                  </span>
                )}
                <ArrowRight 
                  size={16} 
                  className={cn(
                    "transition-transform duration-200",
                    isHovered ? "translate-x-1 text-blue-600" : "text-slate-300"
                  )} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResultsModal;