import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "@/components/reusable/CustomButton";
import { FaArrowRightLong } from "react-icons/fa6";
import CustomInput from "@/components/reusable/CustomInput";
import CustomSelect from "@/components/reusable/CustomSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import CustomDatePicker from "@/components/reusable/CustomDatePicker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/utils/toastUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { SingleValue } from "react-select";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { transformGroupSelectData } from "@/utils/transformUtills";
import { HiMiniTrash } from "react-icons/hi2";
import parse from "html-react-parser";
import {
  createMinAsync,
  getLocationAsync,
  getSkuAsync,
  getUomBySku,
  getVendorAddress,
  getVendorAsync,
  getVendorBranchAsync,
  storeDraftMin,
  storeInvoiceFile,
  storeSerialFile,
  storeStepFormdata,
  uploadInvoiceFile,
  uploadSerialFile,
} from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { FileInput, FileUploader, FileUploaderContent } from "@/components/ui/Fileupload";
import { MdFileCopy } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { CreateMinPayload, Step1Form } from "@/features/wearhouse/Divicemin/DeviceMinType";
import { IoMdCloudUpload } from "react-icons/io";

type OptionType = {
  value: string;
  label: string;
};

type Props = {
  setStep: (step: number) => void;
  step?: number;
};
const DeviceMinStep1: React.FC<Props> = ({ setStep }) => {
  const [unit, setUnit] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [file, setfile] = useState<File[] | null>(null);

  const dispatch = useAppDispatch();
  const {
    storeStep1formData,
    storeDraftMinData,
    storeInvoiceFiles,
    storeSerialFiles,
    getLocationLoading,
    getVendorBranchLoading,
    uploadSerialFileLoading,
    getVendorLoading,
    VendorData,
    locationData,
    VendorBranchData,
    uploadInvoiceFileLoading,
    skuLoading,
    skuData,
    createMinLoading,
  } = useAppSelector((state) => state.divicemin);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Step1Form>({
    defaultValues: {
      vendorType: { value: "V01", label: "Vendor" },
      vendor: null,
      vendorBranch: null,
      vendorAddress: "",
      sku: null,
      location: null,
      qty: "",
      docDate: "",
      unit: "",
      docId: "",
      docType: null,
    },
  });

  const onSubmit: SubmitHandler<Step1Form> = (data) => {
    data.unit = unit;
    if (!storeSerialFiles) showToast({ title: "Please Upload Serial File", variant: "destructive" });
    if (!storeInvoiceFiles) showToast({ title: "Please Upload Invoice File", variant: "destructive" });
    const updateddata: CreateMinPayload = {
      vendorBranch: data.vendorBranch!.value,
      vendorCode: data.vendor!.value,
      vendorType: data.vendorType!.value,
      invoiceAttachment: storeInvoiceFiles!,
      fileReference: storeSerialFiles!.fileReference,
      vendorAddress: data.vendorAddress,
      location: data.location!.value,
      minQty: data.qty,
      itemCode: data.sku!.value,
      unit: data.unit!,
      docId: data.docId,
      docType: data.docType!.value,
      docDate: moment(data.docDate).format("DD-MM-YYYY"),
    };

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
      setUnit(storeStep1formData?.unit);
    }
  }, []);
  const fileUpload = (file: File[] | null) => {
    if (file) {
      const formdata = new FormData();
      formdata.append("file", file[0]);
      dispatch(uploadSerialFile(formdata)).then((res: any) => {
        if (res.payload.data.success) {
          dispatch(storeSerialFile(res.payload.data?.data));
          showToast({
            title: "Success",
            description: res.payload.data.message,
            variant: "success",
          });
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="h-[calc(100vh-70px)]">
        <CardHeader className="p-0 bg-hbg h-[60px] flex-row items-center justify-between px-[20px]">
          <CardTitle>Enter All Details</CardTitle>
          <p className="font-[600] text-slate-600 text-[18px]">{storeDraftMinData && "#" + storeDraftMinData?.min_no}</p>
        </CardHeader>
        <CardContent className="h-[calc(100vh-180px)] grid grid-cols-[1fr_400px] p-0">
          <div className="flex flex-col gap-[20px] h-full overflow-y-auto p-[20px] border-r">
            <Alert className="bg-amber-100 border-amber-200 mt-[20px] ">
              <div className="flex flex-row items-center gap-[10px]">
                <Info className="w-4 h-4" />
                <AlertDescription>Please fill in all the details carefully before proceeding to the next step. Every field is required.</AlertDescription>
              </div>
            </Alert>

            <div className="grid grid-cols-2 gap-[50px] mt-[20px]">
              <div>
                <Controller
                  name="vendorType"
                  control={control}
                  rules={{ required: "Vendor Type is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      defaultValue={{ value: "V01", label: "Vendor" }}
                      options={[{ value: "V01", label: "Vendor" }]}
                      required
                      value={field.value}
                      isClearable={true}
                      onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                      placeholder={"Vendor Type"}
                    />
                  )}
                />
                {errors.vendorType && <span className=" text-[12px] text-red-500">{errors.vendorType.message}</span>}
              </div>
              <div>
                <Controller
                  name="vendor"
                  control={control}
                  rules={{ required: "Vendor is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      isLoading={getVendorLoading}
                      options={transformGroupSelectData(VendorData)}
                      {...field}
                      required
                      value={field.value}
                      isClearable={true}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption as SingleValue<OptionType>);
                        dispatch(getVendorBranchAsync(selectedOption!.value));
                      }}
                      placeholder={"Vendor"}
                      onInputChange={(value) => {
                        if (debounceTimeout.current) {
                          clearTimeout(debounceTimeout.current);
                        }

                        debounceTimeout.current = setTimeout(() => {
                          dispatch(getVendorAsync(!value ? null : value));
                        }, 500);
                      }}
                    />
                  )}
                />
                {errors.vendor && <span className=" text-[12px] text-red-500">{errors.vendor.message}</span>}
              </div>
              <div>
                <Controller
                  name="vendorBranch"
                  control={control}
                  rules={{ required: "Vendor Branch is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      options={transformGroupSelectData(VendorBranchData)}
                      isLoading={getVendorBranchLoading}
                      {...field}
                      required
                      value={field.value}
                      isClearable={true}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption as SingleValue<OptionType>);
                        dispatch(getVendorAddress(selectedOption!.value)).then((response: any) => {
                          if (response.payload.data.success) {
                            setValue("vendorAddress", response.payload.data?.data?.address?.replace("</br>", ""));
                          }
                        });
                      }}
                      placeholder={"Vendor Branch"}
                    />
                  )}
                />
                {errors.vendorBranch && <span className=" text-[12px] text-red-500">{errors.vendorBranch.message}</span>}
              </div>
              <div>
                <Label className="text-slate-500">Vendor Address</Label>
                <Textarea className="resize-none h-[100px]" {...register("vendorAddress", { required: "Vendor Address is required" })} />
                {errors.vendorAddress && <span className=" text-[12px] text-red-500">{errors.vendorAddress.message}</span>}
              </div>
              <div>
                <Controller
                  name="sku"
                  control={control}
                  rules={{ required: "SKU is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      options={transformGroupSelectData(skuData)}
                      isLoading={skuLoading}
                      {...field}
                      required
                      value={field.value}
                      isClearable={true}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption as SingleValue<OptionType>);
                        dispatch(getUomBySku(selectedOption!.value)).then((response: any) => {
                          if (response.payload.data.success) {
                            setUnit(response.payload.data.data.unit);
                          }
                        });
                      }}
                      placeholder={"SKU"}
                      onInputChange={(value) => {
                        if (debounceTimeout.current) {
                          clearTimeout(debounceTimeout.current);
                        }
                        debounceTimeout.current = setTimeout(() => {
                          dispatch(getSkuAsync(!value ? null : value));
                        }, 500);
                      }}
                    />
                  )}
                />
                {errors.sku && <span className=" text-[12px] text-red-500">{errors.sku.message}</span>}
              </div>

              <div>
                <div className="flex items-end w-full">
                  <CustomInput min={0} required type="number" label={"Qty"} className="w-full" {...register("qty", { required: "Qty is required" })} />
                  <div className="h-[35px] w-[70px] bg-slate-200 flex justify-center items-center">{unit}</div>
                </div>
                {errors.qty && <span className=" text-[12px] text-red-500">{errors.qty.message}</span>}
              </div>
              <div>
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      options={transformGroupSelectData(locationData)}
                      isLoading={getLocationLoading}
                      {...field}
                      required
                      value={field.value}
                      isClearable={true}
                      onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                      placeholder={"Location"}
                      onInputChange={(value) => {
                        if (debounceTimeout.current) {
                          clearTimeout(debounceTimeout.current);
                        }
                        debounceTimeout.current = setTimeout(() => {
                          dispatch(getLocationAsync(!value ? null : value));
                        }, 500);
                      }}
                    />
                  )}
                />
                {errors.location && <span className=" text-[12px] text-red-500">{errors.location.message}</span>}
              </div>
              <div>
                <Controller
                  name="docType"
                  control={control}
                  rules={{ required: "Document type is required" }}
                  render={({ field }) => (
                    <CustomSelect
                      options={[
                        { value: "CHL", label: "Challan" },
                        { value: "INV", label: "Invoice" },
                      ]}
                      {...field}
                      required
                      value={field.value}
                      isClearable={true}
                      onChange={(selectedOption) => field.onChange(selectedOption as SingleValue<OptionType>)}
                      placeholder={"Document type"}
                    />
                  )}
                />
                {errors.docType && <span className=" text-[12px] text-red-500">{errors.docType.message}</span>}
              </div>
              <div>
                <CustomInput required label="Document Id" {...register("docId", { required: "document Id is required" })} />
                {errors.docId && <span className=" text-[12px] text-red-500">{errors.docId.message}</span>}
              </div>
              <div>
                <Controller
                  name="docDate"
                  control={control}
                  rules={{ required: "Document Date is required" }}
                  render={({ field }) => (
                    <CustomDatePicker
                      label="Document Date"
                      className="w-full"
                      onDateChange={(e) => {
                        const date = new Date(e!.toString());
                        const formattedDate = moment(date).format("DD-MM-YYYY");
                        field.onChange(formattedDate); // Update form state
                      }}
                    />
                  )}
                />
                {errors.docDate && <span className=" text-[12px] text-red-500">{errors.docDate.message}</span>}
              </div>

              <div></div>
            </div>
          </div>
          <div className="h-full overflow-y-auto ">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" className="p-0 ">
                <AccordionTrigger className="hover:no-underline text-slate-600 h-[50px] px-[10px] data-[state=open]:bg-cyan-700 data-[state=open]:text-white">Upload Invoice</AccordionTrigger>
                <AccordionContent className="h-[calc(100vh-285px)] overflow-y-auto px-[10px] py-[30px] bg-zinc-100">
                  <div className="grid ">
                    <div className=" flex flex-col gap-[30px]">
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
                      <div className="flex items-center justify-center">
                        <CustomButton loading={uploadInvoiceFileLoading} type="button" icon={<IoMdCloudUpload className="h-[20px] w-[20px]" />} className="bg-cyan-700 hover:bg-cyan-800" onClick={InvoiceFileUpload}>
                          Upload
                        </CustomButton>
                      </div>
                      <div>
                        <ul className="">
                          {storeInvoiceFiles &&
                            storeInvoiceFiles.map((item, i) => (
                              <li key={i} className="flex items-center justify-between py-[5px] border-b">
                                <span>{item.originalFileName}</span>
                                <HiMiniTrash className="h-[20px] w-[20px] text-red-500 cursor-pointer" />
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
                  <div>
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
                  </div>
                  <div className="mt-[20px] text-cyan-600 hover:underline">
                    <a href="https://res.cloudinary.com/hrmscloud/raw/upload/v1727008397/PROJECTS/BPe/device-sample-serial-upload.xlsx">
                      Sample File <br /> <span className="text-[13px]">8.74 KB (8,956 bytes)</span>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter className="p-0 h-[50px] flex items-center bg-hbg justify-end px-[20px] gap-[10px]">
          <CustomButton loading={createMinLoading} className="bg-cyan-700 hover:bg-cyan-800 flex items-center gap-[5px]">
            Next <FaArrowRightLong className="h-[18px] w-[18px]" />
          </CustomButton>
        </CardFooter>
      </Card>
    </form>
  );
};

export default DeviceMinStep1;
