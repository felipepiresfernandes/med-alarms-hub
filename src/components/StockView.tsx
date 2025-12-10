import { useState, useMemo } from "react";
import { StockProduct, ProductType } from "@/types/stock";
import { mockStock } from "@/data/mockStock";
import StockTabSelector from "./StockTabSelector";
import StockProductCard from "./StockProductCard";
import StockFloatingActions from "./StockFloatingActions";
import { toast } from "sonner";

const StockView = () => {
  const [activeType, setActiveType] = useState<ProductType>("medicamento");
  const [products] = useState<StockProduct[]>(mockStock);

  const handleEdit = (productId: string) => {
    toast("Editar produto", {
      description: `Editando produto ID: ${productId}`,
    });
    // Aqui você pode navegar para a tela de edição
  };

  const handleAddMedication = () => {
    toast("Adicionar medicamento", {
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleAddSupplement = () => {
    toast("Adicionar suplemento", {
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const filteredProducts = useMemo(() => {
    // Filtrar por tipo
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

