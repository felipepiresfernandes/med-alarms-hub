import { StockProduct } from "@/types/stock";
import { Edit, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockProductCardProps {
  product: StockProduct;
  onEdit: (productId: string) => void;
}

const StockProductCard = ({ product, onEdit }: StockProductCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusIcon = () => {
    if (product.status === "warning") {
      return (
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
      );
    }
    if (product.status === "danger") {
      return (
        <AlertTriangle className="w-5 h-5 text-red-500" />
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-card flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Qnt. total: {product.quantity}{product.unit}
          </p>
          <p>
            Val. {formatDate(product.expiryDate)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onEdit(product.id)}
        className="p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
        aria-label="Editar produto"
      >
        <Edit className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};

export default StockProductCard;

