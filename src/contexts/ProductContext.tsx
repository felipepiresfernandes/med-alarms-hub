import { createContext, useContext, useState, ReactNode } from "react";
import { StockProduct, ProductType, ProductStatus } from "@/types/stock";
import { mockStock } from "@/data/mockStock";

interface ProductContextType {
  products: StockProduct[];
  addProduct: (product: Omit<StockProduct, "id" | "status">) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<StockProduct[]>(mockStock);

  const calculateStatus = (quantity: number, expiryDate: string): ProductStatus => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (quantity === 0 || daysUntilExpiry < 0) return "danger";
    if (quantity <= 10 || daysUntilExpiry <= 30) return "warning";
    return "ok";
  };

  const addProduct = (product: Omit<StockProduct, "id" | "status">) => {
    const newProduct: StockProduct = {
      ...product,
      id: Date.now().toString(),
      status: calculateStatus(product.quantity, product.expiryDate),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
