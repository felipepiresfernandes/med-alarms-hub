import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
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

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.id === activeTab);
    const activeButton = buttonRefs.current[activeIndex];
    
    if (activeButton) {
      const { offsetLeft, offsetWidth } = activeButton;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pb-4 px-5">
      <nav className="relative bg-card/90 backdrop-blur-sm rounded-full shadow-navbar">
        <div className="relative flex items-center justify-between">
          {/* Retângulo animado de fundo */}
          <div
            className="absolute h-[60px] rounded-full transition-all duration-300 ease-in-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              backgroundColor: '#D9E8DF',
              boxShadow: 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.05)',
            }}
          />
          
          {/* Botões */}
          {navItems.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => (buttonRefs.current[index] = el)}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1",
                  "h-[60px] px-5 py-2",
                  "transition-all duration-200",
                  "text-muted-foreground hover:text-foreground",
                  isActive && "text-foreground"
                )}
                style={{
                  minWidth: '60px',
                }}
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
