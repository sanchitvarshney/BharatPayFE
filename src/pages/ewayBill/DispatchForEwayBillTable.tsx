import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RowData {
  txnId: string;
  sku: string;
  skuName: string;
  dispatchDate: string;
  dispatchQty: number;
  inserby: string;
  dispatchId: string;
}

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTxn: React.Dispatch<React.SetStateAction<string>>;
};

const R5ReportTable: React.FC<Props> = ({ gridRef, setTxn, setOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rowData: RowData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleFilloutEwayBill = () => {
    if (selectedRow) {
      setSheetOpen(true);
      handleMenuClose();
    }
  };

  const handleCreateEwayBill = () => {
    if (selectedRow) {
      // Add your create eway bill logic here
      console.log("Create eway bill for:", selectedRow);
      const txnId = selectedRow.txnId;
      const shipmentId = txnId.replace(/\//g, "_");
      fnOpenNewWindow(`/create/e-waybill/${shipmentId}`);
      handleMenuClose();
    }
  };

  function fnOpenNewWindow(link:string) {
    // Define window dimensions
    const width = 920;
    const height = 500;

    // Calculate the position to center the window on the screen
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    // Open the new window centered on the screen
    window.open(
        link,
        'Spigen',
        `width=${width},height=${height},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`
    );
}

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      // pinned: "right",
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: RowData }) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, params.data)}
          className="hover:bg-gray-100"
        >
          <MoreVertIcon className="h-4 w-4" />
        </IconButton>
      ),
      width: 50,
    },
    { headerName: "SKU", field: "sku", sortable: true, filter: true, flex: 1 },
    {
      headerName: "SKU Name",
      field: "skuName",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Dispatch Date",
      field: "dispatchDate",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Dispatch Qty",
      field: "dispatchQty",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Insert By",
      field: "inserby",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "TXN ID",
      field: "txnId",
      sortable: false,
      filter: true,
      flex: 1,
      hide: true,
    },
    {
      headerName: "--",
      field: "dispatchId",
      sortable: true,
      filter: true,
      flex: 1,
      hide: true,
    },
  ];

  const { r5report, r5reportLoading } = useAppSelector((state) => state.report);
  const paginationPageSize = 20;

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  return (
    <>
      <div>
        <div className="relative ag-theme-quartz h-[calc(105vh-140px)]">
          <AgGridReact
            ref={gridRef}
            loadingOverlayComponent={CustomLoadingOverlay}
            loading={r5reportLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={r5report ? r5report : []}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
          />
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleFilloutEwayBill}>
            Fillout ewayBill data
          </MenuItem>
          <MenuItem onClick={handleCreateEwayBill}>Create eway bill</MenuItem>
        </Menu>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>
              Fillout Eway Bill Data - {selectedRow?.txnId}
            </SheetTitle>
          </SheetHeader>
          <div className="ag-theme-quartz h-[calc(100vh-200px)] grid grid-cols-4 gap-4">
            <div className="col-span-1 max-h-[calc(100vh-210px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-4 p-4">
              <Card className="rounded-sm shadow-sm shadow-slate-500">
                <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                  <CardTitle className="font-[550] text-slate-600">
                    Dispatch Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                  <div className="grid grid-cols-[1fr_150px]">
                    <div>
                      <h3 className="font-[600]">SKU</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{selectedRow?.sku || "--"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_150px]">
                    <div>
                      <h3 className="font-[600]">SKU Name</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {selectedRow?.skuName || "--"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_150px]">
                    <div>
                      <h3 className="font-[600]">Dispatch Date</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {selectedRow?.dispatchDate || "--"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_150px]">
                    <div>
                      <h3 className="font-[600]">Quantity</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {selectedRow?.dispatchQty || "--"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3">
              {/* Add your form or additional content here */}
            </div>
          </div>
          <div className="bg-white border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px] text-white"
              onClick={() => {
                setTxn(selectedRow?.txnId || "");
                setOpen(true);
                setSheetOpen(false);
              }}
            >
              Submit
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default R5ReportTable;
