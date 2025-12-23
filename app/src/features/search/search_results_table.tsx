import { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import useSearchResultsLogic from "@/services/search/useSearchResultsLogic";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

// Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const DynamicPriceBadge = (params: any) => {
  const isCheapest = params.data?.is_cheapest_global;
  const value = parseFloat(params.value);
  if (isNaN(value)) return <span className="text-slate-400">{params.value}</span>;
  
  return (
    <div className="flex items-center gap-2 h-full">
      <span className={isCheapest ? "font-bold text-slate-900" : "font-medium text-slate-600 font-mono"}>
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
      {isCheapest && (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 h-5 px-1.5 gap-0.5 text-[9px] font-bold uppercase tracking-wide">
          <Check className="w-2.5 h-2.5" /> Best
        </Badge>
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

    const prices = allProducts.map((p: any) => p.product_price || p.price || Infinity);
    const minPrice = Math.min(...prices);
    
    const formattedRows = allProducts.map((p:any )=> ({
      ...p,
      is_cheapest_global: (p.product_price || p.price) === minPrice && minPrice !== Infinity
    }));

    const keys = Object.keys(allProducts[0] || {});
    return { rowData: formattedRows, dynamicKeys: keys };
  }, [tableResults]);

  const colDefs = useMemo(() => {
    return dynamicKeys.map((key) => {
      const isTrade = key.includes("trade_name");
      const isPrice = key.toLowerCase().includes("price");
      const isCode = key.toLowerCase().includes("code");
      const isName = key.toLowerCase().includes("name");

      return {
        field: key,
        headerName: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        flex: isMobile ? undefined : (isTrade || isName ? 2 : 1),
        width: isMobile ? 150 : undefined,
        rowGroup: isTrade, 
        hide: isTrade || (isMobile && !(isPrice || isName)),
        cellRenderer: isPrice ? DynamicPriceBadge : null,
        cellClass: `flex items-center text-sm ${
          isCode || isPrice ? "font-mono tabular-nums text-slate-500" : "font-medium text-slate-900"
        }`,
      };
    });
  }, [dynamicKeys, isMobile]);

  return (
    <div className="w-full h-screen md:h-[90vh] flex flex-col bg-white border-t border-slate-100 overflow-hidden">
      
      {/* Professional Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-end bg-white">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Search Index</h2>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Global Market Intelligence</p>
        </div>
        <div className="bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100 text-right">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Entries Found</span>
          <span className="text-xl font-bold text-slate-700 tabular-nums leading-none">{rowData.length}</span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden relative">
        <div className="ag-theme-quartz h-full w-full">
          <AgGridReact 
            rowData={rowData} 
            columnDefs={colDefs}
            groupDisplayType="groupRows"
            animateRows={true}
            pagination={true}
            paginationPageSize={20}
            suppressMovableColumns={isMobile}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              headerClass: "text-slate-500 font-semibold text-[11px] uppercase tracking-wider"
            }}
            headerHeight={48}
            rowHeight={52}
          />
        </div>
      </div>

      <style>{`
        .ag-theme-quartz {
          --ag-border-color: #f1f5f9;
          --ag-header-background-color: #f8fafc;
          --ag-row-hover-color: #f8fafc;
          --ag-selected-row-background-color: #eff6ff;
          --ag-font-size: 13px;
          --ag-font-family: inherit;
        }
        .ag-header {
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .ag-paging-panel {
          border-top: 1px solid #e2e8f0 !important;
          color: #64748b !important;
          font-weight: 500;
          font-size: 12px;
        }
        .ag-root-wrapper {
          border: none !important;
        }
      `}</style>
    </div>
  );
}

export default SearchResultsTable;