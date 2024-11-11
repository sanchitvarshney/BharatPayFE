import { CustomButton } from "@/components/reusable/CustomButton";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { FaRegSave } from "react-icons/fa";
import { Input, Steps, InputRef } from "antd";
import { showToast } from "@/utils/toastUtils";
import { MdOutlineRefresh } from "react-icons/md";
import { BsUpcScan } from "react-icons/bs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAppSelector } from "@/hooks/useReduxHook";
import CreateProductionTable from "@/table/production/CreateProductionTable";

type RowData = {
  remark: string;
  id: number;
  isNew: boolean;
  component: string;
  qty: string;
  uom: string;
};

const ProductionCreate: React.FC = () => {
//   const dispatch = useAppDispatch();
  const { deviceDetailLoading, batteryQcSaveLoading } = useAppSelector((state) => state.batteryQcReducer);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [resetAlert, setResetAlert] = useState<boolean>(false);
  const [imei, setImei] = useState<string>("");
  const imeiInputRef = useRef<InputRef>(null);
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

    setRowData((prev) => [...prev, newRow].reverse());
  }, [rowData]);

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
        if (!row.component) {
          missingFields.push("Component");
        }
        if (!row.qty) {
          missingFields.push("QTY");
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
          <div className="h-[50px] bg-white flex items-center px-[20px] gap-[20px]">
            <Input
              ref={imeiInputRef}
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              onKeyDown={(e) => {
                console.log(e);
              }}
              className="w-[400px]"
              suffix={!deviceDetailLoading ? <BsUpcScan className="h-[18px] w-[18px]" focusable /> : <MdOutlineRefresh className="h-[18px] w-[18px] animate-spin" />}
              placeholder="IMEI/Serial Number"
            />
          </div>
          <CreateProductionTable addrow={addRow} rowData={rowData} setRowdata={setRowData} />
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
            <CustomButton
              loading={batteryQcSaveLoading}
              onClick={() => {
                onsubmit();
              }}
              disabled={!rowData.length}
              className="bg-cyan-700 hover:bg-cyan-800"
              icon={<FaRegSave className="h-[18px] w-[18px]" />}
            >
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
                title: "Select Components",
                description: "Choose the components required for the device. This step is crucial for identifying specific parts or modules associated with the device.",
              },
              {
                title: "Enter QTY (Quantity)",
                description: "Specify the quantity of devices needed. Ensure accuracy to maintain inventory and order consistency.",
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

export default ProductionCreate;
