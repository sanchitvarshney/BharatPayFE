import React, { RefObject, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppSelector } from "@/hooks/useReduxHook";

type Props = {
  gridRef: RefObject<AgGridReact<any>>;
};
const Q2ReportTable: React.FC<Props> = ({ gridRef }) => {
  const { q1Data, getQ1DataLoading } = useAppSelector((state) => state.query);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: (params: any) => params.node.rowIndex + 1 },
    { headerName: "Date", field: "insertDate", sortable: true, filter: true },
    { headerName: "Type", field: "type", sortable: true, filter: true, cellRenderer: (params: any) => params.value?.type },
    { headerName: "Transaction", field: "type", sortable: true, filter: true, cellRenderer: (params: any) => params.value?.txnID },
    { headerName: "Qty In", field: "qtyIn", sortable: true, filter: true, width: 100 },
    { headerName: "Qty Out", field: "qtyOut", sortable: true, filter: true, width: 120 },
    { headerName: "Location In", field: "locIn", sortable: true, filter: true },
    { headerName: "Location Out", field: "locOut", sortable: true, filter: true },
    { headerName: "Vendor", field: "vendor", sortable: true, filter: true, cellRenderer: (params: any) => params.value?.name },
    { headerName: "Vendor Code", field: "vendor", sortable: true, filter: true, cellRenderer: (params: any) => params.value?.code },
    { headerName: "Inserted By", field: "insertBy", sortable: true, filter: true },
  ];

  return (
    <div>
      <div className=" ag-theme-quartz h-[calc(100vh-85px)]">
        <AgGridReact ref={gridRef} loading={getQ1DataLoading} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={q1Data?.body} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default Q2ReportTable;
