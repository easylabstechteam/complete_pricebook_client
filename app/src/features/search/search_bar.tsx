import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchLogic } from "@/services/search/useSearchLogic";

interface SearchBarProps {
  stage: "idle" | "searching" | "results";
  onTypingStop: () => void;
  onClear: () => void;
}

function SearchBar({ stage, onTypingStop, onClear }: SearchBarProps) {
  const { value, onChange, onKeyDown, handleSearch, isQueryEmpty } =
    useSearchLogic();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (value.trim() === "") {
      onClear();
      return;
    }

    const timer = setTimeout(() => {
      if (value.trim().length > 1 && stage === "idle") {
        handleSearch();
        onTypingStop();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, stage]);

  return (
    /* Removed large padding (p-4 -> p-2) on mobile to give the bar more "breathing room" across the screen width */
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      {/* Increased padding-y (py-1) on the container to make the whole bar taller/thicker */}
      <div className="relative flex items-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-within:-translate-y-0.5 py-1">
        {/* Icon section stays consistent */}
        <div className="pl-4 pr-1 text-black shrink-0">
          <Search size={isMobile ? 22 : 24} strokeWidth={3} />
        </div>

        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={
            isMobile ? "SEARCH..." : "ENTER TRADE_CODE, SUPPLIER OR PRODUCT..."
          }
          /* Bumping py-5 on mobile makes the input field significantly taller.
             Text size remains at sm/base to look "beefy" without clipping.
          */
          className="w-full py-5 sm:py-6 px-3 text-black bg-transparent focus:outline-none placeholder:text-gray-400 font-mono text-sm sm:text-lg uppercase font-bold tracking-tight"
        />

        {/* Action Button: Wider hit area for mobile fingers */}
        <div className="pr-3 shrink-0">
          <button
            onClick={() => {
              handleSearch();
              onTypingStop();
            }}
            disabled={isQueryEmpty}
            className={`
              px-5 sm:px-8 py-3 sm:py-3.5 border-2 border-black font-black uppercase text-xs sm:text-sm tracking-widest transition-all
              ${
                isQueryEmpty
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-black text-white hover:bg-white hover:text-black active:translate-y-1 active:shadow-none"
              }
            `}
          >
            {isMobile ? "GO" : "Search"}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="absolute -top-3 left-4 bg-black text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter">
          user input
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
