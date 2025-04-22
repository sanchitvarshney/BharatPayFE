import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};
// Dummy data

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
  { headerName: "IMEI", field: "imeiNo", sortable: true, filter: true,width: 150},
  { 
    headerName: "Transaction ID", 
    field: "txnId", 
    sortable: true, 
    filter: true, 
    width: 180,
    cellRenderer: (params: any) => {
      return (
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(params.value);
              showToast("Transaction ID copied to clipboard", "info");
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 shadow-sm hover:shadow border border-indigo-100"
            title={`Copy Transaction ID: ${params.value}`}
          >
            <span>Copy ID</span>
            <svg 
              className="w-4 h-4 transition-transform duration-200 group-hover:rotate-3" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      );
    }
  },
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
