import { Icons } from "@/components/icons";
import SelectDevice, { DeviceType } from "@/components/reusable/SelectSku";
import { Button } from "@/components/ui/button";
import { getQ4DatA } from "@/features/query/query/querySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { formatNumber } from "@/utils/numberFormatUtils";
import { showToast } from "@/utils/toasterContext";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";

import React, { useState } from "react";
const Q4query: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const [component, setComponent] = React.useState<DeviceType | null>(null);
  const [deviceType, setDeviceType] = useState<string>("");
  const dispatch = useAppDispatch();
  const { q4Data, q4DataLoading } = useAppSelector((state) => state.query);
  return (
    <div className="  h-[calc(100vh-100px)] bg-white">
      <div className={` h-full flex relative   `}>
        <div
          className={` transition-all h-full ${
            colapse ? "min-w-0 max-w-[0px]" : "min-w-[400px] max-w-[400px] "
          }  overflow-y-auto overflow-x-hidden border-r border-neutral-400/70   `}
        >
          <div
            className={`transition-all ${
              colapse ? "left-0" : "left-[400px]"
            } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
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
          <div className="p-[20px] ">
            <div className="flex flex-col gap-[30px]">
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
                    onChange={(e) => setDeviceType(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Device Type" }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(203 213 225)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(148 163 184)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(14 116 144)",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Device Type</em>
                    </MenuItem>
                    <MenuItem value="soundbox">Sound Box</MenuItem>
                    <MenuItem value="swipemachine">Swipe Machine</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <SelectDevice value={component} onChange={setComponent} />
            </div>
            <div className="mt-[20px]">
              <LoadingButton
                loadingPosition="start"
                loading={q4DataLoading}
                onClick={() => {
                  if (!component || !deviceType) {
                    showToast(
                      "Please select component and device type",
                      "error"
                    );
                    return;
                  }
                  dispatch(getQ4DatA({ id: component.id, type: deviceType }));
                }}
                startIcon={<Icons.search fontSize="small" />}
                variant="contained"
              >
                Search
              </LoadingButton>
            </div>
          </div>
          {q4Data && (
            <List>
              <ListItem>
                <ListItemText
                  primary={"Device Code"}
                  secondary={q4Data?.component?.sku}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={"Name"}
                  secondary={q4Data?.component?.name}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={"Unit"}
                  secondary={q4Data?.component?.uom}
                />
              </ListItem>
            </List>
          )}
        </div>
        {q4Data ? (
          <div className="w-full">
            <div className="flex items-center px-[20px] h-[60px] justify-between">
              <Typography
                variant="h1"
                fontWeight={500}
                fontSize={25}
                component={"div"}
                className=""
              >
                Device Stock at locations as on till date
              </Typography>
              <div className="flex items-center gap-[10px]">
                <Typography>Total : </Typography>
                <Typography>
                  {formatNumber(q4Data?.locationQty.reduce(
                    (sum, item) => sum + Number(item.closeQty),
                    0
                  ))}
                </Typography>
              </div>
            </div>
            <div className="p-[20px] flex flex-wrap gap-[10px]">
              {q4DataLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-[150px] min-h-[150px] "
                    />
                  ))
                : q4Data?.locationQty.map((item, index) => (
                    <div
                      key={index}
                      className="  h-[100px] max-w-max px-[50px]  rounded border bg-slate-50 flex flex-col gap-[5px] justify-center items-center"
                    >
                      <Typography fontWeight={500}>
                        {item.locationName}
                      </Typography>
                      <Typography fontWeight={500} className="text-slate-500">
                        {formatNumber(item.closeQty)}
                      </Typography>
                    </div>
                  ))}
            </div>
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

export default Q4query;
