import { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";
import { Badge } from "@/components/ui/badge"; // Assuming Shadcn UI

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const DynamicImpactBadge = (params: any) => {
  const val = parseFloat(params.value);
  if (isNaN(val)) return <span className="text-muted-foreground">{params.value}</span>;
  
  const isMvp = val === 0;
  
  return (
    <div className="flex items-center h-full">
      <Badge 
        variant={isMvp ? "default" : "secondary"} 
        className={`text-[10px] px-2 py-0 font-medium ${isMvp ? "bg-primary" : "bg-slate-100 text-slate-700 border-none"}`}
      >
        {isMvp ? "Optimal" : `+${val.toFixed(1)}%`}
      </Badge>
    </div>
  );
};

function DynamicProductImpactTable() {
  const { productImpact } = useAnalyticsLogic();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const colDefs = useMemo<ColDef[]>(() => {
    if (!productImpact || productImpact.length === 0) return [];
    const keys = Object.keys(productImpact[0]);

    return keys.map((key): ColDef => {
      const isPrice = key.toLowerCase().includes("price") || key.toLowerCase().includes("avg");
      const isVariance = key.toLowerCase().includes("away") || key.toLowerCase().includes("variance");
      const isTrade = key.toLowerCase().includes("trade_name");
      const isSecondary = !isPrice && !isVariance && !isTrade;

      return {
        field: key,
        headerName: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        flex: isMobile ? undefined : (isTrade ? 2 : 1),
        width: isMobile ? 140 : undefined,
        rowGroup: isTrade,
        hide: isTrade || (isMobile && isSecondary), 
        cellClass: `flex items-center text-sm ${isPrice || isVariance ? "font-mono tabular-nums text-slate-600" : "text-slate-900"}`,
        valueFormatter: isPrice ? (p: any) => `$${parseFloat(p.value).toLocaleString(undefined, {minimumFractionDigits: 2})}` : undefined,
        cellRenderer: isVariance ? DynamicImpactBadge : undefined,
      };
    });
  }, [productImpact, isMobile]);

  return (
    <Card id='product_impact_table' className="h-screen md:h-[90vh] w-full flex flex-col border-none shadow-sm rounded-lg bg-card overflow-hidden">
      
      <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">
              Product Impact Analysis
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Real-time Performance Metrics
            </CardDescription>
          </div>
          <div className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Total Entries</span>
            <span className="text-lg font-bold text-slate-700 tabular-nums leading-none">
              {productImpact?.length || 0}
            </span>
          </div>
        </div>
      </CardHeader>

      <div className="flex-grow p-0 relative overflow-hidden bg-white"> 
        <div className="ag-theme-quartz h-full w-full">
          <AgGridReact 
            rowData={productImpact} 
            columnDefs={colDefs}
            groupDisplayType="groupRows"
            animateRows={true}
            suppressMovableColumns={isMobile}
            defaultColDef={{
              sortable: true, 
              filter: true, 
              resizable: true,
              headerClass: "text-slate-500 font-semibold text-[11px] uppercase tracking-wider"
            }}
            headerHeight={48}
            rowHeight={isMobile ? 52 : 48}
          />
        </div>
      </div>

      <style>{`
        /* Professional UI Refinements */
        .ag-theme-quartz {
          --ag-border-color: #f1f5f9;
          --ag-header-background-color: #f8fafc;
          --ag-row-hover-color: #f1f5f9;
          --ag-selected-row-background-color: #eff6ff;
          --ag-font-size: 13px;
          --ag-font-family: inherit;
        }
        .ag-header-cell-label { justify-content: flex-start; }
        .ag-root-wrapper { border: none !important; }
      `}</style>
    </Card>
  );
}

export default DynamicProductImpactTable;