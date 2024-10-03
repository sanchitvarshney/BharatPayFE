import { CustomButton } from "@/components/reusable/CustomButton";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import ViewTRCTable from "@/table/TRC/ViewTRCTable";
import React, { useEffect, useRef, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearTrcDetail, getTrcList, trcFinalSubmit } from "@/features/trc/ViewTrc/viewTrcSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { transformGroupSelectData } from "@/utils/transformUtills";

import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { showToast } from "@/utils/toastUtils";
import { TrcFinalSubmitPayload } from "@/features/trc/ViewTrc/viewTrcType";
interface Issue {
  id: number;
  issue: string;
  selectedPart: { value: string; label: string } | null;
  quantity: number | string;
  remarks: string;
  isChecked: boolean;
  code: string;
}
type OptionType = {
  value: string;
  label: string;
};
const ViewTRC: React.FC = () => {
  const dispatch = useAppDispatch();
  const { TRCDetail, getTrcRequestDetailLoading, trcRequestDetail,TrcFinalSubmitLoading } = useAppSelector((state) => state.viewTrc);
  const { getLocationLoading, locationData } = useAppSelector((state) => state.divicemin);
  const { partCodeData, getPartCodeLoading } = useAppSelector((state) => state.materialRequestWithoutBom);
  const [process, setProcess] = useState<boolean>(false);
  const [location, setLocation] = useState<OptionType | null>(null);
  const [issues, setIssues] = useState<Issue[]>([
    // { id: 1, issue: "Issue1", selectedPart: null, quantity: 0, remarks: "", isChecked: false },
  ]);
  const [approved, setApproved] = useState<string[]|null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [device, setDevice] = useState<string>("");
  const handleInputChange = (id: number, field: keyof Issue, value: any) => {
    setIssues((prevIssues) => prevIssues.map((issue) => (issue.id === id ? { ...issue, [field]: value } : issue)));
  };


  const checkRequiredFields = (data: Issue[]) => {
    let hasErrors = false;
    const requiredFields: Array<keyof Issue> = ["issue", "selectedPart", "quantity"];
    const miss = data.map((item) => {
      const missingFields: string[] = [];
      requiredFields.forEach((field) => {
        // Check if the required field is empty
        if (item[field] === "" || item[field] === 0 || item[field] === undefined || item[field] === null) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return `${item.id}`;
      }
    });
    
    if(data.filter((item) => !item.isChecked).length > 0){
      showToast({
        description: "Please check all issues",
        variant: "destructive",
      })
      hasErrors = true;
    }
  
    if (miss.filter((item) => item !== undefined).length > 0) {
      showToast({
        description: `Some required fields are missing: line no. ${miss.filter((item) => item !== undefined).join(", ")}`,
        variant: "destructive",
        duration: 3000,
      });
      hasErrors = true;
    }

   
    return hasErrors;
  };
  const  onSubmit = ()=>{
    if(issues.length === 0){
      showToast({
        description: "Issue not added",  
        variant: "destructive",
      })
    }else if(!checkRequiredFields(issues)){
      // TRCDetail?.txnId
      const  consumpItem = issues.map((item)=>item.selectedPart?.value||"")
      const consumpQty = issues.map((item)=>item.quantity)
      const remark = issues.map((item)=>item.remarks)
      const payload :TrcFinalSubmitPayload={
        txnId:TRCDetail?.txnId||"", 
        consumpItem,
        consumpQty,
        remark,
        putLocation:location?.value||""
      }
      dispatch(trcFinalSubmit(payload)).then((res: any) => {
        if (res.payload.data.success) {
          if(!approved){
            setApproved([device])
          }else{
            setApproved([...approved,device])
          }
          setDevice("")
          if(approved?.length === trcRequestDetail!.body.length){
            setProcess(false)
            dispatch(getTrcList());
          }
        }
      })
    }
  }
 
  useEffect(() => {
    dispatch(getTrcList());
    dispatch(getLocationAsync(null));
    dispatch(getPertCodesync(null));
  }, []);
  useEffect(() => {
    if (!process) {
      dispatch(clearTrcDetail());
      setDevice("");
      setIssues([]);
    }
  }, [process]);

  useEffect(() => {
    if (device && trcRequestDetail) {
      setIssues(
        trcRequestDetail.body
          .find((item) => item.device === device)
          ?.issue.map((item, index) => {
            return { id: index + 1, issue: item.text, selectedPart: null, quantity: "", remarks: "", isChecked: false, code: item.code };
          }) || []
      );
    }
  }, [device]);

  return (
    <>
      <CustomDrawer open={process} onOpenChange={setProcess}>
        <CustomDrawerContent className="min-w-[100%] p-0" onInteractOutside={(e) => e.preventDefault()}>
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-300">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">REF98765RDFGHBJKLOI9876</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] grid grid-cols-[500px_1fr]">
            <div className="border-r border-zinc-300">
              <div className="bg-hbg h-[40px] flex items-center px-[10px]">
                <p className="text-slate-600 font-[600]">Device List</p>
              </div>
              <div className="h-[calc(100vh-140px)]">
                <div className=" h-[calc(100vh-270px)] overflow-y-auto">
                  {getTrcRequestDetailLoading ? (
                    <div className="flex flex-col gap-[5px] p-[10px]">
                      <Skeleton className="h-[30px] w-full" />
                      <Skeleton className="h-[30px] w-full" />
                      <Skeleton className="h-[30px] w-full" />
                      <Skeleton className="h-[30px] w-full" />
                      <Skeleton className="h-[30px] w-full" />
                      <Skeleton className="h-[30px] w-full" />
                    </div>
                  ) : (
                    <RadioGroup onValueChange={(e) => setDevice(e)} className="flex flex-col gap-0 p-0 m-0">
                      {trcRequestDetail
                        ? trcRequestDetail.body.map((item) => (
                            <Label key={item.device} htmlFor={item.device} className={`p-0 cursor-pointer ${approved && approved.includes(item.device) ? "pointer-events-none opacity-55" : ""}`}>
                              <div className=" items-center grid grid-cols-[30px_1fr] py-[10px] border-b ps-[10px] ">
                                <RadioGroupItem value={item.device} id={item.device} />
                                <p>{item.device}</p>
                              </div>
                            </Label>
                          ))
                        : ""}
                    </RadioGroup>
                  )}
                </div>
                <div className=" h-[150px] border-t border-slate-300 p-[10px]">
                  <div className="flex items-center gap-[10px]">
                    <p className="font-[500]">Requested By : </p>
                    <p>{TRCDetail ? TRCDetail?.requestedBy || "--" : "--"} </p>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <p className="font-[500]">Reference ID: </p>
                    <p>{TRCDetail ? TRCDetail?.txnId : "--"} </p>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <p className="font-[500]">From Location: </p>
                    <p>{TRCDetail ? TRCDetail?.location : "--"} </p>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <p className="font-[500]">Insert Date: </p>
                    <p>{TRCDetail ? TRCDetail?.insertDate : "--"} </p>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <p className="font-[500]">Total Device </p>
                    <p>{TRCDetail ? TRCDetail?.totalDevice : "--"} </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-hbg h-[40px] flex items-center px-[10px]">
                <p className="text-slate-600 font-[600]">Fix Issues</p>
              </div>
              <div className="h-[calc(100vh-90px)] overflow-y-auto ">
                {/* <div className="flex items-center justify-center h-[100%]">
                  <img src="/empty.png" alt="" className="h-[100px] w-[100px]" />
                </div> */}
                <div className="h-[calc(100vh-140px)] ">
                  <div className="p-[20px]  h-[70px]">
                    <div className="grid grid-cols-[1fr_1fr] gap-[20px]">
                      <div className="flex items-center gap-[10px]">
                        <p>IMEI : </p>
                        <p>{trcRequestDetail && trcRequestDetail.body.find((item) => item.device === device)?.deviceDetail?.imei} </p>
                      </div>
                      <div className="flex items-center gap-[10px]">
                        <p>Model No. : </p>
                        <p>{trcRequestDetail && trcRequestDetail.body.find((item) => item.device === device)?.deviceDetail?.model} </p>
                      </div>
                    </div>
                  </div>
                  <div className=" h-[60px]  flex items-center px-[10px]">
                    <CustomSelect
                      isLoading={getLocationLoading}
                      value={location}
                      options={transformGroupSelectData(locationData)}
                      onInputChange={(value) => {
                        if (debounceTimeout.current) {
                          clearTimeout(debounceTimeout.current);
                        }
                        debounceTimeout.current = setTimeout(() => {
                          dispatch(getLocationAsync(!value ? null : value));
                        }, 500);
                      }}
                      required
                      isClearable={true}
                      onChange={(selectedOption) => {
                        setLocation(selectedOption);
                      }}
                      placeholder={"Put Location"}
                      className="w-[500px]"
                    />
                  </div>
                  <div>
                    <div className="h-[40px] bg-hbg flex items-center px-[10px] justify-between">
                      <p className="text-slate-600 font-[600]">Verify Fix Issues</p>
                      <p className="text-slate-600 font-[600]">Total fix issues: {issues.filter((issue) => issue.isChecked).length.toString()}</p>
                    </div>
                    <div className="h-[calc(100vh-310px)]  overflow-y-auto overflow-x-auto">
                      {!device ? (
                        <div className="flex items-center justify-center h-[100%]">
                          <img src="/empty.png" alt="" className="h-[100px] w-[100px]" />
                        </div>
                      ) : (
                        issues.map((issue) => (
                          <div key={issue.id} className="p-[10px] py-[5px] font-[400] text-slate-600 border-b grid grid-cols-[1fr_1fr_150px_1fr] gap-[20px]">
                            <div className="flex items-center gap-[10px]">
                              <Checkbox id={`issue${issue.id}`} checked={issue.isChecked} onCheckedChange={(checked) => handleInputChange(issue.id, "isChecked", checked)} className="data-[state=checked]:bg-cyan-700 border-cyan-700 h-[20px] w-[20px]" />{" "}
                              <Label htmlFor={`issue${issue.id}`} className="cursor-pointer">
                                {issue.issue}
                              </Label>
                            </div>

                            <CustomSelect
                              fullborder
                              isLoading={getPartCodeLoading}
                              value={issue.selectedPart}
                              options={transformGroupSelectData(partCodeData)}
                              onInputChange={(value) => {
                                if (debounceTimeout.current) {
                                  clearTimeout(debounceTimeout.current);
                                }
                                debounceTimeout.current = setTimeout(() => {
                                  dispatch(getPertCodesync(!value ? null : value));
                                }, 500);
                              }}
                              required
                              isClearable={true}
                              onChange={(value) => handleInputChange(issue.id, "selectedPart", value)}
                              placeholder={"Select used part"}
                            />
                            <div className="flex items-center h-[35px] overflow-hidden border rounded-lg border-slate-400">
                              <Input value={issue.quantity} onChange={(e) => handleInputChange(issue.id, "quantity", Number(e.target.value))} min={0} placeholder="Qty" type="number" className="w-[100%]  text-slate-600  border-none shadow-none mt-[2px] focus-visible:ring-0" />
                              <div className="w-[70px] bg-zinc-200 flex justify-center h-full items-center g">{partCodeData ? partCodeData.find((item) => item.id === issue.selectedPart?.value)?.unit : "--"}</div>
                            </div>
                            <Input className="border-slate-400" placeholder="Remarks" value={issue.remarks} onChange={(e) => handleInputChange(issue.id, "remarks", e.target.value)} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-[50px] flex items-center justify-end px-[10px] gap-[10px] border-t border-slate-300">
                  <CustomButton   variant={"outline"} icon={<FaXmark className="h-[18px] w-[18px] text-red-500" />}>
                    Cancel
                  </CustomButton>
                  <CustomButton onClick={onSubmit}  loading={TrcFinalSubmitLoading} className="bg-cyan-700 hover:bg-cyan-800" icon={<IoMdCheckmark className="h-[18px] w-[18px] " />}>
                    Submit
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </CustomDrawerContent>
      </CustomDrawer>
      <ViewTRCTable open={process} setOpen={setProcess} />
    </>
  );
};

export default ViewTRC;
