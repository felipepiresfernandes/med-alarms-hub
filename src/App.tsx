import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ProductProvider } from "@/contexts/ProductContext";
import { useAuth } from "@/hooks/useAuth";
import { useFirstTimeSetup } from "@/hooks/useFirstTimeSetup";
import Index from "./pages/Index";
import CreateProduct from "./pages/CreateProduct";
import CreateProfile from "./pages/CreateProfile";
import FirstTimeSetup from "./pages/FirstTimeSetup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { isChecking, needsSetup } = useFirstTimeSetup();

  // Mostra loading enquanto verifica autenticação
  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostra a tela de login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<FirstTimeSetup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Se estiver autenticado, verifica se precisa de setup
  return (
    <Routes>
      {needsSetup ? (
        <>
          <Route path="/setup" element={<FirstTimeSetup />} />
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Index />} />
          <Route path="/criar-produto" element={<CreateProduct />} />
          <Route path="/criar-perfil" element={<CreateProfile />} />
          <Route path="/setup" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ProductProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ProductProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
