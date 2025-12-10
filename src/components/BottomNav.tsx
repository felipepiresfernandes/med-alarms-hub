import { Clock, FileText, Package, User, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems: NavItem[] = [
    { id: "alarmes", label: "Alarmes", Icon: Clock },
    { id: "registros", label: "Registros", Icon: FileText },
    { id: "estoque", label: "Estoque", Icon: Package },
    { id: "perfil", label: "Perfil", Icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20" style={{ padding: '20px' }}>
      <nav className="bg-card/90 backdrop-blur-sm rounded-full shadow-navbar">
        <div className="flex items-center">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-all duration-200 first:rounded-l-full last:rounded-r-full",
                  isActive
                    ? "bg-primary-light text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.Icon 
                  className="w-6 h-6 transition-colors"
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 0 : 2}
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
