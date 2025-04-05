import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  docType,
  supplyTypeOptions,
  subsupplytype,
  transactionTypeOptions,
  reverseOptions,
  ewayBillSchema,
  transportationMode,
  vehicleTypeOptions,
} from "@/constants/EwayBillConstants";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EwayBillFormData } from "@/constants/EwayBillConstants";
import { AgGridReact } from "ag-grid-react";

export default function CreateEwayBill() {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<EwayBillFormData>({
    resolver: zodResolver(ewayBillSchema),
    defaultValues: {
      header: {
        documentType: "",
        supplyType: "",
        subSupplyType: "",
        documentNo: "",
        documentDate: dayjs().format("YYYY-MM-DD"),
        transactionType: "1",
        reverseCharge: "N",
      },
    },
  });

  const onSubmit = (data: EwayBillFormData) => {
    console.log(data);
  };

  return (
    <div className="rounded-lg p-[30px] shadow-md bg-[#fff] overflow-y-auto mb-10">
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
            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="header.documentType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.header?.documentType}>
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
                name="header.supplyType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.header?.supplyType}>
                    <InputLabel id="supply-type-label">Supply Type</InputLabel>
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
                  <FormControl fullWidth error={!!errors.header?.subSupplyType}>
                    <InputLabel id="sub-supply-type-label">
                      Sub Supply Type
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="sub-supply-type-label"
                      label="Sub Supply Type"
                      className="bg-white"
                    >
                      {subsupplytype.map((option) => (
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
                  />
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

              <Controller
                name="header.reverseCharge"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.header?.reverseCharge}>
                    <InputLabel id="reverse-charge-label">
                      Reverse Charge
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="reverse-charge-label"
                      label="Reverse Charge"
                      className="bg-white"
                    >
                      {reverseOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.header?.reverseCharge && (
                      <span className="text-red-500 text-sm">
                        {errors.header.reverseCharge.message}
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
                    />
                  )}
                />

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
                      error={!!errors.billFrom?.addressLine1}
                      helperText={errors.billFrom?.addressLine1?.message}
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
                      error={!!errors.billFrom?.addressLine2}
                      helperText={errors.billFrom?.addressLine2?.message}
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
                    />
                  )}
                />

                <Controller
                  name="billFrom.state"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.billFrom?.state}>
                      <InputLabel id="bill-from-state-label">State</InputLabel>
                      <Select
                        {...field}
                        labelId="bill-from-state-label"
                        label="State"
                        className="bg-white"
                      >
                        {/* Add state options here */}
                      </Select>
                      {errors.billFrom?.state && (
                        <span className="text-red-500 text-sm">
                          {errors.billFrom.state.message}
                        </span>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bill To Section */}
          <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
            <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
              <h3 className="text-[18px] font-[600] text-slate-700">Bill To</h3>
            </CardHeader>
            <CardContent className="mt-[30px] p-6">
              <div className="grid grid-cols-2 gap-6">
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
                    />
                  )}
                />

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
                      error={!!errors.billTo?.addressLine1}
                      helperText={errors.billTo?.addressLine1?.message}
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
                      error={!!errors.billTo?.addressLine2}
                      helperText={errors.billTo?.addressLine2?.message}
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
                    />
                  )}
                />

                <Controller
                  name="billTo.state"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.billTo?.state}>
                      <InputLabel id="bill-to-state-label">State</InputLabel>
                      <Select
                        {...field}
                        labelId="bill-to-state-label"
                        label="State"
                        className="bg-white"
                      >
                        {/* Add state options here */}
                      </Select>
                      {errors.billTo?.state && (
                        <span className="text-red-500 text-sm">
                          {errors.billTo.state.message}
                        </span>
                      )}
                    </FormControl>
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
                      error={!!errors.dispatchFrom?.addressLine1}
                      helperText={errors.dispatchFrom?.addressLine1?.message}
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
                      error={!!errors.dispatchFrom?.addressLine2}
                      helperText={errors.dispatchFrom?.addressLine2?.message}
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
                    />
                  )}
                />

                <Controller
                  name="dispatchFrom.state"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.dispatchFrom?.state}>
                      <InputLabel id="dispatch-from-state-label">
                        State
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="dispatch-from-state-label"
                        label="State"
                        className="bg-white"
                      >
                        {/* Add state options here */}
                      </Select>
                      {errors.dispatchFrom?.state && (
                        <span className="text-red-500 text-sm">
                          {errors.dispatchFrom.state.message}
                        </span>
                      )}
                    </FormControl>
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
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ship To Section */}
          <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
            <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
              <h3 className="text-[18px] font-[600] text-slate-700">Ship To</h3>
            </CardHeader>
            <CardContent className="mt-[30px] p-6">
              <div className="grid grid-cols-2 gap-6">
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
                    />
                  )}
                />

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
                      className="bg-white"
                      error={!!errors.shipTo?.addressLine1}
                      helperText={errors.shipTo?.addressLine1?.message}
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
                      label="Address Line 2"
                      variant="outlined"
                      className="bg-white"
                      error={!!errors.shipTo?.addressLine2}
                      helperText={errors.shipTo?.addressLine2?.message}
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
                    />
                  )}
                />

                <Controller
                  name="shipTo.state"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.shipTo?.state}>
                      <InputLabel id="ship-to-state-label">State</InputLabel>
                      <Select
                        {...field}
                        labelId="ship-to-state-label"
                        label="State"
                        className="bg-white"
                      >
                        {/* Add state options here */}
                      </Select>
                      {errors.shipTo?.state && (
                        <span className="text-red-500 text-sm">
                          {errors.shipTo.state.message}
                        </span>
                      )}
                    </FormControl>
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
                    />
                  )}
                />

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
                            error: !!errors.ewaybillDetails?.transporterDate,
                            helperText:
                              errors.ewaybillDetails?.transporterDate?.message,
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
                      helperText={errors.ewaybillDetails?.vehicleNo?.message}
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
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Part B Section */}
          <Card className="rounded-lg shadow-md bg-[#fff] mb-8 border border-slate-200">
            <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[8px] rounded-t-lg">
              <h3 className="text-[18px] font-[600] text-slate-700">Part B</h3>
            </CardHeader>
            <CardContent className="mt-[30px] p-6">
              <div className="grid grid-cols-2 gap-6">
                <Controller
                  name="header.igstOnIntra"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.header?.igstOnIntra}>
                      <InputLabel id="igst-on-intra-label">
                        IGST on Intra
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="igst-on-intra-label"
                        label="IGST on Intra"
                        className="bg-white"
                      >
                        {reverseOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.header?.igstOnIntra && (
                        <span className="text-red-500 text-sm">
                          {errors.header.igstOnIntra.message}
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
          <CardContent className="mt-[30px] p-6">
            <div
              className="ag-theme-alpine"
              style={{ height: 400, width: "100%" }}
            >
              <AgGridReact />
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
  );
}
