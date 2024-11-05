import { CustomButton } from "@/components/reusable/CustomButton";
import AddBatteryQcTable from "@/table/production/AddBatteryQcTable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { FaRegSave } from "react-icons/fa";
import { Input, Steps, InputRef } from "antd";
import { showToast } from "@/utils/toastUtils";
import { MdOutlineRefresh } from "react-icons/md";
import { BsUpcScan } from "react-icons/bs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type RowData = {
  remark: string;
  id: number;
  isNew: boolean;
  IMEI: string;
  IR: string;
  voltage: string;
  serialNo: string;
};

const BatteryQC: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetAlert, setResetAlert] = useState<boolean>(false);
  const [imei, setImei] = useState<string>("");
  const imeiInputRef = useRef<InputRef>(null);
  const addRow = useCallback(
    (id: string) => {
      const newId = rowData.length + 1;
      const newRow: RowData = {
        id: newId,
        remark: "",
        isNew: true,
        IMEI: id,
        IR: "",
        voltage: "",
        serialNo: id,
      };

      setRowData((prev) => [...prev, newRow].reverse());
    },
    [rowData]
  );
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
          <div className="h-[50px] bg-white flex items-center px-[20px] gap-[20px]">
            <Input
              ref={imeiInputRef}
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (imei) {
                    const isUnique = !rowData.some((row) => row.IMEI === imei);
                    if (!isUnique) {
                      showToast({
                        description: "Duplicate IMEI found",
                        variant: "destructive",
                      });
                      return;
                    }
                    setLoading(true);
                    setTimeout(() => {
                      addRow(imei);
                      setImei("");
                      setLoading(false);
                    }, 2000);
                  }
                }
              }}
              className="w-[400px]"
              suffix={!loading ? <BsUpcScan className="h-[18px] w-[18px]" focusable /> : <MdOutlineRefresh className="h-[18px] w-[18px] animate-spin" />}
              placeholder="IMEI/Serial Number"
            />
          </div>
          <AddBatteryQcTable rowData={rowData} setRowdata={setRowData} />
          <div className="h-[50px] bg-white border-t border-neutral-300 flex items-center justify-end gap-[10px] px-[20px]">
            <CustomButton
              disabled={!rowData.length}
              onClick={() => {
                setResetAlert(true);
              }}
              className="text-red-600 hover:text-red-600"
              variant={"outline"}
              icon={<GrPowerReset className="h-[18px] w-[18px]" />}
            >
              Reset
            </CustomButton>
            <CustomButton disabled={!rowData.length} className="bg-cyan-700 hover:bg-cyan-800" icon={<FaRegSave className="h-[18px] w-[18px]" />}>
              Submit
            </CustomButton>
          </div>
        </div>
        <div className="bg-white p-[20px] border-l border-neutral-300">
          <Steps
            progressDot
            current={4}
            direction="vertical"
            items={[
              {
                title: "Scan IMEI",
                description: "Scan the unique IMEI  number of the device. This number helps in identifying and tracking the device. Ensure there are no spaces or special characters for a valid input.",
              },
              {
                title: "Enter IR (Internal Resistance)",
                description: "Provide the internal resistance (IR) value of the device. This value, typically measured in ohms (Ω), is crucial for assessing the device's operational efficiency. Make sure to use accurate measurements.",
              },
              {
                title: "Enter Voltage",
                description: "Input the voltage level of the device. Voltage, measured in volts (V), is essential for monitoring the power status. Please double-check to avoid input errors.",
              },
              {
                title: "Enter Remarks (If Needed)",
                description: "Add any additional notes or observations related to the device. This field is optional but useful for recording specific conditions or requirements. Keep it concise and relevant.",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default BatteryQC;
