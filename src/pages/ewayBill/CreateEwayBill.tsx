import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  docType,
  supplyTypeOptions,
  subsupplytype,
  transactionTypeOptions,
  ewayBillSchema,
  transportationMode,
  vehicleTypeOptions,
  columnDefs,
} from "@/constants/EwayBillConstants";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EwayBillFormData } from "@/constants/EwayBillConstants";
import { AgGridReact } from "ag-grid-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { useEffect, useState } from "react";
import {
  createEwayBill,
  getDispatchData,
} from "@/features/Dispatch/DispatchSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";
import SelectState from "@/components/reusable/SelectState";
import Success from "@/components/reusable/Success";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@/utils/toasterContext";

type ewayBillData = {
  alert: string;
  ewayBillNo: string;
  ewayBillDate: string;
  validUpto: string;
};

export default function CreateEwayBill() {
  const dispatch = useAppDispatch();
  const [isEwayBillCreated, setIsEwayBillCreated] = useState(false);
  const [ewayBillNo, setEwayBillNo] = useState<ewayBillData>({
    alert: "",
    ewayBillNo: "",
    ewayBillDate: "",
    validUpto: "",
  });
  const { dispatchDataLoading, dispatchData, ewayBillDataLoading } =
    useAppSelector((state) => state.dispatch);
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<EwayBillFormData>({
    resolver: zodResolver(ewayBillSchema),
    defaultValues: {
      header: {
        documentDate: dayjs().format("YYYY-MM-DD"),
      },
    },
  });

  const onSubmit = (data: EwayBillFormData) => {
    dispatch(createEwayBill(data)).then((res: any) => {
      if (res.payload.data.status) {
        setIsEwayBillCreated(true);
        setEwayBillNo(res?.payload?.data?.data);
        showToast(res?.payload?.data?.message, "success");
      }
    });
  };
  const dispId = window.location.pathname.split("/").pop()!;

  useEffect(() => {
    dispatch(getDispatchData(dispId?.replace(/_/g, "/")));
  }, []);

  useEffect(() => {
    if (dispatchData) {
      const data = dispatchData?.header[0];
      setValue("header.documentNo", dispId.replace(/_/g, "/"));
      setValue("billFrom.gstin", data.billFrom.gstin);
      setValue("billFrom.legalName", data.billFrom.legalName);
      setValue("billFrom.tradeName", data.billFrom.tradeName);
      setValue("billFrom.email", data.billFrom.email);
      setValue("billFrom.phone", data.billFrom.phone);
      setValue("billFrom.pincode", data.billFrom.pincode);
      setValue("billFrom.addressLine1", data.billFrom.addressLine1);
      setValue("billFrom.addressLine2", data.billFrom.addressLine2);
      setValue("billFrom.location", data.billFrom.location);
      setValue("billFrom.state", {
        Code: data.billFrom.state?.code,
        Name: data.billFrom.state?.name,
      });
      setValue("billTo.gstin", data.billTo.gstin);
      setValue("billTo.legalName", data.billTo.legalName);
      setValue("billTo.email", data.billTo.email);
      setValue("billTo.phone", data.billTo.phone);
      setValue("billTo.pincode", data.billTo.pincode);
      setValue("billTo.addressLine1", data.billTo.addressLine1);
      setValue("billTo.addressLine2", data.billTo.addressLine2);
      setValue("billTo.location", data.billTo.location);
      setValue("billTo.state", {
        Code: data.billTo.state?.code,
        Name: data.billTo.state?.name,
      });
      setValue("dispatchFrom.legalName", data.dispatchFrom.legalName);
      setValue("dispatchFrom.pincode", data.dispatchFrom.pincode);
      setValue("dispatchFrom.addressLine1", data.dispatchFrom.addressLine1);
      setValue("dispatchFrom.addressLine2", data.dispatchFrom.addressLine2);
      setValue("dispatchFrom.location", data.dispatchFrom.location);
      setValue("dispatchFrom.state", {
        Code: data.dispatchFrom.state?.code,
        Name: data.dispatchFrom.state?.name,
      });
      setValue("shipTo.gstin", data.shipTo.gstin);
      setValue("shipTo.legalName", data.shipTo.legalName);
      setValue("shipTo.addressLine1", data.shipTo.addressLine1);
      setValue("shipTo.addressLine2", data.shipTo.addressLine2);
      setValue("shipTo.location", data.shipTo.location);
      setValue("shipTo.state", {
        Code: data.shipTo.state?.code,
        Name: data.shipTo.state?.name,
      });
      setValue("shipTo.pincode", data.shipTo.pincode);
    }
  }, [dispatchData]);
  const formValues = control._formValues;

  return (
    <>
      {isEwayBillCreated ? (
        <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-[#fff] pt-[100px]">
          <div className="flex flex-col items-center justify-center gap-[30px] text-center bg-[#f8f9fa] p-8 rounded-lg shadow-md max-w-[500px] mx-auto">
            <div className="text-green-500 animate-bounce">
              <Success />
            </div>
            <Typography
              variant="h5"
              fontWeight={700}
              color="primary"
              className="border-b-2 border-blue-200 pb-2"
            >
              EwayBill Created Successfully!
            </Typography>
            <div className="space-y-4 bg-white p-6 rounded-md shadow-sm w-full">
              <Typography
                variant="body1"
                fontWeight={500}
                className="flex justify-between"
              >
                <span className="text-gray-600">EwayBill Number:</span>
                <span className="text-blue-600 font-semibold">
                  {ewayBillNo?.ewayBillNo ?? "-"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                className="flex justify-between"
              >
                <span className="text-gray-600">Message:</span>
                <span className="text-green-600 pl-5">
                  {ewayBillNo?.alert ?? "-"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                className="flex justify-between"
              >
                <span className="text-gray-600">EwayBill Date:</span>
                <span className="text-blue-600">
                  {ewayBillNo?.ewayBillDate ?? "-"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                fontWeight={500}
                className="flex justify-between"
              >
                <span className="text-gray-600">Valid Upto:</span>
                <span className="text-blue-600">
                  {ewayBillNo?.validUpto ?? "-"}
                </span>
              </Typography>
            </div>
            <LoadingButton
              onClick={() => window.close()}
              variant="contained"
              className="w-[200px] h-[45px] text-lg font-medium hover:bg-blue-700 transition-colors duration-300"
            >
              Close Window
            </LoadingButton>
          </div>
        </div>
      ) : (
        <div className="rounded-lg p-[30px] shadow-md bg-[#fff] overflow-y-auto mb-10">
          {(dispatchDataLoading || ewayBillDataLoading) && <FullPageLoading />}
          <div className="text-slate-700 font-[600] text-[28px] flex justify-center mb-2">
            Create E-Way Bill
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
              <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                <h3 className="text-[18px] font-[600] text-slate-700">
                  Document Details
                </h3>
              </CardHeader>
              <CardContent className="mt-[30px] p-6">
                <div className="grid grid-cols-3 gap-6">
                  <Controller
                    name="header.supplyType"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.header?.supplyType}
                      >
                        <InputLabel id="supply-type-label">
                          Supply Type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="supply-type-label"
                          label="Supply Type"
                          className="bg-white"
                        >
                          {supplyTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.header?.supplyType && (
                          <span className="text-red-500 text-sm">
                            {errors.header.supplyType.message}
                          </span>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="header.subSupplyType"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.header?.subSupplyType}
                      >
                        <InputLabel id="sub-supply-type-label">
                          Sub Supply Type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="sub-supply-type-label"
                          label="Sub Supply Type"
                          className="bg-white"
                        >
                          {subsupplytype?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.header?.subSupplyType && (
                          <span className="text-red-500 text-sm">
                            {errors.header.subSupplyType.message}
                          </span>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="header.documentNo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Document No"
                        variant="outlined"
                        className="bg-white"
                        error={!!errors.header?.documentNo}
                        helperText={errors.header?.documentNo?.message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="header.documentType"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.header?.documentType}
                      >
                        <InputLabel id="document-type-label">
                          Document Type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="document-type-label"
                          label="Document Type"
                          className="bg-white"
                        >
                          {docType.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.header?.documentType && (
                          <span className="text-red-500 text-sm">
                            {errors.header.documentType.message}
                          </span>
                        )}
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="header.documentDate"
                    control={control}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="DD-MM-YYYY"
                          slots={{
                            textField: TextField,
                          }}
                          maxDate={dayjs()}
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              error: !!errors.header?.documentDate,
                              helperText: errors.header?.documentDate?.message,
                              fullWidth: true,
                              label: "Document Date",
                            },
                          }}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(value) =>
                            field.onChange(value?.format("YYYY-MM-DD"))
                          }
                          sx={{ width: "100%" }}
                        />
                      </LocalizationProvider>
                    )}
                  />

                  <Controller
                    name="header.transactionType"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.header?.transactionType}
                      >
                        <InputLabel id="transaction-type-label">
                          Transaction Type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="transaction-type-label"
                          label="Transaction Type"
                          className="bg-white"
                        >
                          {transactionTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.header?.transactionType && (
                          <span className="text-red-500 text-sm">
                            {errors.header.transactionType.message}
                          </span>
                        )}
                      </FormControl>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              {/* Bill From Section */}
              <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
                <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                  <h3 className="text-[18px] font-[600] text-slate-700">
                    Bill From
                  </h3>
                </CardHeader>
                <CardContent className="mt-[30px] p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Controller
                      name="billFrom.legalName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Legal Name"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billFrom?.legalName}
                          helperText={errors.billFrom?.legalName?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="billFrom.tradeName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Trade Name"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billFrom?.tradeName}
                          helperText={errors.billFrom?.tradeName?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billFrom.gstin"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="GSTIN"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billFrom?.gstin}
                          helperText={errors.billFrom?.gstin?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billFrom.email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billFrom?.email}
                          helperText={errors.billFrom?.email?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billFrom.phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billFrom?.phone}
                          helperText={errors.billFrom?.phone?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billFrom.pincode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Pincode"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billFrom?.pincode}
                          helperText={errors.billFrom?.pincode?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="billFrom.location"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Location"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billFrom?.location}
                          helperText={errors.billFrom?.location?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billFrom.state"
                      control={control}
                      render={({ field }) => (
                        <SelectState
                          size="medium"
                          error={!!errors.billFrom?.state}
                          varient="outlined"
                          helperText={errors.billFrom?.state?.message}
                          onChange={field.onChange}
                          value={field.value}
                          label={formValues.billFrom.state?.Name}
                        />
                      )}
                    />

                    <Controller
                      name="billFrom.addressLine1"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address Line 1"
                          variant="outlined"
                          className="bg-white"
                          multiline
                          rows={3}
                          error={!!errors.billFrom?.addressLine1}
                          helperText={errors.billFrom?.addressLine1?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billFrom.addressLine2"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address Line 2"
                          variant="outlined"
                          className="bg-white"
                          multiline
                          rows={3}
                          error={!!errors.billFrom?.addressLine2}
                          helperText={errors.billFrom?.addressLine2?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bill To Section */}
              <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
                <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                  <h3 className="text-[18px] font-[600] text-slate-700">
                    Bill To
                  </h3>
                </CardHeader>
                <CardContent className="mt-[30px] p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Controller
                      name="billTo.legalName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Legal Name"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billTo?.legalName}
                          helperText={errors.billTo?.legalName?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="billTo.gstin"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="GSTIN"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billTo?.gstin}
                          helperText={errors.billTo?.gstin?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billTo.location"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Location"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billTo?.location}
                          helperText={errors.billTo?.location?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billTo.state"
                      control={control}
                      render={({ field }) => (
                        <SelectState
                          size="medium"
                          error={!!errors.billTo?.state}
                          varient="outlined"
                          helperText={errors.billTo?.state?.message}
                          onChange={field.onChange}
                          value={field.value}
                          label={formValues.billTo.state?.Name}
                        />
                      )}
                    />
                    <Controller
                      name="billTo.email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billTo?.email}
                          helperText={errors.billTo?.email?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billTo.phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billTo?.phone}
                          helperText={errors.billTo?.phone?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billTo.pincode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Pincode"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billTo?.pincode}
                          helperText={errors.billTo?.pincode?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billTo.phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.billTo?.phone}
                          helperText={errors.billTo?.phone?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="billTo.addressLine1"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address Line 1"
                          variant="outlined"
                          className="bg-white"
                          multiline
                          rows={3}
                          error={!!errors.billTo?.addressLine1}
                          helperText={errors.billTo?.addressLine1?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="billTo.addressLine2"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address Line 2"
                          variant="outlined"
                          className="bg-white"
                          multiline
                          rows={3}
                          error={!!errors.billTo?.addressLine2}
                          helperText={errors.billTo?.addressLine2?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Ship From Section */}
              <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
                <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                  <h3 className="text-[18px] font-[600] text-slate-700">
                    Ship From
                  </h3>
                </CardHeader>
                <CardContent className="mt-[30px] p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Controller
                      name="dispatchFrom.legalName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Legal Name"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.dispatchFrom?.legalName}
                          helperText={errors.dispatchFrom?.legalName?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="dispatchFrom.location"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Location"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.dispatchFrom?.location}
                          helperText={errors.dispatchFrom?.location?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="dispatchFrom.state"
                      control={control}
                      render={({ field }) => (
                        <SelectState
                          size="medium"
                          error={!!errors.dispatchFrom?.state}
                          varient="outlined"
                          helperText={errors.dispatchFrom?.state?.message}
                          onChange={field.onChange}
                          value={field.value}
                          label={formValues.dispatchFrom.state?.Name}
                        />
                      )}
                    />

                    <Controller
                      name="dispatchFrom.pincode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Pincode"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.dispatchFrom?.pincode}
                          helperText={errors.dispatchFrom?.pincode?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="dispatchFrom.addressLine1"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address Line 1"
                          variant="outlined"
                          className="bg-white"
                          multiline
                          rows={3}
                          error={!!errors.dispatchFrom?.addressLine1}
                          helperText={
                            errors.dispatchFrom?.addressLine1?.message
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="dispatchFrom.addressLine2"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address Line 2"
                          variant="outlined"
                          className="bg-white"
                          multiline
                          rows={3}
                          error={!!errors.dispatchFrom?.addressLine2}
                          helperText={
                            errors.dispatchFrom?.addressLine2?.message
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ship To Section */}
              <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
                <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                  <h3 className="text-[18px] font-[600] text-slate-700">
                    Ship To
                  </h3>
                </CardHeader>
                <CardContent className="mt-[30px] p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Controller
                      name="shipTo.legalName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Legal Name"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.shipTo?.legalName}
                          helperText={errors.shipTo?.legalName?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="shipTo.tradeName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Trade Name"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.shipTo?.tradeName}
                          helperText={errors.shipTo?.tradeName?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="shipTo.gstin"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="GSTIN"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.shipTo?.gstin}
                          helperText={errors.shipTo?.gstin?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="shipTo.location"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Location"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.shipTo?.location}
                          helperText={errors.shipTo?.location?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="shipTo.state"
                      control={control}
                      render={({ field }) => (
                        <SelectState
                          size="medium"
                          error={!!errors.shipTo?.state}
                          varient="outlined"
                          helperText={errors.shipTo?.state?.message}
                          onChange={field.onChange}
                          value={field.value}
                          label={formValues.shipTo.state?.Name}
                        />
                      )}
                    />

                    <Controller
                      name="shipTo.pincode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Pincode"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.shipTo?.pincode}
                          helperText={errors.shipTo?.pincode?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="shipTo.addressLine1"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address Line 1"
                          variant="outlined"
                          multiline
                          rows={3}
                          className="bg-white"
                          error={!!errors.shipTo?.addressLine1}
                          helperText={errors.shipTo?.addressLine1?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="shipTo.addressLine2"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          label="Address Line 2"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.shipTo?.addressLine2}
                          helperText={errors.shipTo?.addressLine2?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Transportation Details Section */}
              <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
                <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                  <h3 className="text-[18px] font-[600] text-slate-700">
                    Transportation Details
                  </h3>
                </CardHeader>
                <CardContent className="mt-[30px] p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Controller
                      name="ewaybillDetails.transporterId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Transporter ID"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.ewaybillDetails?.transporterId}
                          helperText={
                            errors.ewaybillDetails?.transporterId?.message
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="ewaybillDetails.transporterName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Transporter Name"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.ewaybillDetails?.transporterName}
                          helperText={
                            errors.ewaybillDetails?.transporterName?.message
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="ewaybillDetails.transDistance"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Transport Distance (km)"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.ewaybillDetails?.transDistance}
                          helperText={
                            errors.ewaybillDetails?.transDistance?.message
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Part B Section */}
              <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
                <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                  <h3 className="text-[18px] font-[600] text-slate-700">
                    Part B
                  </h3>
                </CardHeader>
                <CardContent className="mt-[30px] p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Controller
                      name="ewaybillDetails.transMode"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.ewaybillDetails?.transMode}
                        >
                          <InputLabel id="trans-mode-label">
                            Transport Mode
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="trans-mode-label"
                            label="Transport Mode"
                            className="bg-white"
                          >
                            {transportationMode.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.ewaybillDetails?.transMode && (
                            <span className="text-red-500 text-sm">
                              {errors.ewaybillDetails.transMode.message}
                            </span>
                          )}
                        </FormControl>
                      )}
                    />

                    <Controller
                      name="ewaybillDetails.transporterDocNo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Transporter Document No"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.ewaybillDetails?.transporterDocNo}
                          helperText={
                            errors.ewaybillDetails?.transporterDocNo?.message
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="ewaybillDetails.transporterDate"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="DD-MM-YYYY"
                            slots={{
                              textField: TextField,
                            }}
                            maxDate={dayjs()}
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                error:
                                  !!errors.ewaybillDetails?.transporterDate,
                                helperText:
                                  errors.ewaybillDetails?.transporterDate
                                    ?.message,
                                fullWidth: true,
                                label: "Transporter Date",
                              },
                            }}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(value) =>
                              field.onChange(value?.format("YYYY-MM-DD"))
                            }
                            sx={{ width: "100%" }}
                          />
                        </LocalizationProvider>
                      )}
                    />

                    <Controller
                      name="ewaybillDetails.vehicleNo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Vehicle No"
                          variant="outlined"
                          className="bg-white"
                          error={!!errors.ewaybillDetails?.vehicleNo}
                          helperText={
                            errors.ewaybillDetails?.vehicleNo?.message
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="ewaybillDetails.vehicleType"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.ewaybillDetails?.vehicleType}
                        >
                          <InputLabel id="vehicle-type-label">
                            Vehicle Type
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="vehicle-type-label"
                            label="Vehicle Type"
                            className="bg-white"
                          >
                            {vehicleTypeOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.ewaybillDetails?.vehicleType && (
                            <span className="text-red-500 text-sm">
                              {errors.ewaybillDetails.vehicleType.message}
                            </span>
                          )}
                        </FormControl>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
              <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
                <h3 className="text-[18px] font-[600] text-slate-700">
                  Item Details
                </h3>
              </CardHeader>
              <CardContent className="mt-[10px] p-6">
                <div className="ag-theme-quartz h-[calc(100vh-140px)]">
                  <AgGridReact
                    rowData={dispatchData?.data}
                    columnDefs={columnDefs}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
