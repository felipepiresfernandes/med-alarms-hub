import { Clock, FileText, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  IconOutline: React.ComponentType<{ className?: string }>;
  IconFilled: React.ComponentType<{ className?: string; fill?: string }>;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems: NavItem[] = [
    { id: "alarmes", label: "Alarmes", IconOutline: Clock, IconFilled: Clock },
    { id: "registros", label: "Registros", IconOutline: FileText, IconFilled: FileText },
    { id: "estoque", label: "Estoque", IconOutline: Package, IconFilled: Package },
    { id: "perfil", label: "Perfil", IconOutline: User, IconFilled: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 px-5 pb-4 z-20">
      <nav className="bg-card/90 backdrop-blur-sm rounded-full shadow-navbar">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.IconOutline;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-5 py-3 transition-all duration-200 first:rounded-l-full last:rounded-r-full",
                  isActive
                    ? "bg-primary-light text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive && "fill-foreground"
                  )}
                />
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
