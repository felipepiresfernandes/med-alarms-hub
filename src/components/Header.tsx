import { Bell, Settings } from "lucide-react";
import SuplimedLogo from "@/assets/SuplimedLogoVerde.svg";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <img src={SuplimedLogo} alt="SupliMed Logo" className="w-10 h-10" />
        <h1 className="text-xl font-semibold font-sans">
          <span className="text-foreground" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 600 }}>Supli</span>
          <span style={{ color: '#46845E' }}>Med</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-full hover:bg-muted transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
