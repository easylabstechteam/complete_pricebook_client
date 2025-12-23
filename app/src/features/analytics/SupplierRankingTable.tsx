import { useMemo, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";
import { MoreHorizontal, Info, PackageSearch, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  
  if (isMvp) {
    return (
      <div className="flex items-center h-full">
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1 text-[10px] font-semibold uppercase">
          <Trophy className="w-3 h-3" /> Leader
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center h-full">
      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-mono text-[10px]">
        +{val.toFixed(1)}%
      </Badge>
    </div>
  );
};

const RowActions = (params: any) => {
  const { onFetchImpact } = params.context;
  const rowData = params.data;
  return (
    <div className="flex items-center justify-center h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
            <MoreHorizontal className="w-4 h-4 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 shadow-lg border-slate-200">
          <DropdownMenuItem className="text-xs py-2.5 cursor-pointer" onClick={() => console.log("Profile:", rowData)}>
            <Info className="mr-2 h-4 w-4 text-slate-400" /> Supplier Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-xs py-2.5 cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50" 
            onClick={() => {
              onFetchImpact.mutate({ Filter: rowData.trade_code });
              document.getElementById("product_impact_table")?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <PackageSearch className="mr-2 h-4 w-4" /> View High Performers
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
        headerName: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        flex: isMobile ? undefined : (isName ? 2 : 1),
        width: isMobile ? 140 : undefined,
        hide: isMobile && isSecondary,
        cellClass: `flex items-center text-sm ${isName ? "font-medium text-slate-900" : "font-mono tabular-nums text-slate-600"}`,
        valueFormatter: isPrice ? (p: any) => `$${parseFloat(p.value).toLocaleString(undefined, {minimumFractionDigits: 2})}` : undefined,
        cellRenderer: isVariance ? RankingVarianceBadge : undefined,
      };
    });

    return [...baseCols, {
      headerName: "",
      field: "actions",
      width: 60,
      pinned: "right",
      resizable: false,
      sortable: false,
      filter: false,
      cellRenderer: RowActions,
      cellClass: "flex items-center justify-center border-l border-slate-50",
    }];
  }, [supplierRankings, isMobile]);

  return (
    <Card className="h-screen md:h-[85vh] w-full flex flex-col border-none shadow-none rounded-none bg-white overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">
              Supplier Rankings
            </CardTitle>
            <CardDescription className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.15em]">
              Market Performance Benchmarking
            </CardDescription>
          </div>
          <div className="bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100 text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Active Entities</span>
            <span className="text-xl font-bold text-slate-700 tabular-nums leading-none">
              {isLoading ? "---" : supplierRankings?.length}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <div className="flex-grow p-0 relative overflow-hidden bg-white">
        <div className="ag-theme-quartz h-full w-full">
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
              headerClass: "text-slate-500 font-semibold text-[11px] uppercase tracking-wider",
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
          --ag-font-size: 13px;
          --ag-font-family: inherit;
        }
        .ag-root-wrapper { border: none !important; }
        .ag-header { border-bottom: 1px solid #e2e8f0 !important; }
      `}</style>
    </Card>
  );
}

export default SupplierRankingTable;