import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import parse from "html-react-parser";
import {
  createMinAsync,
  getLocationAsync,
  getSkuAsync,
  getUomBySku,
  getVendorAddress,
  getVendorAsync,
  getVendorBranchAsync,
  resetSerialFile,
  storeDraftMin,
  storeInvoiceFile,
  storeSerialFile,
  storeStepFormdata,
  uploadInvoiceFile,
  uploadSerialFile,
} from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { CreateMinPayload, Step1Form } from "@/features/wearhouse/Divicemin/DeviceMinType";
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography } from "@mui/material";
import { Icons } from "@/components/icons";
import SelectVendor from "@/components/reusable/SelectVendor";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import SelectDevice from "@/components/reusable/SelectSku";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FileUploader from "@/components/reusable/FileUploader";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@/utils/toasterContext";
import SelectLocationAcordingModule from "@/components/reusable/SelectLocationAcordingModule";
import SelectCostCenter from "@/components/reusable/SelectCostCenter";

type Props = {
  setStep: (step: number) => void;
  step?: number;
};
const DeviceMinStep1: React.FC<Props> = ({ setStep }) => {
  const [unit, setUnit] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [file, setfile] = useState<File[] | null>(null);
  const [serialfile, setSerialFile] = useState<File[] | null>(null);

  const dispatch = useAppDispatch();
  const { storeStep1formData, storeDraftMinData, storeInvoiceFiles, storeSerialFiles, uploadSerialFileLoading, VendorBranchData, uploadInvoiceFileLoading, createMinLoading } = useAppSelector((state) => state.divicemin);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1Form>({
    defaultValues: {
      vendorType: "V01",
      vendor: null,
      vendorBranch: "",
      vendorAddress: "",
      sku: null,
      location: null,
      qty: "",
      docDate: null,
      unit: "",
      docId: "",
      docType: "",
      cc: null,
    },
  });

  const onSubmit: SubmitHandler<Step1Form> = (data) => {
    data.unit = unit;
    // if (!storeSerialFiles) showToast("Please Upload Serial File", "error");
    if (!storeInvoiceFiles) showToast("Please Upload Invoice File", "error");
    const updateddata: CreateMinPayload = {
      vendorBranch: data.vendorBranch,
      vendorCode: data.vendor!.id,
      vendorType: data.vendorType,
      invoiceAttachment: storeInvoiceFiles!,
      // fileReference: storeSerialFiles!.fileReference,
      vendorAddress: data.vendorAddress,
      location: data.location!.code,
      minQty: data.qty,
      itemCode: data.sku!.id,
      unit: data.unit!,
      docId: data.docId,
      docType: data.docType,
      docDate: dayjs(data.docDate).format("DD-MM-YYYY"),
      cc: data.cc?.id || "",
    };
    setStep(2);

    dispatch(createMinAsync(updateddata)).then((response: any) => {
      if (response.payload.data.success) {
        dispatch(storeStepFormdata(data));
        dispatch(storeDraftMin(response.payload.data?.data));
        setStep(2);
      }
    });
  };

  useEffect(() => {
    dispatch(getVendorAsync(null));
    dispatch(getLocationAsync(null));
    dispatch(getSkuAsync(null));
    if (storeStep1formData) {
      setValue("vendorType", storeStep1formData?.vendorType);
      setValue("vendor", storeStep1formData?.vendor);
      setValue("vendorBranch", storeStep1formData?.vendorBranch);
      setValue("vendorAddress", parse(storeStep1formData?.vendorAddress || "").toString());
      setValue("sku", storeStep1formData?.sku);
      setValue("location", storeStep1formData?.location);
      setValue("qty", storeStep1formData?.qty);
      setValue("docDate", storeStep1formData?.docDate);
      setValue("docId", storeStep1formData?.docId);
      setValue("docType", storeStep1formData?.docType);
      setValue("cc", storeStep1formData?.cc);
      setUnit(storeStep1formData?.unit);
    }
  }, []);
  const fileUpload = (file: File[] | null) => {
    if (file) {
      const formdata = new FormData();
      formdata.append("file", file[0]);
      dispatch(uploadSerialFile(formdata)).then((res: any) => {
        if (res.payload.data.success) {
          setSerialFile(file);
          dispatch(storeSerialFile(res.payload.data?.data));
          showToast(res.payload.data.message, "success");
        }
      });
    }
  };

  const InvoiceFileUpload = () => {
    if (file && filename) {
      const formdata = new FormData();
      formdata.append("file", file[0]);
      formdata.append("fileName", filename);
      dispatch(uploadInvoiceFile(formdata)).then((res: any) => {
        if (res.payload.data.success) {
          dispatch(storeInvoiceFile(res.payload.data?.data[0]));

          showToast(res.payload.data.message, "success");
          setfile(null);
          setFilename("");
        }
      });
    } else {
      showToast("File and Document Name Required", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-[calc(100vh-50px)] ">
        <div className="p-0 bg-hbg h-[50px] flex items-center justify-between px-[20px] border-b border-neutral-300">
          <Typography fontWeight={500} fontSize={16}>
            Enter All Details
          </Typography>
          <Typography>{storeDraftMinData && "#" + storeDraftMinData?.min_no}</Typography>
        </div>
        <div className="h-[calc(100vh-150px)] grid grid-cols-[1fr_400px] p-0">
          <div className="flex flex-col gap-[20px] h-full overflow-y-auto p-[20px] border-r">
            <Paper sx={{ background: "#fef3c7", p: 2 }}>
              <div className="flex flex-row items-center gap-[10px]">
                <Icons.info color="warning" />
                <Typography fontSize={14}>Please fill in all the details carefully before proceeding to the next step. Every field is required.</Typography>
              </div>
            </Paper>

            <div className="grid grid-cols-2 gap-[20px] mt-[20px]">
              <div>
                <Controller
                  name="vendorType"
                  control={control}
                  rules={{ required: "Vendor Type is required" }}
                  render={({ field }) => (
                    <FormControl error={!!errors.vendorType} fullWidth>
                      <InputLabel id="demo-simple-select-label">Vendor Type</InputLabel>
                      <Select {...field} labelId="demo-simple-select-label" id="demo-simple-select" label="Vendor Type">
                        <MenuItem value={"V01"}>Vendor</MenuItem>
                      </Select>
                      {errors.vendorType && <span className=" text-[12px] text-red-500">{errors.vendorType.message}</span>}
                    </FormControl>
                  )}
                />
              </div>
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
                      error={!!errors.vendor}
                      helperText={errors.vendor?.message}
                    />
                  )}
                />
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
                              setValue("vendorAddress", replaceBrWithNewLine(response.payload.data?.data?.address) || "");
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
              <div>
                <TextField
                  focused={!!watch("vendorAddress")}
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors?.vendorAddress}
                  helperText={errors?.vendorAddress?.message}
                  label={"Vendor Address"}
                  className="resize-none h-[100px]"
                  {...register("vendorAddress", { required: "Vendor Address is required" })}
                />
              </div>
              <div>
                <Controller
                  name="sku"
                  control={control}
                  rules={{ required: "SKU is required" }}
                  render={({ field }) => (
                    <SelectDevice
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        dispatch(getUomBySku(value!.id)).then((response: any) => {
                          if (response.payload.data.success) {
                            setUnit(response.payload.data.data.unit);
                          }
                        });
                      }}
                      error={!!errors.sku}
                      helperText={errors.sku?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="qty"
                  control={control}
                  rules={{ required: "Qty is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.qty}>
                      <InputLabel id="demo-simple-select-label">Qty</InputLabel>
                      <OutlinedInput
                        label="Qty"
                        value={field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;

                          if (/^\d*$/.test(inputValue)) {
                            field.onChange(inputValue);
                          }
                        }}
                        endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
                      />
                      {errors.qty && <FormHelperText id="outlined-weight-helper-text">{errors.qty.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => <SelectLocationAcordingModule endPoint="/deviceMin/device-inward-location" {...field} error={!!errors.location} helperText={errors.location?.message} />}
                />
              </div>
              <Controller
                name="cc"
                control={control}
                rules={{ required: "Cost Center  is required" }}
                render={({ field }) => (
                  <SelectCostCenter
                    variant="outlined"
                    error={!!errors.cc}
                    helperText={errors.cc?.message}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      
                    }}
                    label="Cost Center"
                  />
                )}
              />
              <div>
                <Controller
                  name="docType"
                  control={control}
                  rules={{ required: "Document type is required" }}
                  render={({ field }) => (
                    <FormControl error={!!errors.docType} fullWidth>
                      <InputLabel id="demo-docType-select-label">Document type</InputLabel>
                      <Select {...field} labelId="demo-docType-select-label" id="demo-docType-select" label="Document type ">
                        <MenuItem value={"CHL"}>Challan</MenuItem>
                        <MenuItem value={"INV"}>Invoice</MenuItem>
                      </Select>
                      {errors.docType && <FormHelperText id="demo-docType-select-label">{errors.docType.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </div>
              <div>
                <TextField fullWidth error={!!errors.docId} helperText={errors.docId?.message} label="Document Id" {...register("docId", { required: "document Id is required" })} />
              </div>
              <div>
                <Controller
                  name="docDate"
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
                            error: !!errors.docDate,
                            helperText: errors.docDate?.message,
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
              </div>

              <div></div>
            </div>
          </div>
          <div className="h-full overflow-y-auto ">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" className="p-0 ">
                <AccordionTrigger className="hover:no-underline text-slate-600 h-[50px] px-[10px] data-[state=open]:bg-cyan-700 data-[state=open]:text-white">Upload Invoice</AccordionTrigger>
                <AccordionContent className="h-[calc(100vh-285px)] overflow-y-auto px-[10px] py-[30px] ">
                  <div className="grid ">
                    <div className=" flex flex-col gap-[30px]">
                      <div>
                        <TextField fullWidth label="Document Name" value={filename} onChange={(e) => setFilename(e.target.value)} />
                      </div>
                      <div>
                        <FileUploader
                          value={file}
                          acceptedFileTypes={{
                            "application/pdf": [], // PDF files
                            "text/plain": [], // Text files (.txt)
                            "text/csv": [], // CSV files
                            "application/vnd.ms-excel": [], // Excel files (.xls)
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // Excel files (.xlsx)
                          }}
                          onFileChange={(value) => setfile(value)}
                          loading={uploadInvoiceFileLoading}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <LoadingButton loadingPosition="start" loading={uploadInvoiceFileLoading} type="button" startIcon={<Icons.uploadfile />} variant="contained" onClick={InvoiceFileUpload}>
                          Upload
                        </LoadingButton>
                      </div>
                      <div>
                        <ul className="">
                          {storeInvoiceFiles &&
                            storeInvoiceFiles.map((item, i) => (
                              <li key={i} className="flex items-center justify-between py-[5px] border-b">
                                <span>{item.originalFileName}</span>
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    if (storeInvoiceFiles.length > 0) {
                                      const newfile = storeInvoiceFiles.filter((f) => f.fileID !== item.fileID);
                                      dispatch(storeInvoiceFile(newfile));
                                    }
                                  }}
                                >
                                  <Icons.delete />
                                </IconButton>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="hover:no-underline text-slate-600 h-[50px] px-[10px] data-[state=open]:bg-cyan-700 data-[state=open]:text-white">Upload Serial data</AccordionTrigger>
                <AccordionContent className="px-[10px] py-[20px]">
                  <FileUploader
                    success={!!storeSerialFiles}
                    disabled={!!storeSerialFiles}
                    value={serialfile}
                    acceptedFileTypes={{
                      "application/pdf": [],
                      "text/plain": [],
                      "text/csv": [],
                      "application/vnd.ms-excel": [],
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // Excel files (.xlsx)
                    }}
                    onFileChange={(value) => fileUpload(value)}
                    loading={uploadSerialFileLoading}
                    ondelete={() => {
                      setSerialFile(null);
                      dispatch(resetSerialFile());
                    }}
                  />
                  {/* <div>
                    <FileUploader
                      value={null}
                      onValueChange={(value) => fileUpload(value)}
                      dropzoneOptions={{
                        multiple: true,
                        maxFiles: 1,
                        accept: {
                          "application/vnd.ms-excel": [], // Excel files (.xls)
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // Excel files (.xlsx)
                        },
                      }}
                      className={`relative p-2 border-2 border-dashed rounded-lg bg-background border-slate-300 `}
                    >
                      <FileInput loading={uploadSerialFileLoading} className="outline-dashed outline-1 outline-white">
                        <div className="flex flex-col items-center justify-center w-full pt-3 pb-4 text-slate-400 gap-[20px]">
                          {uploadSerialFileLoading ? <CgSpinner className="h-[50px] w-[50px] text-slate-400 animate-spin" /> : <MdFileCopy className="h-[50px] w-[50px] text-slate-400" />}

                          <p>
                            <strong>Drag and drop</strong> files here or click to select
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        <p>{storeSerialFiles?.fileName}</p>
                      </FileUploaderContent>
                    </FileUploader>
                  </div> */}
                  <div className="mt-[20px] text-cyan-600 hover:underline">
                    <a href="https://res.cloudinary.com/hrmscloud/raw/upload/v1727008397/PROJECTS/BPe/device-sample-serial-upload.xlsx">
                      Sample File <br /> <span className="text-[13px]">8.74 KB (8,956 bytes)</span>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="p-0 h-[50px] flex items-center bg-hbg justify-end px-[20px] gap-[10px] border-t border-neutral-300">
          {storeStep1formData ? (
            <LoadingButton type="button" onClick={() => setStep(2)} loading={createMinLoading} variant="contained" endIcon={<FaArrowRightLong className="h-[18px] w-[18px]" />}>
              Next 
            </LoadingButton>
          ) : (
            <LoadingButton type="submit" loading={createMinLoading} variant="contained" endIcon={<FaArrowRightLong className="h-[18px] w-[18px]" />}>
              Next
            </LoadingButton>
          )}
        </div>
      </div>
    </form>
  );
};

export default DeviceMinStep1;
