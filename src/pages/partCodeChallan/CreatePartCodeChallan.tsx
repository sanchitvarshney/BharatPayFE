import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import MaterialInvardUploadDocumentDrawer from "@/components/Drawers/wearhouse/MaterialInvardUploadDocumentDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { clearaddressdetail, getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  resetDocumentFile,
  resetFormData,
} from "@/features/wearhouse/Rawmin/RawMinSlice";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import {
  Autocomplete,
  Divider,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icons } from "@/components/icons";
import { showToast } from "@/utils/toasterContext";
import ConfirmationModel from "@/components/reusable/ConfirmationModel";
import { Button } from "@/components/ui/button";
import Success from "@/components/reusable/Success";
import { getClient, getShippingAddress } from "@/features/master/client/clientSlice";
import { getClientBranch } from "@/features/Dispatch/DispatchSlice";
import AddPOTable, { RowData } from "./AddPartCodeTable";
import {
  isBillToZeroGst,
  recomputePartCodeRowGst,
  ZERO_GST_BILL_TO_MATCH,
} from "./partCodeChallanGst";
import {
  createPartCodeChallan,
  getPartCodeChallanDetail,
  getPartCodeChallanNo,
  setFormData,
  updatePartCodeChallan,
} from "@/features/procurement/poSlices";
import { useNavigate, useParams } from "react-router-dom";
import FullPageLoading from "@/components/shared/FullPageLoading";
import SelectLocationAcordingModule, {
  LocationType,
} from "@/components/reusable/SelectLocationAcordingModule";

interface Totals {
  totalAmount?: number;
  taxableAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

interface dispatchFromaddress {
  id: number;
  city: string;
  gst: string;
  pin: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  label: string;
}

interface ShippingAddress {
  id: number;
  pin: string;
  gst: string;
  pan: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  label: string;
}

type BillToAddress = dispatchFromaddress;

interface FormData {
  location: string;
  pickLocation: LocationType | null;
  dropLocation: LocationType | null;
  dispatchFromaddressid: 0;
  dispatchFromaddress: dispatchFromaddress;
  billToClientid: string;
  billToBranchid: string;
  billToaddress: BillToAddress;
  shipaddressid: 0;
  shipaddress: ShippingAddress;
  deliveryNoteNo: string;
  referenceNoAndDate: string;
  otherReferences: string;
  buyerOrderNo: string;
  dispatchDocNo: string;
  dispatchedThrough: string;
  destination: string;
  termsOfDelivery: string;
  remarks: string;
}

// ────────────────────────────────────────────────────────────────
// Derive GST type by comparing the first 2 digits of both GST nos.
// Same state code → Intra State, different → Inter State.
// ────────────────────────────────────────────────────────────────
const computeGstType = (dispatchGst: string, shipGst: string): string => {
  const dispatchPrefix = (dispatchGst || "").substring(0, 2).toUpperCase();
  const shipPrefix = (shipGst || "").substring(0, 2).toUpperCase();
  if (!dispatchPrefix || !shipPrefix) return "";
  return dispatchPrefix === shipPrefix ? "Intra State" : "Inter State";
};

const isSameAddressCode = (
  first: string | number | null | undefined,
  second: string | number | null | undefined
) => first != null && second != null && String(first) === String(second);

const getChallanIdFromResponse = (response: any): string => {
  const responseData = response?.payload?.data;
  if (!responseData) return "";
  const nestedData = responseData.data;
  if (typeof nestedData === "string") return nestedData;
  if (nestedData && typeof nestedData === "object") {
    return nestedData.challanId || nestedData.id || "";
  }
  return responseData.challanId || responseData.id || "";
};

const CreatePartCodeChallan: React.FC = () => {
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id?: string }>();
  const isEdit = Boolean(routeId);
  const id = routeId || "";

