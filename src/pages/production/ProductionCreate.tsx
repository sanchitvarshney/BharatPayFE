import React, { useCallback, useEffect, useRef, useState } from "react";
import { InputRef } from "antd";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import CreateProductionTable from "@/table/production/CreateProductionTable";
import SaveIcon from "@mui/icons-material/Save";
import { showToast } from "@/utils/toasterContext";
import { CreateProductionPayload } from "@/features/production/ManageProduction/ManageProductionType";
import { clearDeviceDetail, getDeviceDetail } from "@/features/production/Batteryqc/BatteryQcSlice";
import { createProduction } from "@/features/production/ManageProduction/ManageProductionSlie";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import SelectLocation, { LocationType } from "@/components/reusable/SelectLocation";
import LoadingButton from "@mui/lab/LoadingButton";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Button, CircularProgress, IconButton, InputLabel, Tooltip, Typography } from "@mui/material";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckIcon from "@mui/icons-material/Check";
import CreateIcon from "@mui/icons-material/Create";
type RowData = {
  remark: string;
  id: number;
  isNew: boolean;
  component: string;
  qty: string;
  uom: string;
};

const ProductionCreate: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [picklocation, setPicklocation] = useState<LocationType | null>(null);
  const [droplocation, setDroplocation] = useState<LocationType | null>(null);
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [disable, setDisable] = useState<boolean>(false);
  //   const dispatch = useAppDispatch();
  const { deviceDetailLoading, deviceDetailData } = useAppSelector((state) => state.batteryQcReducer);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetAlert, setResetAlert] = useState<boolean>(false);
  const [imei, setImei] = useState<string>("");
  const imeiInputRef = useRef<InputRef>(null);
  const dispatch = useAppDispatch();
  const { createProductionLaoding } = useAppSelector((state) => state.manageProduction);
  const addRow = useCallback(() => {
    const newId = rowData.length + 1;
    const newRow: RowData = {
      id: newId,
      remark: "",
      isNew: true,
      component: "",
      qty: "",
      uom: "",
    };
    if (rowData.length === 0) {
      setRowData([newRow]);
    } else {
      setRowData([newRow, ...rowData]);
    }
  }, [rowData]);

  const onsubmit = () => {
    if (rowData.length === 0) {
      showToast("Please Add Material Details", "error");
      return;
    } else if (!picklocation) {
      showToast("Please Select Pick Location", "error");
      return;
    } else if (!droplocation) {
      showToast("Please Select Drop Location", "error");
      return;
    } else if (!device) {
      showToast("Please Select Device", "error");
      return;
    } else {
      let hasErrors = false;

      rowData.forEach((row) => {
        const missingFields: string[] = [];
        if (!row.component) {
          missingFields.push("Component");
        }
        if (!row.qty) {
          missingFields.push("QTY");
        }

        if (missingFields.length > 0) {
          showToast(`Row ${row.id}: Empty fields: ${missingFields.join(", ")}`, "error");
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        const payload: CreateProductionPayload = {
          slNo: deviceDetailData?.sl_no || "",
          imeiNo: deviceDetailData?.device_imei || "",
          productionLocation: picklocation.id,
          dropLocation: droplocation.id,
          itemKey: rowData.map((row) => row.component),
          issueQty: rowData.map((row) => row.qty),
          remark: rowData.map((row) => row.remark),
          sku: device?.id || "",
        };
        dispatch(createProduction(payload)).then((response: any) => {
          if (response.payload.data.success) {
            setRowData([]);
            setImei("");
            setPicklocation(null);
            setDroplocation(null);
            dispatch(clearDeviceDetail());
            setEnabled(false);
            setDisable(false);
            setDevice(null);
          }
        });
      }
    }
  };
  useEffect(() => {
    imeiInputRef.current?.focus();
  }, []);

  return (
    <>
      <Dialog open={resetAlert} onClose={setResetAlert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Are you absolutely sure?"}</DialogTitle>
        <DialogContent sx={{ width: "600px" }}>
          <DialogContentText id="alert-dialog-description">Resetting the form will clear all entered data, including any selected device details, locations, and added components. This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetAlert(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setRowData([]);
              setResetAlert(false);
              setImei("");
              setPicklocation(null);
              setDroplocation(null);
              dispatch(clearDeviceDetail());
              setEnabled(false);
            }}
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <div className="h-[calc(100vh-100px)] grid grid-cols-[400px_1fr]">
        <div className="bg-white p-[20px] border-r border-neutral-300 flex flex-col gap-[30px]">
          <Typography variant="h2" fontSize={20} fontWeight={500}>
            Create Production
          </Typography>
          <SelectDevice size="medium"  required varient="outlined" helperText={"Select the device to be produced"} onChange={setDevice} value={device} label="Select Device" />
          <SelectLocation size="medium" required varient="outlined" onChange={setDroplocation} value={droplocation} label="Drop Location" helperText={"Location where the device will be dropped"} />
          <SelectLocation size="medium" required varient="outlined" onChange={setPicklocation} value={picklocation} label="Pic Location" helperText={"Location where the components will be picked up"} />
        </div>
        <div>
          <div className="h-[100px] bg-white flex items-center px-[20px] gap-[20px] ">
            <FormControl required sx={{ width: "400px" }} variant="outlined" >
              <InputLabel
                sx={{
                  color: "#a3a3a3", // Default label color
                  "&.Mui-focused": {
                    color: "#404040", // Focused label color
                  },
                }}
                htmlFor="standard-adornment-qty"
              >
                IMEI/Serial No.
              </InputLabel>
              <OutlinedInput
                disabled={disable}
                label="IMEI/Serial No."
                placeholder="Scan or Enter QR Code"
                id="standard-adornment-qty"
                endAdornment={<InputAdornment position="end">{deviceDetailLoading ? <CircularProgress size={20} color="inherit" /> : deviceDetailData ? <CheckIcon color="success" /> : <QrCodeScannerIcon />}</InputAdornment>}
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                value={imei}
                onChange={(e) => {
                  setImei(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (imei) {
                      dispatch(getDeviceDetail(imei)).then((res: any) => {
                        if (res.payload.data.success) {
                          setEnabled(true);
                          setDisable(true);
                        } else {
                          showToast(res.payload.data.message, "error");
                          setEnabled(false);
                          setDisable(false);
                        }
                      });
                    }
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a3a3a3", // Default border color
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a3a3a3", // Hover border color
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a3a3a3", // Focused border color
                  },
                }}
              />
              {/* <FormHelperText id="standard-weight-helper-text">Enter the QR code or scan it for verify the device</FormHelperText> */}
            </FormControl>
            {disable && (
              <Tooltip
                sx={{
                  "& .MuiTooltip-tooltip": {
                    fontWeight: "300", // Adjust to "normal", "bold", "lighter", or a specific number (e.g., 500)
                  },
                }}
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -8],
                        },
                      },
                    ],
                  },
                }}
                title={<Typography sx={{ fontSize: "10px", fontWeight: "400", letterSpacing: "1px" }}>Edit IMEI/Serial No.</Typography>}
                arrow
              >
                <IconButton
                  onClick={() => {
                    setDisable(false);
                    dispatch(clearDeviceDetail());
                    setEnabled(false);
                    setRowData([]);
                  }}
                >
                  <CreateIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <CreateProductionTable enabled={enabled} addrow={addRow} rowData={rowData} setRowdata={setRowData} />
        </div>
      </div>
      <div className="h-[50px] bg-white border-t border-neutral-300 flex items-center justify-end gap-[10px] px-[20px]">
        <Button
          sx={{ color: "red", backgroundColor: "white" }}
          disabled={!rowData.length}
          onClick={() => {
            setResetAlert(true);
          }}
          startIcon={<RotateLeftIcon fontSize="small" />}
          variant="contained"
        >
          Reset
        </Button>
        <LoadingButton
          loading={createProductionLaoding}
          onClick={() => {
            onsubmit();
          }}
          disabled={!rowData.length}
          startIcon={<SaveIcon fontSize="small" />}
          variant="contained"
          loadingPosition="start"
        >
          Submit
        </LoadingButton>
      </div>
    </>
  );
};

export default ProductionCreate;
