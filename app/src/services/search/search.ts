import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { PostSearch } from "@/repositories/search/search";
import { useGlobalState } from "@/store/search_store";
import type { SearchInput } from "@/types/search/searchType.input";

/**
 * useSearchLogic
 * Manages the user input state, mutation logic, and global state updates for the initial search.
 */
function useSearchLogic() {
  const [data, setData] = useState("");
  const isQueryEmpty = useMemo(() => data.trim().length === 0, [data]);

  const setInitialResult = useGlobalState((state: any) => state.setInitialResults);

  const mutation = useMutation({
    mutationFn: () => {
      const userInput: SearchInput = { query: data };
      return PostSearch(userInput);
    },
    onSuccess: (response: any) => {
      setInitialResult(response);
    },
    onError: (error: any) => {
      console.error(error.message);
    },
  });

  function UpdateQuery(e: React.ChangeEvent<HTMLInputElement>) {
    // Clear results immediately when typing starts so UI can react
    setInitialResult(null); 
    setData(e.target.value);
  }

  function handleSearch() {
    if (!isQueryEmpty) {
      mutation.mutate();
    }
  }

  return {
    value: data,
    onChange: UpdateQuery,
    setValue: setData, // Added for clearing
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSearch();
    },
    handleSearch,
    isQueryEmpty,
    isLoading: mutation.isPending, // Map React Query state to UI
  };
}; 

// Export the hook with an alias for cleaner import
export { useSearchLogic };
