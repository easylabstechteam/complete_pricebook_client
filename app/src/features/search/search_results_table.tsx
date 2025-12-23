import { useMemo, useState, useEffect } from "react";
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
    <div className="flex items-center gap-1 md:gap-2 h-full font-mono">
      <span className={`text-[10px] md:text-[11px] font-bold ${isCheapest ? "text-black" : "text-slate-500"}`}>
        ${value.toFixed(2)}
      </span>
      {isCheapest && (
        <div className="bg-black text-white border border-black px-1 md:px-1.5 py-0.5 text-[7px] md:text-[9px] font-black tracking-tighter uppercase leading-none">
          Best
        </div>
      )}
    </div>
  );
};

function SearchResultsTable() {
  const { tableResults } = useSearchResultsLogic();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

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
    const formattedRows = allProducts.map((p:any )=> ({
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
      const isName = key.toLowerCase().includes("name");

      // Mobile strategy: Only show name and price by default to avoid clutter
      const isEssential = isPrice || isName || isTrade;

      return {
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(),
        flex: isMobile ? undefined : (isTrade || isName ? 2 : 1),
        width: isMobile ? 140 : undefined,
        rowGroup: isTrade, 
        hide: isTrade || (isMobile && !isEssential),
        cellRenderer: isPrice ? DynamicPriceBadge : null,
        cellClass: isCode || isPrice 
          ? "font-mono tabular-nums text-[10px]" 
          : "font-bold text-black uppercase text-[10px] md:text-[11px]",
      };
    });
  }, [dynamicKeys, isMobile]);

  return (
    <div className="w-full h-screen md:h-[90vh] flex flex-col bg-white border-t-2 border-black overflow-hidden">
      {/* Header - Scaled for screens */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b-2 border-black flex justify-between items-center md:items-end bg-white">
        <div>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-black leading-none">Search Index</h2>
          <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-50 tracking-[0.1em] md:tracking-[0.2em] text-black">Market Extraction</p>
        </div>
        <div className="text-right">
          <span className="text-[8px] md:text-[10px] block font-black opacity-40 uppercase text-black">Total Records</span>
          <span className="text-lg md:text-2xl font-black text-black tabular-nums">{rowData.length}</span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden relative">
        <div className="ag-theme-quartz h-full w-full ag-theme-custom-bw">
          <AgGridReact 
            rowData={rowData} 
            columnDefs={colDefs}
            groupDisplayType="groupRows"
            animateRows={true}
            pagination={true}
            paginationPageSize={isMobile ? 10 : 20}
            paginationPageSizeSelector={[10, 20, 50]}
            suppressMovableColumns={isMobile} // Better for touch scrolling
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              headerClass: "bg-white text-black font-black text-[9px] md:text-[10px] tracking-widest border-b border-black"
            }}
            headerHeight={isMobile ? 40 : 48}
            rowHeight={isMobile ? 48 : 52}
          />
        </div>
      </div>

      <style>{`
        .ag-theme-quartz {
          --ag-border-color: #000;
          --ag-header-background-color: #fff;
          --ag-odd-row-background-color: #fafafa;
          --ag-font-size: ${isMobile ? '10px' : '11px'};
          --ag-font-family: 'Inter', sans-serif;
        }
        .ag-paging-panel {
          border-top: 2px solid black !important;
          font-family: monospace !important;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 9px;
          height: ${isMobile ? '40px' : '45px'} !important;
        }
        .ag-cell-focus { border: none !important; outline: none !important; }
      `}</style>
    </div>
  );
}

export default SearchResultsTable;