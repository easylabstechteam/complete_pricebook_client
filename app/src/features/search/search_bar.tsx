import { Search } from "lucide-react";
import { useEffect } from "react";
import { useSearchLogic } from "@/services/search/useSearchLogic";

interface SearchBarProps {
  stage: 'idle' | 'searching' | 'results';
  onTypingStop: () => void;
  onClear: () => void;
}

function SearchBar({ stage, onTypingStop, onClear }: SearchBarProps) {
  const { value, onChange, onKeyDown, handleSearch, isQueryEmpty } = useSearchLogic();

  useEffect(() => {
    if (value.trim() === "") {
      onClear();
      return;
    }

    const timer = setTimeout(() => {
      if (value.trim().length > 1 && stage === 'idle') {
        handleSearch();
        onTypingStop();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, stage]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Container with a thick offset shadow for that brutalist 'pop' */}
      <div className="relative flex items-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-within:-translate-y-0.5">
        
        {/* Left Icon Section */}
        <div className="pl-4 pr-2 text-black border-r-2 border-transparent">
          <Search size={22} strokeWidth={3} />
        </div>

        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="ENTER TRADE_CODE, SUPPLIER OR PRODUCT CODE...etc"
          className="w-full py-5 px-3 text-black bg-transparent focus:outline-none placeholder:text-gray-400 font-mono text-sm sm:text-base uppercase font-bold tracking-tight"
        />

        {/* Action Button: Inverted Monochrome */}
        <div className="pr-2">
          <button
            onClick={() => { handleSearch(); onTypingStop(); }}
            disabled={isQueryEmpty}
            className={`
              px-6 py-2 border-2 border-black font-black uppercase text-xs tracking-widest transition-all
              ${isQueryEmpty 
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed" 
                : "bg-black text-white hover:bg-white hover:text-black active:translate-y-1 active:shadow-none"
              }
            `}
          >
            Search
          </button>
        </div>

        {/* Status Indicator (Optional Detail) */}
        <div className="absolute -top-3 left-4 bg-black text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter">
          user input
        </div>
      </div>
    </div>
  );
}

export default SearchBar;