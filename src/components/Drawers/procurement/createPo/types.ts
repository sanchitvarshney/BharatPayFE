import { ComponentPoDetailsResponse } from "@/features/procurement/poTypes";

export type CurrencyOption = { label: string; value: string };

export type ComponentRow = {
  componentKey: string;
  partNo: string;
  componentName: string;
  qty: string;
  rate: string;
  hsnCode: string;
  gstType: string;
  gstRate: string;
  remark: string;
  lastPo: string;
  lastOrdered: string;
  lastQty: number;
  vendors: { id: string; name: string }[];
  enabled: boolean;
};

export type PoTotals = { taxable: number; cgst: number; sgst: number; igst: number };

export type CreatePoDrawerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  details: ComponentPoDetailsResponse["data"] | null;
  onSuccess?: () => void;
};
