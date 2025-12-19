import type { SearchModalInput } from "@/types/search/searchModal.input";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSearchModalLogic } from "@/services/search/search_results_modal";

interface Props {
  onSelect: () => void; // Prop to trigger the stage change in SearchPage
}

function SearchResultsModal({ onSelect }: Props) {
  const { handleSelect, isPending, initialResults } = useSearchModalLogic();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const results = initialResults;

  if (results == null) return null;

  // NO RESULTS STATE: Fits inside the expanded search bar
  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-medium italic">
        No Results Found
      </div>
    );
  }

  // Wrapper for selection to handle both data and UI transition
  const onSelectionInternal = (value: SearchModalInput) => {
    handleSelect(value); // Your existing logic (API calls, etc)
    onSelect();          // Trigger the "Snap to bottom" animation
  };

  return (
    <div className="w-full h-full flex flex-col bg-white" role="listbox">
      {/* Sticky Header */}
      <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-4 pt-3 pb-2 sticky top-0 bg-white z-10 border-b border-gray-50">
        {isPending ? "Searching Database..." : `${results.length} Matches Found`}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {results.map((value: SearchModalInput, key: number) => {
          const isHovered = key === hoveredId;

          return (
            <div
              key={key}
              tabIndex={0}
              className={`
                flex items-center justify-between py-3 px-4 mb-1 rounded-xl 
                cursor-pointer transition-all duration-150 ease-in-out outline-none
                ${isHovered ? "bg-gray-900 text-white shadow-md" : "text-gray-800 hover:bg-gray-100"}
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
              <div className="flex items-center min-w-0">
                <p className="text-sm font-semibold truncate">
                  {value?.data.name}
                  <span className={`ml-2 text-[10px] font-normal uppercase px-2 py-0.5 rounded-full border ${
                    isHovered ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
                  }`}>
                    {value?.type}
                  </span>
                </p>
              </div>
              <ArrowRight size={14} className={isHovered ? "text-white" : "text-gray-300"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResultsModal;