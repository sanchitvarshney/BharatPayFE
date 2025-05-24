import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { CostCenterType } from "@/components/reusable/SelectCostCenter";
import { DeviceType } from "@/components/reusable/SelectSku";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useRef, useMemo } from "react";
import { showToast } from "@/utils/toasterContext";
import { getDeviceDetails } from "@/features/production/Batteryqc/BatteryQcSlice";
import { Icons } from "@/components/icons";
import dayjs from "dayjs";
import { fetchDataForMIN } from "@/features/procurement/poSlices";
import MINFromPOTextInputCellRenderer from "@/table/Cellrenders/MINFromPOTextInputCellRenderer";

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
  const [imei, setImei] = useState<string>("");
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { deviceDetailLoading } = useAppSelector(
    (state) => state.batteryQcReducer
  );
  console.log(materials,vendorData);
  const handleImeiEnter = (imei: string) => {
    dispatch(
      getDeviceDetails({
        imei: imei,
        deviceType: formData.type,
      })
    ).then((res: any) => {
      if (res.payload.data.success) {
        setImei("");
        const newRowData = res?.payload?.data?.data?.map((device: any) => {
          return {
            imei: device.device_imei || device.imei_no1 || "",
            srno: device.sl_no || "",
            modalNo: device?.p_name || "",
            deviceSku: device?.device_sku || "",
            productKey: device?.product_key || "",
            imei2: device?.imei_no2 || "",
          };
        });
        setRowData((prevRowData: any) => [...newRowData, ...prevRowData]);
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };
console.log(rowData);
  const components = useMemo(
    () => ({
      textInputCellRenderer: (params: any) => <MINFromPOTextInputCellRenderer props={params} />,
      
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await fetch("/api/upload-docs", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
    } finally {
      setUploading(false);
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
      {/* Left Panel */}
      <div className="minfrompo-left flex flex-col gap-6 border-r border-neutral-300 p-6 min-w-[350px] max-w-[400px] bg-gray-50">
        <Card variant="outlined" className="bg-white">
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="h6" fontWeight={700}>
                Vendor Detail
              </Typography>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<UploadFileIcon />}
                onClick={handleUploadClick}
                disabled={uploading}
                style={{ minWidth: 120 }}
              >
                {uploading ? "Uploading..." : "Upload Docs"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
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
        <div className="flex gap-2 mb-6 max-w-lg">
          <TextField fullWidth label="PO Number" size="small" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
          <Button variant="contained" onClick={handleSearchPO}>
            Search
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
    </div>
  );
};

export default MINFromPO;
