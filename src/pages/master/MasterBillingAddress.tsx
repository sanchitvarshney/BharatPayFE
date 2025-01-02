import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import MsterBillingAddressTable from "@/table/master/MsterBillingAddressTable";
import { Button, Divider, IconButton, InputAdornment, Slide, TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { LoadingButton } from "@mui/lab";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const MasterBillingAddress: React.FC = () => {
  const [open, setOpen] = React.useState(false);
 

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
     <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <form >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Billing Address
              </Typography>
              <LoadingButton loadingPosition="start"  type="submit" startIcon={<Icons.save />} variant="contained" sx={{ background: "white", color: "black" }} autoFocus color="inherit">
                save
              </LoadingButton>
            </Toolbar>
          </AppBar>
          <div className="sm:p-[20px] md:px-[100px] md:py-[30px] h-[calc(100vh-64px)] overflow-y-auto">
            <div  className="flex items-center w-full py-[20px] gap-3">
              <h2  className="text-lg font-semibold">
                Basic Details
              </h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden">
              <TextField
                label="Warehouse Name"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.warehouse />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Company Name"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.building />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
            <div  className="flex items-center w-full py-[20px] gap-3">
              <h2  className="text-lg font-semibold">
                Tax Details
              </h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden">
              <TextField
                label="GST Number"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.tax  size={25}/>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="PAN Number"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.idcard2 size={25} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
               <TextField
                label="CIN Number"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.tag/>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
            <div  className="flex items-center w-full py-[20px] gap-3">
              <h2  className="text-lg font-semibold">
                Address
              </h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden">
              <TextField
                label="City"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.city2 />
                      </InputAdornment>
                    ),
                  },
                }}
              />
             <div className="col-span-2">
             <TextField
             fullWidth
                label="Complete Address"
                multiline
                rows={3}
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.userAddress fontSize="large" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
             </div>
             
            </div>
          </div>
          
        </form>
      </Dialog>
      <div className="h-full bg-white">
        <div className="h-[90px] flex items-center px-[20px] justify-between border-b border-neutral-300">
          <div className="flex items-center gap-[10px]">
            <Typography variant="h2" fontSize={20} fontWeight={500}>
              Billing Address
            </Typography>
            <MuiTooltip title="  Billing Address" placement="right">
              <Icons.outlineinfo className="text-cyan-700" />
            </MuiTooltip>
          </div>
          <div className="flex items-center gap-[20px]">
            <IconButton>
              <Icons.refresh />
            </IconButton>
            <Button variant="contained" startIcon={<Icons.add />} onClick={() => setOpen(true)}>
              Add New Address
            </Button>
          </div>
        </div>

        <div>
          <MsterBillingAddressTable />
        </div>
      </div>
    </>
  );
};

export default MasterBillingAddress;
