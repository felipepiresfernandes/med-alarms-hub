import { cn } from "@/lib/utils";
import AlarmeCinza from "@/assets/alarme-cinza.svg";
import AlarmePreto from "@/assets/alarme-preto.svg";
import ClipboardCinza from "@/assets/clipboard-cinza.svg";
import ClipboardPreto from "@/assets/clipboard-preto.svg";
import EstoqueCinza from "@/assets/estoque-cinza.svg";
import EstoquePreto from "@/assets/estoque-preto.svg";
import UserCinza from "@/assets/user-cinza.svg";
import UserPreto from "@/assets/user-preto.svg";

interface NavItem {
  id: string;
  label: string;
  iconInactive: string;
  iconActive: string;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const navItems: NavItem[] = [
    { id: "alarmes", label: "Alarmes", iconInactive: AlarmeCinza, iconActive: AlarmePreto },
    { id: "registros", label: "Registros", iconInactive: ClipboardCinza, iconActive: ClipboardPreto },
    { id: "estoque", label: "Estoque", iconInactive: EstoqueCinza, iconActive: EstoquePreto },
    { id: "perfil", label: "Perfil", iconInactive: UserCinza, iconActive: UserPreto },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pb-4 px-5">
      <nav className="bg-card/90 backdrop-blur-sm rounded-full shadow-navbar">
        <div className="flex items-center">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-all duration-200",
                  isActive
                    ? "bg-primary-light text-foreground rounded-full"
                    : "text-muted-foreground hover:text-foreground rounded-full"
                )}
              >
                <img 
                  src={isActive ? item.iconActive : item.iconInactive}
                  alt={item.label}
                  className="w-8 h-8"
                  style={{ width: '32px', height: '32px' }}
                />
                <span 
                  className="text-xs"
                  style={{ 
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: '12px',
                    fontWeight: isActive ? 500 : 400
                  }}
                >
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
