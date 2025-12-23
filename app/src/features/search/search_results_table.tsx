import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import useSearchResultsLogic from "@/services/search/useSearchResultsLogic";

// Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const DynamicPriceBadge = (params: any) => {
  const isCheapest = params.data?.is_cheapest_global;
  const value = parseFloat(params.value);
  if (isNaN(value)) return <span>{params.value}</span>;
  
  return (
    <div className="flex items-center gap-2 h-full font-mono">
      <span className={`text-[11px] font-bold ${isCheapest ? "text-black" : "text-slate-500"}`}>
        ${value.toFixed(2)}
      </span>
      {isCheapest && (
        <div className="bg-black text-white border border-black px-1.5 py-0.5 text-[9px] font-black tracking-tighter uppercase">
          Best Price
        </div>
      )}
    </div>
  );
};

function SearchResultsTable() {
  const { tableResults } = useSearchResultsLogic();

  const { rowData, dynamicKeys } = useMemo(() => {
    if (!tableResults || tableResults.length === 0) return { rowData: [], dynamicKeys: [] };

    const allProducts = tableResults.flatMap((group: any) => 
      group.json_agg.map((p: any) => ({
        ...p,
        trade_name: group.trade_name,
        trade_code: group.trade_code,
      }))
    );

    const minPrice = Math.min(...allProducts.map((p: any) => p.product_price || p.price || 0));
    const formattedRows = allProducts.map(p => ({
      ...p,
      is_cheapest_global: (p.product_price || p.price) === minPrice
    }));

    const keys = Object.keys(allProducts[0]);
    return { rowData: formattedRows, dynamicKeys: keys };
  }, [tableResults]);

  const colDefs = useMemo(() => {
    return dynamicKeys.map((key) => {
      const isTrade = key.includes("trade_name");
      const isPrice = key.toLowerCase().includes("price");
      const isCode = key.toLowerCase().includes("code");

      return {
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(),
        flex: isTrade || key.includes("name") ? 2 : 1,
        rowGroup: isTrade, 
        hide: isTrade,
        cellRenderer: isPrice ? DynamicPriceBadge : null,
        cellClass: isCode || isPrice 
          ? "font-mono tabular-nums text-[10px]" 
          : "font-bold text-black uppercase text-[11px]",
      };
    });
  }, [dynamicKeys]);

  return (
    <div className="w-full h-[90vh] flex flex-col bg-white border-t-2 border-black">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-black flex justify-between items-end bg-white">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Search Index</h2>
          <p className="text-[10px] font-bold uppercase opacity-50 tracking-[0.2em] text-black">Market Extraction // Dynamic Columns</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] block font-black opacity-40 uppercase text-black">Total Records</span>
          <span className="text-2xl font-black text-black">{rowData.length}</span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="ag-theme-quartz h-full w-full ag-theme-custom-bw">
          <AgGridReact 
            rowData={rowData} 
            columnDefs={colDefs}
            groupDisplayType="groupRows"
            animateRows={true}
            // --- Pagination Settings ---
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            // ---------------------------
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              headerClass: "bg-white text-black font-black text-[10px] tracking-widest border-b border-black"
            }}
            headerHeight={48}
            rowHeight={52}
          />
        </div>
      </div>

      {/* Since your search bar is at the bottom, the pagination info 
          will naturally sit just above it in the AG-Grid footer */}
      <style>{`
        .ag-theme-quartz {
          --ag-border-color: #000;
          --ag-header-background-color: #fff;
          --ag-odd-row-background-color: #fafafa;
          --ag-font-size: 11px;
          --ag-font-family: 'Inter', sans-serif;
        }
        .ag-paging-panel {
          border-top: 2px solid black !important;
          font-family: monospace !important;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}

export default SearchResultsTable;