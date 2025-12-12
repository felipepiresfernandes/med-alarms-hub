import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useFirstTimeSetup } from "@/hooks/useFirstTimeSetup";

const FirstTimeSetup = () => {
  const navigate = useNavigate();
  const { completeSetup } = useFirstTimeSetup();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    // Marca setup como completo e navega
    completeSetup();
    toast.success("Perfil criado com sucesso!");
    navigate("/");
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
          
          {/* User icon with plus - overlapping monitor */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center relative">
              {/* Simple face representation */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute top-2 right-3 w-2 h-2 bg-gray-600 rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-gray-600 rounded-full"></div>
              {/* Plus icon */}
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center absolute -bottom-1 -left-1 border-2 border-white">
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
          </div>
          
          {/* Decorative leaf shapes */}
          <div className="absolute -left-8 top-4 w-6 h-6 bg-green-400 rounded-full opacity-60"></div>
          <div className="absolute -right-12 top-8 w-4 h-4 bg-green-300 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-black mb-8 text-center">
        Vamos criar seu perfil!
      </h1>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="bg-white rounded-xl p-6 shadow-card space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium text-black">
              Qual seu nome?
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

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
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-base font-medium h-12 rounded-lg"
        >
          Avançar
        </Button>
      </form>
    </div>
  );
};

export default FirstTimeSetup;
