import { Icons } from "@/components/icons";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";
import { getQ3DatA } from "@/features/query/query/querySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { LoadingButton } from "@mui/lab";
import { List, ListItem, ListItemText, Skeleton, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

const Q3query: React.FC = () => {
  const [component, setComponent] = React.useState<ComponentType | null>(null);
  const [date, setDate] = React.useState<Dayjs | null>(null);
  const dispatch = useAppDispatch();
  const { q3data, q3DataLoading } = useAppSelector((state) => state.query);
  return (
    <div className="h-full bg-white grid grid-cols-[400px_1fr]">
      <div className="h-full border-r border-neutral-300 p-[20px] overflow-y-auto  ">
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
              label="Document Date"
              name="startDate"
            />
          </LocalizationProvider>
        </div>
        <div className="mt-[20px]">
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
        {q3data && (
          <List>
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
        <div>
          <div className="flex items-center px-[20px] h-[60px] justify-between">
            <Typography variant="h1" fontWeight={500} fontSize={25} component={"div"} className="">
              Component Locations
            </Typography>
            <div className="flex items-center gap-[10px]">
              <Typography>Total : </Typography>
              <Typography>{q3data?.locationQty.reduce((sum, item) => sum + Number(item.closeQty), 0)}</Typography>
            </div>
          </div>
          <div className="p-[20px] grid grid-cols-6 gap-[5px]">
            {q3DataLoading
              ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="w-full min-h-[100px]" />)
              : q3data?.locationQty.map((item, index) => (
                  <div key={index} className="w-full  h-[100px] rounded border bg-slate-50 flex flex-col gap-[5px] justify-center items-center">
                    <Typography fontWeight={500}>{item.locationName}</Typography>
                    <Typography fontWeight={500} className="text-slate-500">
                      {item.closeQty}
                    </Typography>
                  </div>
                ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <img src="/search.webp" alt="" className="w-[300px] opacity-50" />
        </div>
      )}
    </div>
  );
};

export default Q3query;
