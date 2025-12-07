interface Query {
  type: string;
  id: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
}

interface SelectedSearchResultInput {
  query: Query;
  pagination: Pagination;
}

export type { SelectedSearchResultInput };
