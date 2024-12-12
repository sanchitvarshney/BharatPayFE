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
  { headerName: "#", field: "txnID", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
  { headerName: "SIM Number", field: "simNo", sortable: true, filter: true },
  { headerName: "Insert Date", field: "insertDt", sortable: true, filter: true },
  { headerName: "Inserted By", field: "insertBy", sortable: true, filter: true },
  { headerName: "SIM Status", field: "sim_status", sortable: true, filter: true },
  { headerName: "Out Date", field: "outDate", sortable: true, filter: true },
  { headerName: "Out By", field: "outBy", sortable: true, filter: true },
  { headerName: "Out Transaction", field: "outTxn", sortable: true, filter: true },
  { headerName: "TXN ID", field: "txnID", sortable: true, filter: true },
];

const Q5StatementTable: React.FC<Props> = ({ gridRef }) => {
  const { q5Data, q5DataLoading } = useAppSelector((state) => state.query);

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
          loading={q5DataLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={q5Data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default Q5StatementTable;
