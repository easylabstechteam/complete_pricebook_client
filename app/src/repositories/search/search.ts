// TODO :: post user input to the backend,
// TODO :: get response from the backend and store it in global state for other components to consume

import { client } from "@/client/http_client/backend_api";
import type { SearchInput } from "@/types/search/searchType.input";

async function PostSearch(userInput: SearchInput) {

    const response = await client.post("search", userInput);

    return response.data;

}; 

export {PostSearch}; 
