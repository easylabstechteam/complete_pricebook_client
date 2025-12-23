import { client } from "@/client/http_client/backend_api";

async function GetProductImpact({
  trade_id,
  supplier_id,
}: {
  trade_id: string;
  supplier_id: string;
}) {
  const response = await client.post(
    "supplier_performance/productPerformance",
    { trade_id, supplier_id }
  );
  return response.data;
}

export { GetProductImpact };
