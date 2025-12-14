import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProfileCard from "./ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  phone?: string | null;
  role: string;
}

interface Profile {
  id: string;
  name: string;
  phone?: string | null;
  avatar_url?: string | null;
}

const ProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      // Busca dados do usuário admin
      const { data: userDataResult, error: userError } = await supabase
        .from("users")
        .select("id, name, phone, role")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Erro ao buscar dados do usuário:", userError);
        toast.error("Erro ao carregar dados do usuário");
      } else {
        setUserData(userDataResult);
      }

      // Busca perfis vinculados
      const { data: profilesResult, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, phone, avatar_url")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Erro ao buscar perfis:", profilesError);
        toast.error("Erro ao carregar perfis");
      } else {
        setProfiles(profilesResult || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Recarrega quando a página ganha foco (útil quando volta da criação de perfil)
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  const handleEditProfile = (profile: Profile) => {
    toast("Editar perfil", {
      description: `${profile.name}`,
    });
    // TODO: Implementar navegação para edição de perfil
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-card text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-card text-center">
        <p className="text-muted-foreground">Erro ao carregar dados do usuário</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Conta Admin */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 flex-shrink-0">
            <AvatarImage src={undefined} alt={userData.name} />
            <AvatarFallback className="text-lg">
              {userData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                CONTA ADMIN
              </span>
            </div>
            <p className="text-foreground font-semibold text-lg truncate">
              {userData.name}
            </p>
            {userData.phone && (
              <p className="text-muted-foreground text-sm truncate">
                {userData.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botão de Criar Perfil */}
      <Button
        onClick={() => navigate("/criar-perfil")}
        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
      >
        <Plus className="w-5 h-5 mr-2" />
        Criar Novo Perfil
      </Button>

      {/* Listagem de Perfis Vinculados */}
      <div className="space-y-3">
        {profiles.length === 0 ? (
          <div className="bg-card rounded-xl p-6 shadow-card text-center">
            <p className="text-muted-foreground">Nenhum perfil vinculado</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={handleEditProfile}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileView;
