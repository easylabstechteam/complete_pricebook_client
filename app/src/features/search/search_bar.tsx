import { Search } from "lucide-react";
import { SearchLogic } from "@/services/search/search";

/**
 * SearchBar
 * A presentation component that utilizes a custom hook (SearchLogic) 
 * to manage all state, handlers, and asynchronous logic related to search 
 * functionality. This component's sole responsibility is rendering the UI.
 */
function SearchBar() {
  // 1. Hook Integration: Destructure necessary values and handlers from the custom hook.
  // This pattern keeps the UI clean (presentational) and the logic separate (container/hook).
  const { value, onChange, onKeyDown, handleSearch, loading, isQueryEmpty } =
    SearchLogic();

  // --- RENDER (JSX) ---
  return (
    // Outer Container: Sets the max width for the search bar and centers it on the page.
    // Responsive Padding: Adjusts padding for mobile (p-2) and larger screens (sm:p-4).
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4"> 
      <div className="relative flex items-center bg-white border border-gray-300 rounded-l shadow-lg transition-all duration-200 
                      // Focus State: Applies a visual ring effect when the input inside is active.
                      focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900">
        
        {/* Search Icon / Spinner Container */}
        <div className="absolute left-3 text-gray-400"> 
          {/* Conditional Rendering: Check the 'loading' state to display either the spinner or the static Search icon. */}
          {loading ? (
            // Custom SVG Spinner for the loading state (copied for cleaner animation control).
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            // Static Search Icon from lucide-react when not loading.
            <Search size={20} />
          )}
        </div>
        
        {/* Input Field (The core interactive element) */}
        <input
          type="text"
          value={value} // Binds the input value to the state managed by SearchLogic.
          onChange={onChange} // Calls the hook's setter function on every keystroke.
          onKeyDown={onKeyDown} // Used to trigger search on 'Enter' key press (logic inside the hook).
          placeholder="Search trade, suppliers or products..."
          // Styling: Wide padding (pl-12) to make room for the icon, and right padding (pr-[4.5rem]) 
          // to make room for the button. Responsive text size (text-base sm:text-lg).
          className="w-full py-4 pl-12 pr-[4.5rem] text-gray-800 bg-transparent rounded-xl focus:outline-none placeholder-gray-500 text-base sm:text-lg"
          disabled={loading} // Disables text input while an API call is in progress.
          aria-label="Search input"
        />
        
        {/* Search Button (Absolute positioned on the right) */}
        <button
          onClick={handleSearch} // Calls the hook's search initiation function.
          // Disables the button if the query is empty or if a search is already running.
          disabled={isQueryEmpty || loading} 
          className={`
                        absolute right-2 px-3 py-1.5 rounded-lg text-sm font-semibold
                        transition-colors duration-150 whitespace-nowrap
                        ${
                          // Conditional Styling: Sets colors and cursor based on disabled state.
                          isQueryEmpty || loading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Disabled (Light/Gray)
                            : "bg-gray-900 text-white hover:bg-black shadow-md" // Active (Dark/Primary)
                        }
                    `}
        >
          {/* Conditional Button Text: Displays "Searching..." while loading, otherwise "Search". */}
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;