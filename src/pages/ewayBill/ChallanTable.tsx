import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewChallanDialog from "@/components/ewayBill/ViewChallanDialog";
import { useNavigate } from "react-router-dom";
import FillEwayBillSheet from "@/components/ewayBill/FillEwayBillSheet";
import { printChallan } from "@/features/Dispatch/DispatchSlice";

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
  challanId: string;
}

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
};

const ChallanTable: React.FC<Props> = ({ gridRef }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewChallanOpen, setViewChallanOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    rowData: RowData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowData);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewChallan = () => {
    setViewChallanOpen(true);
    handleMenuClose();
  };

  const handleEditChallan = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "_");
      navigate(`/update-challan/${shipmentId}`);
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
  const handlePrintChallan = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "/");
      dispatch(printChallan({ challanId: shipmentId })).then((res: any) => {
        if (res.payload.data.success) {
          window.open(res.payload.data.data, "_blank");
        }
      });
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
    {
      headerName: "Challan ID",
      field: "challanId",
      sortable: true,
      filter: true,
      flex: 1,
      sort: "desc",
    },
    {
      headerName: "Quantity",
      field: "dispatchQty",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Client",
      field: "clientDetail.name",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Ship Label",
      field: "shipToDetails.shipLabel",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Ship Company",
      field: "shipToDetails.shipCompany",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Other Ref",
      field: "otherRef",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Dispatch Date",
      field: "date",
      sortable: true,
      filter: true,
      flex: 1,
    },
  ];

  const { challanList, getChallanLoading } = useAppSelector(
    (state) => state.dispatch
  );
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
            loading={getChallanLoading}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={challanList || []}
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
          <MenuItem onClick={handleViewChallan}>View</MenuItem>
          <MenuItem onClick={handleEditChallan}>Edit</MenuItem>
          <MenuItem onClick={handleCreateEwayBill}>Create Dispatch</MenuItem>
          <MenuItem onClick={handlePrintChallan}>Print</MenuItem>
        </Menu>
      </div>

      <FillEwayBillSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedRow={selectedRow}
      />

      <ViewChallanDialog
        open={viewChallanOpen}
        onClose={() => setViewChallanOpen(false)}
        challanDetails={selectedRow}
      />
    </>
  );
};

export default ChallanTable;
