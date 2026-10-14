

export const rightAlignedCellStyle = {
  textAlign: "right",
  justifyContent: "flex-end",
  paddingRight: "10px",
} as const;

export const centerAlignedCellStyle = {
  textAlign: "center",
  justifyContent: "center",
} as const;

export const rightAlignedColumn = {
  cellStyle: rightAlignedCellStyle,
  headerClass: "ag-right-aligned-header",
};

export const centerAlignedColumn = {
  cellStyle: centerAlignedCellStyle,
  headerClass: "ag-center-aligned-header",
};
