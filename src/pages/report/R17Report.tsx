import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getR17Data } from "@/features/report/report/reportSlice";
import { useSocketContext } from "@/components/context/SocketContext";
import R17ReportTable from "@/table/report/R17ReportTable";
import SelectDeviceWithType from "@/components/reusable/SelectDeviceWithType";
import { FormControl, MenuItem, Select } from "@mui/material";
import SelectComponent from "@/components/reusable/SelectComponent";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";

const R17Report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [date, setDate] = useState<{ from: string; to: string } | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [device, setDevice] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("device");
  const { emitDownloadR17Report } = useSocketContext();

  const dispatch = useAppDispatch();
  const { getR17DataLoading } = useAppSelector((state) => state.report);

  const handleDownload = () => {
    if (!date?.from || !date?.to) {
      showToast("Please select a date range", "error");
      return;
    }
    emitDownloadR17Report({ from: date.from, to: date.to });
  };

  const handlePageChange = (newPage: number) => {
    if (date) {
      dispatch(
        getR17Data({
          ...date,
          page: newPage,
          limit: pageSize,
          device: device?.id,
          type: filterType,
        })
      );
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    if (date) {
      dispatch(
        getR17Data({ ...date, page: 1, limit: size, device: device?.id, type: filterType })
      );
    }
  };

  return (
    <div className="bg-white h-[calc(100vh-100px)] flex relative">
      <div
        className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)] border-r border-neutral-300 ${
          colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px]"
        }`}
      >
        <div
          className={`transition-all ${
            colapse ? "left-0" : "left-[400px]"
          } w-[16px] p-0 h-full top-0 bottom-0 absolute rounded-none text-slate-600 z-[10] flex items-center justify-center`}
        >
          <Button
            onClick={() => setcolapse(!colapse)}
            className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200 rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300`}
          >
            {colapse ? (
              <Icons.right fontSize="small" />
            ) : (
              <Icons.left fontSize="small" />
            )}
          </Button>
        </div>

        <div className="flex flex-col p-[20px] gap-[20px] mt-[20px] overflow-hidden">
          <FormControl fullWidth>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="device">Device</MenuItem>
              <MenuItem value="part">Part</MenuItem>
            </Select>
          </FormControl>
           {filterType === "device" ? <SelectDeviceWithType
              value={device}
              onChange={setDevice}
              type="swipeMachine"
            /> :    <div>
            <SelectComponent value={device} onChange={(e) => setDevice(e)} label="Select Part" />
          </div>}
          <RangePicker
            className="h-[50px] rounded-sm border-[2px]"
            value={[
              date ? dayjs(date.from, dateFormat) : null,
              date ? dayjs(date.to, dateFormat) : null,
            ]}
            onChange={(value) => {
              if (value) {
                setDate({
                  from: value[0]?.format(dateFormat) || "",
                  to: value[1]?.format(dateFormat) || "",
                });
              } else {
                setDate(null);
              }
            }}
            disabledDate={(current) => current && current > dayjs()}
            presets={rangePresets}
            placeholder={["Start date", "End Date"]}
            format={dateFormat}
          />

          <div className="flex items-center justify-between">
            <LoadingButton
              loadingPosition="start"
              loading={getR17DataLoading}
              onClick={() => {
                if (!date) {
                  showToast("Please select a date range", "error");
                } else {
                  dispatch(
                    getR17Data({
                      ...date,
                      page: 1,
                      limit: pageSize,
                      device: device?.id,
                      type: filterType,
                    })
                  ).then((res: any) => {
                    if (res.payload?.data?.status === "success") {
                      showToast("Report loaded successfully", "success");
                    }
                  });
                }
              }}
              startIcon={<Icons.search fontSize="small" />}
              variant="contained"
            >
              Search
            </LoadingButton>
            <LoadingButton
              variant="contained"
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
          </div>
        </div>
      </div>
      <div className="w-full">
        <R17ReportTable
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default R17Report;
