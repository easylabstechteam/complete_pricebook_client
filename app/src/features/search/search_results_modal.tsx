import type { SearchModalInput } from "@/types/search/searchModal.input";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSearchModalLogic } from "@/services/search/search_results_modal";

/**
 * SearchResultsModal
 * This component is a presentation layer responsible for displaying a list of search results
 * (e.g., in a dropdown or modal). It relies entirely on the 'useSearchModalLogic' custom hook 
 * for its data, handlers, and pending/loading state.
 */
function SearchResultsModal() {
  // --- 1. GET DATA AND HANDLERS ---
  // The custom hook abstracts all state management, API calls, and business logic
  // (e.g., debouncing, handling initial query, filtering).
  const { handleSelect, isPending, initialResults } = useSearchModalLogic();

  // Local state for handling hover/UI feedback. Used to visually highlight the item 
  // the mouse is currently over, improving user experience.
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // --- 2. CONDITIONAL RENDERING LOGIC ---
  // Use a local alias for simplicity.
  const results = initialResults;

  // Primary Guard Clause: If the result data structure itself is null (e.g., before 
  // the initial fetch has completed or returned a valid object), render nothing.
  if (results == null) {
    return null;
  };

  // Secondary Guard Clause: If results are available but the array is empty.
  if (results.length === 0) {
    // Renders a styled message block indicating no items were found.
    return (
      <div
        className="max-w-xl mx-auto mt-4 p-4 
                     bg-white rounded-l shadow-2xl ring-1 ring-gray-300 
                     max-h-80 flex items-center justify-center text-gray-500 font-medium"
      >
        No Results Found
      </div>
    );
  }

  // --- 3. MAIN RENDER (Results Found) ---
  return (
    <div
      className="max-w-xl mx-auto mt-4 p-1 
                 bg-white rounded-l shadow-2xl ring-1 ring-gray-300 
                 max-h-80 overflow-y-auto" // Enables scrolling if result list exceeds max-h-80
      role="listbox" // ARIA role for accessibility, informing screen readers this is a list of options
      aria-label="Search results"
    >
      {/* Sticky Header: Provides context (count/loading status) and stays visible 
          at the top as the user scrolls through the list. */}
      <div className="text-xs font-semibold text-gray-500 px-3 pt-2 pb-1 sticky top-0 bg-white z-10 border-b border-gray-100">
        {/* Displays "Loading..." while pending, otherwise shows the result count. */}
        {isPending ? "Loading..." : `${results.length} Results Found`}
      </div>

      {/* List Rendering: Map over the results array to render each individual item. */}
      {results.map((value: SearchModalInput) => {
        const resultKey = value.data.id;
        const isHovered = resultKey === hoveredId; // Check if the current item is being hovered over.

        return (
          <div
            className={`
              flex items-center justify-between py-3 px-3 mx-1 my-0.5 rounded-l 
              cursor-pointer transition-all duration-150 ease-in-out 
              outline-none focus:ring-2 focus:ring-blue-500 // Accessibility: Visual feedback for keyboard focus
              ${
                isHovered
                  ? "bg-gray-900 text-white shadow-lg" // Hover State (Dark background)
                  : // Default/Inactive State
                    "text-gray-800 active:bg-gray-200 hover:bg-gray-100" // Subtle hover/active contrast
              }
            `}
            key={resultKey}
            // Accessibility: Allows the element to receive keyboard focus (tabbing).
            tabIndex={0} 
            // Interaction Handlers:
            onClick={() => handleSelect(value)} // Handles mouse click selection.
            onMouseEnter={() => setHoveredId(resultKey)} // Sets local state on mouse entry.
            onMouseLeave={() => setHoveredId(null)} // Clears local state on mouse exit.
            // Keyboard Interaction Handler:
            onKeyDown={(e) => {
              // Checks for Enter or Space key press to trigger selection.
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault(); // Prevents default browser actions (like scrolling).
                handleSelect(value);
              }
            }}
            role="option" // ARIA role identifying this as a selectable option in the listbox.
            aria-selected={isHovered} // ARIA state indicating selection status for screen readers.
          >
            <div className="flex items-center min-w-0">
              <p className="text-sm font-medium truncate">
                {/* Display the main result name (e.g., product name). */}
                {value.data.name}
                <span
                  className={`ml-2 text-xs font-normal ${
                    // Adjusts the color of the type label based on the hover state.
                    isHovered ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {/* Display the result category/type (e.g., 'Supplier', 'Trade'). */}
                  ({value.type})
                </span>
              </p>
            </div>
            {/* Action Indicator Icon */}
            <div
              className={`ml-4 ${isHovered ? "text-white" : "text-gray-400"}`}
            >
              <ArrowRight size={16} /> {/* Visually indicates selection/next step. */}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResultsModal;