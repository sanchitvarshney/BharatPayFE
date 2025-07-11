import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { checkSerial, pustNotExistSr } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import DeviceMinTable from "@/table/wearhouse/DeviceMinTable";
import { CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { Icons } from "@/components/icons";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@/utils/toasterContext";
import { generateUniqueId } from "@/utils/uniqueid";

type Props = {
  setStep: (step: number) => void;
  step: number;
};

interface RowData {
  remarks: string;
  isNew?: boolean;
  id: string;
  simAvailability: string;
  serialno: string;
  IMEI: string;
  model: string;
  isAvailble: boolean;
}

const DeviceMinStep2: React.FC<Props> = ({ setStep, step }) => {
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const dispatch = useAppDispatch();
  const { checkSerialLoading, updateMinData, storeDraftMinData } = useAppSelector((state) => state.divicemin);
  const isSerialUnique = (serial: string) => {
    return !rowData.some((row) => row.serialno === serial);
  };

  const addRow = useCallback(
    (serial: string, imei: string, isAvailble: boolean, isSimAvaileble?: string, model?: string) => {
      if (rowData.filter((item) => item.isNew === true).length >= 10) {
        showToast("First submit your all items before adding new item", "warning");
      } else {
        const newId = generateUniqueId();
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
        setRowData((prev) => [newRow, ...prev]);
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
      

      <div className="h-[calc(100vh-50px)]">
        <div className="h-[50px] flex items-center justify-between bg-hbg px-[20px] border-b border-neutral-300">
          <Typography fontSize={18} fontWeight={600} className="text-slate-700">
            Scan All Items
          </Typography>
          <p className="font-[600] text-slate-600 text-[18px]">{storeDraftMinData && "#" + storeDraftMinData?.min_no}</p>
        </div>
        <div className="h-[calc(100vh-150px)] p-0 grid grid-cols-[1fr_300px] ">
          <div>
            <div className=" clear-startgap-[50px] h-[70px] px-[20px] flex items-center border-b border-neutral-300 ">
              <div className="relative max-w-max ">
                <TextField
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
                                  addRow(input, response.payload.data.data?.imei, true, "N", response.payload.data.data?.deviceModel);
                                } else {
                                  if (input) {
                                    addRow(input, "", false, "--");
                                  }
                                }
                              } else {
                                if (response.payload.data.data?.isAvailable === false) {
                                  if (input) {
                                    addRow(input, "", false, "--");
                                  }
                                }
                              }
                            });
                          } else {
                            showToast("You din't complete your first step", "error");
                          }
                        } else {
                          showToast("Serial number already exists", "error");
                          setInput("");
                        }
                      }
                    }
                  }}
                  ref={inputRef}
                  className="w-[400px] focus-visible:bg-[#fffadb]"
                  placeholder="Scan an item to add"
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">{checkSerialLoading ? <CircularProgress size={25} /> : <Icons.qrScan />}</InputAdornment>,
                    },
                  }}
                />
              </div>
            </div>
            <div className={`  relative `}>
              <DeviceMinTable rowData={rowData} setRowdata={setRowData} />
            </div>
          </div>
          <div className="p-[10px] border-l border-neutral-300">
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
        </div>
        <div className="p-0 h-[50px] flex items-center bg-hbg justify-end px-[20px] gap-[10px] border-t border-neutral-300">
          <LoadingButton sx={{ background: "white" }} startIcon={<FaArrowLeftLong className="h-[18px] w-[18px]" />} type="button" onClick={() => setStep(step - 1)} variant={"outlined"} className="flex items-center gap-[10px]">
            Back
          </LoadingButton>
          <LoadingButton
            type="button"
            onClick={() => {
              let notsubmit: any[] | null = null;
              const notavailble = rowData?.filter((item) => !item.isAvailble);
              const availble = rowData?.filter((item) => item.isAvailble);
              dispatch(pustNotExistSr(notavailble || []));
              notsubmit = availble?.filter((item) => item.isNew);

              if (notsubmit?.length > 0) {
                showToast(`Row no. ${notsubmit.map((item) => item.id).join(",")} items are not submitted`, "error");
              } else {
                setStep(step + 1);
              }
            }}
            variant="contained"
            endIcon={<FaArrowRightLong className="h-[18px] w-[18px]" />}
          >
            Next
          </LoadingButton>
        </div>
      </div>
    </>
  );
};

export default DeviceMinStep2;
