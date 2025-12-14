import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    if (!password.trim()) {
      toast.error("Senha é obrigatória");
      return;
    }

    // Verifica se o Supabase está configurado
    if (!supabase) {
      toast.error("Supabase não está configurado. Verifique as variáveis de ambiente.");
      console.error("⚠️ Supabase não está configurado!");
      return;
    }

    setIsLoading(true);

    try {
      // Remove formatação do telefone para usar como email
      const phoneNumbers = phone.replace(/\D/g, "");
      const email = `${phoneNumbers}@suplimed.local`;

      // Faz login no Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Erro ao fazer login:", authError);
        toast.error(authError.message || "Telefone ou senha incorretos. Tente novamente.");
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Não foi possível fazer login. Tente novamente.");
        setIsLoading(false);
        return;
      }

      toast.success("Login realizado com sucesso!");
      
      // Redireciona para a página inicial
      window.location.href = "/";

    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao fazer login. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex flex-col items-center justify-center px-4 py-8">
      {/* Illustration Section */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          {/* Background oval */}
          <div className="absolute inset-0 bg-gray-200 rounded-full w-64 h-40 -z-10 opacity-50"></div>
          
          {/* Monitor illustration */}
          <div className="w-48 h-32 bg-gray-700 rounded-lg relative shadow-lg">
            <div className="absolute inset-2 bg-white rounded flex items-center justify-center">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* User icon - overlapping monitor */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center relative">
              {/* Simple face representation */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute top-2 right-3 w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          
          {/* Decorative leaf shapes */}
          <div className="absolute -left-8 top-4 w-6 h-6 bg-green-400 rounded-full opacity-60"></div>
          <div className="absolute -right-12 top-8 w-4 h-4 bg-green-300 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-black mb-8 text-center">
        Bem-vindo de volta!
      </h1>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="bg-white rounded-xl p-6 shadow-card space-y-6">
          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium text-black">
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ex: (99) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={15}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium text-black">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-base font-medium h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/cadastro")}
            className="text-green-600 hover:text-green-700 text-sm font-medium underline"
          >
            Não tem uma conta? Cadastre-se
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

