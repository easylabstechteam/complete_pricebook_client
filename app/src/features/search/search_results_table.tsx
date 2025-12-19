import React, { useMemo } from "react";
import useSearchResultsLogic from "@/services/search/search_results_table";

function SearchResultsTable() {
  const { tableResults } = useSearchResultsLogic();

  const minPrice = useMemo(() => {
    if (!tableResults) return null;
    const allPrices = tableResults.flatMap((group: any) => 
      group.json_agg.map((p: any) => p.product_price)
    );
    return allPrices.length > 0 ? Math.min(...allPrices) : null;
  }, [tableResults]);

  if (!tableResults || tableResults.length === 0) return null;

  return (
    /* h-full and flex-col allow the table header to be sticky while the body scrolls */
    <div className="w-full h-full flex flex-col bg-white">
      <div className="h-full w-full overflow-auto">
        <table className="hidden md:table h-full w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-20 bg-slate-50">
            <tr className=" border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Trade / Product</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Code</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Supplier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableResults.map((data: any) => (
              <React.Fragment key={data.trade_code}>
                {/* Trade Group Header */}
                <tr className="bg-slate-50/50">
                  <td colSpan={4} className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{data.trade_name}</span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">{data.trade_code}</span>
                    </div>
                  </td>
                </tr>
                {/* Product Rows */}
                {data.json_agg.map((p: any) => {
                  const isCheapest = p.product_price === minPrice;
                  return (
                    <tr key={p.product_id} className={`group hover:bg-slate-900 transition-colors ${isCheapest ? "bg-emerald-50/40" : ""}`}>
                      <td className="px-6 py-4 text-sm text-slate-700 group-hover:text-white pl-12">{p.product_name}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-400 group-hover:text-slate-300">{p.product_code}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${isCheapest ? "text-emerald-600 group-hover:text-emerald-400" : "text-slate-900 group-hover:text-white"}`}>
                            ${p.product_price.toFixed(2)}
                          </span>
                          {isCheapest && <span className="text-[10px] font-black text-emerald-600 uppercase group-hover:text-emerald-400">Cheapest</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 group-hover:text-slate-300">{p.supplier_name}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SearchResultsTable;