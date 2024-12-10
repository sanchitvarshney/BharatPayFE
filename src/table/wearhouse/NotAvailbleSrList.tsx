import React, { useCallback, useMemo, useRef } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { Icons } from "@/components/icons";
import { IconButton, Typography } from "@mui/material";
import MuiTooltip from "@/components/reusable/MuiTooltip";

// Dummy data

const NotAvailbleSrList: React.FC = () => {
  const { notExistsr } = useAppSelector((state) => state.divicemin);
  console.log(notExistsr);
  const gridRef = useRef<AgGridReact<any>>(null);
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      sheetName: "R3 Report", // Set your desired sheet name here
    });
  }, []);
  const columnDefs: ColDef[] = [
    { headerName: "#", field: "id", sortable: true, filter: true, width: 100, valueGetter: "node.rowIndex+1" },
    {
      headerName: "Serial No.",
      field: "serialno",
      sortable: true,
      filter: true,
      flex: 1,

      headerComponent: () => (
        <div className="flex items-center justify-between w-full h-full">
          <Typography fontWeight={600} variant="inherit">
            Serial No.
          </Typography>
          <div className="flex items-center gap-[10px]">
            <MuiTooltip title="Download" placement="bottom">
              <IconButton color="success" disabled={!notExistsr || notExistsr.length === 0} onClick={onBtExport} type="button">
                <Icons.download />
              </IconButton>
            </MuiTooltip>
            <Typography variant="inherit" fontWeight={500}>
              Total :{notExistsr ? notExistsr.length : 0}
            </Typography>
          </div>
        </div>
      ),
    },
  ];
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
    };
  }, []);

  return (
    <div>
      <div className="relative ag-theme-quartz h-[calc(100vh-150px)]">
        <AgGridReact ref={gridRef} loadingOverlayComponent={CustomLoadingOverlay} overlayNoRowsTemplate={OverlayNoRowsTemplate} suppressCellFocus={true} rowData={notExistsr} columnDefs={columnDefs} defaultColDef={defaultColDef} pagination={true} paginationPageSize={20} />
      </div>
    </div>
  );
};

export default NotAvailbleSrList;
