import React, { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", sortable: true, filter: true, flex: 1, valueGetter: "node.rowIndex + 1", maxWidth: 80 },
  { headerName: "Item Name", field: "item_name", sortable: true, filter: true, flex: 1 },
  { headerName: "Item Code", field: "item_code", sortable: true, filter: true, flex: 1 },
  { headerName: "Unit", field: "item_uom", sortable: true, filter: true, flex: 1 },
  { headerName: "Approved Qty", field: "execute_qty", sortable: true, filter: true, flex: 1 },
  { headerName: "Status", field: "status", sortable: true, filter: true, flex: 1 },
];

const ApprovalItemDetailTable: React.FC = () => {
  const { approveItemDetail, approveItemDetailLoading } = useAppSelector((state) => state.pendingMr);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <>
      <div className="ag-theme-quartz h-[calc(100vh-50px)]">
        <AgGridReact loading={approveItemDetailLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={approveItemDetail} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </>
  );
};

export default ApprovalItemDetailTable;
