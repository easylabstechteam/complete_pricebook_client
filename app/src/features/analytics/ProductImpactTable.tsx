import { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAnalyticsLogic } from "@/services/analytics/useAnalyticsLogic";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const DynamicImpactBadge = (params: any) => {
  const val = parseFloat(params.value);
  if (isNaN(val)) return <span>{params.value}</span>;
  const isMvp = val === 0;
  return (
    <div className="flex items-center gap-1 h-full font-mono">
      <div className={`px-1.5 py-0.5 border text-[9px] sm:text-[10px] font-bold tracking-tighter ${isMvp ? "bg-black text-white border-black" : "bg-white text-black border-black"}`}>
        {isMvp ? "🏆" : `+${val.toFixed(1)}%`}
      </div>
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
        headerName: key.replace(/_/g, " ").toUpperCase(),
        flex: isMobile ? undefined : (isTrade ? 2 : 1),
        width: isMobile ? 125 : undefined,
        rowGroup: isTrade,
        hide: isTrade || (isMobile && isSecondary), 
        cellClass: `group ${isPrice || isVariance ? "font-mono tabular-nums text-[10px] sm:text-[11px]" : "font-medium uppercase text-[10px] sm:text-[11px]"}`,
        valueFormatter: isPrice ? (p: any) => `$${parseFloat(p.value).toFixed(2)}` : undefined,
        cellRenderer: isVariance ? DynamicImpactBadge : undefined,
      };
    });
  }, [productImpact, isMobile]);

  return (
    <Card id='product_impact_table' className="h-screen md:h-[90vh] w-full flex flex-col border-none shadow-none rounded-none bg-white overflow-hidden">
      
      <CardHeader className="px-4 py-3 md:px-6 md:py-4 border-b-2 border-black rounded-none bg-white z-10">
        <div className="flex justify-between items-center text-black">
          <div>
            <CardTitle className="text-xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">Performance Audit</CardTitle>
            <CardDescription className="text-black font-bold text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] opacity-50">Automated Benchmarking</CardDescription>
          </div>
          <div className="text-right">
            <span className="text-[8px] font-bold block uppercase opacity-40">Records</span>
            <span className="text-lg md:text-xl font-black tabular-nums">{productImpact?.length || 0}</span>
          </div>
        </div>
      </CardHeader>

      <div className="flex-grow p-0 relative overflow-hidden"> 
        <div className="ag-theme-quartz h-full w-full brutalist-grid">
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
              headerClass: "bg-white text-black font-black text-[9px] tracking-widest border-b border-black"
            }}
            headerHeight={isMobile ? 35 : 45}
            rowHeight={isMobile ? 48 : 52}
          />
        </div>
      </div>

      <style>{`
        .brutalist-grid .ag-row-hover { background-color: #000 !important; color: #fff !important; } 
        .brutalist-grid .ag-row-hover .ag-cell { color: #fff !important; }
        .ag-header-cell-label { justify-content: center; }
      `}</style>
    </Card>
  );
}

export default DynamicProductImpactTable;