import { Icons } from "@/components/icons";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";
import { Button } from "@/components/ui/button";
import { getQ3DatA } from "@/features/query/query/querySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import Q3ReportTable from "@/table/query/Q3ReportTable";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { LoadingButton } from "@mui/lab";
import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const Q3query: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [component, setComponent] = React.useState<ComponentType | null>(null);
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const dispatch = useAppDispatch();
  const { q3data, q3DataLoading } = useAppSelector((state) => state.query);

  const handleDownloadExcel = () => {
    if (!q3data) return;

    const total = q3data.locationQty.reduce(
      (sum: number, item: any) => sum + Number(item.closeQty),
      0,
    );

    const summaryRows = [
      ["Date", date?.format("DD-MM-YYYY") || ""],
      ["Total", total],
      ["Part Code", q3data.component?.partCode || ""],
      ["Name", q3data.component?.name || ""],
      ["Unit", q3data.component?.uom || ""],
    ];

    const tableHeader = [
      "Location",
      "Opening Balance",
      "Inward",
      "Outward",
      "Closing Balance",
    ];
    const tableRows = q3data.locationQty.map((item: any) => [
      item.locationName,
      item.openingBalance,
      item.totalIn,
      item.totalOut,
      item.closeQty,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([
      ...summaryRows,
      [],
      tableHeader,
      ...tableRows,
    ]);
    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Q3 Report");
    XLSX.writeFile(
      workbook,
      `Q3_Report_${dayjs(date).format("DD-MM-YYYY")}.xlsx`,
    );
  };

  return (
    <div className="  h-[calc(100vh-100px)] bg-white relative">
      <div className={` h-full flex   `}>
        <div className={` transition-all h-full ${colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "}  overflow-y-auto overflow-x-hidden border-r border-neutral-400/70   `}>
          <div className={`transition-all ${colapse ? "left-0" : "left-[400px]"} w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}>
            <Button onClick={() => setcolapse(!colapse)} className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}>
              {colapse ? <Icons.right fontSize="small" /> : <Icons.left fontSize="small" />}
            </Button>
          </div>
          <div className="p-[20px] ">
            <div className="flex flex-col gap-[30px]">
              <SelectComponent value={component} onChange={setComponent} />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  slots={{
                    textField: TextField,
                  }}
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                    },
                  }}
                  value={date}
                  onChange={(value) => setDate(value)}
                  sx={{ width: "100%" }}
                  label="Till Date"
                  name="startDate"
                />
              </LocalizationProvider>
            </div>
            <div className="mt-[20px] flex items-center  gap-[10px]">
                <MuiTooltip title="Download Excel" placement="top">
                <span>
                  <LoadingButton
                    loadingPosition="start"
                    disabled={!q3data}
                    onClick={handleDownloadExcel}
                    startIcon={<Icons.download fontSize="small" />}
                    variant="outlined"
                  >
                    Excel
                  </LoadingButton>
                </span>
              </MuiTooltip>
              <LoadingButton
                loadingPosition="start"
                loading={q3DataLoading}
                onClick={() => {
                  if (!date) showToast("Please select date", "error");
                  if (!component) showToast("Please select component", "error");
                  dispatch(getQ3DatA({ date: dayjs(date).format("DD-MM-YYYY"), comp: component?.id || "" }));
                }}
                startIcon={<Icons.search fontSize="small" />}
                variant="contained"
              >
                Search
              </LoadingButton>
            
            </div>
          </div>
          {q3data && (
            <List>
                  <ListItem>
                <ListItemText primary={"Total"} secondary={q3data?.locationQty.reduce((sum, item) => sum + Number(item.closeQty), 0)} />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Part Code"} secondary={q3data?.component?.partCode} />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Name"} secondary={q3data?.component?.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary={"Unit"} secondary={q3data?.component?.uom} />
              </ListItem>
            </List>
          )}
        </div>
        {q3data ? (
          <div className="w-full">
         
          
              <Q3ReportTable />
        
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <img src="/search.webp" alt="" className="w-[300px] opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Q3query;
