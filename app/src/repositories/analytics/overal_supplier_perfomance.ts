import { client } from "@/client/http_client/backend_api";

async function GetSupplierPerformance() {
  
    const response = await client.get("supplier_perfomance");
    return response.data;

};

export { GetSupplierPerformance };
