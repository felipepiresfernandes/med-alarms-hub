import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import NumberPicker from "@/components/NumberPicker";

const CreateProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [heightPickerOpen, setHeightPickerOpen] = useState(false);
  const [weightPickerOpen, setWeightPickerOpen] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione uma imagem");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");
    
    // Format as DD/MM/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value);
    setBirthDate(formatted);
  };

  const handleHeightConfirm = (value: number | null) => {
    setHeight(value);
  };

  const handleWeightConfirm = (value: number | null) => {
    setWeight(value);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user || !supabase) return null;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Erro ao fazer upload:", uploadError);
        toast.error("Erro ao fazer upload da imagem");
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!user || !supabase) {
      toast.error("Erro de autenticação. Faça login novamente.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload avatar if selected
      let avatarUrl: string | null = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
        if (!avatarUrl && avatarFile) {
          // Continue even if upload fails, but warn user
          toast.warning("Perfil criado, mas houve erro ao salvar a foto");
        }
      }

      // Parse birth date
      let parsedBirthDate: string | null = null;
      if (birthDate.trim()) {
        const dateParts = birthDate.split('/');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          parsedBirthDate = `${year}-${month}-${day}`;
        }
      }

      // Height and weight are already numbers
      const parsedHeight = height;
      const parsedWeight = weight;

      // Create profile in database
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: name.trim(),
          birth_date: parsedBirthDate,
          height: parsedHeight,
          weight: parsedWeight,
          avatar_url: avatarUrl,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar perfil:", error);
        toast.error(error.message || "Erro ao criar perfil. Tente novamente.");
        setIsLoading(false);
        return;
      }

      toast.success("Perfil criado com sucesso!");
      navigate(-1); // Go back to previous page

    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao criar perfil. Tente novamente.");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Criação de Perfil</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-32 h-32 mb-3 border-4 border-white shadow-lg">
            <AvatarImage src={avatarPreview || undefined} alt="Foto de perfil" />
            <AvatarFallback className="text-4xl bg-gray-200">
              {name.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="text-green-600 underline text-sm font-medium hover:text-green-700"
          >
            Editar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-card space-y-0 mb-6">
          {/* Nome */}
          <div className="px-4 py-3 border-b border-gray-200">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Ex: Felipe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="px-4 py-3 border-b border-gray-200">
            <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700 mb-1 block">
              Data de Nascimento
            </Label>
            <Input
              id="birthDate"
              type="text"
              placeholder="Ex: 14/01/2001"
              value={birthDate}
              onChange={handleDateChange}
              maxLength={10}
              className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
          </div>

          {/* Altura */}
          <button
            type="button"
            onClick={() => setHeightPickerOpen(true)}
            className="px-4 py-3 border-b border-gray-200 w-full text-left hover:bg-gray-50 transition-colors"
          >
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Altura
            </Label>
            <div className="flex items-center">
              <span className="text-base flex-1 text-gray-900">
                {height !== null ? `${height} cm` : "Ex: 180cm"}
              </span>
              <span className="text-gray-400 ml-2">›</span>
            </div>
          </button>

          {/* Peso */}
          <button
            type="button"
            onClick={() => setWeightPickerOpen(true)}
            className="px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors"
          >
            <Label className="text-sm font-medium text-gray-700 mb-1 block">
              Peso
            </Label>
            <div className="flex items-center">
              <span className="text-base flex-1 text-gray-900">
                {weight !== null ? `${weight.toFixed(1)} kg` : "Ex: 80,0kg"}
              </span>
              <span className="text-gray-400 ml-2">›</span>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50 h-12 text-base font-medium"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium disabled:opacity-50"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>

      {/* Number Pickers */}
      <NumberPicker
        open={heightPickerOpen}
        onOpenChange={setHeightPickerOpen}
        title="Selecionar Altura"
        value={height}
        onConfirm={handleHeightConfirm}
        min={50}
        max={250}
        step={1}
        unit="cm"
        allowDecimals={false}
      />

      <NumberPicker
        open={weightPickerOpen}
        onOpenChange={setWeightPickerOpen}
        title="Selecionar Peso"
        value={weight}
        onConfirm={handleWeightConfirm}
        min={20}
        max={200}
        step={0.5}
        unit="kg"
        allowDecimals={true}
      />
    </div>
  );
};

export default CreateProfile;
