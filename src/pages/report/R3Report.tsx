import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import R3ReportTable from "@/table/report/R3ReportTable";
import { AgGridReact } from "@ag-grid-community/react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getr3Report } from "@/features/report/report/reportSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import { rangePresets } from "@/utils/rangePresets";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const R3Report: React.FC = () => {
  const dispatch = useAppDispatch();
  const { r3reportLoading } = useAppSelector((state) => state.report);
  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });
  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };
  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      sheetName: "R3 Report", // Set your desired sheet name here
    });
  }, []);

  return (
    <div className="bg-white h-[calc(100vh-90px)]">
      <div className="h-[90px] flex items-center justify-between px-[20px] gap-[20px]">
        <div className="flex items-center gap-[10px]">
          <RangePicker
            className="h-[50px]"
            presets={rangePresets}
            onChange={handleDateChange}
            disabledDate={(current) => current && current > dayjs()}
            placeholder={["Start date", "End Date"]}
            value={date.from && date.to ? [date.from, date.to] : null} // Set value based on `from` and `to`
            format="DD/MM/YYYY" // Update with your desired format
          />
          <LoadingButton
            variant="contained"
            startIcon={<FilterAltIcon fontSize="small" />}
            loadingPosition="start"
            loading={r3reportLoading}
            onClick={() => {
              if (!date.from || !date.to) {
                showToast("Select date range", "error");
              } else {
                dispatch(getr3Report({ from: dayjs(date.from).format("DD-MM-YYYY"), to: dayjs(date.to).format("DD-MM-YYYY") }));
              }
            }}
          >
            Filter
          </LoadingButton>
        </div>
        <LoadingButton
          variant="contained"
          startIcon={<DownloadIcon fontSize={"small"} />}
          loadingPosition="start"
          loading={r3reportLoading}
          disabled={!date.from || !date.to}
          onClick={() => {
            if (!date) {
              showToast("Select date range", "error");
            } else {
              onBtExport();
            }
          }}
        >
          Download
        </LoadingButton>
      </div>
      <R3ReportTable gridRef={gridRef} />
    </div>
  );
};

export default R3Report;
