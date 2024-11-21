import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RMMaterialsAddTable from "@/table/wearhouse/RMMaterialsAddTable";
import CustomInput from "@/components/reusable/CustomInput";
import { CustomButton } from "@/components/reusable/CustomButton";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { IoMdCheckmark, IoMdCloudUpload } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { FaAngleUp } from "react-icons/fa6";

import { showToast } from "@/utils/toastUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getLocationAsync, getVendorAddress, getVendorAsync, getVendorBranchAsync, uploadInvoiceFile } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { FileInput, FileUploader, FileUploaderContent } from "@/components/ui/Fileupload";
import { CgSpinner } from "react-icons/cg";
import { HiMiniTrash } from "react-icons/hi2";
import { MdFileCopy } from "react-icons/md";
import { createRawMin, resetDocumentFile, storeDocumentFile } from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { CreateRawMinPayloadType } from "@/features/wearhouse/Rawmin/RawMinType";
import { getCurrency } from "@/features/common/commonSlice";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import SelectVendor, { VendorData } from "@/components/reusable/SelectVendor";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

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
  const {  VendorBranchData, venderaddressdata, uploadInvoiceFileLoading } = useAppSelector((state) => state.divicemin);
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
    console.log(miss.filter((item) => item !== undefined));
    if (miss.filter((item) => item !== undefined).length > 0) {
      showToast({
        description: `Some required fields are missing: line no. ${miss.filter((item) => item !== undefined).join(", ")}`,
        variant: "destructive",
        duration: 3000,
      });
      hasErrors = true;
    }

    return hasErrors;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (rowData.length === 0) {
      showToast({
        description: "Please Add Material Details",
        variant: "destructive",
      });
    } else if (!documnetFileData) {
      showToast({
        description: "Please Upload Invoice Documents",
        variant: "destructive",
      });
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
            showToast({
              description: response.payload?.data?.message,
              variant: "success",
            });
            setRowData([]);
            setTotal({ cgst: 0, sgst: 0, igst: 0, taxableValue: 0 });
            reset();
            dispatch(resetDocumentFile());
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

          showToast({
            title: "Success",
            description: res.payload.data.message,
            variant: "success",
          });
          setfile(null);
          setFilename("");
        }
      });
    } else {
      showToast({
        description: "File and Document Name Required",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    dispatch(getVendorAsync(null));
    dispatch(getLocationAsync(null));
    dispatch(getPertCodesync(null));
    dispatch(getCurrency());
  }, []);

  return (
    <div>
      <MaterialInvardUploadDocumentDrawer open={upload} setOpen={setUpload} />
      <div className="h-[calc(100vh-50px)]  ">
        <div className="h-[calc(100vh-50px)] grid grid-cols-[500px_1fr]">
          <div className="p-[10px] border-r h-full overflow-y-auto flex flex-col gap-[10px] relative">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="rounded-md ">
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
                          // <CustomSelect
                          //   {...field}
                          //   isLoading={getVendorLoading}
                          //   options={transformGroupSelectData(VendorData)}
                          //   required
                          //   value={field.value}
                          //   isClearable={true}
                          //   onChange={(selectedOption) => {
                          //     field.onChange(selectedOption as SingleValue<OptionType>);
                          //     dispatch(getVendorBranchAsync(selectedOption!.value));
                          //   }}
                          //   onInputChange={(value) => {
                          //     if (debounceTimeout.current) {
                          //       clearTimeout(debounceTimeout.current);
                          //     }

                          //     debounceTimeout.current = setTimeout(() => {
                          //       dispatch(getVendorAsync(!value ? null : value));
                          //     }, 500);
                          //   }}
                          //   placeholder={"Vendor"}
                          // />
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
                          // <CustomSelect
                          //   {...field}
                          //   options={transformGroupSelectData(VendorBranchData)}
                          //   isLoading={getVendorBranchLoading}
                          //   required
                          //   value={field.value}
                          //   isClearable={true}
                          //   onChange={(selectedOption) => {
                          //     field.onChange(selectedOption as SingleValue<OptionType>);
                          //     dispatch(getVendorAddress(selectedOption!.value)).then((response: any) => {
                          //       if (response.payload.data.success) {
                          //         setValue("vendorAddress", response.payload.data?.data?.address?.replace("</br>", ""));
                          //         setValue("gstin", response.payload.data?.data?.gstid);
                          //       }
                          //     });
                          //   }}
                          //   placeholder={"Vendor Branch"}
                          // />
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
                                    setValue("vendorAddress", replaceBrWithNewLine(response.payload.data?.data?.address));
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
                        rules={{ required: " Date is required" }}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
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
                              label="Date"
                              name="startDate"
                            />
                          </LocalizationProvider>
                        )}
                      />
                  <TextField label="Document ID" error={!!errors.documentId} helperText={errors.documentId?.message} {...register("documentId", { required: "Invoice Id  is required" })} />
                  <div className=" flex flex-col gap-[30px] mt-[20px]">
                    <div>
                      <CustomInput required label="Document Name" value={filename} onChange={(e) => setFilename(e.target.value)} />
                    </div>
                    <div>
                      <FileUploader
                        value={null}
                        onValueChange={(value) => {
                          setfile(value);
                        }}
                        dropzoneOptions={{
                          multiple: true,
                          maxFiles: 5,
                          accept: {
                            "application/pdf": [], // PDF files
                            "text/plain": [], // Text files (.txt)
                            "text/csv": [], // CSV files
                            "application/vnd.ms-excel": [], // Excel files (.xls)
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // Excel files (.xlsx)
                          },
                        }}
                        className={`relative p-2 border-2 border-dashed rounded-lg bg-background border-slate-300 `}
                      >
                        <FileInput loading={uploadInvoiceFileLoading} className="outline-dashed outline-1 outline-white">
                          <div className="flex flex-col items-center justify-center w-full pt-3 pb-4 text-slate-400 gap-[20px]">
                            {uploadInvoiceFileLoading ? <CgSpinner className="h-[50px] w-[50px] text-slate-400 animate-spin" /> : <MdFileCopy className="h-[50px] w-[50px] text-slate-400" />}
                            <p>
                              <strong>Drag and drop</strong> files here or click to select
                            </p>
                          </div>
                        </FileInput>
                        <FileUploaderContent>{file && file.map((file) => <p>{file.name}</p>)}</FileUploaderContent>
                      </FileUploader>
                    </div>
                    <div className="flex items-center ">
                      <CustomButton loading={uploadInvoiceFileLoading} type="button" icon={<IoMdCloudUpload className="h-[20px] w-[20px]" />} className="bg-cyan-700 hover:bg-cyan-800" onClick={InvoiceFileUpload}>
                        Upload
                      </CustomButton>
                    </div>
                    <div>
                      <ul className="">
                        {documnetFileData &&
                          documnetFileData.map((item, i) => (
                            <li key={i} className="flex items-center justify-between py-[5px] border-b">
                              <span>{item.originalFileName}</span>
                              <HiMiniTrash className="h-[20px] w-[20px] text-red-500 cursor-pointer" />
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-[10px]">
                    <CustomButton
                      onClick={() => {
                        reset();
                        setRowData([]);
                        setTotal({ cgst: 0, sgst: 0, igst: 0, taxableValue: 0 });
                      }}
                      type="button"
                      variant={"outline"}
                      icon={<TbRefresh className="h-[18px] w-[18px] text-red-600" />}
                    >
                      Reset
                    </CustomButton>
                    <CustomButton loading={createminLoading} icon={<IoMdCheckmark className="h-[18px] w-[18px] " />} className="bg-cyan-700 hover:bg-cyan-800">
                      Submit
                    </CustomButton>
                  </div>
                </CardContent>
              </Card>
            </form>
            <div className="min-h-[50px]"></div>
            <div className={`fixed bottom-0 left-[60px] w-[500px] z-[10]  transition-all bg-white ${open ? "h-[290px]" : "h-[50px]"} border-r`}>
              <div className="h-[50px] bg-cyan-900 flex items-center pe-[20px] gap-[10px]">
                <Button onClick={() => setOpen(!open)} className="bg-amber-500 hover:bg-amber-600 p-0  rounded-none h-full w-[50px]">
                  <FaAngleUp className={`h-[20px] w-[20px] transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} />
                </Button>
                <p className="text-white text-[18px] font-[500]">Total GST and Tax Details</p>
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
          <RMMaterialsAddTable rowData={rowData} setRowData={setRowData} setTotal={setTotal} />
        </div>
      </div>
    </div>
  );
};

export default MaterialInvard;