  const [alert, setAlert] = useState<boolean>(false);
  const [minNo, setMinno] = useState<string>("");
  const [challanNo, setChallanNo] = useState<string>(""); // auto-generated challan no
  const [open, setOpen] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [total, setTotal] = useState<Totals>({ totalAmount: 0 });
  const [gstType, setGstType] = useState<string>(""); // derived from address comparison

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.po);
  const { formData } = useAppSelector((state) => state.po);
  const { shippingAddress, clientdata, getClientLoading } = useAppSelector(
    (state) => state.client
  ) as any;
  const { clientBranchList, clientBranchLoading } = useAppSelector(
    (state) => state.dispatch
  );

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
      pickLocation: null,
      dropLocation: null,
      deliveryNoteNo: "",
      referenceNoAndDate: "",
      otherReferences: "",
      buyerOrderNo: "",
      dispatchDocNo: "",
      dispatchedThrough: "",
      destination: "",
      termsOfDelivery: "",
      remarks: "",
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Form Details", "Add Component Details", "Review & Submit"];

  const handleNext = () => setActiveStep((prev) => prev + 1);

  const handleBack = () => {
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
    setActiveStep((prev) => prev - 1);
  };

  // ── Fetch auto-generated challan number on mount (create mode only) ──
  useEffect(() => {
    dispatch(getLocationAsync(null));
    dispatch(getPertCodesync(null));
    dispatch(getShippingAddress());
    dispatch(getClient());

    if (!isEdit) {
      dispatch(getPartCodeChallanNo()).then((res: any) => {
        const no =
          res?.payload?.data?.data ||
          res?.payload?.data?.challanNo ||
          res?.payload?.data?.no ||
          res?.payload?.data ||
          "";
        if (no) setChallanNo(String(no));
      });
    }
  }, []);

  // ── Watch addresses to keep gstType in sync while user is on step 0 ──
  const watchDispatchGst = watch("dispatchFromaddress.gst");
  const watchShipGst = watch("shipaddress.gst");
  const watchBillToGst = watch("billToaddress.gst");
  const forceZeroGst = isBillToZeroGst(watchBillToGst);

  useEffect(() => {
    const computed = computeGstType(watchDispatchGst || "", watchShipGst || "");
    setGstType(computed);
  }, [watchDispatchGst, watchShipGst]);

  // Bill To GST matches company GST → force 0% on all line items
  useEffect(() => {
    if (!forceZeroGst || rowData.length === 0) return;
    setRowData((prev) => {
      const next = prev.map((row) => recomputePartCodeRowGst(row, gstType, "0"));
      const changed = next.some(
        (row, index) =>
          row.gstRate !== prev[index].gstRate ||
          row.cgst !== prev[index].cgst ||
          row.sgst !== prev[index].sgst ||
          row.igst !== prev[index].igst
      );
      return changed ? next : prev;
    });
  }, [forceZeroGst, gstType, rowData.length]);

  const checkRequiredFields = (data: RowData[]) => {
    let hasErrors = false;
    const requiredFields: Array<keyof RowData> = ["partComponent", "qty", "rate"];
    const missingDetails: string[] = [];

    data.forEach((item, index) => {
      const missingFields: string[] = [];
      requiredFields.forEach((field) => {
        if (
          item[field] === "" ||
          item[field] === 0 ||
          item[field] === undefined ||
          item[field] === null
        ) {
          missingFields.push(field);
        }
      });
      if (missingFields.length > 0) {
        missingDetails.push(`Row ${index + 1}: ${missingFields.join(", ")}`);
        hasErrors = true;
      }
    });

    if (missingDetails.length > 0) {
      showToast(`Some required fields are missing:\n${missingDetails.join("\n")}`, "error");
    }
    return hasErrors;
  };

  const hasDuplicatePartCodes = (data: RowData[]) => {
    const seen = new Map<string, string>();
    const duplicates = new Set<string>();

    data.forEach((item) => {
      const partCode = item.partComponent?.value;
      const partLabel = item.partComponent?.label ?? partCode;
      if (!partCode) return;
      if (seen.has(partCode)) {
        duplicates.add(partLabel ?? partCode);
        return;
      }
      seen.set(partCode, partLabel ?? partCode);
    });

    if (duplicates.size > 0) {
      showToast(
        `Duplicate part code not allowed: ${Array.from(duplicates).join(", ")}`,
        "error"
      );
      return true;
    }

    return false;
  };

  const resetall = () => {
    setRowData([]);
    setTotal({ totalAmount: 0 });
    setGstType("");
    reset();
    dispatch(resetDocumentFile());
    dispatch(clearaddressdetail());
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Required field guards
    if (!data.dispatchFromaddressid) {
      showToast("Please select a Dispatch From address", "error");
      return;
    }
    if (!data.billToClientid) {
      showToast("Please select a Bill To client", "error");
      return;
    }
    if (!data.billToBranchid) {
      showToast("Please select a Bill To branch", "error");
      return;
    }
    if (!data.shipaddressid) {
      showToast("Please select a Ship To address", "error");
      return;
    }
    if (!data.dropLocation) {
      showToast("Please select a Drop Location", "error");
      return;
    }

    // Compute & store the GST type based on addresses
    const derivedGstType = computeGstType(
      data.dispatchFromaddress?.gst || "",
      data.shipaddress?.gst || ""
    );
    setGstType(derivedGstType);

    try {
      dispatch(setFormData(data as any));
      setActiveStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Error submitting form", "error");
    }
  };

  const finalSubmit = () => {
    if (!formData) return;

    if (rowData.length === 0) {
      showToast("Please Add Material Details", "error");
      return;
    }
    if (checkRequiredFields(rowData)) return;
    if (hasDuplicatePartCodes(rowData)) return;

    const component = rowData.map((item) => item.partComponent?.value || "");
    const materialName = rowData.map((item) => item.partComponent?.label ?? "");
    const qty = rowData.map((item) => Number(item.qty));
    const rate = rowData.map((item) => Number(item.rate));
    const remark = rowData.map((item) => item.remarks ?? "");
    const hsn = rowData.map((item) => item.hsn ?? "");
    const pickLocation = rowData.map((item) => item.pickLocation?.value ?? "");
    const gstRatePerItem = rowData.map((item) => item.gstRate ?? "");
    const taxableAmount = rowData.map((item) => item.taxableAmount ?? 0);
    const cgst = rowData.map((item) => item.cgst ?? 0);
    const sgst = rowData.map((item) => item.sgst ?? 0);
    const igst = rowData.map((item) => item.igst ?? 0);
    const totalAmountPerItem = rowData.map((item) => item.totalAmount ?? 0);

    const dispatchFromDetails = formData.dispatchFromaddress
      ? {
          id: formData.dispatchFromaddressid || formData.dispatchFromaddress?.id,
          label: formData.dispatchFromaddress?.label ?? "",
          city: formData.dispatchFromaddress?.city ?? "",
          gst: formData.dispatchFromaddress?.gst ?? "",
          pin: formData.dispatchFromaddress?.pin ?? "",
          pan: formData.dispatchFromaddress?.pan ?? "",
          addressLine1: formData.dispatchFromaddress?.addressLine1 ?? "",
          addressLine2: formData.dispatchFromaddress?.addressLine2 ?? "",
        }
      : {};

    const shippingDetails = formData.shipaddress
      ? {
          id: formData.shipaddressid || formData.shipaddress?.id,
          label: formData.shipaddress?.label ?? "",
          pin: formData.shipaddress?.pin ?? "",
          gst: formData.shipaddress?.gst ?? "",
          pan: formData.shipaddress?.pan ?? "",
          city: formData.shipaddress?.city ?? "",
          addressLine1: formData.shipaddress?.addressLine1 ?? "",
          addressLine2: formData.shipaddress?.addressLine2 ?? "",
        }
      : {};

    const billToDetails = formData.billToaddress
      ? {
          id: formData.billToBranchid || formData.billToaddress?.id,
          clientId: formData.billToClientid,
          label: formData.billToaddress?.label ?? "",
          city: formData.billToaddress?.city ?? "",
          gst: formData.billToaddress?.gst ?? "",
          pin: formData.billToaddress?.pin ?? "",
          pan: formData.billToaddress?.pan ?? "",
          addressLine1: formData.billToaddress?.addressLine1 ?? "",
          addressLine2: formData.billToaddress?.addressLine2 ?? "",
        }
      : {};

    const payload: any = {
      component,
      materialName,
      qty,
      rate,
      remark,
      hsn,
      pickLocation,
      dropLocation: formData.dropLocation?.code ?? formData.dropLocation?.sku ?? "",
      dispatchFromDetails,
      billToDetails,
      shippingDetails,
      deliveryNoteNo: formData.deliveryNoteNo || watch("deliveryNoteNo") || "",
      referenceNoAndDate: formData.referenceNoAndDate || watch("referenceNoAndDate") || "",
      otherReferences: formData.otherReferences || watch("otherReferences") || "",
      buyerOrderNo: formData.buyerOrderNo || watch("buyerOrderNo") || "",
      dispatchDocNo: formData.dispatchDocNo || watch("dispatchDocNo") || "",
      dispatchedThrough: formData.dispatchedThrough || watch("dispatchedThrough") || "",
      destination: formData.destination || watch("destination") || "",
      termsOfDelivery: watch("termsOfDelivery") || formData.termsOfDelivery || "",
      remarks: watch("remarks") || formData.remarks || "",
      updaterow: rowData.map((item) => item.updaterow),
      challanId: id,
      // ── Per-item GST ──
      gstRate: gstRatePerItem,
      gstState: gstType === "Inter State" ? "inter" : "local",
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalAmount: totalAmountPerItem,
    };

    if (isEdit) {
      dispatch(updatePartCodeChallan(payload)).then((response: any) => {
        if (response.payload?.data?.success) {
          showToast(response.payload?.data?.message, "success");
          resetall();
          handleNext();
          dispatch(resetFormData());
          navigate("/manage-challan");
        }
      });
    } else {
      dispatch(createPartCodeChallan(payload)).then((response: any) => {
        if (response.payload?.data?.success) {
          const generatedNo = getChallanIdFromResponse(response);
          showToast(response.payload?.data?.message, "success");
          setMinno(generatedNo);
          resetall();
          handleNext();
          dispatch(resetFormData());
        }
      });
    }
  };

  // ── Address helpers ──────────────────────────────────────────
  const handledispatchFromaddressChange = (value: any) => {
    if (!value) {
      setValue("dispatchFromaddressid", 0);
      setValue("dispatchFromaddress.label", "");
      setValue("dispatchFromaddress.addressLine1", "");
      setValue("dispatchFromaddress.addressLine2", "");
      setValue("dispatchFromaddress.city", "");
      setValue("dispatchFromaddress.gst", "");
      setValue("dispatchFromaddress.pan", "");
      setValue("dispatchFromaddress.pin", "");
      return;
    }

    if (isSameAddressCode(value.code, watch("shipaddressid"))) {
      showToast("Dispatch From and Ship To cannot be the same address", "error");
      return;
    }

    setValue("dispatchFromaddressid", value.code);
    setValue("dispatchFromaddress.label", value.label);
    setValue("dispatchFromaddress.addressLine1", value.addressLine1);
    setValue("dispatchFromaddress.addressLine2", value.addressLine2);
    setValue("dispatchFromaddress.city", value.city);
    setValue("dispatchFromaddress.gst", value.gst);
    setValue("dispatchFromaddress.pan", value.pan);
    setValue("dispatchFromaddress.pin", value.pin);
  };

  const handleBillToClientChange = (client: any) => {
    if (!client) {
      setValue("billToClientid", "");
      setValue("billToBranchid", "");
      setValue("billToaddress.label", "");
      setValue("billToaddress.addressLine1", "");
      setValue("billToaddress.addressLine2", "");
      setValue("billToaddress.city", "");
      setValue("billToaddress.gst", "");
      setValue("billToaddress.pan", "");
      setValue("billToaddress.pin", "");
      return;
    }

    setValue("billToClientid", client.code);
    setValue("billToaddress.label", client.name ?? client.label ?? "");
    setValue("billToBranchid", "");
    setValue("billToaddress.addressLine1", "");
    setValue("billToaddress.addressLine2", "");
    setValue("billToaddress.pin", "");
    setValue("billToaddress.pan", "");

    dispatch(getClientBranch(client.code));
  };

  const handleBillToBranchChange = (branch: any) => {
    if (!branch) {
      setValue("billToBranchid", "");
      setValue("billToaddress.addressLine1", "");
      setValue("billToaddress.addressLine2", "");
      setValue("billToaddress.pin", "");
      setValue("billToaddress.pan", "");
      return;
    }

    setValue("billToBranchid", branch.addressID ?? branch.id ?? "");
    setValue("billToaddress.label", branch.name ?? branch.label ?? watch("billToaddress.label"));
    setValue("billToaddress.addressLine1", branch.addressLine1 ?? branch.address1 ?? "");
    setValue("billToaddress.addressLine2", branch.addressLine2 ?? branch.address2 ?? "");
    setValue("billToaddress.pin", branch.pinCode ?? branch.pin ?? "");
    setValue("billToaddress.gst", branch.gst ?? watch("billToaddress.gst"));
    setValue("billToaddress.pan", branch.panno ?? branch.pan ?? "");
    setValue(
      "billToaddress.city",
      branch.city ?? branch.state?.stateName ?? watch("billToaddress.city")
    );
  };

  const handleShipAddressChange = (value: any) => {
    if (!value) {
      setValue("shipaddressid", 0);
      setValue("shipaddress.label", "");
      setValue("shipaddress.addressLine1", "");
      setValue("shipaddress.addressLine2", "");
      setValue("shipaddress.city", "");
      setValue("shipaddress.gst", "");
      setValue("shipaddress.pan", "");
      setValue("shipaddress.pin", "");
      return;
    }

    if (isSameAddressCode(value.code, watch("dispatchFromaddressid"))) {
      showToast("Dispatch From and Ship To cannot be the same address", "error");
      return;
    }

    setValue("shipaddressid", value.code);
    setValue("shipaddress.label", value.label);
    setValue("shipaddress.addressLine1", value.addressLine1);
    setValue("shipaddress.addressLine2", value.addressLine2);
    setValue("shipaddress.city", value.city);
    setValue("shipaddress.gst", value.gst);
    setValue("shipaddress.pan", value.pan);
    setValue("shipaddress.pin", value.pin);
  };

  const billLabel = watch("dispatchFromaddress.label");
  const billToClientLabel = watch("billToaddress.label");
  const shipLabel = watch("shipaddress.label");
  const dispatchFromAddressId = watch("dispatchFromaddressid");
  const billToClientId = watch("billToClientid");
  const shipAddressId = watch("shipaddressid");
  const shippingList = Array.isArray(shippingAddress)
    ? shippingAddress
    : (shippingAddress?.data ?? []);
  const clientList = Array.isArray(clientdata) ? clientdata : [];
  const isKortek = (addr: any) => addr?.label?.toLowerCase().includes("kortek");
  const dispatchFromSelected = shippingList.find((a: any) =>
    isSameAddressCode(a.code, dispatchFromAddressId)
  );
  const shipSelected = shippingList.find((a: any) =>
    isSameAddressCode(a.code, shipAddressId)
  );
  const dispatchFromOptions = shippingList.filter((addr: any) => {
    if (isSameAddressCode(addr.code, shipAddressId)) return false;
    if (shipSelected && isKortek(shipSelected) && isKortek(addr)) return false;
    return true;
  });
  const shipToOptions = shippingList.filter((addr: any) => {
    if (isSameAddressCode(addr.code, dispatchFromAddressId)) return false;
    if (dispatchFromSelected && isKortek(dispatchFromSelected) && isKortek(addr)) return false;
    return true;
  });

  // ── Edit mode: load existing data ───────────────────────────
  useEffect(() => {
    if (isEdit && id) {
      dispatch(getPartCodeChallanDetail({ id })).then((response: any) => {
        const res = response.payload?.data;
        if (res?.success && res?.data) {
          const { bill, ship, materials, header, billTo, dispatchFrom } = res.data;

          // Show the existing challan number (non-editable)
          const existingNo =
            header?.challanNo || header?.challanId || header?.no || id;
          if (existingNo) setChallanNo(String(existingNo));

          const dispatchFromData = dispatchFrom ?? bill;
          setValue("dispatchFromaddressid", dispatchFromData?.code || "");
          handledispatchFromaddressChange(dispatchFromData || "");

          const billToData = billTo ?? header?.billTo;
          const billToGstForEdit = billToData?.gst ?? header?.billToGst ?? "";
          if (billToData) {
            setValue("billToClientid", billToData.clientId ?? billToData.clientCode ?? billToData.code ?? "");
            setValue("billToBranchid", billToData.branchId ?? billToData.id ?? billToData.addressID ?? "");
            setValue("billToaddress.label", billToData.label ?? billToData.name ?? "");
            setValue("billToaddress.addressLine1", billToData.addressLine1 ?? billToData.address1 ?? "");
            setValue("billToaddress.addressLine2", billToData.addressLine2 ?? billToData.address2 ?? "");
            setValue("billToaddress.city", billToData.city ?? "");
            setValue("billToaddress.gst", billToData.gst ?? "");
            setValue("billToaddress.pan", billToData.pan ?? billToData.panno ?? "");
            setValue("billToaddress.pin", billToData.pin ?? billToData.pinCode ?? "");
            const clientCode = billToData.clientId ?? billToData.clientCode ?? billToData.code;
            if (clientCode) {
              dispatch(getClientBranch(clientCode));
            }
          }

          setValue("shipaddressid", ship?.code || "");
          handleShipAddressChange(ship || "");
          setValue("deliveryNoteNo", header?.deliveryNoteNo || "");
          setValue("referenceNoAndDate", header?.referenceNoAndDate || "");
          setValue("otherReferences", header?.otherReferences || "");
          setValue("buyerOrderNo", header?.buyerOrderNo || "");
          setValue("dispatchDocNo", header?.dispatchDocNo || "");
          setValue("dispatchedThrough", header?.dispatchedThrough || "");
          setValue("destination", header?.destination || "");
          setValue("termsOfDelivery", header?.termsOfDelivery || header?.termsofcondition || "");
          setValue("remarks", header?.remarks || header?.poRemarks || "");

          if (header?.pickLocation) setValue("pickLocation", header.pickLocation);
          if (header?.dropLocation) setValue("dropLocation", header.dropLocation);

          // Derive GST type from saved GST nos (bill.gst vs ship.gst)
          const editGstType = computeGstType(bill?.gst || "", ship?.gst || "");
          setGstType(editGstType);

          dispatch(
            setFormData({
              ...formData,
              termsOfDelivery: header?.termsOfDelivery || "",
            })
          );

          if (!materials?.length) return;

          const headerGstRate = header?.gstrate ?? header?.gstRate;
          const headerGstType =
            header?.gsttype === "inter" ? "Inter State" : "Intra State";

          setRowData(
            materials.map((item: any, index: number) => {
              const qty = Number(item.orderqty) || 0;
              const rate = Number(item.rate) || 0;
              const zeroGstOnEdit = isBillToZeroGst(billToGstForEdit);
              const itemGstRate = zeroGstOnEdit
                ? "0"
                : item.gstRate ?? item.gst_rate ?? headerGstRate ?? "";
              const taxableAmount = qty * rate;
              const gstRateNum = Number(itemGstRate) || 0;
              let cgst = 0, sgst = 0, igst = 0;
              if (headerGstType === "Intra State") {
                cgst = (taxableAmount * (gstRateNum / 2)) / 100;
                sgst = (taxableAmount * (gstRateNum / 2)) / 100;
              } else {
                igst = (taxableAmount * gstRateNum) / 100;
              }
              const totalAmount = taxableAmount + cgst + sgst + igst;

              return {
                id: item.id || item.updateid || `edit-row-${index}`,
                partComponent: {
                  label: item.component_short,
                  value: item.componentKey,
                },
                hsn: item.hsn ?? "",
                qty,
                updaterow: item.updateid,
                rate: Number(item.rate) || 0,
                remarks: item.remark ?? "",
                isNew: true,
                excRate: 1,
                uom: item.uom ?? "",
                gstRate: String(itemGstRate),
                taxableAmount,
                cgst,
                sgst,
                igst,
                totalAmount,
              };
            })
          );

          const totalAmount = materials.reduce(
            (acc: number, item: any) =>
              acc + (Number(item.orderqty) || 0) * (Number(item.rate) || 0),
            0
          );
          setTotal({ totalAmount });
        }
      });
    }
  }, [isEdit]);

  return (
    <>
      <ConfirmationModel
        open={alert}
        onClose={() => setAlert(false)}
        title="Are you sure?"
        content="Are you sure you want to reset all fields and table data?"
        cancelText="Cancel"
        confirmText="Continue"
        onConfirm={() => {
          resetall();
          dispatch(resetDocumentFile());
          dispatch(resetFormData());
          setActiveStep(0);
          setAlert(false);
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
        <MaterialInvardUploadDocumentDrawer open={upload} setOpen={setUpload} />
        {loading && <FullPageLoading />}

        <div className="h-[calc(100vh-100px)]">
          {/* Stepper header */}
          <div className="h-[50px] flex items-center w-full px-[20px] bg-neutral-50 border-b border-neutral-300">
            <Stepper activeStep={activeStep} className="w-full">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          {/* ─────────── STEP 0 : Form Details ─────────── */}
          {activeStep === 0 && (
            <div className="h-[calc(100vh-200px)] py-[20px] sm:px-[10px] md:px-[30px] lg:px-[50px] flex flex-col gap-[20px] overflow-y-auto">

              {/* Auto-generated Challan No */}
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.documentDetail />
                  <h2 className="text-lg font-semibold">Challan Details</h2>
                </div>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "#f59e0b", flexGrow: 1 }} />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <TextField
                  variant="filled"
                  fullWidth
                  label="Challan No."
                  value={challanNo || (isEdit ? id : "Generating…")}
                  InputProps={{ readOnly: true }}
                  focused={!!challanNo}
                  helperText="Auto-generated — not editable"
                  inputProps={{ style: { cursor: "not-allowed", color: "#374151", fontWeight: 600 } }}
                />
                {/* Live GST Type indicator */}
                <TextField
                  variant="filled"
                  fullWidth
                  label="GST Type (auto-detected)"
                  value={gstType || "Select both addresses to compute"}
                  InputProps={{ readOnly: true }}
                  focused={!!gstType}
                  inputProps={{ style: { cursor: "not-allowed", color: gstType ? "#15803d" : "#9ca3af", fontWeight: 600 } }}
                  helperText="Intra State if same state code, else Inter State"
                />
                {forceZeroGst && (
                  <TextField
                    variant="filled"
                    fullWidth
                    label="GST on items"
                    value="0% (Bill To GST matches company GST)"
                    InputProps={{ readOnly: true }}
                    focused
                    inputProps={{ style: { color: "#15803d", fontWeight: 600 } }}
                    helperText={`Bill To GST matches ${ZERO_GST_BILL_TO_MATCH}`}
                  />
                )}
              </div>

              {/* Dispatch From */}
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.shipping />
                  <h2 className="text-lg font-semibold">Dispatch From</h2>
                </div>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "#f59e0b", flexGrow: 1 }} />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <Controller
                  name="dispatchFromaddressid"
                  rules={{ required: { value: true, message: "Dispatch From address is required" } }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={shippingList.find((address: any) => address.code === field.value) || null}
                      onChange={(_, newValue) => handledispatchFromaddressChange(newValue)}
                      disablePortal
                      id="combo-box-billto"
                      options={dispatchFromOptions}
                      getOptionLabel={(option: any) => option?.label ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={(billLabel || "Dispatch From") as any}
                          error={!!errors.dispatchFromaddress}
                          helperText={errors.dispatchFromaddress?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  variant="filled"
                  error={!!errors.dispatchFromaddress?.pin}
                  helperText={errors?.dispatchFromaddress?.pin?.message}
                  focused={!!watch("dispatchFromaddress.pin")}
                  fullWidth
                  label="PinCode"
                  {...register("dispatchFromaddress.pin", { required: "PinCode is required" })}
                />
                <TextField
                  variant="filled"
                  error={!!errors.dispatchFromaddress?.city}
                  helperText={errors?.dispatchFromaddress?.city?.message}
                  focused={!!watch("dispatchFromaddress.city")}
                  fullWidth
                  label="City"
                  {...register("dispatchFromaddress.city", { required: "City is required" })}
                />
                <TextField
                  variant="filled"
                  error={!!errors.dispatchFromaddress?.gst}
                  helperText={errors?.dispatchFromaddress?.gst?.message}
                  focused={!!watch("dispatchFromaddress.gst")}
                  fullWidth
                  label="GST"
                  {...register("dispatchFromaddress.gst", { required: "GST is required" })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 5 }}
                  error={!!errors.dispatchFromaddress?.pan}
                  helperText={errors?.dispatchFromaddress?.pan?.message}
                  focused={!!watch("dispatchFromaddress.pan")}
                  fullWidth
                  label="PAN"
                  {...register("dispatchFromaddress.pan", { required: "PAN is required" })}
                />
                <div />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.dispatchFromaddress?.addressLine1}
                  helperText={errors?.dispatchFromaddress?.addressLine1?.message}
                  focused={!!watch("dispatchFromaddress.addressLine1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Address 1"
                  {...register("dispatchFromaddress.addressLine1", { required: "Address 1 is required" })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.dispatchFromaddress?.addressLine2}
                  helperText={errors?.dispatchFromaddress?.addressLine2?.message}
                  focused={!!watch("dispatchFromaddress.addressLine2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Dispatch From Address 2"
                  {...register("dispatchFromaddress.addressLine2", { required: "Address 2 is required" })}
                />
              </div>

              {/* Bill To */}
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.user />
                  <h2 className="text-lg font-semibold">Bill To</h2>
                </div>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "#f59e0b", flexGrow: 1 }} />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <Controller
                  name="billToClientid"
                  rules={{ required: { value: true, message: "Bill To client is required" } }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      loading={getClientLoading}
                      value={
                        clientList.find((client: any) => client.code === field.value) || null
                      }
                      onChange={(_, newValue) => handleBillToClientChange(newValue)}
                      disablePortal
                      id="combo-box-bill-to-client"
                      options={clientList}
                      getOptionLabel={(option: any) => option?.name ?? option?.label ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={(billToClientLabel || "Bill To Client") as string}
                          error={!!errors.billToClientid}
                          helperText={errors.billToClientid?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="billToBranchid"
                  rules={{ required: { value: true, message: "Bill To branch is required" } }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      loading={clientBranchLoading}
                      disabled={!billToClientId}
                      value={
                        clientBranchList?.find(
                          (branch: any) =>
                            String(branch.addressID ?? branch.id) === String(field.value)
                        ) || null
                      }
                      onChange={(_, newValue) => handleBillToBranchChange(newValue)}
                      disablePortal
                      id="combo-box-bill-to-branch"
                      options={clientBranchList || []}
                      getOptionLabel={(option: any) => option?.name ?? option?.label ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bill To Branch"
                          error={!!errors.billToBranchid}
                          helperText={errors.billToBranchid?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  variant="filled"
                  error={!!errors.billToaddress?.pin}
                  helperText={errors?.billToaddress?.pin?.message}
                  focused={!!watch("billToaddress.pin")}
                  fullWidth
                  label="PinCode"
                  {...register("billToaddress.pin", { required: "PinCode is required" })}
                />
                <TextField
                  variant="filled"
                  error={!!errors.billToaddress?.city}
                  helperText={errors?.billToaddress?.city?.message}
                  focused={!!watch("billToaddress.city")}
                  fullWidth
                  label="City"
                  {...register("billToaddress.city", { required: "City is required" })}
                />
                <TextField
                  variant="filled"
                  error={!!errors.billToaddress?.gst}
                  helperText={errors?.billToaddress?.gst?.message}
                  focused={!!watch("billToaddress.gst")}
                  fullWidth
                  label="GST"
                  {...register("billToaddress.gst", { required: "GST is required" })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 5 }}
                  error={!!errors.billToaddress?.pan}
                  helperText={errors?.billToaddress?.pan?.message}
                  focused={!!watch("billToaddress.pan")}
                  fullWidth
                  label="PAN"
                  {...register("billToaddress.pan", { required: "PAN is required" })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.billToaddress?.addressLine1}
                  helperText={errors?.billToaddress?.addressLine1?.message}
                  focused={!!watch("billToaddress.addressLine1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Bill To Address 1"
                  
                  {...register("billToaddress.addressLine1", { required: "Address 1 is required" })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.billToaddress?.addressLine2}
                  helperText={errors?.billToaddress?.addressLine2?.message}
                  focused={!!watch("billToaddress.addressLine2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Bill To Address 2"
                  className="md:col-span-1 lg:col-span-1"
                  {...register("billToaddress.addressLine2", { required: "Address 2 is required" })}
                />
              </div>

              {/* Ship To */}
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.building />
                  <h2 className="text-lg font-semibold">Ship To</h2>
                </div>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "#f59e0b", flexGrow: 1 }} />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                <Controller
                  name="shipaddressid"
                  rules={{ required: { value: true, message: "Ship To address is required" } }}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      value={shippingList.find((address: any) => address.code === field.value) || null}
                      onChange={(_, newValue) => handleShipAddressChange(newValue)}
                      disablePortal
                      id="combo-box-shipto"
                      options={shipToOptions}
                      getOptionLabel={(option: any) => option?.label ?? ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={(shipLabel || "Ship To") as any}
                          error={!!errors.shipaddress}
                          helperText={errors.shipaddress?.message}
                          variant="filled"
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  variant="filled"
                  error={!!errors.shipaddress?.pin}
                  helperText={errors?.shipaddress?.pin?.message}
                  focused={!!watch("shipaddress.pin")}
                  fullWidth
                  label="PinCode"
                  {...register("shipaddress.pin", { required: "PinCode is required" })}
                />
                <TextField
                  variant="filled"
                  error={!!errors.shipaddress?.gst}
                  helperText={errors?.shipaddress?.gst?.message}
                  focused={!!watch("shipaddress.gst")}
                  fullWidth
                  label="GST"
                  {...register("shipaddress.gst", { required: "GST is required" })}
                />
                <TextField
                  variant="filled"
                  error={!!errors.shipaddress?.pan}
                  helperText={errors?.shipaddress?.pan?.message}
                  focused={!!watch("shipaddress.pan")}
                  fullWidth
                  label="PAN"
                  {...register("shipaddress.pan", { required: "PAN is required" })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 5 }}
                  error={!!errors.shipaddress?.city}
                  helperText={errors?.shipaddress?.city?.message}
                  focused={!!watch("shipaddress.city")}
                  fullWidth
                  label="City"
                  {...register("shipaddress.city")}
                />
                <div />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipaddress?.addressLine1}
                  helperText={errors?.shipaddress?.addressLine1?.message}
                  focused={!!watch("shipaddress.addressLine1")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Ship To Address 1"
                  {...register("shipaddress.addressLine1", { required: "Address 1 is required" })}
                />
                <TextField
                  variant="filled"
                  sx={{ mb: 1 }}
                  error={!!errors.shipaddress?.addressLine2}
                  helperText={errors?.shipaddress?.addressLine2?.message}
                  focused={!!watch("shipaddress.addressLine2")}
                  multiline
                  rows={3}
                  fullWidth
                  label="Ship To Address 2"
                  {...register("shipaddress.addressLine2", { required: "Address 2 is required" })}
                />
              </div>

              {/* Document Details */}
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.documentDetail />
                  <h2 className="text-lg font-semibold">Document Details</h2>
                </div>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "#f59e0b", flexGrow: 1 }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] py-[20px]">
                <TextField
                  variant="filled"
                  fullWidth
                  label="Dispatch Doc No."
                  {...register("dispatchDocNo", { required: "Dispatch Doc No. is required" })}
                  error={!!errors.dispatchDocNo}
                  helperText={errors.dispatchDocNo?.message}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Dispatched Through"
                  {...register("dispatchedThrough")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Destination"
                  {...register("destination")}
                />
                {/* Optional fields */}
                <TextField
                  variant="filled"
                  fullWidth
                  label="Delivery Note No. (optional)"
                  {...register("deliveryNoteNo")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Reference No. & Date (optional)"
                  {...register("referenceNoAndDate")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Other References (optional)"
                  {...register("otherReferences")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Buyer's Order No. (optional)"
                  {...register("buyerOrderNo")}
                />
                <TextField
                  variant="filled"
                  fullWidth
                  label="Terms of Delivery (optional)"
                  {...register("termsOfDelivery")}
                />
                {/* Remarks — spans full row */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <TextField
                    variant="filled"
                    sx={{ mb: 1 }}
                    error={!!errors.remarks}
                    helperText={errors?.remarks?.message}
                    focused={!!watch("remarks")}
                    multiline
                    rows={3}
                    fullWidth
                    label="Remarks"
                    {...register("remarks")}
                  />
                </div>
              </div>

              {/* ── Drop Location (new section) ── */}
              <div className="flex items-center w-full gap-3">
                <div className="flex items-center gap-[5px]">
                  <Icons.warehouse />
                  <h2 className="text-lg font-semibold">Drop Location</h2>
                </div>
                <Divider sx={{ borderBottomWidth: 2, borderColor: "#f59e0b", flexGrow: 1 }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] py-[10px]">
                <Controller
                  name="dropLocation"
                  control={control}
                  rules={{ required: "Drop Location is required" }}
                  render={({ field }) => (
                    <SelectLocationAcordingModule
                      endPoint="/req/without-bom/req-location"
                      label="Drop Location *"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.dropLocation}
                      helperText={errors.dropLocation?.message}
                      varient="filled"
                      required
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* ─────────── STEP 1 : Add Component Details ─────────── */}
          {activeStep === 1 && (
            <div className="h-[calc(100vh-200px)]">
              <AddPOTable
                rowData={rowData}
                setRowData={setRowData}
                setTotal={setTotal}
                exchange={0}
                currency=""
                pickLocation={formData?.pickLocation ?? null}
                gstType={gstType}
                forceZeroGst={forceZeroGst}
              />
            </div>
          )}

          {/* ─────────── STEP 2 : Success ─────────── */}
          {activeStep === 2 && (
            <div className="h-[calc(100vh-200px)] flex items-center justify-center">
              <div className="flex flex-col justify-center gap-[10px]">
                <Success />
                <Typography variant="inherit" fontWeight={500}>
                  Challan No. : {minNo}
                </Typography>
                <LoadingButton
                  onClick={() => {
                    setMinno("");
                    setChallanNo("");
                    setActiveStep(0);
                    // Fetch a fresh challan no for the new challan
                    dispatch(getPartCodeChallanNo()).then((res: any) => {
                      const no =
                        res?.payload?.data?.data ||
                        res?.payload?.data?.challanNo ||
                        res?.payload?.data?.no ||
                        res?.payload?.data ||
                        "";
                      if (no) setChallanNo(String(no));
                    });
                  }}
                  variant="contained"
                >
                  Create New Challan
                </LoadingButton>
              </div>
            </div>
          )}

          {/* ─────────── Footer Buttons ─────────── */}
          <div className="h-[50px] border-t border-neutral-300 flex items-center justify-end px-[20px] bg-neutral-50 gap-[10px] relative">
            {/* Totals panel on step 1 */}
            {activeStep === 1 && (
              <div
                className={`absolute bottom-0 left-0 w-[500px] z-[10] transition-all bg-white ${
                  open ? "h-[330px]" : "h-[50px]"
                } border-r overflow-hidden`}
              >
                <div className="h-[50px] bg-cyan-900 flex items-center pe-[20px] gap-[10px]">
                  <Button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="bg-amber-500 hover:bg-amber-600 p-0 rounded-none h-full w-[50px]"
                  >
                    <Icons.up
                      className={`h-[20px] w-[20px] transition-transform duration-200 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </Button>
                  <Typography
                    variant="h6"
                    component={"div"}
                    fontWeight={500}
                    fontSize={"17px"}
                    className="text-white"
                  >
                    Total
                  </Typography>
                </div>
                <Card className="border-0 rounded-none shadow-none">
                  <CardContent className="flex flex-col gap-[10px] pt-[15px] px-[20px]">
                    {/* Taxable Amount */}
                    <div className="flex justify-between items-center">
                      <p className="text-slate-500 text-[13px]">Taxable Amount</p>
                      <p className="text-[13px] text-muted-foreground">
                        {(total.taxableAmount ?? 0).toFixed(2)}
                      </p>
                    </div>
                    {/* CGST */}
                    <div className="flex justify-between items-center">
                      <p className="text-slate-500 text-[13px]">CGST</p>
                      <p className="text-[13px] text-muted-foreground">
                        {(total.cgst ?? 0).toFixed(2)}
                      </p>
                    </div>
                    {/* SGST */}
                    <div className="flex justify-between items-center">
                      <p className="text-slate-500 text-[13px]">SGST</p>
                      <p className="text-[13px] text-muted-foreground">
                        {(total.sgst ?? 0).toFixed(2)}
                      </p>
                    </div>
                    {/* IGST */}
                    <div className="flex justify-between items-center">
                      <p className="text-slate-500 text-[13px]">IGST</p>
                      <p className="text-[13px] text-muted-foreground">
                        {(total.igst ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <Divider />
                    {/* Total incl. GST */}
                    <div className="flex justify-between items-center">
                      <p className="text-slate-700 font-[600] text-[14px]">Total (incl. GST)</p>
                      <p className="text-[14px] font-[600] text-slate-700">
                        {(total.totalAmount ?? 0).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeStep === 0 && (
              <>
                <LoadingButton
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.refreshv2 />}
                  onClick={() => setAlert(true)}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  endIcon={<Icons.next />}
                  onClick={() => onSubmit(watch())}
                >
                  Next
                </LoadingButton>
              </>
            )}

            {activeStep === 1 && (
              <>
                <LoadingButton
                  disabled={loading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.previous />}
                  onClick={handleBack}
                >
                  Back
                </LoadingButton>
                <LoadingButton
                  disabled={loading}
                  sx={{ background: "white", color: "red" }}
                  variant="contained"
                  startIcon={<Icons.refreshv2 />}
                  onClick={() => setAlert(true)}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  variant="contained"
                  startIcon={<Icons.save />}
                  onClick={finalSubmit}
                >
                  Submit
                </LoadingButton>
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default CreatePartCodeChallan;
