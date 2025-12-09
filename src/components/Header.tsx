import { Bell, Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-primary"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold">
          <span className="text-foreground">Supli</span>
          <span className="text-primary">Med</span>
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
