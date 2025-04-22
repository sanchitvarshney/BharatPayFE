import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};
// Dummy data

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
  { headerName: "IMEI", field: "imeiNo", sortable: true, filter: true,width: 150},
  { headerName: "Transaction ID", field: "txnId", sortable: true, filter: true, width: 150},
  { headerName: "IR (Internal Resistance)", field: "ir", sortable: true, filter: true, width: 250},
  { headerName: "Voltage", field: "volt", sortable: true, filter: true, width: 150},
  { headerName: "Battary ID", field: "batteryId", sortable: true, filter: true, width: 150 },
  { headerName: "Status", field: "status", sortable: true, filter: true, width: 150  },
  { headerName: "Insert Date", field: "insertDate", sortable: true, filter: true, width: 150 },
  { headerName: "Insert By", field: "insertBy", sortable: true, filter: true,width: 150   },
  { headerName: "Remark", field: "remark", sortable: true, filter: true, width: 150 },
];

const R3ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r3reportLoading, r3report } = useAppSelector((state) => state.report);
  // Simulate data loading

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r3reportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r3report ? r3report : []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default R3ReportTable;
