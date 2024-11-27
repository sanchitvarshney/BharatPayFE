import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

const columnDefs: ColDef[] = [
  { headerName: "Date", field: "date", sortable: true, filter: true, },
  { headerName: "Changed Via", field: "changedVia", sortable: true, filter: true, },
  { headerName: "Reference", field: "reference", sortable: true, filter: true,  },
  { headerName: "Previous Quantity", field: "previousQuantity", sortable: true, filter: true,  },
  { headerName: "Change Quantity", field: "changeQuantity", sortable: true, filter: true,  },
  { headerName: "New Quantity", field: "newQuantity", sortable: true, filter: true,  },
  { headerName: "Price", field: "price", sortable: true, filter: true,  },
  { headerName: "Comment", field: "comment", sortable: true, filter: true,  },
  { headerName: "User", field: "user", sortable: true, filter: true,  },
  { headerName: "Store", field: "store", sortable: true, filter: true,  },
];

const dummyData = [
  {
    date: "2024-11-25",
    changedVia: "System",
    reference: "Order123",
    previousQuantity: 100,
    changeQuantity: -20,
    newQuantity: 80,
    price: 50.0,
    comment: "Adjustment",
    user: "John Doe",
    store: "Main Store",
  },
  {
    date: "2024-11-26",
    changedVia: "Manual",
    reference: "Order124",
    previousQuantity: 50,
    changeQuantity: 10,
    newQuantity: 60,
    price: 25.0,
    comment: "Stock Update",
    user: "Jane Smith",
    store: "Secondary Store",
  },
];

const ComponentHistoryTable: React.FC = () => {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: false,
      resizable: true,
    };
  }, []);

  return (
    <div>
      <div className="ag-theme-quartz h-[calc(100vh-298px)]">
        <AgGridReact
         loadingOverlayComponent={CustomLoadingOverlay}
         suppressCellFocus={true}
         overlayNoRowsTemplate={OverlayNoRowsTemplate}
          rowData={dummyData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={50}
        />
      </div>
    </div>
  );
};

export default ComponentHistoryTable;
