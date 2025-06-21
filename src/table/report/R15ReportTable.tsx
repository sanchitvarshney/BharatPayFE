import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { formatNumber } from "@/utils/numberFormatUtils";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  pageSize: number;
};

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    valueGetter: "node.rowIndex+1",
    maxWidth: 100,
  },
  {
    headerName: "Part Code",
    field: "partCode",
    sortable: true,
    filter: true,
    width: 150,
  },
  { headerName: "Part Name", field: "partName", sortable: true, filter: true },
  {
    headerName: "Opening Qty",
    field: "openingQty",
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => {
      return formatNumber(params.value);
    },
  },
  {
    headerName: "Inward Qty",
    field: "inwardQty",
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => {
      return formatNumber(params.value);
    },
  },
  {
    headerName: "Consumption Qty",
    field: "consumpQty",
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => {
      return formatNumber(params.value);
    },
  },
  {
    headerName: "Closing Qty",
    field: "closingQty",
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => {
      return formatNumber(params.value);
    },
  },
  {
    headerName: "Count Qty",
    field: "countQty",
    sortable: true,
    filter: true,
    valueFormatter: (params: any) => {
      return formatNumber(params.value);
    },
  },
  { headerName: "Abnormal Qty", field: "qty", sortable: true, filter: true },
  {
    headerName: "Physical Date",
    field: "physicalDt",
    sortable: true,
    filter: true,
  },
];

const R13ReportTable: React.FC<Props> = ({
  gridRef,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const { r15Report, r15ReportLoading } = useAppSelector(
    (state) => state.report
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-160px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r15ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r15Report?.data || []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          enableCellTextSelection
        />
      </div>
      {r15Report && (
        <CustomPagination
          currentPage={r15Report?.pagination?.currentPage as any}
          totalPages={r15Report?.pagination?.totalPages as any}
          totalRecords={r15Report?.pagination?.totalRecords as any}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default R13ReportTable;
