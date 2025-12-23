import { client } from "@/client/http_client/backend_api";
import type { SelectedSearchResultInput } from "@/types/search/SelectedSearchResultInput";

async function PostSelectedSearchResult(
  userSelection: SelectedSearchResultInput
) {
  const response = await client.post("search/results", userSelection);

  return response.data;
}

export { PostSelectedSearchResult };
