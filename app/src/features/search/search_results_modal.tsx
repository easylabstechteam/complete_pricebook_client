import { useGlobalState } from "@/store/store";
import type { SearchModalInput } from "@/types/search/searchModal.input";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
// 👈 Import the custom hook
import { useSearchModalLogic } from "@/services/search/search.selected.result"; 


function SearchResultsModal() {
  // --- 1. GET DATA AND HANDLERS ---
  
  // Get the list of results populated by the initial search
  const initialSearchResults = useGlobalState((state: any) => state.initialResults);
  
  // Use the custom hook to get the selection handler and loading status
  const { handleSelect, isPending } = useSearchModalLogic(); 

  // Local state for handling hover/UI feedback
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // TODO :: maybe make amendments here.... the backend may not have the data it will bring in an empty array, so the modal should show " No Results "

  // --- 2. CONDITIONAL RENDERING LOGIC ---
  const results = initialSearchResults || [];

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div
      className="max-w-xl mx-auto mt-4 p-1 
                 bg-white rounded-xl shadow-2xl ring-1 ring-gray-300 
                 max-h-80 overflow-y-auto"
      role="listbox"
      aria-label="Search results"
    >
      <div className="text-xs font-semibold text-gray-500 px-3 pt-2 pb-1 sticky top-0 bg-white z-10 border-b border-gray-100">
        {isPending
          ? "Loading..."
          : `${results.length} Results Found`}
      </div>

      {results.map((value: SearchModalInput) => {
        const resultKey = value.data.id;
        const isHovered = resultKey === hoveredId;

        return (
          <div
            className={`
              flex items-center justify-between p-3 mx-1 my-0.5 rounded-lg cursor-pointer transition-all duration-150 ease-in-out
              ${
                isHovered
                  ? "bg-gray-900 text-white shadow-lg"
                  : "text-gray-800 hover:bg-gray-100"
              }
            `}
            key={resultKey}
            // 👈 Call the imported function here
            onClick={() => handleSelect(value)} 
            onMouseEnter={() => setHoveredId(resultKey)}
            onMouseLeave={() => setHoveredId(null)}
            role="option"
            aria-selected={isHovered}
          >
            <div className="flex items-center min-w-0">
              <p className="text-sm font-medium truncate">
                {value.data.name}
                <span
                  className={`ml-2 text-xs font-normal ${
                    isHovered ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ({value.type})
                </span>
              </p>
            </div>
            <div
              className={`ml-4 ${isHovered ? "text-white" : "text-gray-400"}`}
            >
              <ArrowRight size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResultsModal;