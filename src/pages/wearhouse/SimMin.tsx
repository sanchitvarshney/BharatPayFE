import { Icons } from "@/components/icons";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";
import { LoadingButton } from "@mui/lab";
import React from "react";
import { Autocomplete, InputAdornment, List, ListItem, ListItemText, TextField } from "@mui/material";
import SimMinTable from "@/table/wearhouse/SimMinTable";
import { generateUniqueId } from "@/utils/uniqueid";
import { showToast } from "@/utils/toasterContext";
interface RowData {
  remarks: string;
  isNew?: boolean;
  id: string;
  IMEI: string;
}
const SimMin: React.FC = () => {
  const [component, setComponent] = React.useState<ComponentType | null>(null);
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const [rowdata, setRowdata] = React.useState<RowData[]>([]);
  const [input, setInput] = React.useState<string>("");
  const isIMEIUnique = (imei: string) => {
    return !rowdata.some((row) => row.IMEI === imei);
  };
  return (
    <div className="h-[calc(100vh-100px)] bg-white  ">
      <div className="grid grid-cols-[400px_1fr] h-[calc(100vh-150px)]">
        <div className="border-r border-neutral-300 flex flex-col gap-[20px] p-[20px]">
          <Autocomplete options={options} renderInput={(params) => <TextField {...params} label="Select MIN" />} />
          <SelectComponent value={component} onChange={setComponent} />
          <List>
            <ListItem>
              <ListItemText primary="Primary text" secondary="Secondary text" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Primary text" secondary="Secondary text" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Primary text" secondary="Secondary text" />
            </ListItem>
          </List>
        </div>
        <div>
          <div className="h-[70px] flex items-center px-[20px] border-b border-neutral-300">
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scan QR Code"
              sx={{ width: "400px" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icons.qrScan />
                    </InputAdornment>
                  ),
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  //verify deuplicate IMEI
                  if (isIMEIUnique(input)) {
                    setRowdata([{ id: generateUniqueId(), IMEI: input, isNew: true, remarks: "" }, ...rowdata]);
                    setInput("");
                  } else {
                    showToast("IMEI already exists", "error");
                  }
                }
              }}
            />
          </div>
          <SimMinTable rowData={rowdata} setRowdata={setRowdata} />
        </div>
      </div>
      <div className="h-[50px] flex items-center justify-end px-[20px] border-t border-neutral-300">
        <LoadingButton variant="contained" startIcon={<Icons.save />}>
          Save
        </LoadingButton>
      </div>
    </div>
  );
};

export default SimMin;
