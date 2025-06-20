import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FillEwayBillSheet from "@/components/ewayBill/FillEwayBillSheet";
import { getDispatchData } from "@/features/Dispatch/DispatchSlice";

interface RowData {
  orderQty: number;
  material: string;
  hsnCode: string;
  isNew: boolean;
  taxableValue: number;
  txnId: string;
  dispatchId: string;
  dispatchDate: string;
  inserby: string;
  skuName: string;
  sku: string;
}

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
};

const R5ReportTable: React.FC<Props> = ({ gridRef }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rowData: RowData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedRow(null);
  };

  const handleFilloutEwayBill = () => {
    if (selectedRow) {
      setSheetOpen(true);
      handleMenuClose();
      dispatch(getDispatchData(selectedRow.txnId));
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

  function fnOpenNewWindow(link: string) {
    // Define window dimensions
    const width = 920;
    const height = 500;

    // Calculate the position to center the window on the screen
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Open the new window centered on the screen
    window.open(
      link,
      "Spigen",
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
            rowData={r5report?.data|| []}
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

      <FillEwayBillSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default R5ReportTable;
