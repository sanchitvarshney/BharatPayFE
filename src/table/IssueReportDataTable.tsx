import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

type Props = {
  rowData: any[];
};
const IssueReportDataTable: React.FC<Props> = ({ rowData }) => {
  const columnDefs: ColDef[] = useMemo(() => {
    if (Array.isArray(rowData)) {
      if (rowData?.length === 0) return [];
      return Object.keys(rowData[0]).map((key) => ({
        headerName: key
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
          .join(" "),
        sortable: true,
        filter: true,
        resizable: true,
      }));
    } else {
      return [];
    }
  }, [rowData]);

  return (
    <div className="ag-theme-quartz">
      <AgGridReact loading={false} overlayNoRowsTemplate={OverlayNoRowsTemplate} rowData={rowData} columnDefs={columnDefs} domLayout="autoHeight" />
    </div>
  );
};

export default IssueReportDataTable;
