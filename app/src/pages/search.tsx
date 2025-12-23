import { useState } from "react";
import SearchBar from "@/features/search/search_bar";
import SearchResultsTable from "@/features/search/search_results_table";
import AppShell from "@/pages/layouts/app_shell";
import SearchResultsModal from "@/features/search/search_results_modal";
import { cn } from "@/lib/utils";

function SearchPage() {
  const [stage, setStage] = useState<"idle" | "searching" | "results">("idle");

  return (
    <AppShell>
      <div className="relative h-full w-full flex flex-col overflow-hidden bg-white">
        
        {/* 1. TOP AREA: Title Block - Refined Typography */}
        <div
          className={cn(
            "z-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] px-6",
            stage === "results"
              ? "pt-8 pb-4 opacity-100"
              : "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-48"
          )}
        >
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-black tracking-tight leading-none">
              Complete Price Book
            </h1>
            <p className="text-gray-400 text-[10px] md:text-sm mt-2 font-medium uppercase tracking-[0.15em]">
              Market intelligence & trade inventory
            </p>
          </div>
        </div>

        {/* 2. CENTER AREA: Results Table */}
        <div className="flex-1 w-full min-h-0 relative">
          {stage === "results" && (
            <div className="absolute inset-0 w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SearchResultsTable />
            </div>
          )}
        </div>

        {/* 3. SEARCH BAR UNIT - Modern Floating/Footer Logic */}
        <div
          className={cn(
            "z-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
            stage === "results"
              ? "py-4 md:py-6 bg-white border-t border-gray-100 px-4"
              : "absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 pt-24"
          )}
        >
          <div
            className={cn(
              "bg-white transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto",
              "w-full md:w-2/3 lg:w-1/2 mx-auto",
              stage === "results"
                ? "rounded-xl border border-gray-200 shadow-lg"
                : "rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            )}
          >
            <SearchBar
              stage={stage}
              onTypingStop={() => setStage("searching")}
              onClear={() => setStage("idle")}
            />

            {/* Results Dropdown/Modal */}
            {stage === "searching" && (
              <div className="max-h-[40vh] md:max-h-[45vh] border-t border-gray-100 overflow-hidden bg-white animate-in slide-in-from-top-2 duration-300">
                <SearchResultsModal onSelect={() => setStage("results")} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default SearchPage;