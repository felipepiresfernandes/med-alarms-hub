import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NumberPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: number | null;
  onConfirm: (value: number | null) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  allowDecimals?: boolean;
}

const NumberPicker = ({
  open,
  onOpenChange,
  title,
  value,
  onConfirm,
  min,
  max,
  step,
  unit,
  allowDecimals = false,
}: NumberPickerProps) => {
  const [selectedValue, setSelectedValue] = useState<number>(value || min);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  // Sincronizar valor inicial
  useEffect(() => {
    if (value !== null) {
      setSelectedValue(value);
    } else {
      setSelectedValue(min);
    }
  }, [value, min, open]);

  // Gerar array de valores
  const generateValues = () => {
    const values: number[] = [];
    for (let i = min; i <= max; i += step) {
      if (allowDecimals) {
        values.push(Math.round(i * 10) / 10);
      } else {
        values.push(i);
      }
    }
    return values;
  };

  const values = generateValues();
  const totalValues = values.length;
  const valueIndex = values.indexOf(selectedValue);

  // Scroll para o valor selecionado quando abrir
  useEffect(() => {
    if (open && scrollContainerRef.current && rulerRef.current) {
      // Aguardar um frame para garantir que os elementos estão renderizados
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const ruler = rulerRef.current;
        if (!container || !ruler) return;
        
        const containerWidth = container.clientWidth;
        const rulerWidth = ruler.scrollWidth;
        const scrollableWidth = Math.max(0, rulerWidth - containerWidth);
        
        // Calcular posição do scroll baseado no valor
        const progress = totalValues > 1 ? valueIndex / (totalValues - 1) : 0;
        const scrollPosition = progress * scrollableWidth;
        
        container.scrollTo({ left: scrollPosition, behavior: "auto" });
      }, 50);
    }
  }, [open, valueIndex, totalValues]);

  const handleScroll = () => {
    if (!scrollContainerRef.current || !rulerRef.current) return;

    const container = scrollContainerRef.current;
    const ruler = rulerRef.current;
    const containerWidth = container.clientWidth;
    const rulerWidth = ruler.scrollWidth;
    const scrollableWidth = Math.max(0, rulerWidth - containerWidth);
    const scrollLeft = container.scrollLeft;
    
    // Calcular progresso (0 a 1)
    const progress = scrollableWidth > 0 ? Math.max(0, Math.min(1, scrollLeft / scrollableWidth)) : 0;
    
    // Encontrar o valor mais próximo
    const targetIndex = Math.round(progress * (totalValues - 1));
    const clampedIndex = Math.max(0, Math.min(targetIndex, totalValues - 1));
    const newValue = values[clampedIndex];
    
    if (newValue !== selectedValue) {
      setSelectedValue(newValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current || !rulerRef.current) return;

    const container = scrollContainerRef.current;
    const ruler = rulerRef.current;
    const rect = container.getBoundingClientRect();
    const x = (e as MouseEvent).clientX - rect.left;
    const containerWidth = rect.width;
    const rulerWidth = ruler.scrollWidth;
    const scrollableWidth = Math.max(0, rulerWidth - containerWidth);
    
    // Calcular posição do scroll
    const progress = Math.max(0, Math.min(1, x / containerWidth));
    const scrollPosition = progress * scrollableWidth;
    
    container.scrollLeft = scrollPosition;
    
    // Atualizar valor imediatamente
    const newProgress = scrollableWidth > 0 ? scrollPosition / scrollableWidth : 0;
    const targetIndex = Math.round(newProgress * (totalValues - 1));
    const clampedIndex = Math.max(0, Math.min(targetIndex, totalValues - 1));
    const newValue = values[clampedIndex];
    
    if (newValue !== selectedValue) {
      setSelectedValue(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
      const mouseUpHandler = () => handleMouseUp();
      
      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", mouseUpHandler);
      return () => {
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseup", mouseUpHandler);
      };
    }
  }, [isDragging, selectedValue, totalValues, values]);

  // Touch events para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current || !rulerRef.current) return;

    const container = scrollContainerRef.current;
    const ruler = rulerRef.current;
    const rect = container.getBoundingClientRect();
    const touch = (e as TouchEvent).touches?.[0] || (e as React.TouchEvent).touches[0];
    if (!touch) return;
    
    e.preventDefault(); // Prevenir scroll da página
    
    const x = touch.clientX - rect.left;
    const containerWidth = rect.width;
    const rulerWidth = ruler.scrollWidth;
    const scrollableWidth = Math.max(0, rulerWidth - containerWidth);
    
    const progress = Math.max(0, Math.min(1, x / containerWidth));
    const scrollPosition = progress * scrollableWidth;
    
    container.scrollLeft = scrollPosition;
    
    // Atualizar valor imediatamente
    const newProgress = scrollableWidth > 0 ? scrollPosition / scrollableWidth : 0;
    const targetIndex = Math.round(newProgress * (totalValues - 1));
    const clampedIndex = Math.max(0, Math.min(targetIndex, totalValues - 1));
    const newValue = values[clampedIndex];
    
    if (newValue !== selectedValue) {
      setSelectedValue(newValue);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
      const touchEndHandler = () => handleTouchEnd();
      
      window.addEventListener("touchmove", touchMoveHandler, { passive: false });
      window.addEventListener("touchend", touchEndHandler);
      return () => {
        window.removeEventListener("touchmove", touchMoveHandler);
        window.removeEventListener("touchend", touchEndHandler);
      };
    }
  }, [isDragging, selectedValue, totalValues, values]);

  const handleConfirm = () => {
    onConfirm(selectedValue);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const formatValue = (val: number) => {
    if (allowDecimals) {
      return val.toFixed(1).replace(".", ",");
    }
    return val.toString();
  };

  // Calcular posição da barra verde (sempre no centro)
  const indicatorPosition = "50%";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh] rounded-t-3xl p-0 flex flex-col bg-white">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-lg font-semibold text-gray-900">{title}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
          {/* Valor selecionado grande - ACIMA da régua */}
          <div className="mb-6 text-center">
            <span className="text-6xl font-semibold text-gray-900">{formatValue(selectedValue)}</span>
            <span className="text-2xl text-gray-500 ml-2">{unit}</span>
          </div>

          {/* Container da régua com scroll horizontal */}
          <div className="relative w-full flex items-center" style={{ height: "120px" }}>
            {/* Barra verde indicadora fixa no centro */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-green-600 rounded-full z-20 pointer-events-none left-1/2 -translate-x-1/2"
            />

            {/* Régua horizontal scrollável */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div
                ref={rulerRef}
                className="flex items-end"
                style={{
                  minWidth: "max-content",
                  paddingLeft: "50%",
                  paddingRight: "50%",
                  height: "100px",
                }}
              >
                {values.map((val, index) => {
                  // Para decimais: marcas principais a cada 1.0 (78.0, 79.0, 80.0, etc)
                  // Para inteiros: marcas principais a cada 10 (150, 160, 170, etc)
                  const isMajorTick = allowDecimals
                    ? val % 1 === 0
                    : val % 10 === 0;
                  const isSelected = val === selectedValue;
                  const showLabel = isMajorTick || isSelected;

                  return (
                    <div
                      key={val}
                      className="snap-center flex flex-col items-center justify-end relative"
                      style={{
                        width: allowDecimals ? "20px" : "16px",
                        flexShrink: 0,
                      }}
                    >
                      {/* Marca na régua */}
                      <div
                        className={`w-0.5 ${
                          isSelected
                            ? "bg-green-600 h-12"
                            : isMajorTick
                            ? "bg-gray-600 h-8"
                            : "bg-gray-300 h-4"
                        } transition-all duration-200`}
                      />

                      {/* Número abaixo da marca */}
                      {showLabel && (
                        <span
                          className={`text-xs mt-1 ${
                            isSelected
                              ? "text-green-600 font-semibold text-sm"
                              : "text-gray-600"
                          } transition-all duration-200 whitespace-nowrap`}
                        >
                          {formatValue(val)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="px-6 py-4 border-t flex gap-3 bg-white">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50 h-12 text-base font-medium"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
          >
            Confirmar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NumberPicker;
