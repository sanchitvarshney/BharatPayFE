import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import { Button } from "@mui/material";
import { Icons } from "@/components/icons";
import { getR1Data } from "@/features/report/report/reportSlice";
type Props = {
  gridRef?: RefObject<AgGridReact<any>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMin: React.Dispatch<React.SetStateAction<string>>;
};

const R1reportTable: React.FC<Props> = ({ gridRef, setOpen,setMin }) => {
  const dispatch = useAppDispatch();
  const { mainR1Report, mainR1ReportLoading } = useAppSelector((state) => state.report);
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
    { headerName: "MIN No.", field: "minNo", sortable: true, filter: true },
    { headerName: "Insert Date", field: "insertDt", sortable: true, filter: true },
    { headerName: "SKU Code", field: "skuCode", sortable: true, filter: true },
    { headerName: "SKU Name", field: "skuName", sortable: true, filter: true },
    { headerName: "QTY", field: "inQty", sortable: true, filter: true },
    { headerName: "Unit", field: "uom", sortable: true, filter: true },
    { headerName: "In Location", field: "inLoc", sortable: true, filter: true },
    { headerName: "Vendor Name", field: "vendorName", sortable: true, filter: true },
    { headerName: "Vendor Code", field: "vendorCode", sortable: true, filter: true },
    { headerName: "Vendor Address", field: "vendorAddress", sortable: true, filter: true, cellRenderer: (params: any) => replaceBrWithNewLine(params.value), autoHeight: true, maxWidth: 400 },
    { headerName: "DOC Type", field: "docType", sortable: true, filter: true },
    { headerName: "DOC No.", field: "docNo", sortable: true, filter: true },
    { headerName: "DOC Date", field: "docDate", sortable: true, filter: true },
    {
      headerName: "",
      field: "action",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <Button
          onClick={() => {
            setOpen(true);
            dispatch(getR1Data({ type: "min", data: params.data.minNo }));
            setMin(params.data.minNo);
          }}
          variant="contained"
          startIcon={<Icons.view fontSize="small" />}
        >
          View Deatil
        </Button>
      ),
      pinned: "right",
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);
  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          ref={gridRef}
          loading={mainR1ReportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={mainR1Report ? mainR1Report : []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          enableCellTextSelection
        />
      </div>
    </div>
  );
};

export default R1reportTable;
