import { Search } from "lucide-react";
import { SearchLogic } from "@/services/search/search";

/**
 * SearchBar
 * A presentation component that uses SearchLogic to handle input state,
 * API calls, and loading status.
 */
function SearchBar() {
  // 1. Call the external hook to get all necessary props and handlers
  const { value, onChange, onKeyDown, handleSearch, loading, isQueryEmpty } =
    SearchLogic();

  // --- RENDER (JSX) ---
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative flex items-center bg-white border border-gray-300 rounded-xl shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900">
        {/* Search Icon / Spinner */}
        <div className="absolute left-4 text-gray-400">
          {loading ? (
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
            <Search size={20} />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Search trade, suppliers or products..."
          className="w-full py-3 pl-12 pr-16 text-gray-800 bg-transparent rounded-xl focus:outline-none placeholder-gray-500 text-base"
          disabled={loading}
          aria-label="Search input"
        />
        <button
          onClick={handleSearch}
          disabled={isQueryEmpty || loading}
          className={`
                        absolute right-2 px-3 py-1 rounded-lg text-xs font-semibold
                        transition-colors duration-150
                        ${
                          isQueryEmpty || loading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-900 text-white hover:bg-black shadow-md"
                        }
                    `}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
