import { TextField, Typography } from "@mui/material";
import React, { RefObject, useEffect } from "react";
import { TbBatteryOff } from "react-icons/tb";
import { FaBatteryEmpty } from "react-icons/fa6";
import { FaBatteryFull } from "react-icons/fa6";
import { LoadingButton } from "@mui/lab";
import { Icons } from "../icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { batteryQcSave, clearDeviceDetail } from "@/features/production/Batteryqc/BatteryQcSlice";
import { bateryqcSavePayload } from "@/features/production/Batteryqc/BatteryQcType";
import { showToast } from "@/utils/toasterContext";

type Props = {
  inputRef: RefObject<HTMLInputElement>;
};
const AddBatterQcForm: React.FC<Props> = ({ inputRef }) => {
  const [status, setStatus] = React.useState<string>("");
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [ir, setIr] = React.useState("");
  const [voltage, setVoltage] = React.useState("");
  const [ir2, setIr2] = React.useState("");
  const [voltage2, setVoltage2] = React.useState("");
  const [batteryId, setBatteryId] = React.useState("");
  const [remark, setRemark] = React.useState("");
  const dispatch = useAppDispatch();
  const { deviceDetailData, batteryQcSaveLoading } = useAppSelector((state) => state.batteryQcReducer);

  const getStatus = (ir: number, volt: number): string => {
    const voltage = volt;
    const resistance = ir;
    if (voltage <= 2.5) {
      setStatus("Rejected");
      return "Rejected";
    }

    if (voltage >= 3.8 && resistance > 0 && resistance <= 200) {
      setStatus("Pass");
      return "Pass";
    }

    if (voltage >= 2.6 && voltage <= 3.7 && resistance > 0 && resistance <= 200) {
      setStatus("Charging Required");
      return "Charging Required";
    }
    return "Rejected";
  };
  const getnewStatus = (ir: number, volt: number): string => {
    const voltage = volt;
    const resistance = ir;
    if (voltage <= 2.5) {
      setNewStatus("Rejected");
      return "Rejected";
    }

    if (voltage >= 3.8 && resistance > 0 && resistance <= 200) {
      setNewStatus("Pass");
      return "Pass";
    }

    if (voltage >= 2.6 && voltage <= 3.7 && resistance > 0 && resistance <= 200) {
      setNewStatus("Charging Required");
      return "Charging Required";
    }
    return "Rejected";
  };
  const onsubmit = () => {
    if (!ir || !voltage) return showToast("Please enter IR and Voltage", "error");
    if (status === "Rejected" && (!ir2 || !voltage2 || !batteryId)) return showToast("Please enter IR, Voltage and Battery ID", "error");
    const payload: bateryqcSavePayload = {
      slNo: [deviceDetailData?.sl_no || ""],
      imeiNo: [deviceDetailData?.device_imei || ""],
      ir: [ir],
      volt: [voltage],
      remark: [remark],
      batteryID: [batteryId],
      status: status,
      newVolt: [voltage2],
      newIR: [ir2],
    };
    dispatch(batteryQcSave(payload)).then((res: any) => {
      if (res.payload.data.success) {
        setStatus("");
        setIr("");
        setVoltage("");
        setIr2("");
        setVoltage2("");
        setBatteryId("");
        setRemark("");
        dispatch(clearDeviceDetail());
        inputRef.current?.focus();
        setNewStatus("");
      }
    });
  };
  useEffect(() => {
    if (ir && voltage) {
      getStatus(parseFloat(ir), parseFloat(voltage));
    } else {
      setStatus("");
    }
  }, [ir, voltage]);
  useEffect(() => {
    if (ir2 && voltage2) {
      getnewStatus(parseFloat(ir2), parseFloat(voltage2));
    } else {
      setNewStatus("");
    }
  }, [ir2, voltage2]);
  return deviceDetailData ? (
    <div className="h-[calc(100vh-150px)] bg-white p-[20px]">
      <div className="flex  p-[10px] gap-[20px] flex-col">
        <Typography>IMEI :{deviceDetailData?.device_imei}</Typography>
        <Typography>Serial Number: {deviceDetailData?.sl_no}</Typography>
      </div>
      <div className="flex items-center p-[10px] gap-[20px]">
        <TextField
          type="number"
          label="IR"
          sx={{ width: "300px" }}
          value={ir}
          onChange={(e) => {
            if (/^-?\d*\.?\d*$/.test(e.target.value)) {
              setIr(e.target.value);
            }
          }}
        />
        <TextField
          type="number"
          value={voltage}
          label="Voltage"
          sx={{ width: "300px" }}
          onChange={(e) => {
            if (/^-?\d*\.?\d*$/.test(e.target.value)) {
              setVoltage(e.target.value);
            }
          }}
        />
        {status === "Rejected" && (
          <div>
            <TbBatteryOff className="text-red-500 text-[40px]" />
            <p className="text-red-600 font-[600]">Rejected</p>
          </div>
        )}
        {status === "Charging Required" && (
          <div>
            <FaBatteryEmpty className="text-amber-500 text-[40px]" />
            <p className="text-amber-600 font-[600]">Need to Charge</p>
          </div>
        )}
        {status === "Pass" && (
          <div>
            <FaBatteryFull className="text-green-500 text-[40px]" />
            <p className="text-green-600 font-[600]">Pass</p>
          </div>
        )}
      </div>
      {status === "Rejected" && (
        <div>
          <div className="p-[10px]">
            <TextField
              label="Battery ID"
              sx={{ width: "400px" }}
              value={batteryId}
              onChange={(e) => {
                setBatteryId(e.target.value);
              }}
            />
          </div>
          <div className="flex items-center p-[10px] gap-[20px]">
            <TextField
              value={ir2}
              label="IR"
              sx={{ width: "300px" }}
              onChange={(e) => {
                if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                  setIr2(e.target.value);
                }
              }}
            />
            <TextField
              value={voltage2}
              label="Voltage"
              sx={{ width: "300px" }}
              onChange={(e) => {
                if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                  setVoltage2(e.target.value);
                }
              }}
            />
            {newStatus === "Rejected" && (
              <div>
                <TbBatteryOff className="text-red-500 text-[40px]" />
                <p className="text-red-600 font-[600]">Rejected</p>
              </div>
            )}
            {newStatus === "Charging Required" && (
              <div>
                <FaBatteryEmpty className="text-amber-500 text-[40px]" />
                <p className="text-amber-600 font-[600]">Need to Charge</p>
              </div>
            )}
            {newStatus === "Pass" && (
              <div>
                <FaBatteryFull className="text-green-500 text-[40px]" />
                <p className="text-green-600 font-[600]">Pass</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-[10px]">
        <TextField value={remark} onChange={(e) => setRemark(e.target.value)} label="Remark(If any)" sx={{ width: "65%" }} multiline rows={2} placeholder="Add remark" />
      </div>
      <div className="h-[50px] bg-white  flex items-center  gap-[10px] px-[10px]">
        <LoadingButton
          disabled={batteryQcSaveLoading}
          tabIndex={-1}
          onClick={() => {
            setStatus("");
            setIr("");
            setVoltage("");
            setIr2("");
            setVoltage2("");
            setBatteryId("");
            setRemark("");
            dispatch(clearDeviceDetail());
            setNewStatus("");
          }}
          className="text-red-600 hover:text-red-600"
          variant={"contained"}
          sx={{ color: "red", background: "white" }}
          startIcon={<Icons.refresh fontSize="small" />}
        >
          Reset
        </LoadingButton>
        <LoadingButton
          loadingPosition="start"
          loading={batteryQcSaveLoading}
          disabled={status === "Charging Required" || newStatus === "Charging Required" || newStatus === "Rejected"}
          onClick={() => {
            onsubmit();
          }}
          className="bg-cyan-700 hover:bg-cyan-800"
          startIcon={<Icons.save fontSize="small" />}
          variant="contained"
        >
          Submit
        </LoadingButton>
      </div>
    </div>
  ) : (
    <div className="h-[calc(100vh-150px)] bg-white p-[20px] flex items-center justify-center">
      <img src="/qr.svg" alt="" className="w-[200px] " />
    </div>
  );
};

export default AddBatterQcForm;
