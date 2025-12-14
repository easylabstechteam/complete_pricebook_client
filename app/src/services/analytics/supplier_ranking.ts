import { useMutation } from "@tanstack/react-query";
import { GetSupplierPerformance } from "@/repositories/analytics/overal_supplier_perfomance";
import { useAnalyticsState } from "@/store/analytics_store";

function useAnalyticsLogic() {
  const supplierPerformance = useAnalyticsState(
    (state: any) => state.setSupplierPerformance
  );

  const supplierRanking = useAnalyticsState(
    (state: any) => state.supplierRankings
  );

  const mutation = useMutation({
    mutationFn: () => GetSupplierPerformance(),

    onSuccess: (response) => {
      // update global state
      supplierPerformance(response);
    },
  });
  // TODO :: re-write the output object values
  return {
    mutation,
    supplierRanking: supplierRanking,
    setSupplierPerformance: supplierPerformance,
  };
}

export { useAnalyticsLogic };
