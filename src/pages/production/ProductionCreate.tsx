import React, { useCallback, useEffect, useRef, useState } from "react";
import { InputRef } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import CreateProductionTable from "@/table/production/CreateProductionTable";
import SaveIcon from "@mui/icons-material/Save";
import { showToast } from "@/utils/toasterContext";
import { CreateProductionPayload } from "@/features/production/ManageProduction/ManageProductionType";
import {
  clearDeviceDetail,
  getDeviceDetail,
} from "@/features/production/Batteryqc/BatteryQcSlice";
import { createProduction } from "@/features/production/ManageProduction/ManageProductionSlie";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import LoadingButton from "@mui/lab/LoadingButton";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import {
  Button,
  CircularProgress,
  IconButton,
  InputLabel,
  Typography,
} from "@mui/material";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckIcon from "@mui/icons-material/Check";
import CreateIcon from "@mui/icons-material/Create";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";
import { generateUniqueId } from "@/utils/uniqueid";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import SelectBom from "@/components/reusable/SelectBom";
import { fetchBomProduct } from "@/features/master/BOM/BOMSlice";
type RowData = {
  remark: string;
  id: string;
  isNew: boolean;
  component: { lable: string; value: string } | null;
  qty: string;
  uom: string;
};

const ProductionCreate: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [picklocation, setPicklocation] = useState<LocationType | null>(null);
  const [droplocation, setDroplocation] = useState<LocationType | null>(null);
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [bom, setBom] = useState<any>(null);
  const [disable, setDisable] = useState<boolean>(false);
  //   const dispatch = useAppDispatch();
  const { deviceDetailLoading, deviceDetailData } = useAppSelector(
    (state) => state.batteryQcReducer
  );
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetAlert, setResetAlert] = useState<boolean>(false);
  const [imei, setImei] = useState<string>("");
  const imeiInputRef = useRef<InputRef>(null);
  const dispatch = useAppDispatch();
  const { createProductionLaoding } = useAppSelector(
    (state) => state.manageProduction
  );
  const addRow = useCallback(() => {
    const newId = generateUniqueId();
    const newRow: RowData = {
      id: newId,
      remark: "",
      isNew: true,
      component: null,
      qty: "",
      uom: "",
    };
    setRowData([newRow, ...rowData]);
  }, [rowData]);
  console.log(device);
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
          showToast(
            `Row ${row.id}: Empty fields: ${missingFields.join(", ")}`,
            "error"
          );
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        const payload: CreateProductionPayload = {
          slNo: deviceDetailData?.sl_no || "",
          imeiNo: deviceDetailData?.device_imei || "",
          productionLocation: picklocation.code,
          dropLocation: droplocation.code,
          itemKey: rowData.map((row) => row.component?.value || ""),
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

  useEffect(() => {
    if (bom) {
      dispatch(fetchBomProduct(bom.code)).then((response: any) => {
        if (response.payload.data.success) {
          setRowData(response.payload.data.data.data);
        }
      });
    }
  }, [bom]);

  return (
    <>
      <ConfirmationModel
        open={resetAlert}
        title="Are you absolutely sure"
        content="Resetting the form will clear all entered data, including any selected device details, locations, and added components. This action cannot be undone."
        onClose={() => setResetAlert(false)}
        cancelText="Cancel"
        onConfirm={() => {
          setRowData([]);
          setResetAlert(false);
          setImei("");
          setPicklocation(null);
          setDroplocation(null);
          dispatch(clearDeviceDetail());
          setEnabled(false);
          setDevice(null);
          imeiInputRef.current?.blur();
          setDisable(false);
        }}
        confirmText="Continue"
      />

      <div className="h-[calc(100vh-100px)] grid grid-cols-[400px_1fr]">
        <div className="bg-white p-[20px] border-r border-neutral-300 flex flex-col gap-[30px]">
          <Typography variant="h2" fontSize={20} fontWeight={500}>
            Create Production
          </Typography>
          <SelectDevice
            size="medium"
            required
            varient="outlined"
            helperText={"Select the device to be produced"}
            onChange={setDevice}
            value={device}
            label="Select Device"
          />
          <SelectBom
            size="medium"
            required
            varient="outlined"
            helperText={"Select the BOM"}
            onChange={setBom}
            value={bom}
            label="Select BOM"
            id={device?.id}
          />
          <SelectLocationAcordingModule
            endPoint="/production/dropLocation"
            size="medium"
            required
            varient="outlined"
            onChange={setDroplocation}
            value={droplocation}
            label="Drop Location"
            helperText={"Location where the device will be dropped"}
          />
          <SelectLocationAcordingModule
            endPoint="/production/pickLocation"
            size="medium"
            required
            varient="outlined"
            onChange={setPicklocation}
            value={picklocation}
            label="Pick Location"
            helperText={"Location where the components will be picked up"}
          />
        </div>
        <div>
          <div className="h-[100px] bg-white flex items-center px-[20px] gap-[20px] ">
            <FormControl required sx={{ width: "400px" }} variant="outlined">
              <InputLabel
                sx={{
                  color: "#a3a3a3", // Default label color
                  "&.Mui-focused": {
                    color: "#404040", // Focused label color
                  },
                }}
                htmlFor="standard-adornment-qty"
              >
                IMEI No.
              </InputLabel>
              <OutlinedInput
                disabled={disable}
                label="IMEI No."
                placeholder="Scan or Enter QR Code"
                id="standard-adornment-qty"
                endAdornment={
                  <InputAdornment position="end">
                    {deviceDetailLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : deviceDetailData ? (
                      <CheckIcon color="success" />
                    ) : (
                      <QrCodeScannerIcon />
                    )}
                  </InputAdornment>
                }
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
                      dispatch(getDeviceDetail(imei.slice(0, 15))).then(
                        (res: any) => {
                          if (res.payload.data.success) {
                            setEnabled(true);
                            setDisable(true);
                          } else {
                            showToast(res.payload.data.message, "error");
                            setEnabled(false);
                            setDisable(false);
                          }
                        }
                      );
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
            </FormControl>
            {disable && (
              <MuiTooltip title="Edit IMEI/Serial No." placement="bottom">
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
              </MuiTooltip>
            )}
          </div>
          <CreateProductionTable
            enabled={enabled}
            addrow={addRow}
            rowData={rowData}
            setRowdata={setRowData}
          />
        </div>
      </div>
      <div className="h-[50px] bg-white border-t border-neutral-300 flex items-center justify-end gap-[10px] px-[20px]">
        <Button
          sx={{ color: "red", backgroundColor: "white" }}
          disabled={createProductionLaoding}
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
