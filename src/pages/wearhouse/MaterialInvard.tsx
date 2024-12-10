import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RMMaterialsAddTable from "@/table/wearhouse/RMMaterialsAddTable";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { Button } from "@/components/ui/button";
import { FaAngleUp } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail, getLocationAsync, getVendorAddress, getVendorAsync, getVendorBranchAsync, uploadInvoiceFile } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { createRawMin, resetDocumentFile, storeDocumentFile } from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { CreateRawMinPayloadType } from "@/features/wearhouse/Rawmin/RawMinType";
import { getCurrency } from "@/features/common/commonSlice";
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import SelectVendor, { VendorData } from "@/components/reusable/SelectVendor";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import FileUploader from "@/components/reusable/FileUploader";
import { LoadingButton } from "@mui/lab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
interface RowData {
  partComponent: string;
  qty: number;
  rate: string;
  taxableValue: number;
  foreignValue: number;
  hsnCode: string;
  gstType: string;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  location: string;
  autoConsump: string;
  remarks: string;
  id: number;
  currency: string;
  isNew?: boolean;
  excRate: number;
}

interface Totals {
  cgst: number;
  sgst: number;
  igst: number;
  taxableValue: number;
}

type FormData = {
  vendorType: string;
  vendor: VendorData | null;
  vendorBranch: string;
  vendorAddress: string;
  gstin: string;
  doucmentDate: Dayjs | null;
  documentId: string;
};
const MaterialInvard: React.FC = () => {
  const [filename, setFilename] = useState<string>("");
  const [file, setfile] = useState<File[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [total, setTotal] = useState<Totals>({ cgst: 0, sgst: 0, igst: 0, taxableValue: 0 });
  const dispatch = useAppDispatch();
  const { VendorBranchData, venderaddressdata, uploadInvoiceFileLoading } = useAppSelector((state) => state.divicemin);
  const { documnetFileData, createminLoading } = useAppSelector((state) => state.rawmin);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      vendorType: "V01",
      vendor: null,
      vendorBranch: "",
      vendorAddress: "",
      gstin: "",
      doucmentDate: null,
      documentId: "",
    },
  });
  const checkRequiredFields = (data: RowData[]) => {
    let hasErrors = false;
    const requiredFields: Array<keyof RowData> = ["partComponent", "qty", "rate", "hsnCode", "gstType", "gstRate", "location"];
    const miss = data.map((item) => {
      const missingFields: string[] = [];
      requiredFields.forEach((field) => {
        // Check if the required field is empty
        if (item[field] === "" || item[field] === 0 || item[field] === undefined || item[field] === null) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return `${item.id}`;
      }
    });
   
    if (miss.filter((item) => item !== undefined).length > 0) {
      showToast(`Some required fields are missing: line no. ${miss.filter((item) => item !== undefined).join(", ")}`, "error");
      hasErrors = true;
    }

    return hasErrors;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (rowData.length === 0) {
      showToast("Please Add Material Details", "error");
    } else if (!documnetFileData) {
      showToast("Please Upload Invoice Documents", "error");
    } else {
      if (!checkRequiredFields(rowData)) {
        const component = rowData.map((item) => item.partComponent);
        const qty = rowData.map((item) => Number(item.qty));
        const rate = rowData.map((item) => Number(item.rate));
        const gsttype = rowData.map((item) => item.gstType);
        const gstrate = rowData.map((item) => Number(item.gstRate));
        const location = rowData.map((item) => item.location);
        const currency = rowData.map((item) => item.currency);
        const remarks = rowData.map((item) => item.remarks);
        const hsnCode = rowData.map((item) => item.hsnCode);
        const payload: CreateRawMinPayloadType = {
          component,
          qty,
          rate,
          gsttype,
          gstrate,
          location,
          hsnCode,
          remarks,
          currency: currency || [],
          vendor: data.vendor?.id || "",
          vendorbranch: data.vendorBranch || "",
          address: data.vendorAddress || "",
          doc_id: data.documentId || "",
          doc_date: dayjs(data.doucmentDate).format("DD-MM-YYYY") || "",
          vendortype: data.vendorType || "",
          invoiceAttachment: documnetFileData || [],
        };
        dispatch(createRawMin(payload)).then((response: any) => {
          if (response.payload.data.success) {
            showToast(response.payload?.data?.message, "success");
            setRowData([]);
            setTotal({ cgst: 0, sgst: 0, igst: 0, taxableValue: 0 });
            reset();
            dispatch(resetDocumentFile());
            setFilename("");
            setfile(null);
            dispatch(clearaddressdetail())
            
          }
        });
      }
    }
  };

  const InvoiceFileUpload = () => {
    if (file && filename) {
      const formdata = new FormData();
      formdata.append("file", file[0]);
      formdata.append("fileName", filename);
      dispatch(uploadInvoiceFile(formdata)).then((res: any) => {
        if (res.payload.data.success) {
          dispatch(storeDocumentFile(res.payload.data?.data[0]));

          showToast(res.payload.data.message, "success");
        }
      });
    } else {
      showToast("File and Document Name Required", "error");
    }
  };
  useEffect(() => {
    dispatch(getVendorAsync(null));
    dispatch(getLocationAsync(null));
    dispatch(getPertCodesync(null));
    dispatch(getCurrency());
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MaterialInvardUploadDocumentDrawer open={upload} setOpen={setUpload} />
      <div className="h-[calc(100vh-50px)]  ">
        <div className="h-[calc(100vh-50px)] grid grid-cols-[500px_1fr]">
          <div className=" border-r border-neutral-300 h-full overflow-y-auto flex flex-col gap-[10px] relative bg-white ">
            <div>
              <CardContent className="mt-[20px] flex flex-col gap-[20px]">
                <div>
                  <Controller
                    name="vendorType"
                    control={control}
                    rules={{ required: "Vendor Type is required" }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Vendor Type</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Vendor Type" {...field}>
                          <MenuItem value={"V01"}>Vendor</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.vendorType && <span className=" text-[12px] text-red-500">{errors.vendorType.message}</span>}
                </div>
                <div className="grid  gap-[30px] mt-[10px]">
                  <div>
                    <Controller
                      name="vendor"
                      control={control}
                      rules={{ required: "Vendor  is required" }}
                      render={({ field }) => (
                        <SelectVendor
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            dispatch(getVendorBranchAsync(e!.id));
                          }}
                          label="Vendor"
                        />
                      )}
                    />
                    {errors.vendor && <span className=" text-[12px] text-red-500">{errors.vendor.message}</span>}
                  </div>
                  <div>
                    <Controller
                      name="vendorBranch"
                      control={control}
                      rules={{ required: "Vendor Branch  is required" }}
                      render={({ field }) => (
                        <FormControl disabled={!VendorBranchData} fullWidth>
                          <InputLabel id="Vendor-simple-select-label">Vendor Branch</InputLabel>
                          <Select
                            labelId="Vendor-simple-select-label"
                            id="Vendor-simple-select"
                            label="Vendor Branch"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              dispatch(getVendorAddress(e.target.value)).then((response: any) => {
                                if (response.payload.data.success) {
                                  setValue("vendorAddress", replaceBrWithNewLine(response.payload.data?.data?.address) ||"");
                                  setValue("gstin", response.payload.data?.data?.gstid);
                                }
                              });
                            }}
                          >
                            {VendorBranchData?.map((item) => (
                              <MenuItem value={item.id}>{item.text}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors.vendorBranch && <span className=" text-[12px] text-red-500">{errors.vendorBranch.message}</span>}
                  </div>
                  <div className="flex items-center gap-[10px] text-slate-600">
                    <p className="font-[500]">GSTIN :</p>
                    <p>{venderaddressdata ? venderaddressdata.gstid : "--"}</p>
                  </div>
                </div>
                <div>
                  <TextField
                    sx={{ mb: 1 }}
                    error={!!errors.vendorAddress}
                    helperText={errors?.vendorAddress?.message}
                    focused={!!watch("vendorAddress")}
                    multiline
                    rows={3}
                    fullWidth
                    label="Bill From Address"
                    className="h-[100px] resize-none"
                    {...register("vendorAddress", { required: "Bill From Address is required" })}
                  />
                </div>
                <Controller
                  name="doucmentDate"
                  control={control}
                  rules={{ required: " Document Date is required" }}
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
                            error: !!errors.doucmentDate,
                            helperText: errors.doucmentDate?.message,
                          },
                        }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        sx={{ width: "100%" }}
                        label="Document Date"
                        name="startDate"
                      />
                    </LocalizationProvider>
                  )}
                />
                <TextField label="Document ID" error={!!errors.documentId} helperText={errors.documentId?.message} {...register("documentId", { required: "Invoice Id  is required" })} />
                <div className=" flex flex-col gap-[20px] py-[20px] border-t border-neutral-400">
                  <div>
                    <TextField fullWidth label="Document Name" value={filename} onChange={(e) => setFilename(e.target.value)} />
                  </div>
                  <div>
                    <FileUploader
                      acceptedFileTypes={{
                        "application/pdf": [], // PDF files
                        "text/plain": [], // Text files (.txt)
                        "text/csv": [], // CSV files
                        "application/vnd.ms-excel": [], // Excel files (.xls)
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // Excel files (.xlsx)
                      }}
                      label="Upload Document"
                      value={file}
                      onFileChange={setfile}
                    />
                  </div>
                  <div className="flex items-center ">
                    <LoadingButton variant="contained" loadingPosition="start" loading={uploadInvoiceFileLoading} type="button" startIcon={<FileUploadIcon fontSize="small" />} onClick={InvoiceFileUpload}>
                      Upload
                    </LoadingButton>
                  </div>
                </div>
              </CardContent>
            </div>
            <div className="min-h-[50px]"></div>
            <div className={`fixed bottom-0 left-[60px] w-[500px] z-[10]  transition-all bg-white ${open ? "h-[290px]" : "h-[50px]"} border-r`}>
              <div className="h-[50px] bg-cyan-900 flex items-center pe-[20px] gap-[10px]">
                <Button type="button" onClick={() => setOpen(!open)} className="bg-amber-500 hover:bg-amber-600 p-0  rounded-none h-full w-[50px]">
                  <FaAngleUp className={`h-[20px] w-[20px] transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
                </Button>
                <Typography variant="h6" component={"div"} fontWeight={500} fontSize={"17px"} className="text-white">
                  Total GST and Tax Details
                </Typography>
              </div>
              <Card className="border-0 rounded-none shadow-none">
                <CardContent className="flex flex-col gap-[20px] pt-[20px]">
                  <div className="flex justify-between">
                    <p className="text-slate-600 font-[500]">Sub-Total value before Taxes</p>
                    <p className="text-[14px] text-muted-foreground">{total.taxableValue}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-slate-600 font-[500]">CGST</p>
                    <p className="text-[14px] text-muted-foreground">(+) {total.cgst}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-slate-600 font-[500]">SGST</p>
                    <p className="text-[14px] text-muted-foreground">(+) {total.sgst}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-slate-600 font-[500]">IGST</p>
                    <p className="text-[14px] text-muted-foreground">(+) {total.igst}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-slate-600 font-[500]">Sub-Total values after Taxes</p>
                    <p className="text-[14px] text-muted-foreground">{total.taxableValue + (total.cgst + total.sgst + total.igst)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div>
            <div className="h-[70px] bg-white flex items-center justify-end gap-[10px] px-[20px]">
              <LoadingButton
                sx={{ background: "white", color: "red" }}
                onClick={() => {
                  reset();
                  setRowData([]);
                  setTotal({ cgst: 0, sgst: 0, igst: 0, taxableValue: 0 });
                }}
                type="button"
                variant={"contained"}
                startIcon={<Icons.refresh />}
              >
                Reset
              </LoadingButton>
              <LoadingButton loadingPosition="start" loading={createminLoading} startIcon={<Icons.save />} type="submit" variant={"contained"}>
                Submit
              </LoadingButton>
            </div>
            <RMMaterialsAddTable rowData={rowData} setRowData={setRowData} setTotal={setTotal} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default MaterialInvard;
