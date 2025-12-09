import { Plus, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionsProps {
  onAddAlarm: () => void;
  onAddMedication: () => void;
}

const FloatingActions = ({ onAddAlarm, onAddMedication }: FloatingActionsProps) => {
  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-10">
      {/* Add Medication Button */}
      <button
        onClick={onAddMedication}
        className={cn(
          "w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-fab",
          "hover:scale-105 active:scale-95 transition-transform duration-200"
        )}
      >
        <Pill className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Add Alarm Button */}
      <button
        onClick={onAddAlarm}
        className={cn(
          "w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-fab",
          "hover:scale-105 active:scale-95 transition-transform duration-200"
        )}
      >
        <Plus className="w-7 h-7 text-primary-foreground" />
      </button>
    </div>
  );
};

export default FloatingActions;
