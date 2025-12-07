import { useMutation } from "@tanstack/react-query";
import { SupplierComparison } from "@/repositories/analytics/supplier_perfomance_comparison";
import { useGlobalState } from "@/store/store";

export function useSupplierComparison() {
  const setComparisonPerformance = useGlobalState(
    (state) => state.setComparisonPerformance
  );

  const mutation = useMutation({
    mutationFn: (userInput: any) => SupplierComparison(userInput),

    onSuccess: (response) => {
      // update global state
      setComparisonPerformance(response);
    },
  });

  return mutation;
}; 



