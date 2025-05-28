import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { formatNumber } from "@/utils/numberFormatUtils";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", valueGetter: "node.rowIndex+1", maxWidth: 100 },
  { headerName: "#", field: "txnId", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1", hide: true },
  { headerName: "Part Code", field: "partCode", sortable: true, filter: true },
  { headerName: "Component Name", field: "componentName", sortable: true, filter: true },
  { headerName: "Category", field: "category", sortable: true, filter: true },
  { headerName: "Sub-Category", field: "subCategory", sortable: true, filter: true },
  { headerName: "UOM", field: "uom", sortable: true, filter: true },
  { headerName: "Out Quantity", field: "outQty", sortable: true, filter: true, valueFormatter: (params: any) => {
    return formatNumber(params.value);
  }},
  { headerName: "Location From", field: "locFrom", sortable: true, filter: true },
  { headerName: "Location In", field: "locIn", sortable: true, filter: true },
  { headerName: "Requested By", field: "reqBy", sortable: true, filter: true },
  { headerName: "Insert Date", field: "insertDt", sortable: true, filter: true },
  { headerName: "Approved By", field: "approvedBy", sortable: true, filter: true },
];

const R8ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { r8Report, r8ReportLoading } = useAppSelector((state) => state.report);
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
          loading={r8ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r8Report || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          enableCellTextSelection
        />
      </div>
    </div>
  );
};

export default R8ReportTable;
