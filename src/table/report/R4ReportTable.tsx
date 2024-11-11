import React, { RefObject, useMemo, useEffect, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

// Define new column definitions
const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
  { headerName: "Component", field: "component", sortable: true, filter: true, flex: 1 },
  { headerName: "QTY", field: "qty", sortable: true, filter: true, flex: 1 },
  { headerName: "Requested Date", field: "requestedDate", sortable: true, filter: true, flex: 1 },
  { headerName: "Requested By", field: "requestedBy", sortable: true, filter: true, flex: 1 },
  { headerName: "Request Status", field: "requestStatus", sortable: true, filter: true, flex: 1 },
  { headerName: "Remark", field: "remark", sortable: true, filter: true, flex: 1 },
];

// Generate dummy data according to pagination needs
const generateDummyData = (_: number, totalRows: number) => {
  return Array.from({ length: totalRows }, (_, index) => ({
    id: index + 1,
    component: `Component ${index + 1}`,
    qty: Math.floor(Math.random() * 10) + 1,
    requestedDate: `2023-11-${String((index % 30) + 1).padStart(2, "0")}`,
    requestedBy: `User ${index + 1}`,
    requestStatus: ["Pending", "Approved", "Rejected"][index % 3],
    remark: `Remark ${index + 1}`,
  }));
};

const R4ReportTable: React.FC<Props> = ({ gridRef }) => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const paginationPageSize = 20; // Define page size
  const totalRows = 100; // Define total number of rows to simulate multiple pages

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setRowData(generateDummyData(paginationPageSize, totalRows));
      setLoading(false);
    }, 1000); // Simulate 1-second loading time

    return () => clearTimeout(timeout);
  }, []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-135px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={loading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={paginationPageSize}
        />
      </div>
    </div>
  );
};

export default R4ReportTable;
