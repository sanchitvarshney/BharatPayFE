import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertDateRangev2 } from "@/utils/converDateRangeUtills";
import R2ReportDetail from "@/table/report/R2ReportDetail";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR2Data } from "@/features/report/report/reportSlice";
import R2ReportTable from "@/table/report/R2ReportTable";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { useSocketContext } from "@/components/context/SocketContext";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";


dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";

const R2Report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [date, setDate] = useState<{ from: string; to: string } | null>(null);
  const [open, setOpen] = useState(false);
  const { emitDownloadReport, onDownloadReport } = useSocketContext();

  const dispatch = useAppDispatch();
  const { getR2DataLoading, refId } = useAppSelector((state) => state.report);
  const [loading, setLoading] = useState(false);
  const handleDownload = () => {
    emitDownloadReport({ from: date?.from || "", to: date?.to || "" });
    setLoading(true);
  };
  useEffect(() => {
    onDownloadReport((_: any) => {
      setLoading(false);
      showToast("Report downloaded successfully", "success");
    });
  }, [onDownloadReport]);

  return (
    <>
      <CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent side="right" className="min-w-[80%] p-0" onInteractOutside={(e) => e.preventDefault()}>
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-200 gap-0">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">Ref ID: {"#" + refId}</CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] ">
            <R2ReportDetail />
          </div>
        </CustomDrawerContent>
      </CustomDrawer>

      <div className="bg-white h-[calc(100vh-100px)] flex relative">
        <div className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}>
          <div className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}>
            <Button onClick={() => setcolapse(!colapse)} className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}>
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>

          <div className=" flex flex-col  p-[20px] gap-[20px]  mt-[20px] overflow-hidden ">
            <RangePicker
              className="h-[50px] rounded-sm border-[2px]"
              value={[date ? dayjs(date.from, dateFormat) : null, date ? dayjs(date.to, dateFormat) : null]}
              onChange={(value) => {
               
                const newDate = convertDateRangev2(value!);
                setDate(newDate);
              }}
              disabledDate={(current) => current && current > dayjs()}
              presets={rangePresets}
              placeholder={["Start date", "End Date"]}
              format={dateFormat}
            />
            <div className="flex items-center justify-between">
              <LoadingButton
                loadingPosition="start"
                loading={getR2DataLoading}
                onClick={() => {
                  if (!date) {
                    showToast("Please select a date", "error");
                  } else {
                    dispatch(getR2Data(date)).then((res: any) => {
                      if (res.payload?.data?.status === "success") {
                      }
                    });
                  }
                }}
                startIcon={<Icons.search fontSize="small" />}
                variant="contained"
              >
                Search
              </LoadingButton>
              <MuiTooltip title="Download" placement="right">
                <LoadingButton
                  variant="contained"
                  disabled
                  loading={loading}
                  onClick={handleDownload}
                  color="primary"
                  style={{
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    minWidth: 0,
                    padding: 0,
                  }}
                  size="small"
                  sx={{ zIndex: 1 }}
                >
                  <Icons.download fontSize="small" />
                </LoadingButton>
              </MuiTooltip>
            </div>
          </div>
        </div>
        <div className="w-full">
          <R2ReportTable setOpen={setOpen} />
        </div>
      </div>
    </>
  );
};

export default R2Report;
