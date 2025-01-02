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
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import SelectState, { StateData } from "@/components/reusable/SelectState";
import MasterClientDetailTable from "@/table/master/MasterClientDetailTable";
import SelectCountry, { CountryData } from "@/components/reusable/SelectCountry";
import { CraeteClientPayload } from "@/features/master/client/clientType";
import { createClient, getClient } from "@/features/master/client/clientSlice";
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
  state: StateData | null;
  country: CountryData | null;
  city: string;
  address: string;
  pincode: string;
  billToLabel: string;
  billToCountry: CountryData | null;
  billToState: StateData | null;
  billToPincode: string;
  billToPhone: string;
  billToGst: string;
  billToAddresLine1: string;
  billToAddresLine2: string;
  shipToLabel: string;
  shipToCompany: string;
  shipToCountry: CountryData | null;
  shipToState: StateData | null;
  shipToPincode: string;
  shipToGst: string;
  shipToPan: string;
  shipToAddress1: string;
  shipToAddress2: string;
};
const MasterClient: React.FC = () => {
  const dispatch = useAppDispatch();
  const { createClientLoading } = useAppSelector((state) => state.client);
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
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

      state: null,
      city: "",
      address: "",
      pincode: "",
      country: null,
      billToLabel: "",
      billToCountry: null,
      billToState: null,
      billToPincode: "",
      billToPhone: "",
      billToGst: "",
      billToAddresLine1: "",
      billToAddresLine2: "",
      shipToLabel: "",
      shipToCompany: "",
      shipToCountry: null,
      shipToState: null,
      shipToPincode: "",
      shipToGst: "",
      shipToPan: "",
      shipToAddress1: "",
      shipToAddress2: "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getClient());
  }, []);
  const onSubmit = (data: FormData2Type) => {
    const payload: CraeteClientPayload = {
      name: data.clientName,
      gst: data.gstNumber,
      country: data.country?.code.toString() || "",
      state: data.state?.Code || "",
      city: data.city,
      address: data.address,
      panno: data.panNumber,
      phone: data.phoneNumber,
      email: data.email,
      website: data.website,
      salesperson: data.salesPersonName,
      addressDetails: {
        billToLabel: data.billToLabel,
        billToCountry: data.billToCountry?.code.toString() || "",
        billToState: data.billToState?.Code || "",
        billToPincode: data.billToPincode,
        billToPhone: data.billToPhone,
        billToGst: data.billToGst,
        billToAddresLine1: data.billToAddresLine1,
        billToAddresLine2: data.billToAddresLine2,
        shipToLabel: data.shipToLabel,
        shipToCompany: data.shipToCompany,
        shipToCountry: data.shipToCountry?.code.toString() || "",
        shipToState: data.shipToState?.Code || "",
        shipToPincode: data.shipToPincode,
        shipToGst: data.shipToGst,
        shipToPan: data.shipToPan,
        shipToAddress1: data.shipToAddress1,
        shipToAddress2: data.shipToAddress2,
      },
    };
    dispatch(createClient(payload)).then((res: any) => {
      if (res.payload.data.success) {
        handleClose();
        reset();
        dispatch(getClient());
      }
    });
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
              <div className="flex items-center gap-3">
                <LoadingButton onClick={() => reset()} loadingPosition="start" disabled={createClientLoading} type="submit" startIcon={<Icons.refresh />} variant="contained" sx={{ background: "white", color: "red" }} autoFocus color="inherit">
                  reset
                </LoadingButton>
                <LoadingButton loadingPosition="start" loading={createClientLoading} type="submit" startIcon={<Icons.save />} variant="contained" sx={{ background: "white", color: "black" }} autoFocus color="inherit">
                  save
                </LoadingButton>
              </div>
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
                  required: false,
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
                rules={{ required: "Phone No. is required" }}
                render={({ field }) => (
                  <TextField
                    type="number"
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
                      htmlInput: {
                        min: 10,
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
              <Controller
                rules={{ required: "Country is required" }}
                control={control}
                name="country"
                render={({ field }) => <SelectCountry error={!!errors.billToCountry} varient="filled" helperText={errors.billToCountry?.message} onChange={field.onChange} value={field.value} />}
              />
              <Controller rules={{ required: "State is required" }} control={control} name="state" render={({ field }) => <SelectState error={!!errors.state} varient="filled" helperText={errors.state?.message} onChange={field.onChange} value={field.value} />} />
              <TextField
                {...register("city", { required: "City is required" })}
                error={!!errors.city}
                helperText={errors.city?.message}
                label="Pincode"
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
               <div className="lg:col-span-2">
                  <TextField
                    fullWidth
                    {...register("address", { required: "Address  is required" })}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    label="Address Line 2"
                    multiline
                    rows={3}
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.userAddress />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
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
                    label="GST Number "
                   
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
            <div className=" flex flex-col gap-[30px] overflow-x-hidden">
              <header className="flex items-center w-full gap-3">
                <h3 id="" className="text-sm font-medium text-cyan-700">
                  Billing Address
                </h3>
                <Divider
                  sx={{
                    borderBottomWidth: 1,
                    borderColor: "#d4d4d4",
                    flexGrow: 1,
                    borderStyle: "dashed",
                  }}
                />
              </header>
              <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden  ">
                <TextField
                  {...register("billToLabel", { required: "Label is required" })}
                  error={!!errors.billToLabel}
                  helperText={errors.billToLabel?.message}
                  label="Label"
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.label />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Controller
                  rules={{ required: "Country is required" }}
                  control={control}
                  name="billToCountry"
                  render={({ field }) => <SelectCountry error={!!errors.billToCountry} varient="filled" helperText={errors.billToCountry?.message} onChange={field.onChange} value={field.value} />}
                />
                <Controller
                  rules={{ required: "State is required" }}
                  control={control}
                  name="billToState"
                  render={({ field }) => <SelectState error={!!errors.billToState} varient="filled" helperText={errors.billToState?.message} onChange={field.onChange} value={field.value} />}
                />

                <TextField
                  type="number"
                  {...register("billToPhone", { required: "Phone is required" })}
                  error={!!errors.billToPhone}
                  helperText={errors.billToPhone?.message}
                  label="Phone"
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.call />
                        </InputAdornment>
                      ),
                    },
                    htmlInput: {
                      min: 10,
                    },
                  }}
                />
                <TextField
                  type="number"
                  {...register("billToPincode", { required: "Pincode is required" })}
                  error={!!errors.billToPincode}
                  helperText={errors.billToPincode?.message}
                  label="Pincode"
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.call />
                        </InputAdornment>
                      ),
                    },
                    htmlInput: {
                      min: 0,
                    },
                  }}
                />
                <TextField
                  {...register("billToGst", { required: "GST is required" })}
                  error={!!errors.billToGst}
                  helperText={errors.billToGst?.message}
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
                <div></div>
                <div className="lg:col-span-2">
                  <TextField
                    fullWidth
                    {...register("billToAddresLine1", { required: "Address Line 1 is required" })}
                    error={!!errors.billToAddresLine1}
                    helperText={errors.billToAddresLine1?.message}
                    label="Address Line 1"
                    multiline
                    rows={3}
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.userAddress />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
                <div className="lg:col-span-2">
                  <TextField
                    fullWidth
                    {...register("billToAddresLine2", { required: "Address Line 2 is required" })}
                    error={!!errors.billToAddresLine2}
                    helperText={errors.billToAddresLine2?.message}
                    label="Address Line 2"
                    multiline
                    rows={3}
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.userAddress />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
              </div>
              <header className="flex items-center w-full gap-3">
                <h3 id="" className="text-sm font-medium text-cyan-700">
                  Shipping Address
                </h3>
                <Divider
                  sx={{
                    borderBottomWidth: 1,
                    borderColor: "#d4d4d4",
                    flexGrow: 1,
                    borderStyle: "dashed",
                  }}
                />
              </header>
              <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden  ">
                <TextField
                  {...register("shipToLabel", { required: "Label is required" })}
                  error={!!errors.shipToLabel}
                  helperText={errors.shipToLabel?.message}
                  label="Label"
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.label />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  {...register("shipToPan", { required: "Pan Number is required" })}
                  error={!!errors.shipToPan}
                  helperText={errors.shipToPan?.message}
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
                <Controller
                  rules={{ required: "Country is required" }}
                  control={control}
                  name="shipToCountry"
                  render={({ field }) => <SelectCountry error={!!errors.billToCountry} varient="filled" helperText={errors.billToCountry?.message} onChange={field.onChange} value={field.value} />}
                />
                <Controller rules={{ required: "State is required" }} control={control} name="shipToState" render={({ field }) => <SelectState error={!!errors.state} varient="filled" helperText={errors.state?.message} onChange={field.onChange} value={field.value} />} />
                <TextField
                  {...register("shipToPincode", { required: "Pincode is required" })}
                  error={!!errors.shipToPincode}
                  helperText={errors.shipToPincode?.message}
                  label="Pincode"
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
                <TextField
                  {...register("shipToCompany", { required: "Company is required" })}
                  error={!!errors.shipToCompany}
                  helperText={errors.shipToCompany?.message}
                  label="Company"
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
                <TextField
              
                  {...register("shipToGst", { required: "GST is required" })}
                  error={!!errors.shipToGst}
                  helperText={errors.shipToGst?.message}
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
                <div className="lg:col-span-2">
                  <TextField
                    fullWidth
                    {...register("shipToAddress1", { required: "Address Line 1 is required" })}
                    error={!!errors.shipToAddress1}
                    helperText={errors.shipToAddress1?.message}
                    label="Address Line 1"
                    multiline
                    rows={3}
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.userAddress />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
                <div className="lg:col-span-2">
                  <TextField
                    fullWidth
                    {...register("shipToAddress2", { required: "Address Line 2 is required" })}
                    error={!!errors.shipToAddress2}
                    helperText={errors.shipToAddress2?.message}
                    label="Address Line 2"
                    multiline
                    rows={3}
                    variant="filled"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icons.userAddress />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
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
            <IconButton onClick={() => dispatch(getClient())}>
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
