import { client } from "@/client/http_client/backend_api";

async function GetOverlSupplierPerfomance() {
  
    const response = await client.get("supplier_perfomance");
    return response.data;

};

export { GetOverlSupplierPerfomance };
