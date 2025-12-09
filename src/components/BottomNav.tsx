import { Clock, FileText, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems: NavItem[] = [
    { id: "alarmes", label: "Alarmes", icon: <Clock className="w-5 h-5" /> },
    { id: "registros", label: "Registros", icon: <FileText className="w-5 h-5" /> },
    { id: "estoque", label: "Estoque", icon: <Package className="w-5 h-5" /> },
    { id: "perfil", label: "Perfil", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 pb-4 z-20">
      <nav className="bg-card rounded-3xl shadow-card border border-border">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200",
                  isActive
                    ? "bg-primary-light text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "transition-colors",
                    isActive && "text-foreground"
                  )}
                >
                  {item.icon}
                </div>
                <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
