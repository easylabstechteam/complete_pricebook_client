import { useGlobalState } from "@/store/useGlobalState";

function useSearchResultsLogic() {
  const tableResults = useGlobalState((state: any) => state.tableResults);

  return { tableResults: tableResults };
}; 

export default useSearchResultsLogic
