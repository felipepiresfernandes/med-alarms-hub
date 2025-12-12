import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFirstTimeSetup = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        // Verifica se há uma sessão ativa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          setNeedsSetup(false);
          setIsChecking(false);
          return;
        }

        // Se não há sessão, verifica se já existe algum admin no sistema
        // Tenta usar a função has_admin primeiro
        const { data: hasAdmin, error: functionError } = await supabase
          .rpc('has_admin');

        if (functionError) {
          // Se a função não existe, tenta verificar diretamente
          const { data: users, error } = await supabase
            .from('users')
            .select('id')
            .eq('role', 'admin')
            .limit(1);

          if (error) {
            // Se a tabela não existe ainda, precisa fazer setup
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
              setNeedsSetup(true);
            } else {
              console.error("Erro ao verificar usuários:", error);
              // Em caso de erro, permite o setup
              setNeedsSetup(true);
            }
          } else {
            // Se não há admin, precisa fazer setup
            setNeedsSetup(!users || users.length === 0);
          }
        } else {
          // Usa o resultado da função
          setNeedsSetup(!hasAdmin);
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Erro ao verificar setup:", error);
        // Em caso de erro, permite o setup
        setNeedsSetup(true);
        setIsChecking(false);
      }
    };

    checkSetup();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setNeedsSetup(false);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isChecking, needsSetup, isAuthenticated };
};
