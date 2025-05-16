import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import { DeviceType } from "@/components/reusable/SelectSku";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { showToast } from "@/utils/toasterContext";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";

type FormData = {
  product: DeviceType | null;
  toLocation: any;
  fromLocation: any;
  fromBranch: any;
  toBranch: any;
  quantity: number;
  remark: string;
  cc: CostCenterType | null;
  type: string;
  branchType: string;
  fromLocationName: string;
  toLocationName: string;
};

interface ManageBranchTransferProps {
  formData: FormData;
  rowData: any[];
  setRowData: any;
}

const ManageBranchTransfer: React.FC<ManageBranchTransferProps> = ({
  formData,
  rowData,
  setRowData,
}) => {
  const [imei, setImei] = useState<string>("");
  const dispatch = useAppDispatch();
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );

  const handleImeiEnter = (imei: string) => {
    dispatch(
      getDeviceDetails({
        imei: imei,
        deviceType: formData.type,
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
        setRowData((prevRowData: any) => [...newRowData, ...prevRowData]);
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

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
      headerName: "Modal Name",
      field: "modalNo",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Device SKU",
      field: "deviceSku",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "IMEI",
      field: "imei",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "IMEI2",
      field: "imei2",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "SR No.",
      field: "srno",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Actions",
      field: "",
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <IconButton
          onClick={() => {
            setRowData(
              rowData.filter((row: any) => row.imei !== params.data.imei)
            );
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      ),
      width: 100,
    },
  ];
  console.log(formData);
  return (
    <div className="h-[calc(100vh-100px)] bg-white flex w-full">
      {/* Display form data - 1/3 */}
      <div
        className="flex flex-col gap-[20px] border-r border-neutral-300 p-[20px] h-full overflow-y-auto"
        style={{ flex: "1 1 0%", minWidth: 0, maxWidth: "33.3333%" }}
      >
        <Paper elevation={0} className="p-4">
          <Typography variant="h6" className="mb-4">
            Transfer Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Device Type</Typography>
              <Typography>
                {formData.type === "soundBox" ? "Soundbox" : "Swipe Machine"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Product</Typography>
              <Typography>{formData.product?.text || "-"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">From Branch</Typography>
              <Typography>{formData.fromBranch?.branch_name || "-"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">From Location</Typography>
              <Typography>{formData.fromLocationName || "-"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">To Branch</Typography>
              <Typography>{formData.toBranch?.branch_name || "-"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">To Location</Typography>
              <Typography>{formData.toLocationName || "-"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Quantity</Typography>
              <Typography>{formData.quantity || "-"}</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} className="p-4">
          <Typography variant="h6" className="mb-4">
            Device Statistics
          </Typography>
          {formData.type === "soundBox" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <Typography variant="subtitle2" color="primary">
                  Total Devices
                </Typography>
                <Typography variant="h6">{rowData.length}</Typography>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <Typography variant="subtitle2" color="success.main">
                  L Devices
                </Typography>
                <Typography variant="h6">
                  {
                    rowData.filter((item: any) => item.modalNo?.includes("(L)"))
                      .length
                  }
                </Typography>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <Typography variant="subtitle2" color="error">
                  E Devices
                </Typography>
                <Typography variant="h6">
                  {
                    rowData.filter((item: any) => item.modalNo?.includes("(E)"))
                      .length
                  }
                </Typography>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <Typography variant="subtitle2" color="warning.main">
                  F Devices
                </Typography>
                <Typography variant="h6">
                  {
                    rowData.filter((item: any) => item.modalNo?.includes("(F)"))
                      .length
                  }
                </Typography>
              </div>
            </div>
          ) : (
            <div className="">
              <div className="bg-blue-50 p-3 rounded">
                <Typography variant="subtitle2" color="primary">
                  Total Devices
                </Typography>
                <Typography variant="h6">{rowData.length}</Typography>
              </div>
            </div>
          )}
        </Paper>
      </div>

      {/* Right side - 2/3 */}
      <div
        className="flex flex-col p-[20px] h-full"
        style={{ flex: "2 1 0%", minWidth: 0, maxWidth: "66.6666%" }}
      >
        <div className="mb-4" style={{ maxWidth: 400 }}>
          <TextField
            fullWidth
            rows={2}
            value={imei}
            label="Single IMEI/SR No."
            id="standard-adornment-qty"
            aria-describedby="standard-weight-helper-text"
            inputProps={{
              "aria-label": "weight",
            }}
            onChange={(e) => setImei(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleImeiEnter(imei); // Uncomment and implement this function as needed
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {deviceDetailLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <QrCodeScannerIcon />
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        <div className="flex-1 min-h-0 w-full">
          <div className=" ag-theme-quartz h-[calc(100vh-250px)] ">
            <AgGridReact
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              suppressCellFocus={true}
              rowData={rowData}
              columnDefs={columnDefs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBranchTransfer;
