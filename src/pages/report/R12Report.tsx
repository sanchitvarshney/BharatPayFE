import { Icons } from "@/components/icons";
import { getR12Report } from "@/features/report/report/reportSlice";
import { AppDispatch } from "@/features/Store";
import { rangePresets } from "@/utils/rangePresets";
import { showToast } from "@/utils/toasterContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { Card, Typography } from "@mui/material";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const { RangePicker } = DatePicker;

const R12Report: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { r12ReportLoading } = useSelector((state: any) => state.report);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };
  
  const downloadReport = () => {
    if (!date.from || !date.to)
      return showToast("Please select location and date range", "error");
    const reportPayload = {
      from: date.from?.format("YYYY-MM-DD"),
      to: date.to?.format("YYYY-MM-DD"),
    };
    dispatch(getR12Report(reportPayload)).then((res: any) => {
      console.log(res);
      if (res?.payload?.data?.success == true) {
        window.open(res?.payload?.data?.data, "_blank");
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-full bg-white">
      <Card
        elevation={1}
        className="p-[20px] flex flex-col gap-[20px] w-[400px]"
      >
        <div className="mb-[20px] text-center">
          <Typography variant="h1" fontSize={20} fontWeight={500}>
            Download R12 Report
          </Typography>
        </div>
        <RangePicker
          className="w-full h-[50px] border-[2px] rounded-sm "
          presets={rangePresets}
          onChange={handleDateChange}
          disabledDate={(current) => current && current > dayjs()}
          placeholder={["Start date", "End Date"]}
          value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
          format="DD/MM/YYYY" // Update with your desired format
        />
        <LoadingButton
          disabled={!date.from || !date.to}
          loading={r12ReportLoading}
          onClick={downloadReport}
          variant="contained"
          startIcon={<Icons.download fontSize="small" />}
        >
          Download
        </LoadingButton>
      </Card>
    </div>
  );
};

export default R12Report;
