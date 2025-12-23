// TODO :: This page will host analytics features/components.
import ProductImpactTable from "@/features/analytics/ProductImpactTable";
import SupplierRankingTable from "@/features/analytics/SupplierRankingTable";
import AppShell from "@/pages/layouts/app_shell";

function AnalyticsPage() {
  return (
    <AppShell>
      <SupplierRankingTable />
      <ProductImpactTable />
    </AppShell>
  );
}

export default AnalyticsPage;
