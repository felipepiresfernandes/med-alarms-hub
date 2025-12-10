import { cn } from "@/lib/utils";
import { ProductType } from "@/types/stock";

interface StockTabSelectorProps {
  activeTab: ProductType;
  onTabChange: (tab: ProductType) => void;
}

const StockTabSelector = ({ activeTab, onTabChange }: StockTabSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onTabChange("medicamento")}
        className={cn(
          "flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200",
          activeTab === "medicamento"
            ? "bg-[#46845E] text-white"
            : "bg-white text-muted-foreground hover:bg-muted"
        )}
      >
        Medicamento
      </button>
      <button
        onClick={() => onTabChange("suplemento")}
        className={cn(
          "flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200",
          activeTab === "suplemento"
            ? "bg-[#46845E] text-white"
            : "bg-white text-muted-foreground hover:bg-muted"
        )}
      >
        Suplemento
      </button>
    </div>
  );
};

export default StockTabSelector;


