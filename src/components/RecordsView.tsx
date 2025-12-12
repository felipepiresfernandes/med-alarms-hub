import RecordCard from "./RecordCard";
import { mockRecords } from "@/data/mockRecords";
import { MedicationRecord } from "@/types/record";
import { toast } from "sonner";

const RecordsView = () => {
  const handleEditRecord = (record: MedicationRecord) => {
    toast("Editar registro", {
      description: `${record.productName} - ${record.dose}`,
    });
  };

  return (
    <div className="space-y-3">
      {mockRecords.map((record) => (
        <RecordCard key={record.id} record={record} onEdit={handleEditRecord} />
      ))}
    </div>
  );
};

export default RecordsView;
