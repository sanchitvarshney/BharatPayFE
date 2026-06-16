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
import { Icons } from "@/components/icons";
import { fieldSx, selectSx } from "./fqcDeviceImage.constants";

type Props = {
  deviceType: string;
  serialNo: string;
  loading: boolean;
  onDeviceTypeChange: (value: string) => void;
  onSerialNoChange: (value: string) => void;
  onSearch: () => void;
};

const FqcDeviceImageSearchForm: React.FC<Props> = ({
  deviceType,
  serialNo,
  loading,
  onDeviceTypeChange,
  onSerialNoChange,
  onSearch,
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
        </div>
      </CardContent>

      <div className="h-[50px] px-[20px] flex items-center justify-between gap-[10px] pb-4">
        <LoadingButton
          loading={loading}
          onClick={onSearch}
          startIcon={<Icons.search />}
          variant="contained"
        >
          Search
        </LoadingButton>
      </div>
    </Paper>
  </div>
);

export default FqcDeviceImageSearchForm;
