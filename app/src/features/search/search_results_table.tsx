import React from "react";
import { useGlobalState } from "@/store/store";
import type { TradeGroup } from "@/types/store/store.input";

/**
 * SearchResultsTable
 * This component consumes the final, selected data from the global state 
 * (tableResults) and renders it in a structured, grouped table format.
 * It appears only when the data is available (TABLE_VIEW state).
 */
export function SearchResultsTable() {

  // 1. Consume the final, selected search results from the global store.
  // The 'tableResults' state holds the TradeGroup array set after a successful selection mutation.
  const searchResults = useGlobalState((state: any) => state.tableResults) as
    | TradeGroup[]
    | null;

  // 2. Conditional Rendering (Early Exit)
  // If the global state does not contain the final search results, the component renders null,
  // effectively disappearing from the DOM.
  if (!searchResults || searchResults == null) {
    return null;
  }

  // 3. Main Rendering Logic
  // Render the table structure using the available searchResults array.
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-2xl ring-1 ring-gray-300 overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-800 border-b border-gray-300 sticky top-0 z-10 transition-colors">
            <th className="font-semibold text-xs uppercase tracking-wider text-left px-4 py-3">
              Trade Info
            </th>
            <th className="font-semibold text-xs uppercase tracking-wider text-left px-4 py-3">
              Product Code
            </th>
            <th className="font-semibold text-xs uppercase tracking-wider text-left px-4 py-3">
              Product Name
            </th>
            <th className="font-semibold text-xs uppercase tracking-wider text-left px-4 py-3">
              Price
            </th>
            <th className="font-semibold text-xs uppercase tracking-wider text-left px-4 py-3">
              Supplier
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Map over the main Trade Groups */}
          {searchResults.map((tradeGroup) => (
            <React.Fragment key={tradeGroup.trade_code}>
              {/* Parent Row: Displays the Trade Group details and spans the row */}
              <tr className="bg-gray-50/80 border-b border-gray-200 transition-colors hover:bg-gray-100">
                <td className="py-3 px-4">
                  <div className="flex space-x-2 items-center">
                    <span className="font-bold text-sm text-gray-900">
                      {tradeGroup.trade_name}
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">
                      {tradeGroup.trade_code}
                    </span>
                  </div>
                </td>
                <td colSpan={4}></td>
              </tr>
              {/* Nested Rows: Map over the individual products within the Trade Group */}
              {tradeGroup.json_agg.map((p) => (
                <tr
                  key={p.product_id}
                  className="text-sm border-b border-gray-100 cursor-pointer transition-all duration-150 ease-in-out 
                             hover:bg-gray-900 hover:text-white"
                >
                  {/* Empty cell to align products under the main trade group */}
                  <td className="px-4"></td> 
                  <td className="px-4 py-2 group-hover:text-gray-200">
                    {p.product_code}
                  </td>
                  <td className="px-4 py-2 truncate group-hover:text-gray-200">
                    {p.product_name}
                  </td>
                  {/* Display price with currency formatting (assuming product_price is a valid number) */}
                  <td className="px-4 py-2 group-hover:text-gray-200 font-semibold">
                    ${p.product_price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 group-hover:text-gray-400 text-gray-600">
                    {p.supplier_name}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SearchResultsTable;