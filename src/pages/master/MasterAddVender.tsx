import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import { Icons } from "@/components/icons";
import SelectVendor, { VendorData } from "@/components/reusable/SelectVendor";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import MasterVendorDetailTable from "@/table/master/MasterVendorDetailTable";
import FileUploader from "@/components/reusable/FileUploader";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const MasterAddVender: React.FC = () => {
  const [vandor, setVandor] = React.useState<VendorData | null>(null);
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const options = ["Active", "Deactive", "Both"];
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Vendor
            </Typography>
            <Button startIcon={<Icons.save />} variant="contained" sx={{ background: "white", color: "black" }} autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <form className="sm:p-[20px] md:px-[100px] md:py-[30px] h-[calc(100vh-64px)] overflow-y-auto">
          <div id="primary-item-details" className="flex items-center w-full py-[20px] gap-3">
            <h2 id="primary-item-details" className="text-lg font-semibold">
              Vendor Details
            </h2>
            <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
          </div>
          <div className="grid grid-cols-4 gap-[30px]">
            <TextField label="Vendor Name" />
            <TextField label="Vendor Email" />
            <TextField label="Mobile Number" />
            <TextField label="Pan Number" />
            <TextField label="Cin  Number" />
            <TextField label="Cin  Number" />
            <TextField label="Payments Terms (in-days)" type="number" />
            <TextField label="Fax Number" />
          </div>
          <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
            <h2 className="text-lg font-semibold">GST Details</h2>
            <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
          </div>
          <div className="grid grid-cols-4 gap-[30px]">
            <TextField label="GST Number" />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">E-Invoice Applicability</InputLabel>
              <Select labelId="demo-simple-select-label" id="demo-simple-select" label="E-Invoice Applicability">
                <MenuItem value={"Y"}>Yes</MenuItem>
                <MenuItem value={"N"}>No</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
            <h2 className="text-lg font-semibold">Branch Details</h2>
            <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
          </div>
          <div className="grid grid-cols-4 gap-[30px]">
            <TextField label="Branch Name" />
            <Autocomplete value={status} onChange={(_, newValue) => setStatus(newValue)} options={options} renderInput={(params) => <TextField {...params} label="Select State" />} style={{ width: 300 }} />
            <TextField label="City" />
            <TextField label="Pin Code" />
            <div className="col-span-2">
              <TextField fullWidth multiline rows={3} label="Complete Address" />
            </div>
          </div>
          <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
            <h2 className="text-lg font-semibold">Upload Document</h2>
            <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
          </div>
          <div className="grid grid-cols-2 gap-[30px]">
            <div>
              <TextField fullWidth label="Document Name" />
              <FileUploader />
            </div>
          </div>
        </form>
      </Dialog>
      <div className="h-full bg-white">
        <div className="h-[90px] flex items-center px-[20px] justify-between">
          <div className="flex items-center gap-[10px]">
            <Typography variant="h2" fontSize={20} fontWeight={500}>
              Vendor / Suppliers
            </Typography>
            <MuiTooltip title="Vendor / Suppliers" placement="right">
              <Icons.outlineinfo className="text-cyan-700" />
            </MuiTooltip>
          </div>
          <Button variant="contained" startIcon={<Icons.add />} onClick={handleClickOpen}>
            Add New Vendor
          </Button>
        </div>
        <div className="h-[90px] flex items-center px-[20px] gap-[10px]">
          <SelectVendor width="300px" value={vandor} onChange={setVandor} />
          <Autocomplete value={status} onChange={(_, newValue) => setStatus(newValue)} options={options} renderInput={(params) => <TextField {...params} label="Status" />} style={{ width: 300 }} />
        </div>
        <MasterVendorDetailTable />
      </div>
    </>
  );
};

export default MasterAddVender;
