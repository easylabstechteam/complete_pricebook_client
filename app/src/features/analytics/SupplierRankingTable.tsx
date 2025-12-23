import { useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";

import { MoreVertical, Info, PackageSearch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// 1. Monochrome Renderer for Variance
const RankingVarianceBadge = (params: any) => {
  const val = parseFloat(params.value);
  const isMvp = val === 0;

  return (
    <div className="flex items-center gap-2 h-full font-mono">
      <div
        className={`
        flex items-center px-2 py-0.5 border text-[10px] font-bold tracking-tighter
        ${
          isMvp
            ? "bg-black text-white border-black"
            : "bg-white text-black border-black"
        }
        group-hover:border-white group-hover:bg-white group-hover:text-black transition-colors
      `}
      >
        {isMvp ? "🏆 MARKET LEADER" : `+${val.toFixed(2)}%`}
      </div>
    </div>
  );
};

// 2. Custom Cell Renderer for the Actions Menu
const RowActions = (params: any) => {
  const { onFetchImpact } = params.context;
  const rowData = params.data;

  return (
    <div className="flex items-center justify-center h-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded transition-colors group-hover:hover:bg-white/20 outline-none">
          <MoreVertical className="w-4 h-4 text-black group-hover:text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 font-mono border-2 border-black rounded-none bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <DropdownMenuItem
            className="text-[11px] font-bold uppercase cursor-pointer py-3 focus:bg-black focus:text-white"
            onClick={() => console.log("Supplier Info:", rowData)}
          >
            <Info className="mr-2 h-4 w-4" />
            Supplier Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-black h-[1px]" />
          <DropdownMenuItem
            className="text-[11px] font-bold uppercase cursor-pointer py-3 focus:bg-black focus:text-white"
            onClick={() => {
              onFetchImpact.mutate({ Filter: rowData.trade_code });
              
              const targetElement = document.getElementById("product_impact_table");
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <PackageSearch className="mr-2 h-4 w-4" />
            high performing products prices
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

function SupplierRankingTable() {
  const { supplierRankings, getSupplierRankings, getProductImpact, isLoading } =
    useAnalyticsLogic();

  useEffect(() => {
    getSupplierRankings.mutate();
  }, []);

  const gridContext = useMemo(
    () => ({
      onFetchImpact: getProductImpact,
    }),
    [getProductImpact]
  );

  const colDefs = useMemo(() => {
    if (!supplierRankings || supplierRankings.length === 0) return [];

    const baseCols = Object.keys(supplierRankings[0]).map((key) => {
      const isName = key.toLowerCase().includes("name");
      const isPrice = key.toLowerCase().includes("price") || key.toLowerCase().includes("avg");
      const isVariance = key.toLowerCase().includes("away") || key.toLowerCase().includes("percentage");

      return {
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(),
        flex: isName ? 2 : 1,
        cellClass: `group ${
          isName ? "font-bold uppercase text-[11px]" : "font-mono tabular-nums text-[11px]"
        }`,
        valueFormatter: isPrice ? (p: any) => `$${parseFloat(p.value).toFixed(2)}` : null,
        cellRenderer: isVariance ? RankingVarianceBadge : null,
      };
    });

    return [
      ...baseCols,
      {
        headerName: "ACTIONS",
        field: "actions",
        width: 100,
        pinned: "right" as const,
        resizable: false,
        sortable: false,
        filter: false,
        cellRenderer: RowActions,
        cellClass: "group border-l border-black flex items-center justify-center",
      },
    ];
  }, [supplierRankings]);

  return (
    <Card className="h-[85vh] w-full flex flex-col border-none shadow-none rounded-none bg-white">
      <CardHeader className="px-6 py-6 border-b-2 border-black rounded-none bg-white">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">
              Supplier Trade Performance
            </CardTitle>
            <CardDescription className="text-black font-medium text-xs uppercase tracking-widest opacity-60">
              Rankings based on Trade Code Benchmarks
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold block uppercase tracking-widest opacity-40">
              Records Found
            </span>
            <span className="text-2xl font-black tabular-nums">
              {isLoading ? "--" : supplierRankings?.length}
            </span>
          </div>
        </div>
      </CardHeader>

      <div className="flex-grow p-0 relative">
        <div className="ag-theme-quartz h-full w-full brutalist-grid">
          <AgGridReact
            rowData={supplierRankings}
            columnDefs={colDefs}
            context={gridContext}
            loading={isLoading}
            rowHoverable={true}
            suppressRowClickSelection={true}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
              headerClass:
                "bg-white text-black font-black text-[10px] tracking-widest border-b border-black",
            }}
            headerHeight={45}
            rowHeight={52}
          />
        </div>
      </div>

      {/* Scoped Brutalist Hover Styling */}
      <style>{`
        .brutalist-grid .ag-row-hover {
          background-color: #000 !important;
          color: #fff !important;
        }
        .brutalist-grid .ag-row-hover .ag-cell {
          color: #fff !important;
        }
        .brutalist-grid .ag-row-hover .text-black, 
        .brutalist-grid .ag-row-hover .text-slate-500 {
          color: #fff !important;
        }
      `}</style>
    </Card>
  );
}

export default SupplierRankingTable;