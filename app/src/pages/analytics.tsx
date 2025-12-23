// TODO :: This page will host analytics features/components.
import DynamicProductImpactTable from "@/features/analytics/ProductImpactTable";
import SupplierRankingTable from "@/features/analytics/SupplierRankingTable";
import AppShell from "@/pages/layouts/app_shell";

function AnalyticsPage() {
  return (
    <AppShell>
      <SupplierRankingTable />
      <DynamicProductImpactTable />
    </AppShell>
  );
}

export default AnalyticsPage;
