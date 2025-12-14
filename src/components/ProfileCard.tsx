import { Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Profile {
  id: string;
  name: string;
  phone?: string | null;
  avatar_url?: string | null;
}

interface ProfileCardProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
}

const ProfileCard = ({ profile, onEdit }: ProfileCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4">
      {/* Avatar */}
      <Avatar className="w-12 h-12 flex-shrink-0">
        <AvatarImage src={profile.avatar_url || undefined} alt={profile.name} />
        <AvatarFallback className="text-sm">
          {profile.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-foreground font-medium truncate">
          {profile.name}
        </p>
        {profile.phone && (
          <p className="text-muted-foreground text-sm truncate">
            {profile.phone}
          </p>
        )}
      </div>

      {/* Edit Button */}
      <button
        onClick={() => onEdit?.(profile)}
        className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Editar perfil"
      >
        <Pencil className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};

export default ProfileCard;
