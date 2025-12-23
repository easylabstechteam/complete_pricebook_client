interface Data {
  id: string;
  name: string;
}

interface SearchModalInput {
  type: string;
  data: Data;
}

export type { SearchModalInput };
