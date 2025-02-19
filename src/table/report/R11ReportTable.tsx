import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", valueGetter: "node.rowIndex+1", maxWidth: 100 },
  { headerName: "IMEI", field: "imei", sortable: true, filter: true, width: 150 },
  { headerName: "Issue", field: "issue", sortable: true, filter: true },
  { headerName: "Resolution Date", field: "resDt", sortable: true, filter: true },
  { headerName: "Resolution Remark", field: "resRemark", sortable: true, filter: true },
  { headerName: "Resolve Status", field: "resolveStatus", sortable: true, filter: true },
  { headerName: "Serial", field: "serial", sortable: true, filter: true },
  { headerName: "Submit Date", field: "submitDt", sortable: true, filter: true },
  { headerName: "Submit Remark", field: "submitRemark", sortable: true, filter: true },
  { headerName: "Transaction ID", field: "txnID", sortable: true, filter: true, width: 250 },
];


const R8ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r11Report, r11ReportLoading } = useAppSelector((state) => state.report);
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
          loading={r11ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r11Report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default R8ReportTable;
