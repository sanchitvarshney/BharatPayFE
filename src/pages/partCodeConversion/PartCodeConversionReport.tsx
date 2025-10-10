import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  getPartCodeReport,
} from "@/features/report/report/reportSlice";
import { DatePicker } from "antd";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import SelectComponent from "@/components/reusable/SelectComponent";
import PartCodeConversionReportTable from "@/table/report/PartCodeConversionReportTable";
import { CustomDrawer, CustomDrawerContent, CustomDrawerHeader, CustomDrawerTitle } from "@/components/reusable/CustomDrawer";
import PartCodeConversionDetail from "@/table/report/PartCodeConversionDetail";
const { RangePicker } = DatePicker;

const PartCodeConversionReport: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [reportDate, setReportDate] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  }>({
    from: null,
    to: null,
  });

  const [filterType, setFilterType] = useState<string>("component");
  const [component, setComponent] = useState<any>(null);
  const dispatch = useAppDispatch();
  const { partConversionLoading,refId } = useAppSelector(
    (state) => state.report
  );

  return (
    <><div className="flex bg-white h-[calc(100vh-100px)] relative">
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}`}
      >
        <div
          className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
        >
          <Button
            onClick={() => setcolapse(!colapse)}
            className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
          >
            {colapse ? (
              <Icons.right fontSize="small" />
            ) : (
              <Icons.left fontSize="small" />
            )}
          </Button>
        </div>
        <div>
          <div className="flex flex-col   gap-[20px] p-[20px]   mt-[20px] overflow-hidden">
            <FormControl fullWidth>
              <Select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setComponent(null);
                } }
              >
                <MenuItem value="component">Component</MenuItem>
                <MenuItem value="DATE">Date</MenuItem>
              </Select>
            </FormControl>
            {filterType === "component" ? (
              <SelectComponent
                value={component}
                onChange={(e) => setComponent(e)}
                label="Select Component" />
            ) : (
              <div>
                <RangePicker
                  required
                  placement="bottomRight"
                  className="w-full h-[50px] border-[2px] rounded-sm"
                  format="DD-MM-YYYY"
                  disabledDate={(current) => current && current > dayjs()}
                  placeholder={["Start date", "End Date"]}
                  value={reportDate.from && reportDate.to
                    ? [reportDate.from, reportDate.to]
                    : null}
                  onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                    if (range) {
                      setReportDate({ from: range[0], to: range[1] });
                    } else {
                      setReportDate({ from: null, to: null });
                    }
                  } }
                  presets={rangePresets} />
              </div>
            )}

            <div className="flex flex-col gap-[20px] ">
              <div className="flex items-center justify-between">
                <LoadingButton
                  disabled={
                   filterType === "DATE" ? !reportDate.from || !reportDate.to : !component
                  }
                  className="max-w-max"
                  variant="contained"
                  loading={partConversionLoading}
                  onClick={() => {
                    if (filterType === "DATE") {
                      dispatch(
                        getPartCodeReport({
                          type: filterType,
                          fromDate: dayjs(reportDate.from).format("YYYY-MM-DD"),
                          toDate: dayjs(reportDate.to).format("YYYY-MM-DD"),
                        })
                      ).then((response: any) => {
                        if (response.payload?.data?.success) {
                        }
                      });
                    } else {
                      dispatch(
                        getPartCodeReport({
                          type: filterType,
                          component: component?.id,
                        })
                      );
                    }
                  } }
                  startIcon={<Icons.search fontSize="small" />}
                >
                  Search
                </LoadingButton>
                {/* <MuiTooltip title="Download" placement="right">
                  <LoadingButton
                    disabled={!isConnected}
                    variant="contained"
                    color="primary"
                    style={{
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      minWidth: 0,
                      padding: 0,
                    }}
                    // onClick={() => exportWrongDeviceData()}
                    size="small"
                    sx={{ zIndex: 1 }}
                  >
                    <Icons.download fontSize="small" />
                  </LoadingButton>
                </MuiTooltip> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <PartCodeConversionReportTable  setOpen={setOpen}/>
      </div>
    </div><CustomDrawer open={open} onOpenChange={setOpen}>
        <CustomDrawerContent
          side="right"
          className="min-w-[80%] p-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <CustomDrawerHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] space-y-0 bg-zinc-200 gap-0">
            <CustomDrawerTitle className="text-slate-600 font-[500] p-0">
              Ref ID: {"#" + refId}
            </CustomDrawerTitle>
          </CustomDrawerHeader>
          <div className="h-[calc(100vh-50px)] ">
            <PartCodeConversionDetail />
          </div>
        </CustomDrawerContent>
      </CustomDrawer></>
    
  );
};

export default PartCodeConversionReport;
