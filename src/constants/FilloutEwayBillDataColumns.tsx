export const columnDefs= [
    { headerName: "Material", field: "material", editable: false, flex: 4, cellRenderer: "textInputCellRenderer", minWidth: 500 },
    { headerName: "Material Description	", field: "materialDescription", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 300 },
    { headerName: "Order Qty", field: "orderQty", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "Rate", field: "rate", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "GST Rate", field: "gstRate", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "GST Type", field: "gstType", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "CGST", field: "cgst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "SGST", field: "sgst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "IGST", field: "igst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "HSN / SAC", field: "hsnCode", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "Remark", field: "remark", editable: true, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  ];