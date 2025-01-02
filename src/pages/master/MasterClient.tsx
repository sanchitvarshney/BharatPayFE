import React, { useEffect } from "react";
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
import { InputAdornment, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getVendor } from "@/features/master/vendor/vedorSlice";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import SelectState, { StateData } from "@/components/reusable/SelectState";
import MasterClientDetailTable from "@/table/master/MasterClientDetailTable";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type FormData2Type = {
  clientName: string;
  salesPersonName: string;
  gstNumber: string;
  panNumber: string;
  email: string;
  phoneNumber: string;
  mobileNumber: string;
  website: string;
  branch: string;
  state: StateData | null;
  city: string;
  address: string;
  pincode: string;
};
const MasterClient: React.FC = () => {
  const dispatch = useAppDispatch();
  const { createVendorLoading } = useAppSelector((state) => state.vendor);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    
    formState: { errors },
  } = useForm<FormData2Type>({
    mode: "all",
    defaultValues: {
      clientName: "",
      salesPersonName: "",
      gstNumber: "",
      panNumber: "",
      email: "",
      phoneNumber: "",
      mobileNumber: "",
      website: "",
      branch: "",
      state: null,
      city: "",
      address: "",
      pincode: "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getVendor());
  }, []);
  const onSubmit = (data: FormData2Type) => {
    console.log(data);
  };
  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Client
              </Typography>
              <LoadingButton loadingPosition="start" loading={createVendorLoading} type="submit" startIcon={<Icons.save />} variant="contained" sx={{ background: "white", color: "black" }} autoFocus color="inherit">
                save
              </LoadingButton>
            </Toolbar>
          </AppBar>
          <div className="sm:p-[20px] md:px-[100px] md:py-[30px] h-[calc(100vh-64px)] overflow-y-auto">
            <div id="primary-item-details" className="flex items-center w-full py-[20px] gap-3">
              <h2 id="primary-item-details" className="text-lg font-semibold">
                Client Basic Details
              </h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden">
              <div className="">
                <TextField
                  error={!!errors.clientName}
                  helperText={errors.clientName?.message}
                  {...register("clientName", { required: "Client Name is required" })}
                  fullWidth
                  variant="filled"
                  label="Client Name"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.user />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>
              <Controller
                name="salesPersonName"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.salesPersonName}
                    helperText={errors.salesPersonName?.message}
                    {...field}
                    label="Sales Person Name"
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.user />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="email"
                rules={{
                  required: "Client Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...field}
                    label="Email "
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.email />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    {...field}
                    label="Phone No."
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.call />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.website}
                    helperText={errors.website?.message}
                    {...field}
                    label="Website"
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.website size={25} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </div>
            <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
              <h2 className="text-lg font-semibold">Tax Details</h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden">
              <Controller
                control={control}
                name="gstNumber"
                rules={{
                  required: "GST Number is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.gstNumber}
                    helperText={errors.gstNumber?.message}
                    label="GST Number"
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.tax size={25} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="panNumber"
                rules={{
                  required: "PAN Number is required",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.panNumber}
                    helperText={errors.panNumber?.message}
                    label="Pan Number"
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
                )}
              />
            </div>
            <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
              <h2 className="text-lg font-semibold">Branch Details</h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden">
              <TextField
                {...register("branch", { required: "Branch Name is required" })}
                error={!!errors.branch}
                helperText={errors.branch?.message}
                label="Branch Name"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.branch />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Controller rules={{ required: "State is required" }} control={control} name="state" render={({ field }) => <SelectState error={!!errors.state} varient="filled" helperText={errors.state?.message} onChange={field.onChange} value={field.value} />} />
              <TextField
                {...register("city", { required: "City is required" })}
                error={!!errors.city}
                helperText={errors.city?.message}
                label="City"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.city />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                {...register("pincode", { required: "Pin Code is required" })}
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
                label="Pin Code"
                variant="filled"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icons.tag />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <div className="col-span-2">
                <TextField {...register("address", { required: "Address is required" })} error={!!errors.address} helperText={errors.address?.message} fullWidth multiline rows={3} label="Complete Address" placeholder="use line break for next line" variant="filled" />
              </div>
            </div>
          </div>
        </form>
      </Dialog>
      <div className="h-full bg-white">
        <div className="h-[90px] flex items-center px-[20px] justify-between border-b border-neutral-300">
          <div className="flex items-center gap-[10px]">
            <Typography variant="h2" fontSize={20} fontWeight={500}>
              Client
            </Typography>
            <MuiTooltip title="Client" placement="right">
              <Icons.outlineinfo className="text-cyan-700" />
            </MuiTooltip>
          </div>
          <div className="flex items-center gap-[20px]">
            <IconButton onClick={() => dispatch(getVendor())}>
              <Icons.refresh />
            </IconButton>
            <Button variant="contained" startIcon={<Icons.add />} onClick={handleClickOpen}>
              Add New Client
            </Button>
          </div>
        </div>

        <MasterClientDetailTable />
      </div>
    </>
  );
};

export default MasterClient;
