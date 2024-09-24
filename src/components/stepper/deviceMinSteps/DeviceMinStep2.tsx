import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "@/components/reusable/CustomButton";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { showToast } from "@/utils/toastUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { checkSerial } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { CgSpinner } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeviceMinTable from "@/table/wearhouse/DeviceMinTable";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Props = {
  setStep: (step: number) => void;
  step: number;
};

interface RowData {
  remarks: string;
  isNew?: boolean;
  id: number;
  simAvailability: string;
  serialno: string;
  IMEI: string;
  model: string;
  isAvailble: boolean;
}

const DeviceMinStep2: React.FC<Props> = ({ setStep, step }) => {
  const [input, setInput] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const continueref = useRef<HTMLButtonElement>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const dispatch = useAppDispatch();
  const { checkSerialLoading, updateMinData, storeDraftMinData } = useAppSelector((state) => state.divicemin);
  const isSerialUnique = (serial: string) => {
    console.log(rowData.some((row) => row.serialno === serial));
    return !rowData.some((row) => row.serialno === serial);
  };

  const addRow = useCallback(
    (serial: string, imei: string, isAvailble: boolean, isSimAvaileble?: string, model?: string) => {
      if (rowData.filter((item) => item.isNew === true).length >= 10) {
        showToast({
          description: "First submit your all items before adding new item",
          variant: "default",
          className: "bg-amber-500 text-white",
        });
      } else {
        const newId = rowData.length + 1;
        const newRow: RowData = {
          id: newId,
          serialno: serial,
          simAvailability: isSimAvaileble || "Y",
          remarks: "",
          isNew: true,
          IMEI: imei,
          model: model || "",
          isAvailble: isAvailble,
        };
        setRowData((prev) => [...prev, newRow]);
        setInput("");
      }
    },
    [rowData]
  );
  useEffect(() => {
    if (step === 2 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  return (
    <>
      <AlertDialog open={alert} onOpenChange={setAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>This Serial No. is not exiest in you uploaded file</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <CardTitle className="text-slate-600">Is SIM Available</CardTitle>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                addRow(input, "", false, "N");
                inputRef.current!.focus();
              }}
            >
              No
            </AlertDialogCancel>
            <AlertDialogAction
              ref={continueref}
              className="bg-cyan-700 hover:bg-cyan-800"
              onClick={() => {
                addRow(input, "", false, "Y");
                inputRef.current!.focus();
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="h-[calc(100vh-70px)]">
        <CardHeader className="p-0 bg-hbg h-[60px] items-center flex-row justify-between px-[20px]">
          <CardTitle>Scan All Items</CardTitle>
          <p className="font-[600] text-slate-600 text-[18px]">{storeDraftMinData && "#" + storeDraftMinData?.min_no}</p>
        </CardHeader>
        <CardContent className="h-[calc(100vh-180px)] p-0 grid grid-cols-[1fr_300px] ">
          <div>
            <div className="max-h-max clear-startgap-[50px] h-[60px] px-[20px] flex items-center ">
              <div className="relative max-w-max ">
                <Input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (input) {
                        if (isSerialUnique(input)) {
                          if (storeDraftMinData) {
                            dispatch(checkSerial({ fileref: storeDraftMinData.fileReference, serials: input })).then((response: any) => {
                              if (response.payload.data.success) {
                                if (response.payload.data.data?.isAvailable) {
                                  addRow(input, response.payload.data.data?.imei, true, "Y", response.payload.data.data?.deviceModel);
                                } else {
                                  setAlert(true);
                                }
                              } else {
                                if (response.payload.data.data?.isAvailable === false) {
                                  setAlert(true);
                                }
                              }
                            });
                          }
                        } else {
                          showToast({
                            description: "Serial number already exists",
                            variant: "destructive",
                          });
                          setInput("");
                        }
                      }
                    }
                  }}
                  ref={inputRef}
                  className="w-[400px]"
                  placeholder="Scan an item to add"
                />
                {checkSerialLoading && (
                  <span>
                    <CgSpinner className="h-[30px] w-[30px] text-slate-400 animate-spin absolute top-[7%] right-[5px]" />
                  </span>
                )}
              </div>
            </div>
            <div className={`  relative `}>
              <DeviceMinTable rowData={rowData} setRowdata={setRowData} />
            </div>
          </div>
          <div className="p-[10px] border-l">
            <Card className="p-0 border-none shadow-none">
              <CardContent className="p-0">
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Total items:</p>
                  <p>{updateMinData?.totalItems}</p>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Scanned items:</p>
                  <p>{updateMinData?.totalScanned}</p>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Remaining items:</p>
                  <p>{updateMinData?.total_remaining}</p>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Additional items:</p>
                  <p>{updateMinData?.total_additional}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="p-0 h-[50px] flex items-center bg-hbg justify-end px-[20px] gap-[10px]">
          <Button onClick={() => setStep(step - 1)} variant={"outline"} className="flex items-center gap-[10px]">
            <FaArrowLeftLong className="h-[18px] w-[18px]" />
            Back
          </Button>
          <CustomButton
            onClick={() => {
              let notsubmit: any[] | null = null;
              notsubmit = rowData?.filter((item) => item.isNew);
              if (notsubmit?.length > 0) {
                showToast({
                  description: `Row no. ${notsubmit.map((item) => item.id).join(",")} items are not submitted`,
                  variant: "destructive",
                });
              } else {
                setStep(step + 1);
              }
            }}
            className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]"
          >
            Next <FaArrowRightLong className="h-[18px] w-[18px]" />
          </CustomButton>
        </CardFooter>
      </Card>
    </>
  );
};

export default DeviceMinStep2;
