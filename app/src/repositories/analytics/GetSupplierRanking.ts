import { client } from "@/client/http_client/backend_api";


async function GetSupplierRanking() {
  const response = await client.get(
    "supplier_performance/supplierTradePerformance"
  );
  return response.data;
}

export { GetSupplierRanking };
