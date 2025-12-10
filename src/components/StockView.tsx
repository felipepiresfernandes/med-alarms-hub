import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProductType } from "@/types/stock";
import { useProducts } from "@/contexts/ProductContext";
import StockTabSelector from "./StockTabSelector";
import StockProductCard from "./StockProductCard";
import StockFloatingActions from "./StockFloatingActions";
import { toast } from "sonner";

const StockView = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [activeType, setActiveType] = useState<ProductType>("medicamento");

  const handleEdit = (productId: string) => {
    toast("Editar produto", {
      description: `Editando produto ID: ${productId}`,
    });
  };

  const handleAddMedication = () => {
    navigate("/criar-produto?type=medicamento");
  };

  const handleAddSupplement = () => {
    navigate("/criar-produto?type=suplemento");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.type === activeType);
  }, [products, activeType]);

  return (
    <div className="space-y-4">
      {/* Tab Selector */}
      <StockTabSelector activeTab={activeType} onTabChange={setActiveType} />

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-card rounded-xl p-6 shadow-card text-center">
            <p className="text-muted-foreground">
              Nenhum {activeType === "medicamento" ? "medicamento" : "suplemento"} cadastrado
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <StockProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Floating Actions */}
      <StockFloatingActions
        onAddMedication={handleAddMedication}
        onAddSupplement={handleAddSupplement}
      />
    </div>
  );
};

export default StockView;
