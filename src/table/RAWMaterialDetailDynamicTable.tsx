import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";

type Props = {
  rowData: any[];
};
const RAWMaterialDetailDynamicTable: React.FC<Props> = ({ rowData }) => {
  const columnDefs: ColDef[] = useMemo(() => {
    if (Array.isArray(rowData)) {
      if (rowData?.length === 0) return [];
      return Object.keys(rowData[0]).map((key) => ({
        headerName: key,
        field: key,
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

export default RAWMaterialDetailDynamicTable;
