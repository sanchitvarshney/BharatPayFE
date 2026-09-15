import React from "react";
import { Typography, CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import CustomPagination from "@/components/reusable/CustomPagination";
import { FqcPagination } from "@/features/common/commonSlice";
import { FqcTableRow } from "./fqcDeviceImage.types";

type Props = {
  loading: boolean;
  error: string | null;
  rows: FqcTableRow[];
  columnDefs: ColDef<FqcTableRow>[];
  page: number;
  limit: number;
  pagination: FqcPagination | null;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const FqcDeviceImageResults: React.FC<Props> = ({
  loading,
  error,
  rows,
  columnDefs,
  page,
  limit,
  pagination,
  onPageChange,
  onLimitChange,
}) => (
  <div className="w-full flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
    {loading ? (
      <div className="flex items-center justify-center h-full">
        <CircularProgress  />
      </div>
    ) : error ? (
      <div className="flex items-center justify-center h-full">
        <Typography color="error">{error}</Typography>
      </div>
    ) : !rows.length ? (
      <div className="flex flex-col items-center justify-center h-full">
        <img
          src="/search.svg"
          className="w-[200px] opacity-60 mb-4"
          alt="No images"
        />
        <Typography variant="body2" color="textSecondary">
          No images to display
        </Typography>
      </div>
    ) : (
      <>
        <div className="ag-theme-quartz w-full flex-1">
          <AgGridReact<FqcTableRow>
            rowData={rows}
            columnDefs={columnDefs}
            animateRows
            rowHeight={50}
            headerHeight={50}
            suppressContextMenu
          />
        </div>
        {pagination && (
          <CustomPagination
            currentPage={page}
            totalPages={pagination.totalPages}
            totalRecords={pagination.totalDsns}
            onPageChange={onPageChange}
            pageSize={limit}
            onPageSizeChange={onLimitChange}
          />
        )}
      </>
    )}
  </div>
);

export default FqcDeviceImageResults;
