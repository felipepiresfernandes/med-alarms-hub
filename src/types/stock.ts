export type ProductType = "medicamento" | "suplemento";
export type SortOption = "quantidade-crescente" | "quantidade-decrescente" | "validade-crescente" | "validade-decrescente";

export type ProductStatus = "ok" | "warning" | "danger";

export interface StockProduct {
  id: string;
  name: string;
  type: ProductType;
  quantity: number;
  unit: string;
  expiryDate: string; // formato: YYYY-MM-DD
  status: ProductStatus;
}


