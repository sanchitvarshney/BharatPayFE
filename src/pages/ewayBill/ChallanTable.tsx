import React, { RefObject, useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHook";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import FillEwayBillSheet from "@/components/ewayBill/FillEwayBillSheet";
import { printChallan, printPartChallan } from "@/features/Dispatch/DispatchSlice";
import { cancelPartCodeChallan } from "@/features/procurement/poSlices";
import { showToast } from "@/utils/toasterContext";

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
  type?: string;
  itemType?: string;
}

type Props = {
  gridRef: RefObject<AgGridReact<RowData>>;
  challanType?: string;
};

const ChallanTable: React.FC<Props> = ({ gridRef, challanType }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
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
  const handleCancelChallan = () => {
    handleMenuClose();
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim() || !selectedRow) return;
    setCancelLoading(true);
    dispatch(
      cancelPartCodeChallan({ challanId: selectedRow.challanId, reason: cancelReason.trim() })
    ).then((res: any) => {
      setCancelLoading(false);
      setCancelDialogOpen(false);
      if (res?.payload?.data?.success) {
        showToast("Challan cancelled successfully", "success");
      } else {
        showToast(res?.payload?.data?.message || "Failed to cancel challan", "error");
      }
    });
  };

  const handlePrintChallan = () => {
    if (selectedRow) {
      const txnId = selectedRow.challanId;
      const shipmentId = txnId.replace(/\//g, "/");
      const printAction = challanType === "PART" ? printPartChallan : printChallan;
      dispatch(printAction({ challanId: shipmentId })).then((res) => {
        const payload = res.payload as
          | { data?: { success?: boolean; data?: string } }
          | undefined;

        if (payload?.data?.success && payload.data.data) {
          window.open(payload.data.data, "_blank");
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
          : params.data.deviceType == "scrapDevice"
          ? "Scrap Device"
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
      headerName: "Is Eway Bill",
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
          {challanType !== "PART" && (
            <MenuItem
              onClick={handleEditChallan}
              disabled={selectedRow ? isDispatchCreated(selectedRow) : false}
            >
              Edit
            </MenuItem>
          )}
          {challanType !== "PART" && (
            <MenuItem
              onClick={handleCreateDispatch}
              disabled={selectedRow ? isDispatchCreated(selectedRow) : false}
            >
              Create Dispatch
            </MenuItem>
          )}
          {challanType === "PART" && (
            <MenuItem onClick={handleCancelChallan} sx={{ color: "error.main" }}>
              Cancel
            </MenuItem>
          )}
          <MenuItem onClick={handlePrintChallan}>Print</MenuItem>
        </Menu>
      </div>

      <FillEwayBillSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedRow={selectedRow}
      />

      {/* ── Cancel Challan Dialog ── */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => { if (!cancelLoading) setCancelDialogOpen(false); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Cancel Challan</DialogTitle>
        <DialogContent>
          <p className="text-slate-500 text-[13px] mb-4">
            Challan ID: <strong className="text-slate-700">{selectedRow?.challanId}</strong>
          </p>
          <TextField
            label="Reason for Cancellation"
            required
            multiline
            rows={3}
            fullWidth
            autoFocus
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            error={cancelReason.trim() === ""}
            helperText={cancelReason.trim() === "" ? "Reason is mandatory" : ""}
            placeholder="Enter reason for cancellation..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            disabled={cancelLoading}
            onClick={() => setCancelDialogOpen(false)}
          >
            Close
          </Button>
          <LoadingButton
            loading={cancelLoading}
            variant="contained"
            color="error"
            disabled={!cancelReason.trim()}
            onClick={handleConfirmCancel}
          >
            Confirm Cancel
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChallanTable;
