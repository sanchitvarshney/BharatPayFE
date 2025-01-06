import React, { useEffect } from "react";
import BootstrapStyleDialog from "../ui/BootstrapStyleDialog";
import { Button, InputAdornment, TextField } from "@mui/material";
import SelectCountry, { CountryData } from "../reusable/SelectCountry";
import SelectState, { StateData } from "../reusable/SelectState";
import { Controller, useForm } from "react-hook-form";
import { Icons } from "../icons";
import { UpdateShipToPayload } from "@/features/master/client/clientType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getClientAddressDetail, updateShipToDetail } from "@/features/master/client/clientSlice";

type Props = {
  open: boolean;
  handleClose: () => void;
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
};
const EditClientShippingAddress: React.FC<Props> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch();
  const { updateshiptoAddressLoading, addressDetail, addressId, shipId } = useAppSelector((state) => state.client);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
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
    },
  });
  const onSubmit = (data: FormData2Type) => {
    const paylaod: UpdateShipToPayload = {
      shipCode: shipId || "",
      shipToPincode: data.shipToPincode,
      shipToLabel: data.shipToLabel,
      shipToCompany: data.shipToCompany,
      shipToAddress1: data.shipToAddress1,
      shipToAddress2: data.shipToAddress2,
      shipToState: data.shipToState?.Code || "",
      shipToGst: data.shipToGst,
      shipToPan: data.shipToPan,
      shipToCountry: data.shipToCountry?.code.toString() || "",
    };

    dispatch(updateShipToDetail(paylaod)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        handleClose();
        dispatch(getClientAddressDetail(addressId || ""));
      }
    });
  };

  useEffect(() => {
    if (shipId && addressDetail) {
      const data = addressDetail?.data?.shippingAddress.find((items) => items.shipId === shipId);
      if (data) {
        setValue("shipToLabel", data.label);
        setValue("shipToCompany", data.company || "");
        setValue("shipToPincode", data.pinCode);
        setValue("shipToGst", data.gst);
        setValue("shipToPan", data.panno || "");
        setValue("shipToAddress1", data.addressLine1);
        setValue("shipToAddress2", data.addressLine2);
        setValue("shipToState", { Code: data.state?.stateCode, Name: data?.state.stateName || "" });
        setValue("shipToCountry", { code: Number(data?.country?.countryID), text: data?.country?.countryName || "" });
      }
    }
  }, [shipId, addressDetail]);

  return (
    <BootstrapStyleDialog
      loading={updateshiptoAddressLoading}
      title="Edit Ship To Address"
      open={open}
      handleClose={handleClose}
      content={
        <div className="w-[700px] ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-[20px] overflow-x-hidden h-[60vh] overflow-y-auto p-[20px]  ">
              <TextField
                focused={!!watch("shipToLabel")}
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
                focused={!!watch("shipToPan")}
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
                render={({ field }) => <SelectCountry size="small" error={!!errors.shipToCountry} varient="filled" helperText={errors.shipToCountry?.message} onChange={field.onChange} value={field.value} />}
              />
              <Controller
                rules={{ required: "State is required" }}
                control={control}
                name="shipToState"
                render={({ field }) => <SelectState size="small" error={!!errors.shipToState} varient="filled" helperText={errors.shipToState?.message} onChange={field.onChange} value={field.value} />}
              />
              <TextField
                focused={!!watch("shipToPincode")}
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
                focused={!!watch("shipToCompany")}
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
                focused={!!watch("shipToGst")}
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
                  focused={!!watch("shipToAddress1")}
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
                  focused={!!watch("shipToAddress2")}
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
              <Button sx={{ background: "white", color: "red" }} onClick={() => reset()} disabled={updateshiptoAddressLoading} variant="contained" startIcon={<Icons.refresh />} color="primary">
                reset
              </Button>
              <Button disabled={updateshiptoAddressLoading} variant="contained" startIcon={<Icons.save />} color="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default EditClientShippingAddress;
