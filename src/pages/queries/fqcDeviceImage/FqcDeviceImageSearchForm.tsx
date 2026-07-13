import React from "react";
import {
  CardContent,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import { Icons } from "@/components/icons";
import { rangePresets } from "@/utils/rangePresets";
import { fieldSx, selectSx } from "./fqcDeviceImage.constants";

const { RangePicker } = DatePicker;

type Props = {
  deviceType: string;
  deviceTypeReport: string;
  serialNo: string;
  loading: boolean;
  onDeviceTypeChange: (value: string) => void;
  onSerialNoChange: (value: string) => void;
  onSearch: () => void;
  dateRange: { from: Dayjs | null; to: Dayjs | null };
  onDateRangeChange: (range: { from: Dayjs | null; to: Dayjs | null }) => void;
  isConnected: boolean;
  onBulkDownload: () => void;
  onChangeDeviceType: (value: string) => void;
};

const FqcDeviceImageSearchForm: React.FC<Props> = ({
  deviceType,
  deviceTypeReport,
  serialNo,
  loading,
  onDeviceTypeChange,
  onSerialNoChange,
  onSearch,
  dateRange,
  onDateRangeChange,
  isConnected,
  onBulkDownload,
  onChangeDeviceType,
}) => (
  <div className="transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)] border-r border-neutral-300 min-w-[400px] max-w-[400px] items-center">
    <Paper elevation={0} className="m-2 w-full">
      <CardContent>
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[10px]">
            <Typography
              variant="subtitle1"
              className="text-slate-600 font-medium"
            >
              Device Type
            </Typography>
            <FormControl fullWidth>
              <Select
                value={deviceType}
                onChange={(e) => onDeviceTypeChange(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Device Type" }}
                sx={selectSx}
              >
                <MenuItem value="" disabled>
                  <em>Select Device Type</em>
                </MenuItem>
                <MenuItem value="sound">Sound Box Image</MenuItem>
                <MenuItem value="swipe">Swipe Machine Image</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="flex flex-col gap-[10px]">
            <Typography
              variant="subtitle1"
              className="text-slate-600 font-medium"
            >
              Serial Number
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={serialNo}
              onChange={(e) => onSerialNoChange(e.target.value)}
              sx={fieldSx}
            />
          </div>

          <div className="flex justify-start">
            <LoadingButton
              loading={loading}
              onClick={onSearch}
              startIcon={<Icons.search />}
              variant="contained"
            >
              Search
            </LoadingButton>
          </div>

          <div className="flex flex-col gap-[10px] pt-[10px] border-t border-neutral-200">
            <Typography
              variant="subtitle1"
              className="text-slate-600 font-medium"
            >
              Bulk Download
            </Typography>
            <div className="flex flex-col gap-[10px]">
              <Typography
                variant="subtitle1"
                className="text-slate-600 font-medium"
              >
                Device Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={deviceTypeReport}
                  onChange={(e) => onChangeDeviceType(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Device Type" }}
                  sx={selectSx}
                >
                  <MenuItem value="" disabled>
                    <em>Select Device Type</em>
                  </MenuItem>
                  <MenuItem value="sound">Sound Box Image</MenuItem>
                  <MenuItem value="swipe">Swipe Machine Image</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="flex items-center gap-[10px]">
              <RangePicker
                placement="bottomRight"
                className="w-full h-[50px] border-[2px] rounded-sm"
                format="DD-MM-YYYY"
                placeholder={["Start date", "End Date"]}
                value={
                  dateRange.from && dateRange.to
                    ? [dateRange.from, dateRange.to]
                    : null
                }
                onChange={(range: [Dayjs | null, Dayjs | null] | null) => {
                  if (range) {
                    onDateRangeChange({ from: range[0], to: range[1] });
                  } else {
                    onDateRangeChange({ from: null, to: null });
                  }
                }}
                presets={rangePresets}
              />
            </div>

            <LoadingButton
              disabled={!isConnected || !dateRange.from || !dateRange.to}
              variant="contained"
              color="primary"
              style={{
                padding: "8px",
              }}
              onClick={onBulkDownload}
              size="small"
            >
              <Icons.download fontSize="small" /> Download
            </LoadingButton>
          </div>
        </div>
      </CardContent>
    </Paper>
  </div>
);

export default FqcDeviceImageSearchForm;
