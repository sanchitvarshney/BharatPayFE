import React from "react";
import { Typography, CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { FqcTableRow } from "./fqcDeviceImage.types";

type Props = {
  loading: boolean;
  error: string | null;
  rows: FqcTableRow[];
  columnDefs: ColDef<FqcTableRow>[];
};

const FqcDeviceImageResults: React.FC<Props> = ({
  loading,
  error,
  rows,
  columnDefs,
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
      <div className="ag-theme-quartz w-full h-full">
        <AgGridReact<FqcTableRow>
          rowData={rows}
          columnDefs={columnDefs}
          animateRows
          rowHeight={50}
          headerHeight={50}
          suppressContextMenu
        />
      </div>
    )}
  </div>
);

export default FqcDeviceImageResults;
