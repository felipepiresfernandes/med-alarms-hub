import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const FirstTimeSetup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se o Supabase está configurado ao montar o componente
  useEffect(() => {
    if (!supabase) {
      console.error("Supabase não está configurado!");
      console.log("Variáveis de ambiente:", {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? "✓ Configurado" : "✗ Não configurado",
        VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "✓ Configurado" : "✗ Não configurado"
      });
      toast.error("Supabase não está configurado. Verifique o arquivo .env", {
        duration: 10000
      });
    } else {
      console.log("Supabase está configurado corretamente");
    }
  }, []);

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    // Aplica a máscara (99) 99999-9999
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
    
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!phone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Verifica se o Supabase está configurado
    if (!supabase) {
      toast.error("Supabase não está configurado. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY");
      console.error("Supabase client is null. Check environment variables.");
      return;
    }

    setIsLoading(true);

    try {
      // Remove formatação do telefone para salvar apenas números
      const phoneNumbers = phone.replace(/\D/g, "");
      
      if (phoneNumbers.length < 10) {
        toast.error("Telefone inválido. Digite pelo menos 10 dígitos.");
        setIsLoading(false);
        return;
      }
      
      // Cria o usuário no Supabase Auth
      // Usaremos um email único baseado no telefone
      const email = `admin-${phoneNumbers}@med-alarms.local`;
      
      console.log("=== DIAGNÓSTICO DE CADASTRO ===");
      console.log("Email que será usado:", email);
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL ? "✓ Configurado" : "✗ Não configurado");
      console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "✓ Configurado" : "✗ Não configurado");
      console.log("Supabase client:", supabase ? "✓ Existe" : "✗ Null");
      
      if (!supabase) {
        throw new Error("Supabase client não está disponível. Verifique as variáveis de ambiente.");
      }
      
      console.log("Tentando criar usuário com email:", email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            phone: phoneNumbers,
            role: 'admin'
          },
          emailRedirectTo: window.location.origin
        }
      });

      console.log("=== RESPOSTA DO SIGNUP ===");
      console.log("authData completo:", JSON.stringify(authData, null, 2));
      console.log("authError:", authError);
      console.log("authData.user:", authData?.user);
      console.log("authData.session:", authData?.session);

      if (authError) {
        console.error("=== ERRO DETALHADO ===");
        console.error("Mensagem:", authError.message);
        console.error("Status:", authError.status);
        console.error("Nome:", authError.name);
        console.error("Erro completo:", JSON.stringify(authError, null, 2));
        
        // Mensagens de erro mais específicas
        if (authError.message?.includes("already registered") || authError.message?.includes("already exists")) {
          throw new Error("Este telefone já está cadastrado. Use outro número.");
        } else if (authError.message?.includes("email")) {
          throw new Error(`Erro no email: ${authError.message}`);
        } else if (authError.message?.includes("password")) {
          throw new Error(`Erro na senha: ${authError.message}`);
        } else {
          throw new Error(`Erro ao criar usuário: ${authError.message || "Erro desconhecido"}`);
        }
      }

      if (!authData) {
        throw new Error("Nenhuma resposta do Supabase. Verifique sua conexão e configuração.");
      }

      if (!authData.user) {
        console.error("=== PROBLEMA: authData.user é null/undefined ===");
        console.error("Isso pode significar:");
        console.error("1. Confirmação de email está habilitada e o usuário precisa confirmar");
        console.error("2. Há um problema na configuração do Supabase");
        console.error("3. O email já existe mas não está confirmado");
        
        // Verifica se há uma mensagem específica
        if (authData.session === null && !authError) {
          throw new Error("Usuário criado, mas precisa confirmar o email. Verifique se a confirmação de email está desabilitada no Supabase Dashboard.");
        }
        
        throw new Error("Erro ao criar usuário: nenhum usuário foi retornado. Verifique o console para mais detalhes.");
      }

      console.log("Usuário criado com sucesso:", authData.user.id);
      console.log("Metadata do usuário:", authData.user.user_metadata);

      // Aguarda um pouco para garantir que o trigger tenha executado
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verifica se o usuário foi criado na tabela users
      console.log("Verificando se usuário existe na tabela users...");
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Erro ao verificar usuário:", checkError);
      }

      if (!existingUser) {
        console.log("Usuário não encontrado na tabela users. Tentando sincronizar...");
        
        // Tenta usar a função de sincronização
        const { data: syncResult, error: syncError } = await supabase
          .rpc('sync_user_to_table', { user_id: authData.user.id });

        if (syncError || !syncResult) {
          console.error("Erro ao sincronizar usuário:", syncError);
          
          // Tenta inserir/atualizar diretamente
          console.log("Tentando inserir/atualizar diretamente...");
          const { data: userData, error: userError } = await supabase
            .from('users')
            .upsert({
              id: authData.user.id,
              name: name,
              phone: phoneNumbers,
              role: 'admin'
            }, {
              onConflict: 'id'
            });

          if (userError) {
            console.error("Erro ao atualizar tabela users:", userError);
            // Tenta inserir diretamente se o upsert falhar
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                name: name,
                phone: phoneNumbers,
                role: 'admin'
              });
            
            if (insertError) {
              console.error("Erro ao inserir na tabela users:", insertError);
              toast.error(`Usuário criado, mas houve erro ao salvar dados: ${insertError.message}. Verifique o console para mais detalhes.`, {
                duration: 8000
              });
              // Não bloqueia o fluxo, mas avisa o usuário
            } else {
              console.log("Dados inseridos com sucesso na tabela users");
            }
          } else {
            console.log("Dados atualizados com sucesso na tabela users:", userData);
          }
        } else {
          console.log("Usuário sincronizado com sucesso via função sync_user_to_table");
        }
      } else {
        console.log("Usuário já existe na tabela users:", existingUser);
        // Atualiza os dados caso estejam diferentes
        if (existingUser.name !== name || existingUser.phone !== phoneNumbers || existingUser.role !== 'admin') {
          const { error: updateError } = await supabase
            .from('users')
            .update({
              name: name,
              phone: phoneNumbers,
              role: 'admin'
            })
            .eq('id', authData.user.id);
          
          if (updateError) {
            console.error("Erro ao atualizar dados do usuário:", updateError);
          } else {
            console.log("Dados do usuário atualizados");
          }
        }
      }

      // Verifica se o email precisa ser confirmado
      if (authData.user && !authData.session) {
        toast.success("Perfil criado! Verifique seu email para confirmar a conta.", {
          duration: 5000
        });
        // Mesmo sem sessão, podemos continuar se a confirmação de email estiver desabilitada
      } else {
        toast.success("Perfil criado com sucesso!");
      }
      
      // Aguarda um pouco antes de redirecionar
      setTimeout(() => {
        navigate("/");
        // Recarrega a página para garantir que o estado de autenticação seja atualizado
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error("Erro completo ao criar perfil:", error);
      
      // Mensagens de erro mais específicas
      let errorMessage = "Erro ao criar perfil. Tente novamente.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 422) {
        errorMessage = "Dados inválidos. Verifique os campos preenchidos.";
      } else if (error.status === 429) {
        errorMessage = "Muitas tentativas. Aguarde um momento e tente novamente.";
      } else if (error.message?.includes("already registered")) {
        errorMessage = "Este telefone já está cadastrado. Use outro número.";
      }
      
      toast.error(errorMessage, {
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Se o Supabase não estiver configurado, mostra aviso
  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#EEEEEE] flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Supabase não configurado</h2>
          <p className="text-red-700 mb-4">
            O Supabase não está configurado corretamente. Verifique se as variáveis de ambiente estão definidas no arquivo <code className="bg-red-100 px-2 py-1 rounded">.env</code>:
          </p>
          <ul className="list-disc list-inside text-red-700 space-y-2 mb-4">
            <li><code>VITE_SUPABASE_URL</code></li>
            <li><code>VITE_SUPABASE_PUBLISHABLE_KEY</code></li>
          </ul>
          <p className="text-sm text-red-600">
            Após configurar, reinicie o servidor de desenvolvimento.
          </p>
        </div>
      </div>
    );
  }

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
              disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
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
          disabled={isLoading}
        >
          {isLoading ? "Criando..." : "Avançar"}
        </Button>
      </form>
    </div>
  );
};

export default FirstTimeSetup;
