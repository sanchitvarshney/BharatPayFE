import React, { memo, RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import CustomPagination from "@/components/reusable/CustomPagination";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  pageSize: number;
};
// Dummy data

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    sortable: true,
    width: 100,
    valueGetter: "node.rowIndex+1",
  },
  {
    headerName: "Part Code",
    field: "part_code",
    sortable: true,
    width: 180,
  },
  {
    headerName: "Part Name",
    field: "component_name",
    sortable: true,
    width: 450,
  },
  {
    headerName: "Category",
    field: "department",
    sortable: true,
    width: 180,
  },
  {
    headerName: "Opening Ballance",
    field: "opening_balance",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Purchase By MSC",
    field: "purchase_by_msc",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Purchase By BPE",
    field: "purchase_by_bpe",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Sent To BPE",
    field: "sent_to_bharatpe",
    sortable: true,
    width: 200,
  },
  {
    headerName: "Wastages",
    field: "wastage",
    sortable: true,
    width: 200,
  },
  {
    headerName: "Speaker",
    field: "total_consumption",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Speaker %",
    field: "component_percentage",
    sortable: true,
    width: 150,
  },
  {
    headerName: "Total Consume",
    field: "total_consumption",
    sortable: true,
    width: 250,
  },
  {
    headerName: "Closing Ballance",
    field: "closing_balance",
    sortable: true,
    width: 250,
  },
];

const EMPTY_ROWS: unknown[] = [];

const AssemblyAndTRCTable: React.FC<Props> = ({
  gridRef,
  handlePageChange,
  handlePageSizeChange,
  pageSize,
}) => {
  const trcAssemblyLoading = useAppSelector((state) => state.summary?.trcAssemblyLoading);
  const trcAssemblyData = useAppSelector((state) => state.summary?.trcAssemblyData);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const rowData = useMemo(() => trcAssemblyData?.data ?? EMPTY_ROWS, [trcAssemblyData?.data]);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-170px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={trcAssemblyLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          paginationPageSize={20}
          enableCellTextSelection={true}
        />
      </div>
      {trcAssemblyData && (
        <CustomPagination
          currentPage={trcAssemblyData?.pagination?.currentPage}
          totalPages={trcAssemblyData?.pagination?.totalPages}
          totalRecords={trcAssemblyData?.pagination?.totalRecords}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default memo(AssemblyAndTRCTable);
