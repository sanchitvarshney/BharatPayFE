import { useSocketContext } from "@/components/context/SocketContext";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import {
  Button,
  Card,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";

const R23Report: React.FC = () => {
  const { isConnected, emitR6XmlDownload } = useSocketContext();
  const [moduleType, setModuleType] = useState<string>("STORE-INWARD");
  const [date, setDate] = useState<Dayjs | null>(null);

  const downloadReport = () => {
    if (!date) return showToast("Please select a date", "error");
    const reportPayload = {
      type: "DATE",
      date: date.format("DD-MM-YYYY"),
      module: moduleType,
    };
    emitR6XmlDownload(reportPayload);
    showToast("Start downloading ", "success");
  };

  return (
    <div className="flex items-center justify-center h-full bg-white">
      <Card
        elevation={1}
        className="p-[20px] flex flex-col gap-[20px] w-[400px]"
      >
        <div className="mb-[20px] text-center">
          <Typography variant="h1" fontSize={20} fontWeight={500}>
            Download XML Report
          </Typography>
        </div>
        <Typography
          variant="h3"
          fontSize={14}
          fontWeight={400}
          className="text-center"
        >
          Download XML Report by date and Inward Type
        </Typography>
        <FormControl fullWidth>
          <div className="mb-2">Inward Type</div>
          <Select
            value={moduleType}
            onChange={(e) => setModuleType(e.target.value)}
          >
            {[
              { value: "STORE-INWARD", label: "Store" },
              { value: "OTHERS", label: "Others" },
            ].map((item) => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          className="w-full h-[50px] border-[2px] rounded-sm "
          onChange={(value) => setDate(value)}
          disabledDate={(current) => current && current > dayjs()}
          placeholder="Select date"
          value={date}
          format="DD/MM/YYYY"
        />
        <Button
          disabled={!isConnected}
          onClick={downloadReport}
          variant="contained"
          startIcon={<Icons.download fontSize="small" />}
        >
          Download
        </Button>
      </Card>
    </div>
  );
};

export default R23Report;
