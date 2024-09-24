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
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Skeleton } from "@/components/ui/skeleton";
import { approveSelectedItemAsync, clearItemdetail, getItemDetailsAsync, getProcessMrReqeustAsync, materialRequestReject } from "@/features/wearhouse/MaterialApproval/MrApprovalSlice";
import { CgSpinner } from "react-icons/cg";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { transformGroupSelectData } from "@/utils/transformUtills";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { SingleValue } from "react-select";
import { showToast } from "@/utils/toastUtils";

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
const MaterialRequestApprovalDrawer: React.FC<Props> = ({ open, setOpen, approved, setApproved }) => {
  const [itemkey, setItemKey] = useState<string>("");
  const { processMrRequestLoading, processRequestData, requestDetail, itemDetail, itemDetailLoading, approveItemLoading ,rejectItemLoading} = useAppSelector((state) => state.pendingMr);
  const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);
  const [remarks, setRemarks] = useState<string>("");
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
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
      approveSelectedItemAsync({
        itemsCode: itemkey,
        pickLocation: data.picLocation!.value,
        issueQty: data.issueQty,
        remarks: data.remarks,
        transactionId: requestDetail?.id || "",
      })
    ).then((response: any) => {
      if (response.payload.data?.success) {
        dispatch(clearItemdetail());
        setItemKey("");
        reset();
        approved ? setApproved([...approved, itemkey]) : setApproved([itemkey]);
      }
    });
  };
  useEffect(() => {
    dispatch(getLocationAsync(null));
  }, []);
  return (
    <div>
    
      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent side="right" className="min-w-[80%] p-0" onInteractOutside={(e) => e.preventDefault()}>
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-400 ">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0"> Process Request</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] overflow-y-auto grid grid-cols-[250px_1fr_1fr]">
            <div className="relative border-r border-slate-300">
              <CardTitle className="text-slate-600 border-b h-[40px] px-[10px] flex items-center bg-hbg">Requested Details</CardTitle>
              <div className="p-[10px]">
                <ul className="flex flex-col gap-[10px]">
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">BOM:</p>
                    {processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : <p className="text-slate-500 text-[14px] ml-[5px]">{processRequestData?.head[0]?.bomName}</p>}
                  </li>
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">Req. Location:</p>
                    {processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : <p className="text-slate-500 text-[14px] ml-[5px]">{processRequestData?.head[0]?.locationName}</p>}
                  </li>
                  <li>
                    <p className="text-slate-500 font-[600] text-[14px] ml-[5px]">MFG Qty:</p>
                    {processMrRequestLoading ? <Skeleton className="w-full h-[20px]" /> : <p className="text-slate-500 text-[14px] ml-[5px]">{processRequestData?.head[0]?.mfgQty}</p>}
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
            <div className="">
              <CardTitle className="text-slate-600 border-b h-[40px] px-[10px] flex items-center bg-hbg ">Item Transfer Details</CardTitle>
              <div className={`p-[10px]  relative ${itemkey ? "" : "opacity-40 pointer-events-none"}`}>
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
                <form onSubmit={handleSubmit(onSubmit)}>
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
                              placeholder={"Location"}
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
                        <CustomInput required type="number" label="Issue Qty" {...register("issueQty", { required: "Issue Qty is required" })} />
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
                        )}/>
                    </div>
                    <div className="flex items-center justify-end gap-[10px]">
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
                        ).then((response:any)=>{
                          if(response.payload.data?.success){
                            dispatch(getProcessMrReqeustAsync(requestDetail?.id||""));
                            setItemKey("")
                            reset()
                          }
                        })
                      }
                    }}
                    variant={"outline"}
                    icon={<RxCross2 className="h-[18px] w-[18px] text-red-500" />}
                    loading={rejectItemLoading}
                  >
                    Reject
                  </CustomButton>
                      <CustomButton loading={approveItemLoading} className="bg-cyan-700 hover:bg-cyan-800" icon={<IoMdCheckmark className="h-[18px] w-[18px] " />}>
                        Approve
                      </CustomButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </CustomDrawerContent>
      </CustomDrawer>
    </div>
  );
};

export default MaterialRequestApprovalDrawer;
