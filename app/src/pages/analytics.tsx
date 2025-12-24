// TODO  This page will host analytics features/components.
// import DynamicProductImpactTable from "@/features/analytics/ProductImpactTable";
import UnifiedSupplierTable from "@/features/analytics/UnifiedSupplierRanking";
import AppShell from "@/pages/layouts/app_shell";


function AnalyticsPage() {
  return (
    <AppShell>
      <UnifiedSupplierTable />
    </AppShell>
  );
}; 

export default AnalyticsPage;
