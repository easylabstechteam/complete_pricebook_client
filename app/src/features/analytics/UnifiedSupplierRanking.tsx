import { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community"; // Added for explicit typing
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";
import {
  Trophy,
  ChevronUp,
  PackageSearch,
  TrendingUp,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- 1. THE NESTED PRODUCT COMPONENT ---
const ProductDetailRow = (p: any) => {
  const { masterData } = p.data;
  const { getProductImpact, productImpact } = useAnalyticsLogic();

  useEffect(() => {
    if (masterData.trade_id && masterData.supplier_id) {
      getProductImpact.mutate({
        trade_id: masterData.trade_id,
        supplier_id: masterData.supplier_id,
      });
    }
  }, [masterData.trade_id, masterData.supplier_id]);

  // Explicitly typing ColDef avoids TS2769
  const detailColDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "product_name",
        headerName: "Product",
        flex: 2,
        cellClass: "font-medium",
      },
      {
        field: "supplier_price",
        headerName: "Price",
        valueFormatter: (x: any) => `$${parseFloat(x.value).toFixed(2)}`,
      },
      {
        field: "market_avg_price",
        headerName: "Mkt Avg",
        valueFormatter: (x: any) => `$${parseFloat(x.value).toFixed(2)}`,
        cellClass: "text-slate-500 font-mono",
      },
      {
        field: "dollar_impact",
        headerName: "Impact ($)",
        cellClass: (x: any) =>
          `font-bold ${
            parseFloat(x.value) > 0 ? "text-red-600" : "text-green-600"
          }`,
        valueFormatter: (x: any) =>
          `${parseFloat(x.value) > 0 ? "+" : ""}$${parseFloat(x.value).toFixed(2)}`,
      },
      {
        field: "pct_variance",
        headerName: "Variance (%)",
        cellRenderer: (x: any) => {
          const val = parseFloat(x.value);
          return (
            <Badge
              variant={val > 0 ? "destructive" : "default"}
              className="text-[10px]"
            >
              {val > 0 ? `+${val}%` : `${val}%`}
            </Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="h-full bg-slate-50/50 p-6 border-y border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Product Analysis: {masterData.supplier_name}
            </h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-tight font-semibold">
              Trade Category: {masterData.trade_name}
            </p>
          </div>
        </div>
        {getProductImpact.isPending && (
          <span className="text-[10px] font-bold text-blue-500 animate-pulse">
            SYNCING DATA...
          </span>
        )}
      </div>

      <div className="ag-theme-quartz h-[240px] shadow-sm rounded-xl overflow-hidden bg-white border border-slate-200">
        <AgGridReact
          rowData={productImpact}
          columnDefs={detailColDefs}
          theme="legacy" 
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
          domLayout="normal"
        />
      </div>
    </div>
  );
};

// --- 2. MAIN SUPPLIER RANKING TABLE ---
function UnifiedSupplierRanking() {
  const { supplierRankings, isLoading, getSupplierRankings } = useAnalyticsLogic();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  useEffect(() => {
    getSupplierRankings.mutate();
  }, []);

  const rowDataWithDetails = useMemo(() => {
    const data: any[] = [];
    supplierRankings?.forEach((row: any) => {
      data.push(row);
      if (expandedRowId === row.trade_code) {
        data.push({
          isDetail: true,
          masterData: row,
          id: `${row.trade_code}-detail`,
        });
      }
    });
    return data;
  }, [supplierRankings, expandedRowId]);

  // FIX: Added <ColDef[]> type to resolve 'pinned' property mismatch
  const colDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "trade_name",
        headerName: "Trade",
        flex: 1,
        cellRenderer: (p: any) => (
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Tag className="w-3 h-3" /> {p.value}
          </div>
        )
      },
      {
        field: "supplier_name",
        headerName: "Supplier",
        flex: 1.5,
        cellClass: "font-bold text-slate-900",
      },
      {
        field: "avg_price",
        headerName: "Avg Price",
        valueFormatter: (p: any) => `$${parseFloat(p.value).toFixed(2)}`,
      },
      {
        field: "percentage_away",
        headerName: "Status",
        cellRenderer: (p: any) =>
          parseFloat(p.value) === 0 ? (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 text-[10px] font-bold">
              <Trophy className="w-3 h-3" /> TRADE LEADER
            </Badge>
          ) : (
            <span className="text-slate-500 font-mono text-xs">
              +{p.value}%
            </span>
          ),
      },
      {
        headerName: "Action",
        width: 170,
        pinned: "right", // This is now correctly typed as "right" | "left"
        cellRenderer: (params: any) => {
          // Guard for detail rows which don't have trade_code
          if (params.data.isDetail) return null;
          
          const isExpanded = expandedRowId === params.data.trade_code;
          return (
            <Button
              variant={isExpanded ? "default" : "outline"}
              size="sm"
              className="h-8 w-full gap-2 text-[11px]"
              onClick={() => setExpandedRowId(isExpanded ? null : params.data.trade_code)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <PackageSearch className="w-4 h-4" />
              )}
              {isExpanded ? "Close" : `View ${params.data.items_in_trade} Items`}
            </Button>
          );
        },
      },
    ],
    [expandedRowId]
  );

  return (
    <Card className="h-full w-full flex flex-col border-none shadow-none bg-white rounded-none">
      <CardHeader className="px-6 py-5 border-b bg-white">
        <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
          Market Rankings
        </CardTitle>
        <CardDescription className="text-xs font-medium text-slate-500">
          Supplier performance benchmarked against trade optimal prices.
        </CardDescription>
      </CardHeader>

      <div className="flex-grow ag-theme-quartz">
        <AgGridReact
          rowData={rowDataWithDetails}
          columnDefs={colDefs}
          getRowId={(p: any) => p.data.id || p.data.trade_code}
          theme="legacy"
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={[5, 10, 20]}
          isFullWidthRow={(params: any) => params.rowNode.data.isDetail}
          fullWidthCellRenderer={ProductDetailRow}
          getRowHeight={(params: any) => (params.data.isDetail ? 360 : 60)}
          animateRows={true}
          loading={isLoading}
        />
      </div>
    </Card>
  );
}

export default UnifiedSupplierRanking;