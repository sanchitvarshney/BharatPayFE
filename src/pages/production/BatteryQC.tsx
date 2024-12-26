import AddBatteryQcTable from "@/table/production/AddBatteryQcTable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Steps, InputRef } from "antd";
import { showToast } from "@/utils/toastUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { batteryQcSave, getDeviceDetail } from "@/features/production/Batteryqc/BatteryQcSlice";
import { bateryqcSavePayload } from "@/features/production/Batteryqc/BatteryQcType";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { CircularProgress, FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";

type RowData = {
  remark: string;
  id: number;
  isNew: boolean;
  IMEI: string;
  IR: string;
  voltage: string;
  serialNo: string;
  batteryID: string;
};




const BatteryQC: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deviceDetailLoading, batteryQcSaveLoading } = useAppSelector((state) => state.batteryQcReducer);
  const [batteryStatus, setBatteryStatus] = useState<string>("");
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetAlert, setResetAlert] = useState<boolean>(false);
  const [imei, setImei] = useState<string>("");
  const imeiInputRef = useRef<InputRef>(null);
  const addRow = useCallback(
    (id: string, sr: string) => {
      const newId = rowData.length + 1;
      const newRow: RowData = {
        id: newId,
        remark: "",
        isNew: true,
        IMEI: id,
        IR: "",
        voltage: "",
        serialNo: sr,
        batteryID: "",
      };

      setRowData((prev) => [...prev, newRow].reverse());
    },
    [rowData]
  );

  const onsubmit = () => {
    if (rowData.length === 0) {
      showToast({
        description: "Please Add Material Details",
        variant: "destructive",
      });
      return;
    } else {
      let hasErrors = false;

      rowData.forEach((row) => {
        const missingFields: string[] = [];
        if (!row.IMEI) {
          missingFields.push("IMEI");
        }
        if (!row.IR) {
          missingFields.push("IR");
        }
        if (!row.serialNo) {
          missingFields.push("serialNo");
        }
        if (!row.voltage) {
          missingFields.push("voltage");
        }

        if (missingFields.length > 0) {
          showToast({
            description: `Row ${row.id}: Empty fields: ${missingFields.join(", ")}`,
            variant: "destructive",
          });
          hasErrors = true;
        }
      });

      
      if (!hasErrors) {
        const payload: bateryqcSavePayload = {
          slNo: rowData.map((row) => row.serialNo),
          imeiNo: rowData.map((row) => row.IMEI),
          ir: rowData.map((row) => row.IR),
          volt: rowData.map((row) => row.voltage),
          remark: rowData.map((row) => row.remark),
          batteryID: rowData.map((row) => row.batteryID),
          status:batteryStatus,
        };
        dispatch(batteryQcSave(payload)).then((res: any) => {
          if (res.payload.data.success) {
            setRowData([]);
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
      <AlertDialog open={resetAlert} onOpenChange={setResetAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will reset the data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                setRowData([]);
                setResetAlert(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="h-[calc(100vh-50px)] grid grid-cols-[1fr_400px]">
        <div>
          <div className="h-[100px] bg-white flex items-center px-[20px] gap-[20px]">
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-IMEI/Serial">IMEI/Serial Number</InputLabel>
              <OutlinedInput
                id="outlined-adornment-IMEI/Serial"
                ref={imeiInputRef}
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (imei) {
                      const isUnique = !rowData.some((row) => row.IMEI === imei);
                      const issrunique = !rowData.some((row) => row.serialNo === imei);
                   
                      if (!isUnique) {
                        showToast({
                          description: "Duplicate IMEI found",
                          variant: "destructive",
                        });
                        return;
                      }
                      if (!issrunique) {
                        showToast({
                          description: "Duplicate Serial Number found",
                          variant: "destructive",
                        });
                        return;
                      }

                      dispatch(getDeviceDetail(imei.slice(0, 15))).then((res: any) => {
                        if (res.payload.data.success) {
                          addRow(res.payload.data?.data[0]?.device_imei, res.payload.data?.data[0]?.sl_no);
                          setImei("");
                        } else {
                          showToast({
                            description: res.payload.data.message,
                            variant: "destructive",
                          });
                        }
                      });
                    }
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    {
                      deviceDetailLoading ? <CircularProgress/>: <Icons.qrScan />
                    }
                   
                  </InputAdornment>
                }
                className="w-[400px]"
                label="IMEI/Serial Number"
              />
            </FormControl>
          </div>
          <AddBatteryQcTable rowData={rowData} setRowdata={setRowData} batteryStatus={batteryStatus} setBatteryStatus={setBatteryStatus} />
          <div className="h-[50px] bg-white border-t border-neutral-300 flex items-center justify-end gap-[10px] px-[20px]">
            <LoadingButton
              disabled={!rowData.length}
              onClick={() => {
                setResetAlert(true);
              }}
              className="text-red-600 hover:text-red-600"
              variant={"contained"}
              sx={{ color: "red", background: "white" }}
              startIcon={<Icons.refresh fontSize="small" />}
            >
              Reset
            </LoadingButton>
            <LoadingButton
              loading={batteryQcSaveLoading}
              onClick={() => {
                onsubmit();
              }}
              disabled={!rowData.length}
              className="bg-cyan-700 hover:bg-cyan-800"
              startIcon={<Icons.save fontSize="small" />}
              variant="contained"
            >
              Submit
            </LoadingButton>
          </div>
        </div>
        <div className="bg-white p-[20px] border-l border-neutral-300">
          <Steps
            current={5}
            direction="vertical"
            items={[
              {
                title: "Scan IMEI",
                description:
                  "Scan the unique IMEI number of the device. This number helps in identifying and tracking the device. Ensure there are no spaces or special characters for a valid input.",
                icon: <div className="custom-step-icon">1</div>, // Custom number icon
              },
              {
                title: "Enter IR (Internal Resistance)",
                description:
                  "Provide the internal resistance (IR) value of the device. This value, typically measured in ohms (Ω), is crucial for assessing the device's operational efficiency. Make sure to use accurate measurements.",
                icon: <div className="custom-step-icon">2</div>,
              },
              {
                title: "Enter Voltage",
                description:
                  "Input the voltage level of the device. Voltage, measured in volts (V), is essential for monitoring the power status. Please double-check to avoid input errors.",
                icon: <div className="custom-step-icon">3</div>,
              },
              {
                title: "Enter Battary Id",
                description:
                  "Enter the battery ID of the device. This is a unique identifier associated with the battery used in the device. Ensure it is accurate and up-to-date.",
                icon: <div className="custom-step-icon">4</div>,
              },
              {
                title: "Enter Remarks (If Needed)",
                description:
                  "Add any additional notes or observations related to the device. This field is optional but useful for recording specific conditions or requirements. Keep it concise and relevant.",
                icon: <div className="custom-step-icon">5</div>,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default BatteryQC;
