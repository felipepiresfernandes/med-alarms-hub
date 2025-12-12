import { MedicationRecord } from "@/types/record";
import { Pencil, Pill, Leaf } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface RecordCardProps {
  record: MedicationRecord;
  onEdit?: (record: MedicationRecord) => void;
}

const RecordCard = ({ record, onEdit }: RecordCardProps) => {
  const formattedDate = format(new Date(record.takenAt), "dd/MM/yyyy HH:mm");

  return (
    <div className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4">
      {/* Product Type Icon */}
      <div className="flex-shrink-0">
        {record.type === "suplemento" ? (
          <Leaf className="w-8 h-8 text-primary" />
        ) : (
          <Pill className="w-8 h-8 text-primary" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src={record.profileAvatar} alt={record.profileName} />
            <AvatarFallback className="text-xs">
              {record.profileName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground font-medium truncate">
            {record.productName} - {record.dose}
          </span>
        </div>
        <p className="text-muted-foreground text-sm font-semibold">
          {formattedDate}
        </p>
      </div>

      {/* Edit Button */}
      <button
        onClick={() => onEdit?.(record)}
        className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label="Editar registro"
      >
        <Pencil className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};

export default RecordCard;
