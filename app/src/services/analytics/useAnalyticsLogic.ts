import { useMutation } from "@tanstack/react-query";
import { GetSupplierRanking } from "@/repositories/analytics/GetSupplierRanking";
import { GetProductImpact } from "@/repositories/analytics/GetProductImpact";
import { useAnalyticsState } from "@/store/useAnalyticsState";


function useAnalyticsLogic() {
  const setSupplierRankings = useAnalyticsState((state: any) => state.setSupplierRankings);
  const setProductImpact = useAnalyticsState((state: any) => state.setProductImpact);
  const supplierRankings = useAnalyticsState((state: any) => state.supplierRankings);
  const productImpact = useAnalyticsState((state: any) => state.productImpact);

  const productImpactMutate = useMutation({
    mutationFn: GetProductImpact,
    onSuccess: (response) => setProductImpact(response),
  });

  const supplierRankingMutate = useMutation({
    mutationFn: GetSupplierRanking,
    onSuccess: (response) => setSupplierRankings(response),
  });

  return {
    getSupplierRankings: supplierRankingMutate,
    getProductImpact: productImpactMutate, // Fixed name
    productImpact,
    supplierRankings,
    // Helper to check if either is loading
    isLoading: supplierRankingMutate.isPending || productImpactMutate.isPending
  };
}

export {useAnalyticsLogic}