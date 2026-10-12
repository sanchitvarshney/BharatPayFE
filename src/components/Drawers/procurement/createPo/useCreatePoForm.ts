import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { replaceBrWithNewLine } from "@/utils/replacebrtag";
import { transformSkuCode } from "@/utils/transformUtills";
import { VendorData } from "@/components/reusable/SelectVendor";
import {
  getVendorAddress,
  getVendorBranchAsync,
} from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import {
  getDispatchFromDetail,
  getShippingAddress,
} from "@/features/master/client/clientSlice";
import { getCurrency } from "@/features/common/commonSlice";
import { createPO } from "@/features/procurement/poSlices";
import { ComponentPoVendor } from "@/features/procurement/poTypes";
import { CreatePoDrawerProps, ComponentRow, CurrencyOption } from "./types";
import {
  STEPS,
  clean,
  collectVendors,
  parseDueDate,
  poVendors,
  rowGst,
  rowIncomplete,
  rowTaxable,
  toRow,
} from "./helpers";

export function useCreatePoForm({ open, setOpen, details, onSuccess }: CreatePoDrawerProps) {
  const dispatch = useAppDispatch();
  const { VendorBranchData } = useAppSelector((state) => state.divicemin);
  const { dispatchFromDetails, shippingAddress } = useAppSelector(
    (state) => state.client,
  ) as any;
  const { currencyData } = useAppSelector((state) => state.common);
  const { loading } = useAppSelector((state) => state.po);

  const [step, setStep] = useState(0);
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [isComponentsPending, startComponents] = useTransition();
  const [vendorPickOpen, setVendorPickOpen] = useState(false);
  const [pickedVendorId, setPickedVendorId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [vendorBranch, setVendorBranch] = useState("");
  const [vendorMobile, setVendorMobile] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [gstin, setGstin] = useState("");

  const [currency, setCurrency] = useState<CurrencyOption | null>(null);
  const [exchange, setExchange] = useState("1");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [termsOfDelivery, setTermsOfDelivery] = useState("");
  const [poRemarks, setPoRemarks] = useState("");

  const [billAddr, setBillAddr] = useState<any | null>(null);
  const [shipAddr, setShipAddr] = useState<any | null>(null);
  const [fallbackBill, setFallbackBill] = useState<{ id: string; text: string } | null>(null);
  const [fallbackShip, setFallbackShip] = useState<{ id: string; text: string } | null>(null);

  const [rows, setRows] = useState<ComponentRow[]>([]);

  const currencyOptions = useMemo<CurrencyOption[]>(
    () => (transformSkuCode(currencyData) as CurrencyOption[]) ?? [],
    [currencyData],
  );

  useEffect(() => {
    if (!open) return;
    dispatch(getCurrency());
    dispatch(getDispatchFromDetail());
    dispatch(getShippingAddress());
  }, [open, dispatch]);

  // Hydrate the form whenever fresh details arrive.
  useEffect(() => {
    if (!open || !details) return;
    setStep(0);

    const firstPo =
      details.components.find((c) => c.latest_po_details)?.latest_po_details ?? null;
    setRows(details.components.map(toRow));

    setExchange(clean(firstPo?.exchange) || "1");
    setDueDate(parseDueDate(firstPo?.duedate));
    setPaymentTerms(clean(firstPo?.payment_terms));
    setTermsOfDelivery(clean(firstPo?.terms_condition));
    setPoRemarks(clean(firstPo?.full_remark) || clean(firstPo?.remark));

    const poVendor = poVendors(firstPo)[0];
    if (poVendor?.billing_address_id) {
      setFallbackBill({
        id: poVendor.billing_address_id,
        text: clean(replaceBrWithNewLine(poVendor.billing_address || "") || ""),
      });
    }
    if (poVendor?.shipping_address_id) {
      setFallbackShip({
        id: poVendor.shipping_address_id,
        text: clean(replaceBrWithNewLine(poVendor.shipping_address || "") || ""),
      });
    }

    // Vendor fields start blank; the picker dialog (below) fills them once the
    // user chooses a vendor, or they enter one manually on the Vendor step.
    setVendor(null);
    setVendorBranch("");
    setVendorMobile("");
    setVendorAddress("");
    setGstin("");

    const opts = collectVendors(details.components, details.vendor_list);
    setPickedVendorId(opts.length === 1 ? opts[0].vendor_id : "");
    setVendorPickOpen(opts.length >= 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, details]);

  useEffect(() => {
    if (!details || !currencyOptions.length) return;
    const firstPo = details.components.find((c) => c.latest_po_details)?.latest_po_details;
    const match = currencyOptions.find((o) => o.value === firstPo?.currency);
    if (match) setCurrency(match);
  }, [details, currencyOptions]);

  useEffect(() => {
    if (fallbackBill && Array.isArray(dispatchFromDetails)) {
      const match = dispatchFromDetails.find((a: any) => a.code === fallbackBill.id);
      if (match) setBillAddr(match);
    }
  }, [fallbackBill, dispatchFromDetails]);

  useEffect(() => {
    if (fallbackShip && Array.isArray(shippingAddress)) {
      const match = shippingAddress.find((a: any) => a.code === fallbackShip.id);
      if (match) setShipAddr(match);
    }
  }, [fallbackShip, shippingAddress]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          const { cgst, sgst, igst } = rowGst(row);
          acc.taxable += rowTaxable(row);
          acc.cgst += cgst;
          acc.sgst += sgst;
          acc.igst += igst;
          return acc;
        },
        { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
      ),
    [rows],
  );
  const grandTotal = totals.taxable + totals.cgst + totals.sgst + totals.igst;
  const incompleteCount = useMemo(() => rows.filter(rowIncomplete).length, [rows]);

  const branchLabel = useMemo(
    () => (VendorBranchData ?? []).find((b: any) => b.id === vendorBranch)?.text ?? vendorBranch,
    [VendorBranchData, vendorBranch],
  );

  const { billId, shipId, billLabel, shipLabel } = useMemo(
    () => ({
      billId: billAddr?.code ?? fallbackBill?.id ?? "",
      shipId: shipAddr?.code ?? fallbackShip?.id ?? "",
      billLabel: billAddr?.label ?? fallbackBill?.text ?? "",
      shipLabel: shipAddr?.label ?? fallbackShip?.text ?? "",
    }),
    [billAddr, shipAddr, fallbackBill, fallbackShip],
  );
  const dueDateText = useMemo(
    () => (dueDate && dueDate.isValid() ? dueDate.format("DD-MM-YYYY") : ""),
    [dueDate],
  );

  const vendorOptions = useMemo<ComponentPoVendor[]>(
    () => (details ? collectVendors(details.components, details.vendor_list) : []),
    [details],
  );

  const updateRow = useCallback(
    (index: number, patch: Partial<ComponentRow>) =>
      setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row))),
    [],
  );

  // Open the (heavy) components panel as a transition so the click stays responsive.
  const openComponents = useCallback(
    () => startComponents(() => setComponentsOpen(true)),
    [],
  );
  const closeComponents = useCallback(() => setComponentsOpen(false), []);

  const applyVendor = useCallback(
    (v: ComponentPoVendor) => {
    setVendor({ id: v.vendor_id, text: clean(v.vendor_name) });
    setVendorBranch(v.vendor_branch || "");
    setVendorMobile(clean(v.vendor_mobile));
    setVendorAddress(clean(replaceBrWithNewLine(v.vendor_address || "") || ""));
    setGstin("");
    if (v.vendor_id) dispatch(getVendorBranchAsync(v.vendor_id));
    if (v.billing_address_id) {
      setFallbackBill({
        id: v.billing_address_id,
        text: clean(replaceBrWithNewLine(v.billing_address || "") || ""),
      });
      setBillAddr(null);
    }
    if (v.shipping_address_id) {
      setFallbackShip({
        id: v.shipping_address_id,
        text: clean(replaceBrWithNewLine(v.shipping_address || "") || ""),
      });
      setShipAddr(null);
    }
  }, [dispatch]);

  const confirmVendorPick = useCallback(() => {
    const v = vendorOptions.find((o) => o.vendor_id === pickedVendorId);
    if (!v) return showToast("Select a vendor to continue", "error");
    applyVendor(v);
    setVendorPickOpen(false);
    setStep(0);
  }, [vendorOptions, pickedVendorId, applyVendor]);

  const skipVendorPick = useCallback(() => {
    setVendorPickOpen(false);
    setStep(0);
  }, []);

  const handleVendorChange = useCallback(
    (value: VendorData | null) => {
      setVendor(value);
      setVendorBranch("");
      setVendorMobile("");
      setVendorAddress("");
      setGstin("");
      if (value?.id) dispatch(getVendorBranchAsync(value.id));
    },
    [dispatch],
  );

  const handleBranchChange = useCallback(
    (branchId: string) => {
      setVendorBranch(branchId);
      dispatch(getVendorAddress(branchId)).then((res: any) => {
        if (res.payload?.data?.success) {
          setVendorAddress(replaceBrWithNewLine(res.payload.data?.data?.address) || "");
          setGstin(res.payload.data?.data?.gstid || "");
          setVendorMobile(res.payload.data?.data?.phone || "");
        }
      });
    },
    [dispatch],
  );

  const resetForm = useCallback(() => {
    setStep(0);
    setComponentsOpen(false);
    setVendorPickOpen(false);
    setPickedVendorId("");
    setVendor(null);
    setVendorBranch("");
    setVendorMobile("");
    setVendorAddress("");
    setGstin("");
    setCurrency(null);
    setExchange("1");
    setDueDate(null);
    setPaymentTerms("");
    setTermsOfDelivery("");
    setPoRemarks("");
    setBillAddr(null);
    setShipAddr(null);
    setFallbackBill(null);
    setFallbackShip(null);
    setRows([]);
    setConfirmOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    setOpen(false);
  }, [resetForm, setOpen]);

  const validateStep = useCallback(
    (s: number): string => {
      if (s === 0) {
        if (!vendor?.id) return "Select a vendor";
        if (!vendorBranch) return "Select a vendor branch";
      } else if (s === 1) {
        if (!billId) return "Select a billing address";
        if (!shipId) return "Select a shipping address";
      } else if (s === 2) {
        if (!currency?.value) return "Select a currency";
        if (!dueDateText) return "Select a valid due date";
      }
      return "";
    },
    [vendor, vendorBranch, billId, shipId, currency, dueDateText],
  );

  const goToStep = useCallback(
    (target: number) => {
      if (target <= step) return setStep(target);
      for (let s = step; s < target; s += 1) {
        const err = validateStep(s);
        if (err) return showToast(err, "error");
      }
      setStep(target);
    },
    [step, validateStep],
  );

  const handleNext = useCallback(
    () => goToStep(Math.min(step + 1, STEPS.length - 1)),
    [goToStep, step],
  );
  const handleBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Requirement checklist — drives the Review step + the Submit button's enabled state.
  const requirements = useMemo(
    () => [
      { label: "Vendor selected", done: !!vendor?.id },
      { label: "Vendor branch selected", done: !!vendorBranch },
      { label: "Billing address selected", done: !!billId },
      { label: "Shipping address selected", done: !!shipId },
      { label: "Currency selected", done: !!currency?.value },
      { label: "Due date set", done: !!dueDateText },
      {
        label: rows.length
          ? `All ${rows.length} components have qty, rate & HSN`
          : "At least one component",
        done: rows.length > 0 && incompleteCount === 0,
      },
    ],
    [vendor, vendorBranch, billId, shipId, currency, dueDateText, rows.length, incompleteCount],
  );
  const canSubmit = requirements.every((r) => r.done);

  const openConfirm = useCallback(() => {
    for (let s = 0; s <= 2; s += 1) {
      const err = validateStep(s);
      if (err) {
        setStep(s);
        return showToast(err, "error");
      }
    }
    const bad = rows.findIndex(rowIncomplete);
    if (bad !== -1) {
      setComponentsOpen(true);
      return showToast(
        `Row ${bad + 1} (${rows[bad].partNo || rows[bad].componentName || "#"}): qty, rate & HSN code required`,
        "error",
      );
    }
    setConfirmOpen(true);
  }, [validateStep, rows]);

  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const handleSubmit = useCallback(() => {
    for (let s = 0; s <= 2; s += 1) {
      const err = validateStep(s);
      if (err) {
        setStep(s);
        return showToast(err, "error");
      }
    }
    if (!rows.length) return showToast("No components to order", "error");

    const bad = rows.findIndex(rowIncomplete);
    if (bad !== -1) {
      setComponentsOpen(true);
      const row = rows[bad];
      return showToast(
        `Row ${bad + 1} (${row.partNo || row.componentName || "#"}): qty, rate & HSN code required`,
        "error",
      );
    }

    const billText = billAddr
      ? `${billAddr.addressLine1 ?? ""}${billAddr.addressLine2 ?? ""}`
      : fallbackBill?.text ?? "";
    const shipText = shipAddr
      ? `${shipAddr.addressLine1 ?? ""}${shipAddr.addressLine2 ?? ""}`
      : fallbackShip?.text ?? "";

    const payload = {
      component: rows.map((row) => row.componentKey),
      qty: rows.map((row) => Number(row.qty)),
      rate: rows.map((row) => Number(row.rate)),
      gsttype: rows.map((row) => row.gstType),
      gstrate: rows.map((row) => Number(row.gstRate)),
      hsncode: rows.map((row) => row.hsnCode),
      remark: rows.map((row) => row.remark || ""),
      currency: currency!.value,
      vendorname: vendor!.id,
      vendorbranch: vendorBranch,
      vendoraddress: vendorAddress,
      duedate: dueDateText,
      billaddressid: billId,
      shipaddressid: shipId,
      billaddress: billText,
      shipaddress: shipText,
      exchange: exchange || "1",
      doucmentDate: "",
      paymentterms: paymentTerms,
      termsOfDelivery,
      vendorMobile,
      updaterow: [],
      poid: "",
      vendor_type: "v01",
      poRemarks,
    };

    dispatch(createPO(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        showToast(res.payload?.data?.message || "PO created successfully", "success");
        handleClose();
        onSuccess?.();
      }
    });
  }, [
    dispatch,
    onSuccess,
    handleClose,
    validateStep,
    rows,
    currency,
    vendor,
    vendorBranch,
    vendorAddress,
    vendorMobile,
    dueDateText,
    billId,
    shipId,
    billAddr,
    shipAddr,
    fallbackBill,
    fallbackShip,
    exchange,
    paymentTerms,
    termsOfDelivery,
    poRemarks,
  ]);

  return {
    open,
    details,
    vendorCount: vendorOptions.length,
    loading,

    step,
    setStep,
    componentsOpen,
    setComponentsOpen,
    openComponents,
    closeComponents,
    isComponentsPending,

    vendorPickOpen,
    setVendorPickOpen,
    pickedVendorId,
    setPickedVendorId,
    vendorOptions,
    confirmVendorPick,
    skipVendorPick,

    vendor,
    vendorBranch,
    vendorMobile,
    setVendorMobile,
    vendorAddress,
    setVendorAddress,
    gstin,
    VendorBranchData,
    branchLabel,
    handleVendorChange,
    handleBranchChange,

    dispatchFromDetails,
    shippingAddress,
    billAddr,
    setBillAddr,
    shipAddr,
    setShipAddr,
    fallbackBill,
    fallbackShip,
    billLabel,
    shipLabel,

    currencyOptions,
    currency,
    setCurrency,
    exchange,
    setExchange,
    dueDate,
    setDueDate,
    dueDateText,
    paymentTerms,
    setPaymentTerms,
    termsOfDelivery,
    setTermsOfDelivery,
    poRemarks,
    setPoRemarks,

    rows,
    updateRow,
    totals,
    grandTotal,
    incompleteCount,
    requirements,
    canSubmit,

    confirmOpen,
    openConfirm,
    closeConfirm,

    handleClose,
    goToStep,
    handleNext,
    handleBack,
    handleSubmit,
  };
}

export type CreatePoForm = ReturnType<typeof useCreatePoForm>;
