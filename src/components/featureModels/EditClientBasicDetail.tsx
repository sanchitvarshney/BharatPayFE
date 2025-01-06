import React, { useEffect } from "react";
import BootstrapStyleDialog from "../ui/BootstrapStyleDialog";
import { Button, InputAdornment, TextField } from "@mui/material";
import SelectCountry, { CountryData } from "../reusable/SelectCountry";
import SelectState, { StateData } from "../reusable/SelectState";
import { Controller, useForm } from "react-hook-form";
import { Icons } from "../icons";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { useParams } from "react-router-dom";
import { BasicDetailPayload } from "@/features/master/client/clientType";
import { getClientDetail, updateBasicDetail } from "@/features/master/client/clientSlice";
type Props = {
  open: boolean;
  handleClose: () => void;
};
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
};
const EditClientBasicDetail: React.FC<Props> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { updateBasicDetailLoading, clientDetail } = useAppSelector((state) => state.client);
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
      clientName: "",
      salesPersonName: "",
      gstNumber: "",
      panNumber: "",
      email: "",
      phoneNumber: "",
      mobileNumber: "",
      website: "",
      state: null,
      country: null,
      city: "",
      address: "",
      pincode: "",
    },
  });
  const onSubmit = (data: FormData2Type) => {
    const payload: BasicDetailPayload = {
      clientCode: id || "",
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
    };
    dispatch(updateBasicDetail(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        handleClose();
        dispatch(getClientDetail(id || ""));
      }
    });
  };

  useEffect(() => {
    if (clientDetail) {
      setValue("clientName", clientDetail?.client?.name);
      setValue("salesPersonName", clientDetail?.client?.salesperson);
      setValue("gstNumber", clientDetail?.client?.gst);
      setValue("panNumber", clientDetail?.client?.panno);
      setValue("email", clientDetail?.client?.email);
      setValue("phoneNumber", clientDetail?.client?.phone);
      setValue("mobileNumber", clientDetail?.client?.mobile);
      setValue("website", clientDetail?.client?.website);
      setValue("state", { Name: clientDetail?.client?.state?.name, Code: clientDetail?.client?.state?.code });
      setValue("country", { text: clientDetail?.client?.country?.name, code: Number(clientDetail?.client?.country?.code) });
      setValue("city", clientDetail?.client?.city);
      setValue("address", clientDetail?.client?.address);
    }
  }, [clientDetail]);
  return (
    <BootstrapStyleDialog
      loading={updateBasicDetailLoading}
      title="Edit Basic Details"
      open={open}
      handleClose={handleClose}
      content={
        <div className="w-[700px] ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-[20px] overflow-x-hidden h-[500px] p-[20px] overflow-y-auto">
              <div className="">
                <TextField
                  focused={!!watch("clientName")}
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
                    focused={!!watch("salesPersonName")}
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
                    focused={!!watch("email")}
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
                    focused={!!watch("phoneNumber")}
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
                    focused={!!watch("website")}
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
              <Controller rules={{ required: "Country is required" }} control={control} name="country" render={({ field }) => <SelectCountry error={!!errors.country} varient="filled" helperText={errors.country?.message} onChange={field.onChange} value={field.value} />} />
              <Controller rules={{ required: "State is required" }} control={control} name="state" render={({ field }) => <SelectState error={!!errors.state} varient="filled" helperText={errors.state?.message} onChange={field.onChange} value={field.value} />} />
              <TextField
                focused={!!watch("city")}
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
              <Controller
                control={control}
                name="gstNumber"
                rules={{
                  required: "GST Number is required",
                }}
                render={({ field }) => (
                  <TextField
                    size="small"
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
                    size="small"
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
              <div className="lg:col-span-2">
                <TextField
                  focused={!!watch("address")}
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
            <div className="flex items-center justify-end h-[50px] px-[20px] border-t border-neutral-300 gap-[10px]">
              <Button sx={{ background: "white", color: "red" }} onClick={() => reset()} disabled={updateBasicDetailLoading} variant="contained" startIcon={<Icons.refresh />} color="primary">
                reset
              </Button>
              <Button disabled={updateBasicDetailLoading} variant="contained" startIcon={<Icons.save />} color="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default EditClientBasicDetail;
