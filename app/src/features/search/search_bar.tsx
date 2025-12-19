import { Search } from "lucide-react";
import { useEffect } from "react";
import { useSearchLogic } from "@/services/search/search";

// We add these props so the Page and Bar can stay in sync
interface SearchBarProps {
  stage: 'idle' | 'searching' | 'results';
  onTypingStop: () => void;
  onClear: () => void;
}

function SearchBar({ stage, onTypingStop, onClear }: SearchBarProps) {
  const { value, onChange, onKeyDown, handleSearch, isQueryEmpty } = useSearchLogic();

  // This is the 0.5s logic YOU requested
  useEffect(() => {
    if (value.trim() === "") {
      onClear(); // Reset to center if input is empty
      return;
    }

    const timer = setTimeout(() => {
      // If they stop for 0.5s and we aren't already at the bottom, Expand!
      if (value.trim().length > 1 && stage === 'idle') {
        handleSearch(); // Runs your Mutation
        onTypingStop(); // Makes the bar grow
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, stage]);

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
      <div className="relative w-full flex items-center bg-white rounded-l transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900">
        <div className="absolute left-3 text-gray-400">
          <Search size={20} />
        </div>

        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Search trade, suppliers or products..."
          className="w-full py-4 pl-12 pr-[4.5rem] text-gray-800 bg-transparent rounded-xl focus:outline-none placeholder-gray-500 text-base sm:text-lg"
        />

        <button
          onClick={() => { handleSearch(); onTypingStop(); }}
          disabled={isQueryEmpty}
          className={`absolute right-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-150 whitespace-nowrap ${
            isQueryEmpty ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black shadow-md"
          }`}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;

