import React, { RefObject, useMemo } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Button } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { r4ReportDetail } from "@/features/report/report/reportSlice";
type Props = {
  gridRef: RefObject<AgGridReact<any>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Define new column definitions

// Generate dummy data according to pagination needs
const R4ReportTable: React.FC<Props> = ({ gridRef, setOpen }) => {
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
    { headerName: "SR No.", field: "productSrlNo", sortable: true, filter: true },
    { headerName: "IMEI", field: "productImei", sortable: true, filter: true },
    { headerName: "Requested Date", field: "insertDate", sortable: true, filter: true },
    { headerName: "Requested By", field: "insertBy", sortable: true, filter: true },
    { headerName: "Pick Location", field: "productionLocation", sortable: true, filter: true },
    { headerName: "Drop Location", field: "dropLocation", sortable: true, filter: true },
    { headerName: "", field: "prodductionId", sortable: true, filter: true, hide: true },
    {
      headerName: "",
      pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <Button
          onClick={() => {
            setOpen(true);
            dispatch(r4ReportDetail(params.data.prodductionId));
          }}
          variant="contained"
          size="small"
          startIcon={<FullscreenIcon fontSize="small" />}
        >
          Detail
        </Button>
      ),
      width: 150,
    },
  ];
  const { r4report, r4reportLoading } = useAppSelector((state) => state.report);

  const paginationPageSize = 20; // Define page size

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-175px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={r4reportLoading}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={r4report?r4report:[]}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={paginationPageSize}
        />
      </div>
    </div>
  );
};

export default R4ReportTable;
