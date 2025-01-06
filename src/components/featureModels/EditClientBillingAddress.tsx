import React, { useEffect } from "react";
import BootstrapStyleDialog from "../ui/BootstrapStyleDialog";
import { Button, InputAdornment, TextField } from "@mui/material";
import SelectCountry, { CountryData } from "../reusable/SelectCountry";
import SelectState, { StateData } from "../reusable/SelectState";
import { Controller, useForm } from "react-hook-form";
import { Icons } from "../icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { UpdateBillingAddressPayload } from "@/features/master/client/clientType";
import { getClientDetail, updatebillingAddress } from "@/features/master/client/clientSlice";
import { useParams } from "react-router-dom";

type Props = {
  open: boolean;
  handleClose: () => void;
};
type FormData2Type = {
  billToLabel: string;
  billToCountry: CountryData | null;
  billToState: StateData | null;
  billToPincode: string;
  billToPhone: string;
  billToGst: string;
  billToAddresLine1: string;
  billToAddresLine2: string;
};
const EditClientBillingAddress: React.FC<Props> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { billId, updateBillingAddressLoading, clientDetail } = useAppSelector((state) => state.client);
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
      billToLabel: "",
      billToCountry: null,
      billToState: null,
      billToPincode: "",
      billToPhone: "",
      billToGst: "",
      billToAddresLine1: "",
      billToAddresLine2: "",
    },
  });
  const onSubmit = (data: FormData2Type) => {
    const paylaod: UpdateBillingAddressPayload = {
      addressID: billId || "",
      billToLabel: data.billToLabel,
      billToCountry: data.billToCountry?.code.toString() || "",
      billToState: data.billToState?.Code || "",
      billToPincode: data.billToPincode,
      billToPhone: data.billToPhone,
      billToGst: data.billToGst,
      billToAddresLine1: data.billToAddresLine1,
      billToAddresLine2: data.billToAddresLine2,
    };
    dispatch(updatebillingAddress(paylaod)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        handleClose();
        dispatch(getClientDetail(id || ""));
      }
    });
  };

  useEffect(() => {
    if (billId && clientDetail) {
      const data = clientDetail?.branch?.find((item) => item.id === billId);
      if (data) {
        setValue("billToLabel", data?.name);
        setValue("billToCountry", { code: Number(data?.country?.countryID), text: data?.country?.countryName || "" });
        setValue("billToState", { Code: data?.state?.stateCode, Name: data?.state?.stateName || "" });
        setValue("billToPincode", data?.pincode);
        setValue("billToPhone", data?.phone);
        setValue("billToGst", data?.gst);
        setValue("billToAddresLine1", data?.address1);
        setValue("billToAddresLine2", data?.address2);
      }
    }
  }, [billId, clientDetail]);
  return (
    <BootstrapStyleDialog
      loading={updateBillingAddressLoading}
      title="Edit Bill to Address"
      open={open}
      handleClose={handleClose}
      content={
        <div className="w-[700px] ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-[30px] overflow-x-hidden p-[20px] h-[500px] overflow-y-auto ">
              <TextField
                size="small"
                focused={!!watch("billToLabel")}
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
                render={({ field }) => <SelectCountry size="small" error={!!errors.billToCountry} varient="filled" helperText={errors.billToCountry?.message} onChange={field.onChange} value={field.value} />}
              />
              <Controller
                rules={{ required: "State is required" }}
                control={control}
                name="billToState"
                render={({ field }) => <SelectState size="small" error={!!errors.billToState} varient="filled" helperText={errors.billToState?.message} onChange={field.onChange} value={field.value} />}
              />

              <TextField
                size="small"
                focused={!!watch("billToPhone")}
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
                size="small"
                focused={!!watch("billToPincode")}
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
                size="small"
                focused={!!watch("billToGst")}
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
                  size="small"
                  focused={!!watch("billToAddresLine1")}
                  fullWidth
                  {...register("billToAddresLine1", { required: "Address Line 1 is required" })}
                  error={!!errors.billToAddresLine1}
                  helperText={errors.billToAddresLine1?.message}
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
                  size="small"
                  focused={!!watch("billToAddresLine2")}
                  fullWidth
                  {...register("billToAddresLine2", { required: "Address Line 2 is required" })}
                  error={!!errors.billToAddresLine2}
                  helperText={errors.billToAddresLine2?.message}
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
              <Button sx={{ background: "white", color: "red" }} onClick={() => reset()} disabled={updateBillingAddressLoading} variant="contained" startIcon={<Icons.refresh />} color="primary">
                reset
              </Button>
              <Button disabled={updateBillingAddressLoading} variant="contained" startIcon={<Icons.save />} color="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default EditClientBillingAddress;
