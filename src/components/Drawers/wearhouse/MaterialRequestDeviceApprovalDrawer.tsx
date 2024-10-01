import React, { useEffect, useRef, useState } from "react";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer"; // Update with the correct path
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomSelect from "@/components/reusable/CustomSelect";
import CustomInput from "@/components/reusable/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { CustomButton } from "@/components/reusable/CustomButton";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Skeleton } from "@/components/ui/skeleton";
import { approveDeviceRequest, clearItemdetail, getItemDetailsAsync, getPendingMaterialListsync, getProcessMrReqeustAsync, materialRequestReject } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import { CgSpinner } from "react-icons/cg";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { transformGroupSelectData } from "@/utils/transformUtills";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { SingleValue } from "react-select";
import { showToast } from "@/utils/toastUtils";
import { AlertDescription } from "@/components/ui/alert";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  approved: string[] | null;
  setApproved: React.Dispatch<React.SetStateAction<string[] | null>>;
};

type OptionType = {
  label: string;
  value: string;
};
type Forstate = {
  picLocation: OptionType | null;
  issueQty: string;
  remarks: string;
  
};
const MaterialRequestDeviceApprovalDrawer: React.FC<Props> = ({ open, setOpen, approved, setApproved }) => {
  const [itemkey, setItemKey] = useState<string>("");
  const { processMrRequestLoading, processRequestData, requestDetail, itemDetail, itemDetailLoading, approveItemLoading, rejectItemLoading } = useAppSelector((state) => state.pendingMr);
  const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);
  const [scanned, setScanned] = useState<string[] | null>(null);
  const [input, setInput] = useState<string>("");
  const [isueeQty, setIsueeQty] = useState<string>("");
  const [confirmIssueChange, setConfirmIssueChange] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Forstate>({
    defaultValues: {
      picLocation: null,
      issueQty: "",
      remarks: "",
    },
  });
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const onSubmit: SubmitHandler<Forstate> = (data) => {
    dispatch(
      approveDeviceRequest({
        itemCode: itemkey,
        pickLocation: data.picLocation!.value,
        issueQty: data.issueQty,
        txnID: requestDetail?.id || "",
        srlNumber: scanned || [],
      })
    ).then((response: any) => {
      if (response.payload.data?.success) {
        dispatch(clearItemdetail());
        setItemKey("");
        reset();
        approved ? setApproved([...approved, itemkey]) : setApproved([itemkey]);
        setScanned(null);
        setIsueeQty("");
      }
    });
  };

  useEffect(() => {
    if (!open) {
      setScanned(null);
      setItemKey("");
      reset();
      setIsueeQty("");
      setRemarks("");
    }
  }, [open]);
 
  return (
    <div>
      {/*confirm isuee change =======================================================  */}
      <AlertDialog open={confirmIssueChange} onOpenChange={setConfirmIssueChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">Are you absolutely sure?</AlertDialogTitle>
            <AlertDescription>If you change the issue quantity, Then your all scanned data will be cleared.</AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                setScanned(null);
                setInput("");
                setValue("issueQty", "");
                setIsueeQty("");
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/*confirm isuee change =======================================================  */}
      <CustomDrawer
        open={open}
        onOpenChange={(e) => {
          setOpen(e);
          if (!e) {
            dispatch(getPendingMaterialListsync());
          }
        }}
      >
        <CustomDrawerContent side="bottom" className="min-w-[100%] p-0" onInteractOutside={(e) => e.preventDefault()}>
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-300 ">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">Device Process Request</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] overflow-y-auto grid grid-cols-[250px_1fr_1fr]">
            <div className="relative border-r border-slate-300">
              <CardTitle className="text-slate-600 border-b h-[40px] px-[10px] flex items-center bg-hbg">Requested Details</CardTitle>
              <div className="p-[10px]">
                <ul className="flex flex-col gap-[10px]">
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">BOM:</p>
                    {processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : <p className="text-slate-500 text-[14px] ml-[5px]">{processRequestData?.head?.bomName}</p>}
                  </li>
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">Req. Location:</p>
                    {processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : <p className="text-slate-500 text-[14px] ml-[5px]">{processRequestData?.head?.locationName}</p>}
                  </li>
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">MFG Qty:</p>
                    {processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : <p className="text-slate-500 text-[14px] ml-[5px]">{processRequestData?.head?.mfgQty}</p>}
                  </li>
                </ul>
              </div>
              <div className="absolute bottom-[10px] border-t w-full border-slate-300 p-[10px]">
                <ul className="flex flex-col gap-[10px]">
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">Request Id:</p>
                    <p className="text-slate-500 text-[14px] ml-[5px]">{requestDetail?.id}</p>
                  </li>
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">Request From:</p>
                    <p className="text-slate-500 text-[14px] ml-[5px]">{requestDetail?.name}</p>
                  </li>
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">Request Date:</p>
                    <p className="text-slate-500 text-[14px] ml-[5px]">{requestDetail?.requestDate}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-r border-slate-300">
              <CardTitle className="text-slate-600 border-b h-[40px] px-[10px] flex items-center bg-hbg ">Requested Items</CardTitle>
              <div className="p-[10px] h-[calc(100vh-90px)] ">
                <div className="relative flex items-center">
                  <Input placeholder="Serch Items" />
                  <Filter className="h-[20px] w-[20px] text-slate-400 absolute right-[5px]" />
                </div>
                <div className="mt-[20px] ">
                  {processMrRequestLoading ? (
                    <ul className="flex flex-col gap-[10px]">
                      <li>
                        <Skeleton className="h-[50px] w-full" />
                      </li>
                      <li>
                        <Skeleton className="h-[50px] w-full" />
                      </li>
                      <li>
                        <Skeleton className="h-[50px] w-full" />
                      </li>
                    </ul>
                  ) : (
                    <RadioGroup
                      defaultValue="option-one"
                      onValueChange={(e) => {
                        setItemKey(e);
                      }}
                    >
                      {processRequestData?.body?.map((item, index) => (
                        <Label key={index} htmlFor={item?.partKey} className={`flex  space-x-2  border-b p-[10px] items-start cursor-pointer ${approved?.includes(item?.partKey) ? "opacity-50 pointer-events-none" : ""}`}>
                          <RadioGroupItem value={item?.partKey} id={item?.partKey} className="mt-[5px]" />
                          <div>
                            <p className="text-slate-600 font-[600]">{item?.partCode}</p>
                            <p className="text-slate-600 text-[13px]">{item?.partName}</p>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>
            </div>
            <div className={`${itemkey ? "" : "opacity-40 pointer-events-none"}`}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardTitle className="text-slate-600 border-b h-[40px] px-[10px] flex items-center bg-hbg ">Item Transfer Details</CardTitle>
                <div className={`p-[10px] h-[240px]  relative `}>
                  {itemDetailLoading && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[10] bg-white/60">
                      <div className="max-h-max max-w-max">
                        <CgSpinner className="text-slate-600  animate-spin h-[30px] w-[30px]" />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-[10px]">
                    <div className="border-b">
                      <p className="text-slate-600 font-[600]">Available Qty</p>
                      <p className="text-slate-600 text-[14px]">{itemDetail ? itemDetail[0]?.stock : "--"}</p>
                    </div>
                    <div className="border-b">
                      <p className="text-slate-600 font-[600]">Requested Qty</p>
                      <p className="text-slate-600 text-[14px]">{itemDetail ? itemDetail[0]?.reqQty : "--"}</p>
                    </div>
                  </div>

                  <div className="mt-[30px] flex flex-col gap-[20px]">
                    <div className="grid grid-cols-2 gap-[10px]">
                      <div>
                        <Controller
                          name="picLocation"
                          control={control}
                          rules={{ required: "Pic Location is required" }}
                          render={({ field }) => (
                            <CustomSelect
                              options={transformGroupSelectData(locationData)}
                              isLoading={getLocationLoading}
                              {...field}
                              required
                              value={field.value}
                              isClearable={true}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption as SingleValue<OptionType>);
                                dispatch(getItemDetailsAsync({ txnid: requestDetail?.id || "", itemKey: itemkey, picLocation: selectedOption!.value }));
                              }}
                              placeholder={"Pick Location"}
                              onInputChange={(value) => {
                                if (debounceTimeout.current) {
                                  clearTimeout(debounceTimeout.current);
                                }
                                debounceTimeout.current = setTimeout(() => {
                                  dispatch(getLocationAsync(!value ? null : value));
                                }, 500);
                              }}
                            />
                          )}
                        />
                        {errors.picLocation && <span className=" text-[12px] text-red-500">{errors.picLocation.message}</span>}
                      </div>
                      <div>
                        <Controller
                          name="issueQty"
                          control={control}
                          rules={{ required: "Issue Qty is required" }}
                          render={({ field }) => (
                            <CustomInput
                              // disabled={!itemDetail || itemDetail[0]?.stock < 1 || itemDetail[0]?.reqQty < 1}
                              {...field}
                              value={field.value}
                              required
                              type="number"
                              label="Issue Qty"
                              onChange={(e) => {
                                if (itemDetail) {
                                  if (parseInt(e.target.value) > itemDetail[0]?.stock || parseInt(e.target.value) > itemDetail[0]?.reqQty) {
                                    showToast({
                                      description: "Issue Qty can't be greater than Available Qty or Requested Qty",
                                      variant: "destructive",
                                    });
                                  } else {
                                    if (scanned && scanned?.length > 0) {
                                      setConfirmIssueChange(true);
                                    } else {
                                      field.onChange(e);
                                      setIsueeQty(e.target.value);
                                    }
                                  }
                                }
                              }}
                            />
                          )}
                        />

                        {errors.issueQty && <span className=" text-[12px] text-red-500">{errors.issueQty.message}</span>}
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-500">Remarks</Label>
                      <Controller
                        name="remarks"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              setRemarks(e.target.value);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className={`${isueeQty && Number(isueeQty) > 0 ? "" : "opacity-40 pointer-events-none"}`}>
                  <div className="h-[50px] px-[10px] bg-zinc-100 flex items-center border-t border-slate-300">
                    <div className="relative w-full ">
                      <Input
                        value={input}
                        className="bg-white shadow-slate-400"
                        placeholder="Scan Product..."
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (input) {
                              if (scanned && scanned.includes(input)) {
                                showToast({
                                  description: "Product already scanned",
                                  variant: "destructive",
                                });
                              } else {
                                if (scanned && scanned.length + 1 > parseInt(isueeQty)) {
                                  showToast({
                                    description: "Scanned Items can't be greater than Issue Qty",
                                    variant: "destructive",
                                  });
                                } else {
                                  scanned ? setScanned([input, ...scanned]) : setScanned([input]);
                                  setInput("");
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="h-[calc(100vh-425px)] overflow-y-auto bg-zinc-100">
                    <div className="bg-hbg h-[30px] px-[10px] flex items-center justify-between">
                      <p className="font-[500]">Total Scanned Products</p>
                      <p className="font-[500] text-slate-500">Total Scanned Items:{scanned ? scanned.length : 0}</p>
                    </div>
                    <div className="h-[calc(100vh-455px)] overflow-y-auto flex flex-col bg-white ">
                      <ul className="flex flex-col ">{scanned ? scanned.map((item) => <li className="py-[3px] border-b px-[20px]">{item}</li>) : ""}</ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-[10px] h-[45px] border-t shadow px-[20px] border-slate-300">
                  <CustomButton
                    type="button"
                    onClick={() => {
                      if (!remarks) {
                        showToast({
                          description: "Remarks is required",
                          variant: "destructive",
                        });
                      } else {
                        dispatch(
                          materialRequestReject({
                            itemCode: itemkey,
                            txnId: requestDetail?.id || "",
                            remarks: remarks,
                          })
                        ).then((response: any) => {
                          if (response.payload.data?.success) {
                            dispatch(getProcessMrReqeustAsync(requestDetail?.id || ""));
                            setItemKey("");
                            reset();
                          }
                        });
                      }
                    }}
                    variant={"outline"}
                    icon={<RxCross2 className="h-[18px] w-[18px] text-red-500" />}
                    loading={rejectItemLoading}
                  >
                    Reject
                  </CustomButton>
                  <CustomButton disabled={!(scanned ? parseInt(isueeQty) === scanned.length : true) || approveItemLoading} loading={approveItemLoading} className="bg-cyan-700 hover:bg-cyan-800" icon={<IoMdCheckmark className="h-[18px] w-[18px] " />}>
                    Approve
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        </CustomDrawerContent>
      </CustomDrawer>
    </div>
  );
};

export default MaterialRequestDeviceApprovalDrawer;
