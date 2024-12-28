import React, { useEffect, useRef, useState } from "react";
import { Steps } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getDeviceDetail } from "@/features/production/Batteryqc/BatteryQcSlice";
import { Icons } from "@/components/icons";
import { CircularProgress, FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import AddBatterQcForm from "@/components/form/AddBatterQcForm";

const BatteryQC: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deviceDetailLoading } = useAppSelector((state) => state.batteryQcReducer);
  const [imei, setImei] = useState<string>("");
  const imeiInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (imei && imei.length === 15) {
      dispatch(getDeviceDetail(imei.slice(0, 15))).then((res: any) => {
        if (res.payload.data.success) {
          setImei("");
        } else {
          setImei("");
          console.log(res.payload.data.message);
        }
      });
    }
  }, [imei]);

  return (
    <>
      <div className="h-[calc(100vh-50px)] grid grid-cols-[1fr_400px]">
        <div>
          <div className="h-[100px] bg-white flex items-center px-[20px] gap-[20px] border-b border-neutral-300">
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-IMEI/Serial">IMEI/Serial Number</InputLabel>
              <OutlinedInput
                autoFocus
                id="outlined-adornment-IMEI/Serial"
               
                inputRef={imeiInputRef}
                value={imei}
                onChange={(e) => {
                  setImei(e.target.value);
                }}
                endAdornment={<InputAdornment position="end">{deviceDetailLoading ? <CircularProgress size={20} /> : <Icons.qrScan />}</InputAdornment>}
                className="w-[400px]"
                label="IMEI/Serial Number"
              />
            </FormControl>
          </div>
          {/* <AddBatteryQcTable rowData={rowData} setRowdata={setRowData} batteryStatus={batteryStatus} setBatteryStatus={setBatteryStatus} /> */}
          <AddBatterQcForm inputRef={imeiInputRef} />
        </div>
        <div className="bg-white p-[20px] border-l border-neutral-300 h-[calc(100vh-50px)] overflow-y-auto">
          <Steps
            className="custom-steps"
            current={5}
            direction="vertical"
            items={[
              {
                title: "Scan IMEI",
                description: "Scan the unique IMEI number of the device. This number helps in identifying and tracking the device. Ensure there are no spaces or special characters for a valid input.",
                icon: <div className="custom-step-icon">1</div>, // Custom number icon
              },
              {
                title: "Enter IR (Internal Resistance)",
                description: "Provide the internal resistance (IR) value of the device. This value, typically measured in ohms (Ω), is crucial for assessing the device's operational efficiency. Make sure to use accurate measurements.",
                icon: <div className="custom-step-icon">2</div>,
              },
              {
                title: "Enter Voltage",
                description: "Input the voltage level of the device. Voltage, measured in volts (V), is essential for monitoring the power status. Please double-check to avoid input errors.",
                icon: <div className="custom-step-icon">3</div>,
              },
              {
                title: "Enter Battary Id",
                description: "Enter the battery ID of the device. This is a unique identifier associated with the battery used in the device. Ensure it is accurate and up-to-date.",
                icon: <div className="custom-step-icon">4</div>,
              },
              {
                title: "Enter Remarks (If Needed)",
                description: "Add any additional notes or observations related to the device. This field is optional but useful for recording specific conditions or requirements. Keep it concise and relevant.",
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
