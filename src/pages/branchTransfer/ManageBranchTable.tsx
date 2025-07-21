import { useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  InputAdornment,
  Stack,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons";
import { transferBranchReport } from "@/features/report/report/reportSlice";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { showToast } from "@/utils/toasterContext";
import {
  approveTransfer,
  printBranchTransferChallan,
  rejectTransfer,
} from "@/features/Dispatch/DispatchSlice";
import MuiTooltip from "@/components/reusable/MuiTooltip";

// Generate dummy data according to pagination needs
const ManageBranchTable = () => {
  const dispatch = useAppDispatch();

  const columnDefs: ColDef[] = [
    {
      field: "txnId",
      headerName: "Print Challan",
      sortable: true,
      filter: true,
      pinned: "left",
      cellRenderer: (params: any) => {
        return (
          <div className="flex items-center justify-center h-full gap-[10px]">
            {false === params.data.insertDt ? (
              <CircularProgress size={20} />
            ) : (
              <MuiTooltip title="Print" placement="left">
                <IconButton
                  onClick={() => {
                    dispatch(
                      printBranchTransferChallan(params.data.challanId)
                    ).then((response: any) => {
                      if (response?.payload?.status === 200) {
                        window.open(response.payload.data?.data, "_blank");
                      }
                    });
                  }}
                  color="primary"
                >
                  <LocalPrintshopIcon />
                </IconButton>
              </MuiTooltip>
            )}

            {params.value}
          </div>
        );
      },
    },
    {
      headerName: "#",
      field: "serialNo",
      sortable: true,
      filter: true,
      valueGetter: "node.rowIndex+1",
      width: 100,
    },
    {
      headerName: "Challan ID",
      field: "challanId",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Device Type",
      field: "deviceType",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Quantity",
      field: "qty",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "From Branch",
      field: "fromBranch",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "To Branch",
      field: "toBranch",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "From Location",
      field: "fromLocation",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "To Location",
      field: "toLocation",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Insert Date",
      field: "insertDt",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Insert By",
      field: "insertBy",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Actions",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) =>
        params.data.status === "PEN" ? (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => {
                setSelectedRow(params.data);
                // Map IMEI and serial arrays to objects for the table
                const imeis = params.data.imei || [];
                const serials = params.data.serial || [];
                const devices = imeis.map((imei: string, idx: number) => ({
                  imei,
                  srno: serials[idx] || "",
                  modalNo: params.data.product || "",
                }));
                setScannedDevices(devices);
                setApproveModalOpen(true);
              }}
              color="success"
              size="small"
            >
              Approve
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedRow(params.data);
                setRejectModalOpen(true);
              }}
              color="error"
              size="small"
            >
              Reject
            </IconButton>
          </Stack>
        ) : null,
      width: 220,
    },
  ];
  const { transferReport, transferReportLoading } = useAppSelector(
    (state) => state.report
  );
  const [status, setStatus] = useState<string>("");
  const [colapse, setcolapse] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [imei, setImei] = useState("");
  const [scannedDevices, setScannedDevices] = useState<any[]>([]);
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );
  const { rejectTransferLoading, printLoading } = useAppSelector(
    (state) => state.dispatch
  );
  const paginationPageSize = 20; // Define page size

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      sortable: true,
    };
  }, []);

  const handleImeiEnter = (imei: string) => {
    dispatch(
      getDeviceDetails({
        imei: imei,
        deviceType: selectedRow?.deviceType,
      })
    ).then((res: any) => {
      if (res.payload.data.success) {
        setImei("");
        const newRowData = res?.payload?.data?.data?.map((device: any) => {
          return {
            imei: device.device_imei || device.imei_no1 || "",
            srno: device.sl_no || "",
            modalNo: device?.p_name || "",
            deviceSku: device?.device_sku || "",
            productKey: device?.product_key || "",
            imei2: device?.imei_no2 || "",
          };
        });
        setScannedDevices((prev) => [...newRowData, ...prev]);
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  const handleApprove = () => {
    if (scannedDevices.length === 0) {
      showToast("Please scan at least one device", "error");
      return;
    }
    const payload = {
      challanId: selectedRow?.challanId,
      imei: scannedDevices.map((device) => device.imei),
      serial: scannedDevices.map((device) => device.srno || ""),
    };
    dispatch(approveTransfer(payload)).then((res: any) => {
      if (res.payload.data.success) {
        showToast("Transfer approved successfully", "success");
        dispatch(transferBranchReport(status));
        setApproveModalOpen(false);
        setScannedDevices([]);
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  const handleReject = () => {
    if (!rejectRemark.trim()) {
      showToast("Please enter rejection remark", "error");
      return;
    }
    const payload = {
      reason: rejectRemark,
      challanId: selectedRow?.challanId,
    };
    dispatch(rejectTransfer(payload)).then((res: any) => {
      if (res.payload.data.success) {
        showToast("Transfer rejected successfully", "success");
        setRejectModalOpen(false);
        setRejectRemark("");
        dispatch(transferBranchReport(status));
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  return (
    <>
      <div className="bg-white h-[calc(100vh-100px)] flex relative">
        <div
          className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${
            colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "
          }`}
        >
          <div
            className={`transition-all ${
              colapse ? "left-0" : "left-[400px]"
            } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
          >
            <Button
              onClick={() => setcolapse(!colapse)}
              className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
            >
              {colapse ? (
                <Icons.right fontSize="small" />
              ) : (
                <Icons.left fontSize="small" />
              )}
            </Button>
          </div>
          <div className="flex  gap-[20px] flex-col   p-[20px] overflow-hidden mt-[20px]">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Filter By"
              >
                <MenuItem value={"APR"}>APPROVED</MenuItem>
                <MenuItem value={"PEN"}>PENDING</MenuItem>
                <MenuItem value={"CANCELLED"}>CANCELLED</MenuItem>
              </Select>
            </FormControl>

            <div className="flex justify-between itesms-center">
              <div className="flex gap-[10px]">
                <LoadingButton
                  loading={transferReportLoading}
                  variant="contained"
                  startIcon={<Icons.search fontSize="small" />}
                  loadingPosition="start"
                  onClick={() => {
                    dispatch(transferBranchReport(status));
                  }}
                >
                  Search
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full ">
          <div className="relative ag-theme-quartz h-[calc(100vh-100px)]">
            <AgGridReact
              // ref={gridRef}
              loadingOverlayComponent={CustomLoadingOverlay}
              loading={transferReportLoading || printLoading}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              suppressCellFocus={true}
              rowData={transferReport ? transferReport : []}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={paginationPageSize}
              enableCellTextSelection
            />
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
        <DialogTitle>
          Reject Transfer Request {selectedRow?.challanId}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Remark"
            fullWidth
            multiline
            rows={4}
            value={rejectRemark}
            onChange={(e) => setRejectRemark(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectModalOpen(false)}>Cancel</Button>
          <LoadingButton
            onClick={handleReject}
            variant="contained"
            color="error"
            loading={rejectTransferLoading}
          >
            Reject
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Approve Modal */}
      <Dialog
        open={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setScannedDevices([]);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Approve Transfer Request {selectedRow?.challanId}
        </DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <div className="ag-theme-quartz h-[300px]">
              <AgGridReact
                rowData={scannedDevices}
                columnDefs={[
                  { field: "imei", headerName: "IMEI",flex:1 },
                  { field: "srno", headerName: "SR No.",flex:1 },
                  { field: "modalNo", headerName: "Model",flex:1 },
                ]}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setApproveModalOpen(false);
              setScannedDevices([]);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleApprove}
            variant="contained"
            color="success"
            loading={rejectTransferLoading}
          >
            Approve
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageBranchTable;
