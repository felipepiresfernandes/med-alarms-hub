import { Alarm } from "@/types/alarm";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
}

const AlarmCard = ({ alarm, onToggle }: AlarmCardProps) => {
  const statusColors = {
    critical: "bg-destructive",
    ok: "bg-success",
    neutral: "bg-foreground",
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Switch
          checked={alarm.enabled}
          onCheckedChange={() => onToggle(alarm.id)}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xl font-semibold text-foreground">{alarm.time}</p>
          <p className="text-sm text-muted-foreground truncate">
            {alarm.periodicity}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium text-foreground">{alarm.medicationName}</p>
          <p className="text-sm text-muted-foreground">{alarm.dosage}</p>
        </div>
        <div
          className={cn(
            "w-3 h-3 rounded-full shrink-0",
            statusColors[alarm.status]
          )}
        />
      </div>
    </div>
  );
};

export default AlarmCard;
