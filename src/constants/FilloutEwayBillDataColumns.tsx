export const columnDefs= [
    { headerName: "Material", field: "material", editable: false, flex: 4, minWidth: 300 },
    { headerName: "Dispatch Qty", field: "orderQty", editable: false, flex: 1, minWidth: 200 },
    { headerName: "HSN Code", field: "hsnCode", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "Rate", field: "rate", editable: false, cellRenderer: "textInputCellRenderer", flex: 1, minWidth: 200 },
    { headerName: "Taxable Value", field: "localValue", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "GST Type", field: "gstType", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "GST Rate", field: "gstRate", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "CGST", field: "cgst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "SGST", field: "sgst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "IGST", field: "igst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
    { headerName: "Remark", field: "remark", editable: true, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 300 },
  ];