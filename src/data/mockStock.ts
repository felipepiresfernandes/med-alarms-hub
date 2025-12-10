import { StockProduct } from "@/types/stock";

export const mockStock: StockProduct[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    type: "medicamento",
    quantity: 30,
    unit: "comprimidos",
    expiryDate: "2025-12-31",
    status: "ok",
  },
  {
    id: "2",
    name: "Ibuprofeno 400mg",
    type: "medicamento",
    quantity: 5,
    unit: "comprimidos",
    expiryDate: "2025-08-17",
    status: "warning",
  },
  {
    id: "3",
    name: "Vitamina D3",
    type: "suplemento",
    quantity: 0,
    unit: "cápsulas",
    expiryDate: "2024-06-15",
    status: "danger",
  },
  {
    id: "4",
    name: "Whey Protein",
    type: "suplemento",
    quantity: 900,
    unit: "g",
    expiryDate: "2025-08-17",
    status: "warning",
  },
  {
    id: "5",
    name: "Creatina",
    type: "suplemento",
    quantity: 500,
    unit: "g",
    expiryDate: "2026-03-20",
    status: "ok",
  },
  {
    id: "6",
    name: "Dipirona 1g",
    type: "medicamento",
    quantity: 20,
    unit: "comprimidos",
    expiryDate: "2025-10-10",
    status: "ok",
  },
];


