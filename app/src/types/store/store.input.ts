

// create interfaces of the below json, i want to tbe able ti use it ion my global state. 

export interface SearchDataItem {
  id: string;
  name: string;
}; 

type SearchResultType = "supplier" | "product" | "trade";

export interface SearchResultItem {
  type: SearchResultType;
  data: SearchDataItem;
}; 

export interface ProductItem {
  product_id: string;
  product_name: string;
  product_price: number;
  product_code: string;
  supplier_name: string;
};
export interface TradeGroup {
  trade_name: string;
  trade_code: string;
  json_agg: ProductItem[];
}; 
export interface tableResultsInput {
    results: TradeGroup []
}; 





