import React, { memo, RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
// import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  // handlePageChange: (page: number) => void;
  // handlePageSizeChange: (pageSize: number) => void;
  // pageSize: number;
};

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    width: 100,
    valueGetter: (params) => {
    if (params?.node?.rowPinned) {
      return "";
    }

    return (params?.node?.rowIndex ?? 0) + 1;
  },
  },
  {
    headerName: "Part Code",
    field: "part_code",
    sortable: true,
    width: 180,
  },
  {
    headerName: "Component Name",
    field: "component_name",
    sortable: true,
    width: 450,
  },
  {
    headerName: "Quantity",
    field: "qty",
    sortable: true,
    width: 180,
  },
  {
    headerName: "Rate",
    field: "rate",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Taxable Amount",
    field: "taxable_amount",
    sortable: true,
    width: 250,
  },
  {
    headerName: "GST Rate",
    field: "gst_rate",
    sortable: true,
    width: 250,
  },
  {
    headerName: "GST Amount",
    field: "gst_amount",
    sortable: true,
    width: 200,
  },
  {
    headerName: "Total Invoice",
    field: "total_invoice",
    sortable: true,
    width: 200,
  },
];

const EMPTY_ROWS: unknown[] = [];

const MaterialPurchaseTable: React.FC<Props> = ({
  gridRef,
  // handlePageChange,
  // handlePageSizeChange,
  // pageSize,
}) => {
  const { materialData, materialLoading } = useAppSelector(
    (state) => state.summary,
  );
  const tabValue = useAppSelector((state) => state.summary?.tabValue);

const defaultColDef = useMemo<ColDef>(() => ({
  filter: true,

  cellStyle: (params) => {
    if (params.node.rowPinned === "bottom") {
      return {
        fontWeight: 700,
        backgroundColor: "#f2f4f7",
         display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", 
    
      };
    }

    return undefined;
  },
}), []);

  const rowData = useMemo(
    () => materialData?.data ?? EMPTY_ROWS,
    [materialData?.data],
  );
 const buildGrandTotalRow = (apiResponse: any[] | null) => ({
  id: "grand-total",
  part_code: "",
  component_name: "Grand Total",

  qty: Number(
    (apiResponse?.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0,
    ) ?? 0).toFixed(3),
  ),

  rate: "",

  taxable_amount: Number(
    (apiResponse?.reduce(
      (sum, item) => sum + Number(item.taxable_amount || 0),
      0,
    ) ?? 0).toFixed(3),
  ),

  gst_rate: "",

  gst_amount: Number(
    (apiResponse?.reduce(
      (sum, item) => sum + Number(item.gst_amount || 0),
      0,
    ) ?? 0).toFixed(3),
  ),

  total_invoice: Number(
    (apiResponse?.reduce(
      (sum, item) => sum + Number(item.total_invoice || 0),
      0,
    ) ?? 0).toFixed(3),
  ),
});

  const grandTotalRow = useMemo(() => buildGrandTotalRow(rowData), [rowData]);
  
  return (
    <div>
      <div
        className={`relative ag-theme-quartz ${tabValue === "preview" ? "h-[calc(100vh-210px)]" : "h-[calc(100vh-195px)]"}`}
      >
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={materialLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pinnedBottomRowData={rowData ? [grandTotalRow] : []}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
          
        />
      </div>
      {/* {materialData?.pagination && (
        <CustomPagination
          currentPage={materialData?.pagination?.page || 0}
          totalPages={materialData?.pagination?.total_pages || 0}
          totalRecords={materialData?.pagination?.total_records || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize || 0}
        />
      )} */}
    </div>
  );
};

export default memo(MaterialPurchaseTable);
