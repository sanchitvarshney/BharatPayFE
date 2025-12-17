import { useSocketContext } from "@/components/context/SocketContext";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { showToast } from "@/utils/toasterContext";
import {
  Button,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
const { RangePicker } = DatePicker;

type DeviceType = "MONO" | "SWIPE";

const BillingReport: React.FC = () => {
  const { isConnected } = useSocketContext();
  const { emitDownloadBillingReport } =
    useSocketContext();
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const [deviceType, setDeviceType] = useState<DeviceType>("SWIPE");

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };

  const handleDeviceTypeChange = (event: any) => {
    setDeviceType(event.target.value);
  };

  const downloadReport = () => {
    if (!date.from || !date.to)
      return showToast("Please select date range", "error");

    const reportPayload = {
      startDate: date.from?.format("YYYY-MM-DD"),
      endDate: date.to?.format("YYYY-MM-DD"),
    };

    if (deviceType === "SWIPE") {
      emitDownloadBillingReport(reportPayload);
    }
    // } else {
    //   emitDownloadSwipeR10Report(reportPayload);
    // }

    showToast(`Start downloading ${deviceType} report`, "success");
  };

  return (
    <div className="flex items-center justify-center h-full bg-white">
      <Card
        elevation={1}
        className="p-[20px] flex flex-col gap-[20px] w-[400px]"
      >
        <div className="mb-[20px] text-center">
          <Typography variant="h1" fontSize={20} fontWeight={500}>
            Download Billing Report
          </Typography>
        </div>
        <Typography
          variant="h3"
          fontSize={14}
          fontWeight={400}
          className="text-center"
        >
          Download Billing Report
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="device-type-label">Device Type</InputLabel>
          <Select
            labelId="device-type-label"
            value={deviceType}
            label="Device Type"
            onChange={handleDeviceTypeChange}
            className="h-[50px]"
          >
            {/* <MenuItem value="MONO">Soundbox</MenuItem> */}
            <MenuItem value="SWIPE">Swipe Device</MenuItem>
          </Select>
        </FormControl>

        <RangePicker
          className="w-full h-[50px] border-[2px] rounded-sm "
          presets={rangePresets}
          onChange={handleDateChange}
          disabledDate={(current) => current && current > dayjs()}
          placeholder={["Start date", "End Date"]}
          value={date.from && date.to ? [date.from, date.to] : null}
          format="DD/MM/YYYY"
        />
        <Button
          disabled={!isConnected}
          onClick={downloadReport}
          variant="contained"
          startIcon={<Icons.download fontSize="small" />}
        >
          Download {deviceType} Report
        </Button>
      </Card>
    </div>
  );
};

export default BillingReport;
