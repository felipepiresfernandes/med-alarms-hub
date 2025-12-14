import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFirstTimeSetup = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        // Verifica se há um usuário autenticado no Supabase
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Se há usuário autenticado, verifica se existe na tabela users
            const { data: userData, error } = await supabase
              .from('users')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (userData && !error) {
              // Usuário existe e está autenticado - não precisa de setup
              setNeedsSetup(false);
              localStorage.setItem("suplimed_setup_completed", "true");
            } else {
              // Usuário autenticado mas não existe na tabela users - precisa de setup
              setNeedsSetup(true);
            }
          } else {
            // Não há usuário autenticado - não precisa verificar setup
            setNeedsSetup(false);
          }
        } else {
          // Supabase não configurado
          setNeedsSetup(false);
        }
      } catch (error) {
        console.error("Erro ao verificar setup:", error);
        setNeedsSetup(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSetup();

    // Escuta mudanças na autenticação
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          checkSetup();
        } else {
          setNeedsSetup(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const completeSetup = () => {
    localStorage.setItem("suplimed_setup_completed", "true");
    setNeedsSetup(false);
  };

  return { isChecking, needsSetup, completeSetup };
};
