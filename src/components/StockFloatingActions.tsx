import { useState } from "react";
import { Plus, X, Pill, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockFloatingActionsProps {
  onAddMedication: () => void;
  onAddSupplement: () => void;
}

const StockFloatingActions = ({ onAddMedication, onAddSupplement }: StockFloatingActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-28 right-6 flex flex-col items-end gap-2 z-30">
      {/* Expanded Menu */}
      <div
        className={cn(
          "flex flex-col gap-2 transition-all duration-300 origin-bottom",
          isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <button
          onClick={() => {
            onAddMedication();
            setIsExpanded(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-card transition-all duration-200 hover:scale-105 active:scale-95 bg-card text-foreground border border-border"
        >
          <Pill className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium whitespace-nowrap">Adicionar Medicamento</span>
        </button>
        <button
          onClick={() => {
            onAddSupplement();
            setIsExpanded(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-card transition-all duration-200 hover:scale-105 active:scale-95 bg-card text-foreground border border-border"
        >
          <Leaf className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium whitespace-nowrap">Adicionar Suplemento</span>
        </button>
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-fab",
          "hover:scale-105 active:scale-95 transition-all duration-200"
        )}
        style={{ backgroundColor: '#46845E' }}
      >
        <div
          className={cn(
            "transition-transform duration-200",
            isExpanded && "rotate-45"
          )}
        >
          <Plus className="w-7 h-7 text-white" />
        </div>
      </button>
    </div>
  );
};

export default StockFloatingActions;


