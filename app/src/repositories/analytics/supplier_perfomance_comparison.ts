import { client } from "@/client/http_client/backend_api";
import  type {SupplierComparisonInput} from '@/types/analytics/supplier_comparison.input'


async function SupplierComparison(input: SupplierComparisonInput) {

    const response = await client.post("supplier_perfomance/compare", input);
    return response.data;

};

export { SupplierComparison };



