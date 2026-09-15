

export const formatCurrency = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return typeof value === "string" ? value : "";
  const sign = n < 0 ? "-" : "";
  return `${sign}₹ ${Math.abs(n).toLocaleString("en-IN")}`;
};

export const formatNumber = (value: unknown): string => {
  const n = Number(value);
  if (!Number.isFinite(n)) return typeof value === "string" ? value : "";
  return n.toLocaleString("en-IN");
};

type FlexAlign = "left" | "right" | "center";

const justifyForAlign: Record<FlexAlign, string> = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
};


export const baseFlexCellStyle = (
  align: FlexAlign = "left",
): Record<string, string | number> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: justifyForAlign[align],
});


export const flexCellStyle = (
  align: FlexAlign = "left",
  pinnedBottomStyle: Record<string, string | number> = {
    fontWeight: 700,
    backgroundColor: "#f2f4f7",
  },
) => (params: any): Record<string, string | number> => {
  const base = baseFlexCellStyle(align);

  if (params?.node?.rowPinned === "bottom") {
    return { ...base, ...pinnedBottomStyle };
  }

  return base;
};
