export interface ProductSuggestion {
  productId: number;
  productName: string;
  quantity: number;
  totalValue: number;
}

export interface ProductionSuggestionResponse {
  suggestions: ProductSuggestion[];
  totalProductionValue: number;
}