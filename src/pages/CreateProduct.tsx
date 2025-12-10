import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Calendar, Palette, ChevronRight } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/stock";
import { useProducts } from "@/contexts/ProductContext";
import { toast } from "sonner";

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const unitLabels: Record<string, string> = {
  capsula: "cápsulas",
  comprimido: "comprimidos",
  ml: "ml",
  g: "g",
  gota: "gotas",
  sachê: "sachês",
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as ProductType) || "medicamento";
  const { addProduct } = useProducts();

  const [activePageTab, setActivePageTab] = useState<"produto" | "alertas">("produto");
  const [productType, setProductType] = useState<ProductType>(initialType);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [productColor, setProductColor] = useState("#46845E");

  // Alert settings
  const [alertLowStock, setAlertLowStock] = useState(false);
  const [lowStockAmount, setLowStockAmount] = useState("");
  const [alertExpiry, setAlertExpiry] = useState(false);
  const [expiryDays, setExpiryDays] = useState("");

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAdvance = () => {
    if (activePageTab === "produto") {
      if (!name.trim()) {
        toast.error("Nome é obrigatório");
        return;
      }
      setActivePageTab("alertas");
    } else {
      // Save product
      addProduct({
        name: name.trim(),
        type: productType,
        quantity: parseInt(quantity) || 0,
        unit: unitLabels[unit] || unit || "unidades",
        expiryDate: expiryDate ? format(expiryDate, "yyyy-MM-dd") : "2099-12-31",
      });
      
      toast.success("Produto criado com sucesso!");
      navigate("/?tab=estoque");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ backgroundColor: '#EEEEEE' }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4">
        <button 
          onClick={handleCancel}
          className="p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Criação de Produto</h1>
      </header>

      {/* Page Tabs */}
      <div className="px-4 border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActivePageTab("produto")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activePageTab === "produto" 
                ? "text-foreground" 
                : "text-muted-foreground"
            )}
          >
            Produto
            {activePageTab === "produto" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#46845E' }} />
            )}
          </button>
          <button
            onClick={() => setActivePageTab("alertas")}
            className={cn(
              "pb-3 text-sm font-medium transition-colors relative",
              activePageTab === "alertas" 
                ? "text-foreground" 
                : "text-muted-foreground"
            )}
          >
            Alertas
            {activePageTab === "alertas" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#46845E' }} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {activePageTab === "produto" && (
          <div className="space-y-6">
            {/* Illustration Placeholder */}
            <div className="flex justify-center py-4">
              <div className="w-48 h-32 flex items-center justify-center">
                <svg viewBox="0 0 200 140" className="w-full h-full">
                  <ellipse cx="100" cy="130" rx="80" ry="10" fill="#A9D2B9" opacity="0.3" />
                  <rect x="130" y="50" width="30" height="70" rx="4" fill="#A9D2B9" />
                  <rect x="135" y="45" width="20" height="10" rx="2" fill="#46845E" />
                  <circle cx="145" cy="90" r="8" fill="white" opacity="0.5" />
                  <rect x="70" y="70" width="25" height="50" rx="3" fill="#46845E" />
                  <rect x="75" y="65" width="15" height="8" rx="2" fill="#A9D2B9" />
                  <path d="M40 100 L55 70 L70 100 Z" fill="#A9D2B9" />
                  <rect x="50" y="95" width="10" height="25" fill="#A9D2B9" />
                  <circle cx="80" cy="40" r="15" fill="#FFDAB9" />
                  <rect x="70" y="55" width="20" height="35" fill="#46845E" />
                  <rect x="65" y="55" width="30" height="8" rx="2" fill="white" />
                </svg>
              </div>
            </div>

            {/* Form Title */}
            <h2 className="text-base font-semibold text-foreground">
              Complete os dados do produto
            </h2>

            {/* Product Type Selector */}
            <div className="flex bg-muted rounded-full p-1">
              <button
                onClick={() => setProductType("medicamento")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all",
                  productType === "medicamento"
                    ? "bg-[#46845E] text-white shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                Medicamento
              </button>
              <button
                onClick={() => setProductType("suplemento")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all",
                  productType === "suplemento"
                    ? "bg-[#46845E] text-white shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                Suplemento
              </button>
            </div>

            {/* Form Fields */}
            <div className="bg-card rounded-xl p-4 space-y-5 shadow-card">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tylenol"
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#46845E] bg-transparent"
                />
              </div>

              {/* Unidade de medida */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Unidade de medida</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="border-0 border-b border-border rounded-none px-0 focus:ring-0 bg-transparent">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="capsula">Cápsula (cp)</SelectItem>
                    <SelectItem value="comprimido">Comprimido (comp)</SelectItem>
                    <SelectItem value="ml">Mililitro (ml)</SelectItem>
                    <SelectItem value="g">Grama (g)</SelectItem>
                    <SelectItem value="gota">Gota (gt)</SelectItem>
                    <SelectItem value="sachê">Sachê</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantidade total */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantidade total (opcional)</label>
                <Input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Informe o total que vem na embalagem"
                  type="number"
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-[#46845E] bg-transparent"
                />
              </div>

              {/* Validade */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Validade (opcional)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "w-full flex items-center justify-between border-0 border-b border-border py-2 text-left",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <span className="text-sm">
                        {expiryDate 
                          ? format(expiryDate, "dd/MM/yyyy", { locale: ptBR }) 
                          : "Selecione a data"}
                      </span>
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Cor do produto */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cor do produto (opcional)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="w-full flex items-center justify-between border-0 border-b border-border py-2 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: productColor }}
                        />
                        <span className="text-sm text-foreground">{productColor.toUpperCase()}</span>
                      </div>
                      <Palette className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <HexColorPicker 
                        color={productColor} 
                        onChange={setProductColor}
                        className="!w-full"
                      />
                      
                      {/* Hex and RGB inputs */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Hex</label>
                          <Input
                            value={productColor.toUpperCase()}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                setProductColor(val);
                              }
                            }}
                            className="text-xs h-8 px-2"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">R</label>
                          <Input
                            value={hexToRgb(productColor).r}
                            readOnly
                            className="text-xs h-8 px-2 bg-muted"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">G</label>
                          <Input
                            value={hexToRgb(productColor).g}
                            readOnly
                            className="text-xs h-8 px-2 bg-muted"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">B</label>
                          <Input
                            value={hexToRgb(productColor).b}
                            readOnly
                            className="text-xs h-8 px-2 bg-muted"
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {activePageTab === "alertas" && (
          <div className="space-y-6">
            {/* Illustration for Alerts */}
            <div className="flex justify-center py-4">
              <div className="w-56 h-40 flex items-center justify-center">
                <svg viewBox="0 0 220 160" className="w-full h-full">
                  {/* Background elements */}
                  <ellipse cx="110" cy="150" rx="90" ry="10" fill="#A9D2B9" opacity="0.3" />
                  
                  {/* Clipboard/Document */}
                  <rect x="60" y="30" width="70" height="100" rx="6" fill="#E8F5E9" stroke="#A9D2B9" strokeWidth="2" />
                  <rect x="75" y="20" width="40" height="20" rx="4" fill="#46845E" />
                  <circle cx="95" cy="30" r="5" fill="white" />
                  
                  {/* Bell icon on document */}
                  <path d="M85 55 L95 55 L95 65 Q95 75 85 75 L85 75 Q75 75 75 65 L75 55 Z" fill="#A9D2B9" />
                  <circle cx="85" cy="78" r="3" fill="#46845E" />
                  <circle cx="85" cy="45" r="6" fill="#FF6B6B" />
                  <text x="85" y="48" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">!</text>
                  
                  {/* Lines on document */}
                  <rect x="70" y="90" width="50" height="4" rx="2" fill="#A9D2B9" />
                  <rect x="70" y="100" width="35" height="4" rx="2" fill="#A9D2B9" />
                  <rect x="70" y="110" width="45" height="4" rx="2" fill="#A9D2B9" />
                  
                  {/* Person */}
                  <circle cx="160" cy="60" r="15" fill="#FFDAB9" />
                  <rect x="145" y="75" width="30" height="45" rx="4" fill="#46845E" />
                  <rect x="140" y="75" width="40" height="10" rx="2" fill="white" />
                  
                  {/* Plant */}
                  <rect x="175" y="110" width="8" height="20" fill="#8B4513" />
                  <ellipse cx="179" cy="105" rx="12" ry="15" fill="#A9D2B9" />
                </svg>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">
                Configure as notificações de alerta
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecione quando deseja ser notificado sobre o término do estoque e o vencimento do produto.
              </p>
            </div>

            {/* Alert Settings */}
            <div className="bg-card rounded-xl p-4 space-y-4 shadow-card">
              {/* Low Stock Alert */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Avisar quando restarem (opcional)
                </label>
                <div className="flex items-center justify-between border-b border-border py-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={lowStockAmount}
                      onChange={(e) => setLowStockAmount(e.target.value)}
                      placeholder="000"
                      type="number"
                      disabled={!alertLowStock}
                      className="border-0 p-0 focus-visible:ring-0 bg-transparent w-20 text-sm"
                    />
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Switch
                    checked={alertLowStock}
                    onCheckedChange={setAlertLowStock}
                  />
                </div>
              </div>

              {/* Expiry Alert */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Avisar quantos dias antes do vencimento (opcional)
                </label>
                <div className="flex items-center justify-between border-b border-border py-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(e.target.value)}
                      placeholder="0000"
                      type="number"
                      disabled={!alertExpiry}
                      className="border-0 p-0 focus-visible:ring-0 bg-transparent w-20 text-sm"
                    />
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Switch
                    checked={alertExpiry}
                    onCheckedChange={setAlertExpiry}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Buttons */}
      <div className="px-4 py-4 flex gap-3 bg-background" style={{ backgroundColor: '#EEEEEE' }}>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex-1 rounded-full border-border"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAdvance}
          className="flex-1 rounded-full text-white"
          style={{ backgroundColor: '#46845E' }}
        >
          {activePageTab === "alertas" ? "Salvar" : "Avançar"}
        </Button>
      </div>
    </div>
  );
};

export default CreateProduct;
