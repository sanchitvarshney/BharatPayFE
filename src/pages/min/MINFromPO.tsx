import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import { DeviceType } from "@/components/reusable/SelectSku";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useState, useMemo } from "react";
import { showToast } from "@/utils/toasterContext";
import { fetchDataForMIN, uploadMinInvoice } from "@/features/procurement/poSlices";
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

type FormData = {
  product: DeviceType | null;
  toLocation: any;
  fromLocation: any;
  fromBranch: any;
  toBranch: any;
  quantity: number;
  remark: string;
  cc: CostCenterType | null;
  type: string;
  branchType: string;
  fromLocationName: string;
  toLocationName: string;
};

const MINFromPO = () => {
  const [rowData, setRowData] = useState<any>([]);
  const [formData, setFormData] = useState<FormData>({
    product: null,
    toLocation: null,
    fromLocation: null,
    fromBranch: null,
    toBranch: null,
    quantity: 0,
    remark: "",
    cc: null,
    type: "",
    branchType: "",
    fromLocationName: "",
    toLocationName: "",
  });
  const [poNumber, setPoNumber] = useState("");
  const [vendorData, setVendorData] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [url , setUrl] = useState<string>("");

  const { loading } = useAppSelector(
    (state) => state.po
  );

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
console.log(url)
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
            console.log(res)
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
      cellRenderer: "textInputCellRenderer",
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
      headerName: "Location",
      field: "location",
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

  return (
    <div className="minfrompo-root flex bg-white h-[calc(100vh-60px)]">
      {loading && <FullPageLoading/>}
      {/* Left Panel */}
      <div className="minfrompo-left flex flex-col gap-6 border-r border-neutral-300 p-6 min-w-[350px] max-w-[400px] bg-gray-50">
        <Card variant="outlined" className="bg-white">
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="h6" fontWeight={700}>
                Vendor Detail
              </Typography>
            </div>
            <div className="space-y-2 mb-4">
              <div>
                <b>Name:</b> {vendorData?.vendorname || "-"}
              </div>
              <div>
                <b>Address:</b> {vendorData?.vendoraddress || "-"}
              </div>
              <div>
                <b>GSTIN:</b> {vendorData?.gstin || "-"}
              </div>
              <div>
                <b>Currency:</b>{" "}
                {vendorData?.currencyData?.currency_symbol || "-"}
              </div>
              <div>
                <b>Exchange Rate:</b> {vendorData?.exchange_rate || "-"}
              </div>
              <div className="flex gap-2 mt-2">
                <TextField
                  label="Invoice No."
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  required
                  size="small"
                  fullWidth
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
                />
              </div>
            </div>
            <Divider className="my-4" />
            <Typography fontWeight={600} fontSize={16} mb={1}>
              Tax Detail
            </Typography>
            <Card className="border-0 rounded-none shadow-none">
              <CardContent className="flex flex-col gap-[20px] pt-[20px] ">
                <div className="flex justify-between">
                  <p className="text-slate-600 font-[500]">
                    Sub-Total value before Taxes
                  </p>
                  <p className="text-[14px] text-muted-foreground">
                    {totalValue.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-600 font-[500]">CGST</p>
                  <p className="text-[14px] text-muted-foreground">
                    (+) {cgst.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-600 font-[500]">SGST</p>
                  <p className="text-[14px] text-muted-foreground">
                    (+) {sgst.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-600 font-[500]">IGST</p>
                  <p className="text-[14px] text-muted-foreground">
                    (+) {igst.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-600 font-[500]">
                    Sub-Total values after Taxes
                  </p>
                  <p className="text-[14px] text-muted-foreground">
                    {afterTax.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
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
            <Button variant="contained" onClick={handleSearchPO}>
              Search
            </Button>
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
        <div className="ag-theme-quartz rounded shadow h-[calc(100vh-250px)] bg-white">
          <AgGridReact
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            components={components}
          />
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
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
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
  );
};

export default MINFromPO;
