interface Totals {
    cgst: number;
    sgst: number;
    igst: number;
    taxableValue: number;
  }
  interface RowData {
    partComponent: string;
    qty: number;
    rate: string;
    taxableValue: number;
    foreignValue: number;
    hsnCode: string;
    gstType: string;
    gstRate: number;
    cgst: number;
    sgst: number;
    igst: number;
    location: string;
    autoConsump: string;
    remarks: string;
    id: number;
    currency?: string;
    isNew?: boolean;
  }
  
export const calculateTotals = (data: RowData[]): Totals => {
    return data.reduce<Totals>(
      (totals, row) => {
        totals.cgst += row.cgst;
        totals.sgst += row.sgst;
        totals.igst += row.igst;
        totals.taxableValue += row.taxableValue;
        return totals;
      },
      {
        cgst: 0,
        sgst: 0,
        igst: 0,
        taxableValue: 0,
      }
    );
  };