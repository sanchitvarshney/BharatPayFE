import React, { RefObject, useMemo, useEffect, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";


type Props = {
    gridRef: RefObject<AgGridReact<any>>;
  };
// Dummy data
const dummyData= Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  imei: `IMEI${index + 1}`,
  IR: `IR${index + 1}`,
  voltage: ` ${index + 10}V`,
  remark: `Remark ${index + 1}`,
  date: `Date ${index + 1}`,
  By: `By User ${index + 1}`,
}));

const columnDefs: ColDef[] = [
  { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
  { headerName: "IMEI", field: "imei", sortable: true, filter: true ,flex:1},
  { headerName: "IR (Internal Resistance)", field: "IR", sortable: true, filter: true, flex:1 },
  { headerName: "Voltage", field: "voltage", sortable: true, filter: true ,flex:1},
  { headerName: "Insert Date", field: "date", sortable: true, filter: true,flex:1 },
  { headerName: "Insert By", field: "By", sortable: true, filter: true,flex:1 },
  { headerName: "Remark", field: "remark", sortable: true, filter: true,flex:1 },
];


const R3ReportTable: React.FC<Props>= ({ gridRef }) => {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState<any[]>([]);
  
  // Simulate data loading
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      setTimeout(() => {
        setRowData(dummyData);
        setLoading(false);
      }, 2000); // 2-second delay to simulate loading
    };
    fetchData();
  }, []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-135px)]">
        <AgGridReact
         ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={loading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
         
        />
      </div>
    </div>
  );
};

export default R3ReportTable;
