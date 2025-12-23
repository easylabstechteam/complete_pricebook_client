import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Monochrome Variance Renderer
const DynamicImpactBadge = (params: any) => {
  const val = parseFloat(params.value);
  if (isNaN(val)) return <span>{params.value}</span>;
  
  const isMvp = val === 0;
  return (
    <div className="flex items-center gap-2 h-full font-mono">
      <div className={`
        px-2 py-0.5 border text-[10px] font-bold tracking-tighter
        ${isMvp ? "bg-black text-white border-black" : "bg-white text-black border-black"}
      `}>
        {isMvp ? "🏆 MVP" : `+${val.toFixed(2)}%`}
      </div>
    </div>
  );
};

function DynamicProductImpactTable() {
  const { productImpact} = useAnalyticsLogic();

  const colDefs = useMemo(() => {
    if (!productImpact || productImpact.length === 0) return [];

    // Get all keys from the first object in the data
    const keys = Object.keys(productImpact[0]);

    return keys.map((key) => {
      const isPrice = key.toLowerCase().includes("price") || key.toLowerCase().includes("avg");
      const isVariance = key.toLowerCase().includes("away") || key.toLowerCase().includes("variance");
      const isTrade = key.toLowerCase().includes("trade_name");

      return {
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(), // Format: "trade_name" -> "TRADE NAME"
        flex: isTrade ? 2 : 1,
        rowGroup: isTrade, // Automatically groups by trade if the column exists
        hide: isTrade,     // Hides the flat column to use the Group Row instead
        cellClass: isPrice || isVariance ? "font-mono tabular-nums" : "font-medium uppercase text-[11px]",
        valueFormatter: isPrice ? (p: any) => `$${parseFloat(p.value).toFixed(2)}` : null,
        cellRenderer: isVariance ? DynamicImpactBadge : null,
      };
    });
  }, [productImpact]);

  return (
    <Card id='product_impact_table' className="h-[90vh] w-full flex flex-col border-none shadow-none rounded-none bg-white">
      <CardHeader className="px-6 py-4 border-b-2 border-black rounded-none">
        <div className="flex justify-between items-baseline">
          <div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              Performance Audit
            </CardTitle>
            <CardDescription className="text-black font-bold text-[10px] uppercase tracking-[0.2em] opacity-50">
              Automated Supplier Benchmarking // Data-Driven
            </CardDescription>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <span className="text-[9px] font-bold block uppercase tracking-widest opacity-40">Records</span>
              <span className="text-xl font-black">{productImpact?.length || 0}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="flex-grow"> 
        <div className="ag-theme-quartz h-full w-full">
          <AgGridReact 
            rowData={productImpact} 
            columnDefs={colDefs}
            groupDisplayType="groupRows"
            animateRows={true}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              headerClass: "bg-white text-black font-black text-[10px] tracking-widest border-b border-black"
            }}
            // Layout Settings
            headerHeight={45}
            rowHeight={52}
          />
        </div>
      </div>
    </Card>
  );
}

export default DynamicProductImpactTable;