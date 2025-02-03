import React from "react";
import BootstrapStyleDialog from "../ui/BootstrapStyleDialog";
import { Button, InputAdornment, TextField } from "@mui/material";
import SelectCountry, { CountryData } from "../reusable/SelectCountry";
import SelectState, { StateData } from "../reusable/SelectState";
import { Controller, useForm } from "react-hook-form";
import { Icons } from "../icons";
import { AddShipToAddressPayload } from "@/features/master/client/clientType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { addShipToAddress, getClientAddressDetail } from "@/features/master/client/clientSlice";

type Props = {
  open: boolean;
  handleClose: () => void;
  addressId: string;
};
type FormData2Type = {
  shipToLabel: string;
  shipToCompany: string;
  shipToCountry: CountryData | null;
  shipToState: StateData | null;
  shipToPincode: string;
  shipToGst: string;
  shipToPan: string;
  shipToAddress1: string;
  shipToAddress2: string;
  shipToCity: string;
};
const AddClientShippingAddress: React.FC<Props> = ({ open, handleClose, addressId }) => {
  const dispatch = useAppDispatch();
  const { addShiptoAddressLoading } = useAppSelector((state) => state.client);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData2Type>({
    mode: "all",
    defaultValues: {
      shipToLabel: "",
      shipToCompany: "",
      shipToCountry: null,
      shipToState: null,
      shipToPincode: "",
      shipToGst: "",
      shipToPan: "",
      shipToAddress1: "",
      shipToAddress2: "",
      shipToCity: "",
    },
  });
  const onSubmit = (data: FormData2Type) => {
    const paylaod: AddShipToAddressPayload = {
      addressID: addressId,
      shipToPincode: data.shipToPincode,
      shipToLabel: data.shipToLabel,
      shipToCompany: data.shipToCompany,
      shipToAddress1: data.shipToAddress1,
      shipToAddress2: data.shipToAddress2,
      shipToState: data.shipToState?.Code || "",
      shipToGst: data.shipToGst,
      shipToPan: data.shipToPan,
      shipToCity: data.shipToCity || "",
      shipToCountry: data.shipToCountry?.code.toString() || "",
    };

    dispatch(addShipToAddress(paylaod)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        handleClose();
        dispatch(getClientAddressDetail(addressId));
      }
    });
  };

  return (
    <BootstrapStyleDialog
      loading={addShiptoAddressLoading}
      title="Add Shipping Address"
      open={open}
      handleClose={handleClose}
      content={
        <div className="w-[700px] ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-[20px] overflow-x-hidden h-[60vh] overflow-y-auto p-[20px]  ">
              <TextField
              size="small"
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
                 size="small"
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
                render={({ field }) => <SelectCountry    size="small" error={!!errors.shipToCountry} varient="filled" helperText={errors.shipToCountry?.message} onChange={field.onChange} value={field.value} />}
              />
              <Controller rules={{ required: "State is required" }} control={control} name="shipToState" render={({ field }) => <SelectState    size="small" error={!!errors.shipToState} varient="filled" helperText={errors.shipToState?.message} onChange={field.onChange} value={field.value} />} />
              <TextField
                 size="small"
                {...register("shipToCity", { required: "City is required" })}
                error={!!errors.shipToCity}
                helperText={errors.shipToCity?.message}
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
              <TextField
                 size="small"
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
                 size="small"
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
                 size="small"
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
                  rows={2}
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
                  rows={2}
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
            <div className="flex items-center justify-end h-[50px] px-[20px] border-t border-neutral-300 gap-[10px]">
            <Button sx={{background:"white",color:"red"}} onClick={()=>reset()} disabled={addShiptoAddressLoading} variant="contained" startIcon={<Icons.refresh />} color="primary" >
                reset
              </Button>
              <Button disabled={addShiptoAddressLoading} variant="contained" startIcon={<Icons.save />} color="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default AddClientShippingAddress;
