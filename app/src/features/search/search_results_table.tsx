import React from "react";
import useSearchResultsLogic from "@/services/search/search_results_table";

/**
 * SearchResultsTable
 * This presentation component consumes the final, selected data (tableResults) 
 * from the associated hook (useSearchResultsLogic) and renders it in a structured, 
 * grouped, and fully responsive format (Table view for desktop, Card view for mobile).
 */
function SearchResultsTable() {
  // Hook Integration: Destructures the final, processed data from the logic layer.
  const { tableResults } = useSearchResultsLogic();

  // Guard Clause: If data is null, undefined, or an empty array, render nothing.
  if (!tableResults || tableResults == null || tableResults.length === 0) {
    return null;
  }

  /**
   * Helper function for rendering a single key-value pair used in the mobile card view.
   */
  const renderCardItem = (label, value, className = "") => (
    <div className={`flex justify-between py-1 ${className}`}>
      <span className="font-medium text-gray-500 mr-4">{label}:</span>
      <span className="text-right font-normal text-gray-900">{value}</span>
    </div>
  );

  return (
    // Main Container: Controls the card's overall style and ensures horizontal scrolling
    // is available for the table view on desktop if content is too wide.
    <div className="w-full h-full p-6 bg-white rounded-l shadow-2xl ring-1 ring-gray-300 overflow-x-auto">
      
      {/* DESKTOP/TABLET VIEW (Standard Table) - Visible on screens >= md */}
      <table className="hidden md:table w-full border-collapse">
        <thead>
          {/* Table Header: Sticky to remain visible when scrolling down the results list. */}
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
          {/* Map over the main Trade Groups (Outer Loop) */}
          {tableResults.map((data) => (
            <React.Fragment key={data.trade_code}>
              {/* Parent Row: Trade Group Header - Provides visual grouping and context. */}
              <tr className="bg-gray-50/80 border-b border-gray-200 transition-colors hover:bg-gray-100">
                <td className="py-3 px-4">
                  <div className="flex space-x-2 items-center">
                    <span className="font-bold text-sm text-gray-900">
                      {data.trade_name}
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">
                      {data.trade_code}
                    </span>
                  </div>
                </td>
                <td colSpan={4}></td>
              </tr>
              {/* Nested Rows: Individual Products (Inner Loop) */}
              {data.json_agg.map((p) => (
                <tr
                  key={p.product_id}
                  className="text-sm border-b border-gray-100 cursor-pointer transition-all duration-150 ease-in-out 
                             hover:bg-gray-900 hover:text-white"
                >
                  {/* Empty cell to align products under the main trade group column */}
                  <td className="px-4"></td>
                  <td className="px-4 py-2 group-hover:text-gray-200">
                    {p.product_code}
                  </td>
                  <td className="px-4 py-2 truncate group-hover:text-gray-200">
                    {p.product_name}
                  </td>
                  {/* Currency Formatting: Ensures price is displayed with two decimal places. */}
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

      {/* Mobile View (Card Layout) - Visible on screens < md */}
      <div className="md:hidden space-y-4">
        {/* Map over the main Trade Groups (Outer Loop) */}
        {tableResults.map((data) => (
          <div key={data.trade_code} className="border border-gray-200 rounded-l shadow-sm">
            {/* Trade Group Header (The "Card Group" Title) */}
            <div className="bg-gray-50 p-3 border-b border-gray-200 rounded-t-l">
              <span className="font-bold text-base text-gray-900">
                {data.trade_name}
              </span>
              <span className="text-zinc-500 text-sm font-mono ml-2">
                {data.trade_code}
              </span>
            </div>

            {/* Individual Product Cards (Inner Loop) */}
            <div className="divide-y divide-gray-100">
              {data.json_agg.map((p, index) => (
                <div
                  key={p.product_id}
                  className={`p-3 space-y-1 cursor-pointer transition-all duration-150 ease-in-out 
                              hover:bg-gray-100`}
                >
                  {/* Product Details - Uses the helper function for clean key/value display */}
                  {renderCardItem("Product Name", p.product_name)}
                  {renderCardItem("Product Code", p.product_code)}
                  {/* Applies specific styling to the price item */}
                  {renderCardItem("Price", `$${p.product_price.toFixed(2)}`, "font-bold text-blue-600")}
                  {renderCardItem("Supplier", p.supplier_name, "text-gray-600")}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResultsTable;