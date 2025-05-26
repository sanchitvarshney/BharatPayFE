import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Stepper,
  StepLabel,
  Step,
  Skeleton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState, useMemo } from "react";
import { showToast } from "@/utils/toasterContext";
import {
  fetchDataForMIN,
  submitPOMIN,
  uploadMinInvoice,
} from "@/features/procurement/poSlices";
import MINFromPOTextInputCellRenderer from "@/table/Cellrenders/MINFromPOTextInputCellRenderer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/Fileupload";
import { LoadingButton } from "@mui/lab";
import { IoCloudUpload } from "react-icons/io5";
import FullPageLoading from "@/components/shared/FullPageLoading";
import AntLocationSelectAcordinttoModule from "@/components/reusable/antSelecters/AntLocationSelectAcordinttoModule";
import Success from "@/components/reusable/Success";

const VendorDetailSkeleton = () => (
  <div className="space-y-5 mb-8">
    <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width={60} />
          <Skeleton variant="text" width={120} />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton variant="text" width={70} />
          <Skeleton variant="text" width="100%" height={40} />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width={50} />
          <Skeleton variant="text" width={100} />
        </div>
      </div>
    </div>
    <div className="bg-slate-50 p-4 rounded-lg shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={60} />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={60} />
      </div>
    </div>
    <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
      <Typography
        variant="subtitle2"
        className="text-slate-600 mb-3 font-semibold"
      >
        Invoice & Location
      </Typography>
      <div className="flex flex-col gap-3">
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={40} />
      </div>
    </div>
  </div>
);

const TaxDetailSkeleton = () => (
  <Card className="border-0 rounded-lg shadow bg-slate-50">
    <CardContent className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={180} />
        <Skeleton variant="text" width={80} />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={80} />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={80} />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={60} />
        <Skeleton variant="text" width={80} />
      </div>
      <Divider className="my-2" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={180} />
        <Skeleton variant="text" width={80} />
      </div>
    </CardContent>
  </Card>
);

const MINFromPO = () => {
  const [rowData, setRowData] = useState<any>([]);
  const [poNumber, setPoNumber] = useState("");
  const [vendorData, setVendorData] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [url, setUrl] = useState<string>("");
  const [location, setLocation] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [minMessage, setMinMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["PO Details", "Submit"];

  const { loading, submitPOMINLoading } = useAppSelector((state) => state.po);

  const dispatch = useAppDispatch();
  const components = useMemo(
    () => ({
      textInputCellRenderer: (params: any) => (
        <MINFromPOTextInputCellRenderer props={params} />
      ),
    }),
    []
  );
  console.log(rowData);
  const handleSearchPO = async () => {
    dispatch(fetchDataForMIN(poNumber.trim())).then((res: any) => {
      if (res.payload.data.success) {
        const materials = res.payload.data.data.materials;
        setRowData(
          materials.map((item: any) => ({
            partComponent: {
              lable: "( " + item.c_partno + " ) " + item.component_shortname,
              value: item.componentKey,
            },
            qty: Number(item.orderqty) || 0,
            updaterow: item.access_code,
            rate: Number(item.orderrate) || 0,
            taxableValue: Number(item.totalValue) || 0,
            foreignValue: Number(item.usdValue),
            hsnCode: item.hsncode,
            gstType: item.gsttype,
            gstRate: Number(item.gstrate),
            cgst: Number(item.cgst) || 0,
            sgst: Number(item.sgst) || 0,
            igst: Number(item.igst) || 0,
            remarks: item.remark,
            currency: {
              value: item.header?.currency?.value,
              label: item.header?.currency?.label,
            },
            isNew: true,
            excRate: item.header?.exchangerate || 1,
            uom: item.uom,
          }))
        );
        setMaterials(res.payload.data.data.materials);
        setVendorData(res.payload.data.data.vendor_type);
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  const handleFileChange = async (files: File[] | null) => {
    setFiles(files);
  };
  console.log(url);
  const uploadDocs = async () => {
    setUploadLoading(true);
    if (!files && files === null) {
      // toast({
      //   title: "No file selected",
      //   className: "bg-red-600 text-white items-center",
      // });
      setUploadLoading(false);
    }

    try {
      if (files && files.length > 0) {
        dispatch(uploadMinInvoice({ files: files[0] }))
          .then((res) => {
            console.log(res);
            if (res.payload?.success) {
              setUrl(res.payload?.data[0]?.url);
              // toast({
              //   title: res.payload?.message,
              //   className: "bg-green-600 text-white items-center",
              // });
              setUploadLoading(false);
              setSheetOpen(false);
            }
          })
          .catch((error) => {
            console.error("Error uploading docs:", error);
            // toast({
            //   title: "Error uploading docs",
            //   className: "bg-red-600 text-white items-center",
            // });
            setUploadLoading(false);
            setSheetOpen(false);
            setFiles([]);
          });
      }
    } catch (error) {
      console.error("Error uploading docs:", error);
      // toast({
      //   title: "Error uploading docs",
      //   className: "bg-red-600 text-white items-center",
      // });
      setUploadLoading(false);
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 50,
      pinned: "left",
    },
    {
      headerName: "",
      field: "excRate",
      cellRenderer: "textInputCellRenderer",
      hide: true,
    },
    {
      headerName: "Part Component",
      field: "partComponent.lable",
      minWidth: 300,
    },
    {
      headerName: "Qty",
      field: "qty",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Rate",
      field: "rate",
      cellRenderer: "textInputCellRenderer",
      width: 200,
    },
    // {
    //   headerName: "",
    //   field: "currency",
    //   cellRenderer: "textInputCellRenderer",
    //   width: 80,
    // },
    {
      headerName: "Taxable Value",
      field: "taxableValue",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Foreign Value",
      field: "foreignValue",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "HSN Code",
      field: "hsnCode",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "GST Type",
      field: "gstType",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "GST Rate",
      field: "gstRate",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "CGST",
      field: "cgst",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "SGST",
      field: "sgst",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "IGST",
      field: "igst",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "uom",
      field: "uom",

      hide: true,
    },
  ];

  const totalValue = Number(materials[0]?.totalValue || 0);
  const cgst = Number(materials[0]?.cgst || 0);
  const sgst = Number(materials[0]?.sgst || 0);
  const igst = Number(materials[0]?.igst || 0);
  const afterTax = totalValue + cgst + sgst + igst;

  const handleSubmit = async () => {
    if (!poNumber || !invoiceNo || !invoiceDate || !url) {
      showToast("Please fill all required fields and upload invoice", "error");
      return;
    }

    if (rowData.length === 0) {
      showToast("No items to submit", "error");
      return;
    }
    try {
      const submitData = {
        poid: poNumber,
        invoice: invoiceNo,
        location: location?.value || "",
        invoiceAttachment: Array(url),
        invoiceDate: invoiceDate,
        access_code: rowData.map((row: any) => row.updaterow),
        component: rowData.map((row: any) => row.partComponent.value),
        qty: rowData.map((row: any) => row.qty.toString()),
        rate: rowData.map((row: any) => row.rate.toString()),
        gstrate: rowData.map((row: any) => row.gstRate.toString()),
        gsttype: rowData.map((row: any) => row.gstType),
        hsnCode: rowData.map((row: any) => row.hsnCode),
      };
      dispatch(submitPOMIN(submitData)).then((res: any) => {
        if (res.payload.data.success) {
          showToast(res.payload.data.message, "success");
          setMinMessage(res.payload.data.message);
          setRowData([]);
          setPoNumber("");
          setInvoiceNo("");
          setInvoiceDate("");
          setUrl("");
          setLocation(null);
          setVendorData(null);
          setMaterials([]);
          setActiveStep(1);
        }
      });
      console.log("Submit Data:", submitData);
    } catch (error) {
      console.error("Error submitting data:", error);
      showToast("Failed to submit data", "error");
    }
  };

  return (
    <div>
      <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
        <Stepper activeStep={activeStep} className="w-full">
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      {activeStep === 0 && (
        <div className="minfrompo-root flex bg-white h-[calc(100vh-100px)]">
          {/* {loading && <FullPageLoading />} */}
          {/* Left Panel */}
          <div className="minfrompo-left flex flex-col border-r border-neutral-300 min-w-[350px] max-w-[400px] bg-gray-50 h-[calc(100vh-100px)]">
            <div className="overflow-y-auto flex-1 p-6">
              <Card
                variant="outlined"
                className="bg-white shadow-md rounded-xl"
              >
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    className="text-slate-700 mb-6 sticky top-0 bg-white z-10"
                  >
                    Vendor Detail
                  </Typography>
                  {loading ? (
                    <>
                      <VendorDetailSkeleton />
                      <Divider className="my-6" />
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        className="text-slate-700 mb-6 sticky top-0 bg-white z-10"
                      >
                        Tax Detail
                      </Typography>
                      <TaxDetailSkeleton />
                    </>
                  ) : (
                    <>
                      <div className="space-y-5 mb-8">
                        <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 font-medium">
                                Name:
                              </span>
                              <span className="text-slate-900 font-semibold">
                                {vendorData?.vendorname || "-"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-slate-600 font-medium">
                                Address:
                              </span>
                              <span className="text-slate-900 font-semibold break-words">
                                {vendorData?.vendoraddress || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 font-medium">
                                GSTIN:
                              </span>
                              <span className="text-slate-900 font-semibold">
                                {vendorData?.gstin || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg shadow-sm flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">
                              Currency:
                            </span>
                            <span className="text-slate-900 font-semibold">
                              {vendorData?.currency_symbol || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">
                              Exchange Rate:
                            </span>
                            <span className="text-slate-900 font-semibold">
                              {vendorData?.exchange_rate || "-"}
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
                          <Typography
                            variant="subtitle2"
                            className="text-slate-600 mb-3 font-semibold"
                          >
                            Invoice & Location
                          </Typography>
                          <div className="flex flex-col gap-3">
                            <TextField
                              label="Invoice No."
                              value={invoiceNo}
                              onChange={(e) => setInvoiceNo(e.target.value)}
                              required
                              size="small"
                              fullWidth
                              className="bg-white"
                              variant="standard"
                            />
                            <TextField
                              label="Invoice Date"
                              type="date"
                              value={invoiceDate}
                              onChange={(e) => setInvoiceDate(e.target.value)}
                              required
                              size="small"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              className="bg-white"
                              variant="standard"
                            />
                            <AntLocationSelectAcordinttoModule
                              endpoint="/transaction/rm-inward-location"
                              onChange={setLocation}
                              value={location}
                              label="Select Location"
                            />
                          </div>
                        </div>
                      </div>
                      <Divider className="my-6" />
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        className="text-slate-700 mb-6 sticky top-0 bg-white z-10"
                      >
                        Tax Detail
                      </Typography>
                      <Card className="border-0 rounded-lg shadow bg-slate-50">
                        <CardContent className="flex flex-col gap-4 p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">
                              Sub-Total value before Taxes
                            </span>
                            <span className="text-slate-900 font-semibold">
                              {totalValue.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">
                              CGST
                            </span>
                            <span className="text-slate-900 font-semibold">
                              (+) {cgst.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">
                              SGST
                            </span>
                            <span className="text-slate-900 font-semibold">
                              (+) {sgst.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">
                              IGST
                            </span>
                            <span className="text-slate-900 font-semibold">
                              (+) {igst.toFixed(2)}
                            </span>
                          </div>
                          <Divider className="my-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-slate-700 font-bold">
                              Sub-Total values after Taxes
                            </span>
                            <span className="text-slate-900 font-bold">
                              {afterTax.toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Right Panel */}
          <div className="flex-1 flex flex-col p-8">
            <div className="flex justify-between gap-2 mb-6 w-full">
              <div className="flex gap-2">
                <TextField
                  fullWidth
                  label="PO Number"
                  size="small"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                />
                <LoadingButton
                  variant="contained"
                  onClick={handleSearchPO}
                  loading={loading}
                >
                  Search
                </LoadingButton>
              </div>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<UploadFileIcon />}
                onClick={() => setSheetOpen(true)}
                className="w-40"
              >
                Upload Docs
              </Button>
            </div>
            <div className="ag-theme-quartz rounded shadow h-[calc(100vh-150px)] bg-white">
              <AgGridReact
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
                suppressCellFocus={true}
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                components={components}
              />
            </div>
            <div className="flex justify-end mt-4">
              <LoadingButton
                variant="contained"
                color="primary"
                loading={submitPOMINLoading}
                onClick={handleSubmit}
                className="w-40"
              >
                Submit
              </LoadingButton>
            </div>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent
              className="min-w-[35%] p-0"
              onInteractOutside={(e: any) => {
                e.preventDefault();
              }}
            >
              <SheetHeader className="h-[50px] p-0 flex flex-col justify-center px-[20px] bg-zinc-200 gap-0 border-b border-zinc-400">
                <SheetTitle className="text-slate-600">
                  Upload Docs here
                </SheetTitle>
              </SheetHeader>
              <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
                <FileUploader
                  value={files}
                  onValueChange={handleFileChange}
                  dropzoneOptions={{
                    accept: {
                      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
                    },
                    maxFiles: 5,
                    maxSize: 4 * 1024 * 1024, // 4 MB
                    multiple: true,
                  }}
                >
                  <div className="bg-white border border-gray-300 rounded-lg shadow-lg h-[120px] p-[20px] m-[20px]">
                    <h2 className="text-xl font-semibold text-center mb-4">
                      <div className="text-center w-full justify-center flex">
                        <div>Upload Your Files</div>
                        <div>
                          <IoCloudUpload
                            className="text-cyan-700 ml-5 h-[20]"
                            size={"1.5rem"}
                          />
                        </div>
                      </div>
                    </h2>
                    <FileInput>
                      <span className="text-slate-500 text-sm text-center w-full justify-center flex">
                        Drag and drop files here, or click to select files
                      </span>
                    </FileInput>
                  </div>
                  <div className="m-[20px]">
                    <FileUploaderContent>
                      {files?.map((file, index) => (
                        <FileUploaderItem key={index} index={index}>
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                    </FileUploaderContent>
                  </div>
                </FileUploader>
              </div>
              <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
                <Button
                  className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
                  onClick={() => setSheetOpen(false)}
                >
                  Back
                </Button>
                <LoadingButton
                  onClick={uploadDocs}
                  sx={{
                    backgroundColor: "#217346",
                    "&:hover": {
                      backgroundColor: "#2fa062",
                    },
                    color: "white",
                  }}
                  variant="contained"
                  loading={uploadLoading}
                >
                  Upload
                </LoadingButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
      {activeStep === 1 && (
        <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-white">
          <div className="flex flex-col justify-center gap-[10px]">
            <Success />
            <Typography variant="inherit" fontWeight={500}>
              {minMessage}
            </Typography>
            <LoadingButton onClick={() => setActiveStep(0)} variant="contained">
              Create New PO MIN
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default MINFromPO;
