import { useUploadState } from "@/store/useUploadState";

function ViewUploadedContents() {
  const excelFile: {
    supplier_name: string;
    supplier_allocated_trade_code: string | number;
    supplier_brand?: string;
    product_name: string;
    product_description?: string;
    product_code?: string;
    product_price: number;
    product_unit_measure: string;
    effective_date: string;
    due_to_update_price: string;
    storage_type?: string;
    hazardous?: boolean;
    material_grade: string; // ( AS/NZ)
    type_of_product: string; // ( material/ product/ service),
    compliance_standard: string;
    product_length?: number;
    product_width?: number;
    product_thickness?: number;
    product_weight_unit_measure?: string; // (kg/m etc....)
  }[] = useUploadState((state: any) => state.excelFile);
  if (!excelFile) {
    return null;
  }

  const tableHead = [
    "Supplier Name", "Trade Code", "Brand", "Product Name", "Description", 
    "Code", "Price", "Unit", "Effective Date", "Update Date", 
    "Storage", "Haz", "Grade", "Type", "Compliance", "L", "W", "T", "Weight Unit"
  ];

  return (
    <div className="flex-1 overflow-auto border border-stone-200 rounded-xl bg-white shadow-inner">
      <table className="w-full text-left border-collapse min-w-[1800px]">
        <thead className="sticky top-0 bg-stone-100 z-20 shadow-sm">
          <tr>
            {tableHead.map((header, i) => (
              <th key={i} className="px-4 py-3 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {excelFile.map((item: any, idx: number) => (
            <tr key={idx} className="hover:bg-stone-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-stone-900">{item.supplier_name}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.supplier_allocated_trade_code}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.supplier_brand}</td>
              <td className="px-4 py-3 text-sm font-semibold text-stone-900">{item.product_name}</td>
              <td className="px-4 py-3 text-sm text-stone-500 truncate max-w-[200px]">{item.product_description}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.product_code}</td>
              <td className="px-4 py-3 text-sm font-bold text-green-700">${item.product_price}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.product_unit_measure}</td>
              <td className="px-4 py-3 text-sm text-stone-500">{item.effective_date}</td>
              <td className="px-4 py-3 text-sm text-stone-500">{item.due_to_update_price}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.storage_type}</td>
              <td className="px-4 py-3 text-sm text-center">{item.hazardous ? "⚠️" : "No"}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.material_grade}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.type_of_product}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.compliance_standard}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.product_length}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.product_width}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.product_thickness}</td>
              <td className="px-4 py-3 text-sm text-stone-600">{item.product_weight_unit_measure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export  {ViewUploadedContents};
