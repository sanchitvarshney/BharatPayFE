import React, { useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import DeviceMinViewTable from "@/table/wearhouse/DeviceMinViewTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getAllSubmitInfo, reseAllupdateDeviceInfo, resetAllSubmitInfo, resetDraftMin, resetForm, resetInvoiceFile, resetSerialFile, submitFinalStage } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import parse from "html-react-parser";
import { CircularProgress, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@/utils/toasterContext";
type Props = {
  setStep: (step: number) => void;
  step: number;
};
const DeviceMinStep3: React.FC<Props> = ({ setStep, step }) => {
  const dispatch = useAppDispatch();
  const { getAllsubmitinfoLoading, getAllSubminInfo, finaSubmitLoading, storeDraftMinData, updateMinData } = useAppSelector((state) => state.divicemin);

  useEffect(() => {
    if (storeDraftMinData) {
      dispatch(getAllSubmitInfo(storeDraftMinData?.min_no));
    } else {
    }
  }, []);
  return (
    <div className="h-[calc(100vh-50px)] relative">
      {getAllsubmitinfoLoading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-white">
          <div className="flex items-center">
            <CircularProgress size={50} />
          </div>
        </div>
      )}

      <div className="p-0 bg-hbg h-[50px] flex items-center px-[20px] justify-between border-b border-neutral-300 ">
        <Typography fontSize={18} fontWeight={600} className="text-slate-700">
          Check All the Items you have Submit
        </Typography>
        <p className="font-[600] text-slate-600 text-[18px]">{storeDraftMinData && "#" + storeDraftMinData?.min_no}</p>
      </div>
      <div className="h-[calc(100vh-150px)] overflow-y-auto grid grid-cols-[450px_1fr] p-0">
        <div className="h-full overflow-y-auto border-r p-[20px] ">
          <ul className="h-[calc(100vh-380px)]">
            <li className="flex items-center justify-between text-slate-500 py-[5px] border-b">
              <p className="text-slate-500 font-[600] text-[13px]">Vendor</p>
              <p className="text-[13px]">
                {getAllSubminInfo?.data?.headerData?.vendorName}({getAllSubminInfo?.data?.headerData?.vendorCode})
              </p>
            </li>
            <li className="flex items-center justify-between gap-[50px] text-slate-500 py-[5px] border-b">
              <p className="text-slate-500 font-[600] text-[13px] text-nowrap">Vendor Address</p>
              <p className="text-[13px]">{parse(getAllSubminInfo?.data?.headerData?.vendorAddress || "")}</p>
            </li>
            <li className="flex items-center justify-between text-slate-500 py-[5px] border-b">
              <p className="text-slate-500 font-[600] text-[13px]">Location</p>
              <p className="text-[13px]">{getAllSubminInfo?.data?.headerData?.location}</p>
            </li>
            <li className="flex items-center justify-between text-slate-500 py-[5px] border-b">
              <p className="text-slate-500 font-[600] text-[13px]">SKU</p>
              <p className="text-[13px]">{getAllSubminInfo?.data?.headerData?.sku}</p>
            </li>
            <li className="flex items-center justify-between text-slate-500 py-[5px] border-b">
              <p className="text-slate-500 font-[600] text-[13px]">Device Name</p>
              <p className="text-[13px]">{getAllSubminInfo?.data?.headerData?.deviceName}</p>
            </li>
            <li className="flex items-center justify-between text-slate-500 py-[5px] border-b">
              <p className="text-slate-500 font-[600] text-[13px]">Qty</p>
              <p className="text-[13px]">
                {getAllSubminInfo?.data?.headerData?.qty} {getAllSubminInfo?.data?.headerData?.unit}
              </p>
            </li>
          </ul>
          <div className="">
            <Card className="p-0 border-none shadow-none h-[150px]  ">
              <CardContent className="p-0">
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Total items:</p>
                  <p>{updateMinData?.totalItems}</p>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Remaining items:</p>
                  <p>{updateMinData?.total_remaining}</p>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Scanned items:</p>
                  <p>{updateMinData?.totalScanned}</p>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <p className="font-[600]">Additional items:</p>
                  <p>{updateMinData?.total_additional}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="">
          <DeviceMinViewTable />
        </div>
      </div>
      <CardFooter className="p-0 h-[50px] flex items-center bg-hbg justify-end px-[20px] gap-[10px] border-t border-neutral-300">
        <LoadingButton type="button" startIcon={<FaArrowLeftLong className="h-[18px] w-[18px]" />} onClick={() => setStep(step - 1)} variant={"outlined"} sx={{ background: "white" }}>
          Back
        </LoadingButton>
        <LoadingButton
          type="button"
          loading={finaSubmitLoading}
          onClick={() => {
            if (storeDraftMinData) {
              dispatch(submitFinalStage(storeDraftMinData?.min_no)).then((response: any) => {
                if (response.payload.data.success) {
                  setStep(4);
                  dispatch(resetDraftMin());
                  dispatch(resetInvoiceFile());
                  dispatch(resetForm());
                  dispatch(resetSerialFile());
                  dispatch(reseAllupdateDeviceInfo());
                  dispatch(resetAllSubmitInfo());
                }
              });
            } else {
              showToast("MIN no not found", "error");
            }
          }}
          startIcon={<IoMdCheckmark className="h-[18px] w-[18px]" />}
          variant="contained"
        >
          Submit
        </LoadingButton>
      </CardFooter>
    </div>
  );
};

export default DeviceMinStep3;
