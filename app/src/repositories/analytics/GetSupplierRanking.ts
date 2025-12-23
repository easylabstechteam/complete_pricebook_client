import { client } from "@/client/http_client/backend_api";
import type { SupplierComparisonInput } from "@/types/analytics/SupplierComparisonInput";

async function GetSupplierRanking() {
  const response = await client.get(
    "supplier_performance/supplierTradePerformance"
  );
  return response.data;
}

export { GetSupplierRanking };
