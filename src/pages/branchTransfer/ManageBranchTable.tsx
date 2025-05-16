import { useMemo, useState } from "react";
import { ColDef } from "@ag-grid-community/core";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { AgGridReact } from "@ag-grid-community/react";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
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
import { approveTransfer, rejectTransfer } from "@/features/Dispatch/DispatchSlice";

// Generate dummy data according to pagination needs
const ManageBranchTable = () => {
  const dispatch = useAppDispatch();
  const columnDefs: ColDef[] = [
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
      headerName: "SKU",
      field: "sku",
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
      field: "fromFranch",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "To Branch",
      field: "to_branch",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "From Location",
      field: "from_location",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "To Location",
      field: "to_location",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Model Name",
      field: "modelName",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Insert Date",
      field: "insertDate",
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
      cellRenderer: (params: any) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => {
              setSelectedRow(params.data);
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
      ),
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
    }
    dispatch(approveTransfer(payload)).then((res: any) => {
      if (res.payload.data.success) {
        showToast("Transfer approved successfully", "success");
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
    // Call your approve API here with scannedDevices
    console.log("Approving with devices:", scannedDevices);
    setApproveModalOpen(false);
    setScannedDevices([]);
  };

  const handleReject = () => {
    if (!rejectRemark.trim()) {
      showToast("Please enter rejection remark", "error");
      return;
    }
    const payload = {
      reason: rejectRemark,
      challanId: selectedRow?.challanId,
    }
    dispatch(rejectTransfer(payload)).then((res: any) => {
      console.log(res);
      if (res.payload.data.success) {
        showToast("Transfer rejected successfully", "success");
        setRejectModalOpen(false);
        setRejectRemark("");
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
    // Call your reject API here with rejectRemark
    console.log("Rejecting with remark:", rejectRemark);
   
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
              loading={transferReportLoading}
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
          <div className="mb-4 mt-2">
            <TextField
              fullWidth
              rows={2}
              value={imei}
              label="Scan IMEI/SR No."
              onChange={(e) => setImei(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleImeiEnter(imei);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {deviceDetailLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <QrCodeScannerIcon />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="mt-4">
            <Typography variant="subtitle1" className="mb-2">
              Scanned Devices
            </Typography>
            <div className="ag-theme-quartz h-[300px]">
              <AgGridReact
                rowData={scannedDevices}
                columnDefs={[
                  { field: "imei", headerName: "IMEI" },
                  { field: "srno", headerName: "SR No." },
                  { field: "modalNo", headerName: "Model" },
                  {
                    headerName: "Actions",
                    field: "",
                    cellRenderer: (params: any) => (
                      <IconButton
                        onClick={() => {
                          setScannedDevices(
                            scannedDevices.filter(
                              (device) => device.imei !== params.data.imei
                            )
                          );
                        }}
                        
                      >
                        <Icons.delete color="error" />
                      </IconButton>
                    ),
                  },
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
          >
            Approve
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageBranchTable;
