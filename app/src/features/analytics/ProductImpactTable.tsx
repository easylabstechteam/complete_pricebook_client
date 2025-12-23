import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
// 1. IMPORT ColDef
import { ColDef } from "ag-grid-community"; 
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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
  const { productImpact } = useAnalyticsLogic();

  // 2. EXPLICITLY TYPE THE useMemo as ColDef[]
  const colDefs = useMemo<ColDef[]>(() => {
    if (!productImpact || productImpact.length === 0) return [];

    const keys = Object.keys(productImpact[0]);

    return keys.map((key): ColDef => { // 3. TYPE THE MAP RETURN
      const isPrice = key.toLowerCase().includes("price") || key.toLowerCase().includes("avg");
      const isVariance = key.toLowerCase().includes("away") || key.toLowerCase().includes("variance");
      const isTrade = key.toLowerCase().includes("trade_name");

      return {
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(),
        flex: isTrade ? 2 : 1,
        // Only use rowGroup if you have AG-Grid Enterprise
        rowGroup: isTrade, 
        hide: isTrade,     
        cellClass: `group ${isPrice || isVariance ? "font-mono tabular-nums text-[11px]" : "font-medium uppercase text-[11px]"}`,
        valueFormatter: isPrice ? (p: any) => `$${parseFloat(p.value).toFixed(2)}` : undefined,
        cellRenderer: isVariance ? DynamicImpactBadge : undefined,
      };
    });
  }, [productImpact]);

  return (
    <Card id='product_impact_table' className="h-[90vh] w-full flex flex-col border-none shadow-none rounded-none bg-white">
      <CardHeader className="px-6 py-4 border-b-2 border-black rounded-none">
        <div className="flex justify-between items-baseline">
          <div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter italic">
              Performance Audit
            </CardTitle>
            <CardDescription className="text-black font-bold text-[10px] uppercase tracking-[0.2em] opacity-50">
              Automated Supplier Benchmarking // Data-Driven
            </CardDescription>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <span className="text-[9px] font-bold block uppercase tracking-widest opacity-40">Records</span>
              <span className="text-xl font-black tabular-nums">{productImpact?.length || 0}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="flex-grow p-0 relative"> 
        <div className="ag-theme-quartz h-full w-full brutalist-grid">
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
            headerHeight={45}
            rowHeight={52}
          />
        </div>
      </div>

      <style>{`
        .brutalist-grid .ag-row-hover {
          background-color: #000 !important;
          color: #fff !important;
        }
        .brutalist-grid .ag-row-hover .ag-cell {
          color: #fff !important;
          border-right: 1px solid #333 !important;
        }
      `}</style>
    </Card>
  );
}

export default DynamicProductImpactTable;