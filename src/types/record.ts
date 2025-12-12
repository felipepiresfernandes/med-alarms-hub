export interface MedicationRecord {
  id: string;
  productName: string;
  dose: string;
  type: "medicamento" | "suplemento";
  profileId: string;
  profileName: string;
  profileAvatar: string;
  takenAt: string; // ISO date string
}
