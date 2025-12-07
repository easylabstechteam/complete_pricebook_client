import { useMutation } from "@tanstack/react-query";
import { useGlobalState } from "@/store/store";
import { PostSelectedSearchResult } from "@/repositories/search/search.selected.result";
import type { SearchModalInput } from "@/types/search/searchModal.input";

/**
 * Custom hook to handle the selection of a search result item, 
 * triggering the final data fetch (mutation), and updating the global state.
 */
export function useSearchModalLogic() {
  // 1. Get State Setters UNCONDITIONALLY inside the hook
  const setTableResults = useGlobalState((state: any) => state.setTableResults);
  const setInitialResults = useGlobalState((state: any) => state.setInitialResults);

  // 2. API MUTATION HOOK (Final Data Fetch)
  const selectMutation = useMutation({
    mutationFn: (userSelection: any) => PostSelectedSearchResult(userSelection),

    onSuccess: (response: any) => {
      console.log({ message: "success", APIResponse: response });
      
      // Cleanup: Remove the results that triggered the modal
      setInitialResults(null); 

      // Set the final data for the table component
      setTableResults(response);
    },
    onError: (error) =>
      console.error({ message: error.message, cause: error.cause }),
  });

  // 3. HANDLER FUNCTION: This is what the component will call
  const handleSelect = (item: SearchModalInput) => {
    // Construct the payload for the API request based on the selected item
    const Data = {
      query: {
        type: item?.type,
        id: item?.data.id,
        name: item?.data.name,
      },
      pagination: {
        page: 1,
        limit: 20,
      },
    };
    // Trigger the mutation to fetch the final table data
    selectMutation.mutate(Data);
  };
  
  // Return the handler function and the mutation status (for 'Loading...' text)
  return { handleSelect: handleSelect, isPending: selectMutation.isPending };
}