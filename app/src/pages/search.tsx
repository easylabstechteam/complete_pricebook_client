import { useState } from "react";
import SearchBar from "@/features/search/search_bar";
import SearchResultsTable from "@/features/search/search_results_table";
import AppShell from "@/pages/layouts/app_shell";
import SearchResultsModal from "@/features/search/search_results_modal";

function SearchPage() {
  const [stage, setStage] = useState<"idle" | "searching" | "results">("idle");

  return (
    <AppShell>
      <div className="relative h-full w-full flex flex-col overflow-hidden bg-white">
        
        {/* 1. TOP AREA: Title Block */}
        <div
          className={`
            z-0 transition-all duration-500 ease-in-out px-6
            ${
              stage === "results"
                ? "pt-6 md:pt-10 pb-4"
                : "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-48 md:pb-64"
            }
          `}
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase leading-none">
              Complete Price Book
            </h1>
            <p className="text-slate-500 text-xs md:text-lg mt-2 font-bold uppercase tracking-[0.2em]">
              Search trade rates and inventory
            </p>
          </div>
        </div>

        {/* 2. CENTER AREA: Table */}
        <div className="flex-1 w-full min-h-0 relative">
          {stage === "results" && (
            <div className="absolute inset-0 w-full h-full animate-in fade-in duration-500">
              <SearchResultsTable />
            </div>
          )}
        </div>

        {/* 3. SEARCH BAR UNIT - Z-INDEX LOWERED TO z-10 */}
        <div
          className={`
            z-10 transition-all duration-500 ease-in-out px-4
            ${
              stage === "results"
                ? "py-4 md:py-6 bg-white border-t-2 border-black"
                : "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-24 md:pt-32"
            }
          `}
        >
          <div
            className={`
              bg-white transition-all duration-500 ease-in-out overflow-hidden pointer-events-auto
              /* Responsive Width: Full on mobile, half/third on desktop */
              w-full md:w-2/3 lg:w-1/2 mx-auto
              ${
                stage === "results"
                  ? "rounded-none md:rounded-xl border-t md:border-2 border-black shadow-none md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              }
            `}
          >
            <SearchBar
              stage={stage}
              onTypingStop={() => setStage("searching")}
              onClear={() => setStage("idle")}
            />

            {stage === "searching" && (
              <div className="h-[40vh] md:h-[45vh] border-t-2 border-black overflow-y-auto bg-white">
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