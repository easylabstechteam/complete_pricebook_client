import { useGlobalState } from "@/store/search_store";

function useSearchResultsLogic() {
  const tableResults = useGlobalState((state: any) => state.tableResults);

  return { tableResults: tableResults };
}; 

export default useSearchResultsLogic
