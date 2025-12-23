import { useMemo, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community"; 
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";
import { MoreVertical, Info, PackageSearch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const RankingVarianceBadge = (params: any) => {
  const val = parseFloat(params.value);
  const isMvp = val === 0;
  return (
    <div className="flex items-center gap-2 h-full font-mono">
      <div className={`flex items-center px-1.5 sm:px-2 py-0.5 border text-[9px] sm:text-[10px] font-bold tracking-tighter ${isMvp ? "bg-black text-white border-black" : "bg-white text-black border-black"} group-hover:border-white group-hover:bg-white group-hover:text-black transition-colors`}>
        {isMvp ? "🏆 LEADER" : `+${val.toFixed(1)}%`}
      </div>
    </div>
  );
};

const RowActions = (params: any) => {
  const { onFetchImpact } = params.context;
  const rowData = params.data;
  return (
    <div className="flex items-center justify-center h-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded transition-colors group-hover:hover:bg-white/20 outline-none">
          <MoreVertical className="w-4 h-4 text-black group-hover:text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 sm:w-64 font-mono border-2 border-black rounded-none bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[9999]">
          <DropdownMenuItem className="text-[10px] sm:text-[11px] font-bold uppercase cursor-pointer py-3 focus:bg-black focus:text-white" onClick={() => console.log("Supplier Info:", rowData)}>
            <Info className="mr-2 h-4 w-4" /> Supplier Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-black h-[1px]" />
          <DropdownMenuItem className="text-[10px] sm:text-[11px] font-bold uppercase cursor-pointer py-3 focus:bg-black focus:text-white" onClick={() => {
              onFetchImpact.mutate({ Filter: rowData.trade_code });
              document.getElementById("product_impact_table")?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <PackageSearch className="mr-2 h-4 w-4" /> High performing products
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

function SupplierRankingTable() {
  const { supplierRankings, getSupplierRankings, getProductImpact, isLoading } = useAnalyticsLogic();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getSupplierRankings.mutate();
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const gridContext = useMemo(() => ({ onFetchImpact: getProductImpact }), [getProductImpact]);

  const colDefs = useMemo<ColDef[]>(() => {
    if (!supplierRankings || supplierRankings.length === 0) return [];
    
    const baseCols: ColDef[] = Object.keys(supplierRankings[0]).map((key) => {
      const isName = key.toLowerCase().includes("name");
      const isPrice = key.toLowerCase().includes("price") || key.toLowerCase().includes("avg");
      const isVariance = key.toLowerCase().includes("away") || key.toLowerCase().includes("percentage");
      const isSecondary = !isName && !isPrice && !isVariance;

      return {
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(),
        flex: isMobile ? undefined : (isName ? 2 : 1),
        width: isMobile ? 130 : undefined,
        hide: isMobile && isSecondary, // Auto-clean interface for phones
        cellClass: `group ${isName ? "font-bold uppercase text-[10px] sm:text-[11px]" : "font-mono tabular-nums text-[10px] sm:text-[11px]"}`,
        valueFormatter: isPrice ? (p: any) => `$${parseFloat(p.value).toFixed(2)}` : undefined,
        cellRenderer: isVariance ? RankingVarianceBadge : undefined,
      };
    });

    return [...baseCols, {
      headerName: "ACT",
      field: "actions",
      width: isMobile ? 60 : 80,
      pinned: "right",
      resizable: false,
      sortable: false,
      filter: false,
      cellRenderer: RowActions,
      cellClass: "group border-l border-black flex items-center justify-center bg-white sm:bg-transparent",
    }];
  }, [supplierRankings, isMobile]);

  return (
    <Card className="h-screen md:h-[85vh] w-full flex flex-col border-none shadow-none rounded-none bg-white overflow-hidden">
      <CardHeader className="px-4 py-4 md:px-6 md:py-6 border-b-2 border-black rounded-none bg-white">
        <div className="flex justify-between items-center sm:items-end">
          <div className="space-y-0.5 md:space-y-1 text-black">
            <CardTitle className="text-lg sm:text-2xl font-black uppercase tracking-tighter italic leading-tight">Supplier Performance</CardTitle>
            <CardDescription className="text-black font-bold text-[8px] sm:text-xs uppercase tracking-widest opacity-60">Benchmarked Rankings</CardDescription>
          </div>
          <div className="text-right text-black">
            <span className="text-[8px] sm:text-[10px] font-bold block uppercase tracking-widest opacity-40">Records</span>
            <span className="text-lg sm:text-2xl font-black tabular-nums">{isLoading ? "--" : supplierRankings?.length}</span>
          </div>
        </div>
      </CardHeader>
      
      <div className="flex-grow p-0 relative overflow-hidden">
        <div className="ag-theme-quartz h-full w-full brutalist-grid">
          <AgGridReact
            rowData={supplierRankings}
            columnDefs={colDefs}
            context={gridContext}
            loading={isLoading}
            suppressRowClickSelection={true}
            suppressMovableColumns={isMobile}
            defaultColDef={{
              resizable: true, 
              sortable: true, 
              filter: true,
              headerClass: "bg-white text-black font-black text-[9px] sm:text-[10px] tracking-widest border-b border-black",
            }}
            headerHeight={isMobile ? 38 : 45}
            rowHeight={isMobile ? 48 : 52}
          />
        </div>
      </div>
      
      <style>{`
        .brutalist-grid .ag-row-hover { background-color: #000 !important; color: #fff !important; } 
        .brutalist-grid .ag-row-hover .ag-cell { color: #fff !important; }
        .ag-pinned-right-header { border-left: 1px solid black !important; }
      `}</style>
    </Card>
  );
}

export default SupplierRankingTable;