import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Typography } from "@mui/material";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    filter: true,
    width: 80,
    valueGetter: "node.rowIndex+1",
  },
  {
    headerName: "Model",
    field: "model",
    sortable: true,
    filter: true,
    width: 180,
  },
  {
    headerName: "SKU",
    field: "sku",
    sortable: true,
    filter: true,
    width: 180,
  },
  {
    headerName: "Product Name",
    field: "product_name",
    sortable: true,
    filter: true,
    width: 260,
  },
  {
    headerName: "Inward",
    field: "inward",
    sortable: true,
    filter: true,
    width: 150,
         headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Outward",
    field: "outward",
    sortable: true,
    filter: true,
    width: 150,
         headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Partial MIN",
    field: "partial_min",
    sortable: true,
    filter: true,
    width: 180,
         headerClass: "ag-right-aligned-header",
          cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Device Image",
    field: "device_img",
    sortable: false,
    filter: false,
    width: 160,
    cellRenderer: (params: any) => {
      if (!params.value) return "-";
      return (
       <Typography variant="body2" className="text-slate-500">
            {params.value}
       
        </Typography>
      );
    },
  },
];

const QcMinOutwardTable: React.FC<Props> = ({ gridRef }) => {
  const { qcminreport, qcminreportLoading } = useAppSelector(
    (state) => state.reportSummary,
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={qcminreportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={qcminreport?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default QcMinOutwardTable;
