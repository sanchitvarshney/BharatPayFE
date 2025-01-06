import React from "react";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Icons } from "@/components/icons";
import { InputAdornment, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import SelectState, { StateData } from "@/components/reusable/SelectState";
import SelectCountry, { CountryData } from "@/components/reusable/SelectCountry";
import { addClientBranch, getClientDetail } from "@/features/master/client/clientSlice";
import { AddBranchPayload } from "@/features/master/client/clientType";
import { useParams } from "react-router-dom";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type FormData2Type = {
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
type Props = {
  open: boolean;
  handleClose: () => void;
};
const AddClientBranch: React.FC<Props> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { addBranchLoading } = useAppSelector((state) => state.client);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData2Type>({
    mode: "all",
    defaultValues: {
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

  const onSubmit = (data: FormData2Type) => {
    const payload: AddBranchPayload = {
      client: id || "",
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
    };
    dispatch(addClientBranch(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        handleClose();
        if (id) {
          dispatch(getClientDetail(id));
        }
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
                Add Branch
              </Typography>
              <div className="flex items-center gap-3">
                <LoadingButton onClick={() => reset()} loadingPosition="start" disabled={addBranchLoading} type="button" startIcon={<Icons.refresh />} variant="contained" sx={{ background: "white", color: "red" }} autoFocus color="inherit">
                  reset
                </LoadingButton>
                <LoadingButton loadingPosition="start" loading={addBranchLoading} type="submit" startIcon={<Icons.save />} variant="contained" sx={{ background: "white", color: "black" }} autoFocus color="inherit">
                  save
                </LoadingButton>
              </div>
            </Toolbar>
          </AppBar>
          <div className="sm:p-[20px] md:px-[100px] md:py-[30px] h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
              <h2 className="text-lg font-semibold">Billing Address</h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
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
              <Controller rules={{ required: "State is required" }} control={control} name="billToState" render={({ field }) => <SelectState error={!!errors.billToState} varient="filled" helperText={errors.billToState?.message} onChange={field.onChange} value={field.value} />} />

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
            <div className="flex items-center w-full py-[20px] gap-3 mt-[20px]">
              <h2 className="text-lg font-semibold">Shipping Address Address</h2>
              <Divider sx={{ borderBottomWidth: 2, borderColor: "#d4d4d4", flexGrow: 1 }} />
            </div>
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
                render={({ field }) => <SelectCountry error={!!errors.shipToCountry} varient="filled" helperText={errors.shipToCountry?.message} onChange={field.onChange} value={field.value} />}
              />
              <Controller rules={{ required: "State is required" }} control={control} name="shipToState" render={({ field }) => <SelectState error={!!errors.shipToState} varient="filled" helperText={errors.shipToState?.message} onChange={field.onChange} value={field.value} />} />
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
        </form>
      </Dialog>
    </>
  );
};

export default AddClientBranch;
