import { useState } from "react";
import { Plus, X, Clock, Pill, Leaf, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionsProps {
  onAddAlarm: () => void;
  onAddMedication: () => void;
  onAddSupplement: () => void;
}

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isAI?: boolean;
}

const FloatingActions = ({ onAddAlarm, onAddMedication, onAddSupplement }: FloatingActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actionItems: ActionItem[] = [
    {
      id: "alarm",
      label: "Adicionar Alarme",
      icon: <Clock className="w-4 h-4" />,
      onClick: onAddAlarm,
    },
    {
      id: "medication",
      label: "Adicionar Medicamento",
      icon: <Pill className="w-4 h-4" />,
      onClick: onAddMedication,
    },
    {
      id: "supplement",
      label: "Adicionar Suplemento",
      icon: <Leaf className="w-4 h-4" />,
      onClick: onAddSupplement,
    },
    {
      id: "record",
      label: "Adicionar Registro",
      icon: <FileText className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      id: "profile",
      label: "Adicionar Perfil",
      icon: <User className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      id: "ai",
      label: "IA SupliMed",
      icon: <Pill className="w-4 h-4" />,
      onClick: () => {},
      isAI: true,
    },
  ];

  const handleActionClick = (item: ActionItem) => {
    item.onClick();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-28 right-6 flex flex-col items-end gap-2 z-30">
      {/* Expanded Menu */}
      <div
        className={cn(
          "flex flex-col gap-2 transition-all duration-300 origin-bottom",
          isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {actionItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleActionClick(item)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full shadow-card transition-all duration-200",
              "hover:scale-105 active:scale-95",
              item.isAI
                ? "bg-gradient-to-r from-cyan-400 to-teal-500 text-white"
                : "bg-card text-foreground border border-border"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-5 h-5",
                !item.isAI && "text-muted-foreground"
              )}
            >
              {item.icon}
            </span>
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
          </button>
        ))}
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
          <Plus className="w-7 h-7 text-primary-foreground" />
        </div>
      </button>
    </div>
  );
};

export default FloatingActions;
