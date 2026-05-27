import { RowData } from "./AddPartCodeTable";

/** Company GST — when Bill To GST matches this, line GST rate is forced to 0%. */
export const ZERO_GST_BILL_TO_MATCH = "09AATCM1744R1ZH";

export const normalizeGstNumber = (gst?: string) =>
  (gst ?? "").replace(/\s/g, "").toUpperCase();

export const isBillToZeroGst = (billToGst?: string) =>
  normalizeGstNumber(billToGst) === normalizeGstNumber(ZERO_GST_BILL_TO_MATCH);

export const recomputePartCodeRowGst = (
  row: RowData,
  gstType: string,
  gstRate: string
): RowData => {
  const qty = Number(row.qty) || 0;
  const rate = Number(row.rate) || 0;
  const gstRateNum = Number(gstRate) || 0;
  const taxableAmount = qty * rate;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (gstType === "Intra State") {
    cgst = (taxableAmount * (gstRateNum / 2)) / 100;
    sgst = (taxableAmount * (gstRateNum / 2)) / 100;
  } else if (gstType === "Inter State") {
    igst = (taxableAmount * gstRateNum) / 100;
  }

  return {
    ...row,
    gstRate,
    taxableAmount,
    cgst,
    sgst,
    igst,
    totalAmount: taxableAmount + cgst + sgst + igst,
  };
};
