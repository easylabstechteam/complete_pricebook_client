import { useMutation } from "@tanstack/react-query";
import { GetOverlSupplierPerfomance } from "@/repositories/analytics/overal_supplier_perfomance";
import { useGlobalState } from "@/store/store";

export function OveralSupplier() {
  const supplierPerformance = useGlobalState(
    (state:any) => state.setSupplierPerformance
  );

  const mutation = useMutation({
    mutationFn: () => GetOverlSupplierPerfomance(),

    onSuccess: (response) => {
      // update global state
      supplierPerformance(response);
    },
  });

  return mutation;
}
