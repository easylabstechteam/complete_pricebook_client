import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { PostSearch } from "@/repositories/search/search";
import { useGlobalState } from "@/store/store";
import type { SearchInput } from "@/types/search/searchType.input";

/**
 * useSearchLogic
 * Manages the user input state, mutation logic, and global state updates for the initial search.
 */
function useSearchLogic() {
  // 1. INPUT STATE MANAGEMENT (Moved from SearchBar.tsx)
  const [data, setData] = useState("");
  const isQueryEmpty = useMemo(() => data.trim().length === 0, [data]);

  // 2. GLOBAL STATE SETTER
  const setInitialResult = useGlobalState(
    (state: any) => state.setInitialResults
  );

  // 3. API MUTATION HOOK
  const Muation = useMutation({
    mutationFn: () => {
      // The API uses the latest 'data' from the state managed inside this hook
      const userInput: SearchInput = { query: data };
      return PostSearch(userInput);
    },
    onSuccess: (response: any) => {
      console.log({ APIResponse: response });
      setInitialResult(response);
    },
    onError: (error: any) => {
      console.error(error.message);
    },
  });

  // 4. HANDLERS

  // Handler for input change: updates internal state 'data'
  function UpdateQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setInitialResult(null);
    setData(e.target.value);
  }

  // Handler for search trigger: runs the mutation
  function handleSearch() {
    if (!isQueryEmpty && !Muation.isLoading) {
      Muation.mutate();
    }
  }

  // 5. RETURN OBJECT
  return {
    // Props for Input binding
    value: data,
    onChange: UpdateQuery,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },

    // Props for Button/UI logic
    handleSearch: handleSearch,
    loading: Muation.isLoading,
    isQueryEmpty: isQueryEmpty,
  };
}

// Export the hook with an alias for cleaner import
export { useSearchLogic as SearchLogic };
