import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  isdispatch: string;
  isewaybill: string;
  deviceType: string;
}

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
};

const ChallanTable: React.FC<Props> = ({ gridRef }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
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

  const handleEditChallan = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "_");
      navigate(`/update-challan/${shipmentId}`);
      handleMenuClose();
    }
  };

  const handleCreateDispatch = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "_");
      if (selectedRow.deviceType == "wrongDevices") {
        navigate(`/dispatch/wrong-device/${shipmentId}`);
      } else {
        navigate(`/dispatch/create/${shipmentId}`);
      }
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
      handleMenuClose();
    }
  };

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
      minWidth: 190,
    },
    {
      headerName: "Quantity",
      field: "dispatchQty",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 140,
    },
    {
      headerName: "Type",
      field: "deviceType",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 140,
      valueGetter: (params: { data: RowData }) =>
        params.data.deviceType == "wrongDevices"
          ? "Wrong Device"
          : params.data.deviceType == "swipedevice"
          ? "Swipe Device"
          : "Sound Box",
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
      minWidth: 160,
    },
    {
      headerName: "Ship Company",
      field: "shipToDetails.shipCompany",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Other Ref",
      field: "otherRef",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Dispatch Date",
      field: "date",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Is Dispatch",
      field: "isdispatch",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
      valueGetter: (params: { data: RowData }) =>
        params.data.isdispatch == "Y" ? "Yes" : "No",
    },
    {
      headerName: "Eway Bill No",
      field: "isewaybill",
      sortable: true,
      filter: true,
      flex: 1,
      valueGetter: (params: { data: RowData }) =>
        params.data.isewaybill == "Y"
          ? "Yes"
          : params.data.isewaybill == "C"
          ? "Cancelled"
          : "No",
      minWidth: 160,
    },
    {
      headerName: "Dispatch Date",
      field: "date",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
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

  const isDispatchCreated = (row: RowData) => row.isdispatch === "Y";

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
          <MenuItem
            onClick={handleEditChallan}
            disabled={selectedRow ? isDispatchCreated(selectedRow) : false}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={handleCreateDispatch}
            disabled={selectedRow ? isDispatchCreated(selectedRow) : false}
          >
            Create Dispatch
          </MenuItem>
          <MenuItem onClick={handlePrintChallan}>Print</MenuItem>
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

export default ChallanTable;
