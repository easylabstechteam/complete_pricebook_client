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
      z-20 transition-all duration-500 ease-in-out
      ${
        stage === "results"
          ? "pt-10 pb-4"
          : stage === "searching"
          ? "absolute inset-x-0 top-[10vh] flex flex-col items-center pointer-events-none"
          : "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-40"
      }
    `}
        >
          <div className="text-center px-6">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              Complete Price Book
            </h1>
            <p className="text-slate-500 text-lg mt-2">
              Search trade rates and supplier inventory.
            </p>
          </div>
        </div>

        {/* 2. CENTER AREA: Table */}
        <div className="flex-1 w-full min-h-0 relative">
          {stage === "results" && (
            <div className="absolute inset-0 w-full mx-auto h-full animate-in fade-in duration-500">
              <SearchResultsTable />
            </div>
          )}
        </div>

        {/* 3. BOTTOM AREA: Search Bar Unit */}
        <div
          className={`
        z-50 transition-all duration-500 ease-in-out
        ${
          stage === "results"
            ? "py-6 bg-white"
            : stage === "searching"
            ? "absolute inset-x-0 top-[25vh] flex flex-col items-center pointer-events-none"
            : "absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-40"
        }
      `}
        >
          <div
            className={`
          bg-white w-1/3 mx-auto transition-all duration-500 ease-in-out overflow-hidden pointer-events-auto
          ${
            stage === "results"
              ? "rounded-xl border border-slate-200"
              : "rounded-2xl border border-slate-200"
          }
        `}
          >
            <SearchBar
              stage={stage}
              onTypingStop={() => setStage("searching")}
              onClear={() => setStage("idle")}
            />

            {stage === "searching" && (
              <div className="h-[45vh] border-t border-slate-100 overflow-y-auto">
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
