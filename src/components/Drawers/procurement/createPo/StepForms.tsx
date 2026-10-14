import React from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Icons } from "@/components/icons";
import SelectVendor from "@/components/reusable/SelectVendor";
import { SectionHeading } from "./parts";
import { money } from "./helpers";
import { CreatePoForm } from "./useCreatePoForm";

type StepProps = { form: CreatePoForm };

export const VendorStep = React.memo<StepProps>(({ form }) => (
  <section className="flex flex-col gap-[18px]">
    <SectionHeading icon={<Icons.user />} title="Vendor Details" />
    <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
      <SelectVendor
        size="small"
        varient="outlined"
        label="Vendor"
        value={form.vendor}
        onChange={form.handleVendorChange}
      />
      <FormControl size="small" fullWidth disabled={!form.VendorBranchData}>
        <InputLabel id="cpo-vendor-branch">Vendor Branch</InputLabel>
        <Select
          labelId="cpo-vendor-branch"
          label="Vendor Branch"
          value={form.vendorBranch}
          onChange={(e) => form.handleBranchChange(e.target.value)}
        >
          {(form.VendorBranchData ?? []).map((item: any) => (
            <MenuItem key={item.id} value={item.id}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        label="Mobile No"
        value={form.vendorMobile}
        onChange={(e) => form.setVendorMobile(e.target.value)}
      />
      <div className="flex items-center gap-[8px] text-[13px] text-slate-600">
        <span className="font-medium">GSTIN:</span>
        <span>{form.gstin || "--"}</span>
      </div>
      <div className="md:col-span-2">
        <TextField
          size="small"
          label="Bill From Address"
          fullWidth
          multiline
          minRows={2}
          value={form.vendorAddress}
          onChange={(e) => form.setVendorAddress(e.target.value)}
        />
      </div>
    </div>
  </section>
));
VendorStep.displayName = "VendorStep";

export const BillingShippingStep = React.memo<StepProps>(({ form }) => (
  <section className="flex flex-col gap-[18px]">
    <SectionHeading icon={<Icons.shipping />} title="Billing & Shipping" />
    <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
      <Autocomplete
        size="small"
        options={Array.isArray(form.dispatchFromDetails) ? form.dispatchFromDetails : []}
        value={form.billAddr}
        onChange={(_, next) => form.setBillAddr(next)}
        getOptionLabel={(option: any) => option?.label ?? ""}
        isOptionEqualToValue={(option: any, val: any) => option?.code === val?.code}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Billing Address"
            helperText={!form.billAddr && form.fallbackBill?.text ? form.fallbackBill.text : " "}
          />
        )}
      />
      <Autocomplete
        size="small"
        options={Array.isArray(form.shippingAddress) ? form.shippingAddress : []}
        value={form.shipAddr}
        onChange={(_, next) => form.setShipAddr(next)}
        getOptionLabel={(option: any) => option?.label ?? ""}
        isOptionEqualToValue={(option: any, val: any) => option?.code === val?.code}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Shipping Address"
            helperText={!form.shipAddr && form.fallbackShip?.text ? form.fallbackShip.text : " "}
          />
        )}
      />
    </div>
  </section>
));
BillingShippingStep.displayName = "BillingShippingStep";

export const DocumentStep = React.memo<StepProps>(({ form }) => (
  <section className="flex flex-col gap-[18px]">
    <SectionHeading icon={<Icons.documentDetail />} title="Document Details" />
    <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
      <Autocomplete
        size="small"
        options={form.currencyOptions}
        value={form.currency}
        onChange={(_, next) => form.setCurrency(next)}
        getOptionLabel={(option) => option?.label ?? ""}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        renderInput={(params) => <TextField {...params} label="Currency" />}
      />
      <TextField
        size="small"
        label="Exchange Rate"
        type="number"
        value={form.exchange}
        onChange={(e) => form.setExchange(e.target.value)}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          format="DD-MM-YYYY"
          label="Due Date"
          value={form.dueDate}
          onChange={(next) => form.setDueDate(next)}
          slotProps={{ textField: { size: "small", fullWidth: true } }}
        />
      </LocalizationProvider>
      <TextField
        size="small"
        label="Payment Terms"
        value={form.paymentTerms}
        onChange={(e) => form.setPaymentTerms(e.target.value)}
      />
      <TextField
        size="small"
        label="Terms of Delivery"
        value={form.termsOfDelivery}
        onChange={(e) => form.setTermsOfDelivery(e.target.value)}
      />
      <div className="md:col-span-2">
        <TextField
          size="small"
          label="PO Remarks"
          fullWidth
          multiline
          minRows={2}
          value={form.poRemarks}
          onChange={(e) => form.setPoRemarks(e.target.value)}
        />
      </div>
    </div>

    <div className="flex items-center justify-between gap-[12px] rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-[14px]">
      <div className="text-[13px] text-slate-600">
        <b className="text-slate-800">{form.rows.length}</b> components
        {form.incompleteCount > 0 && (
          <span className="text-amber-600"> · {form.incompleteCount} need qty/rate/HSN</span>
        )}
      </div>
      <LoadingButton
        variant="outlined"
        size="small"
        loading={form.isComponentsPending}
        loadingPosition="start"
        startIcon={<Icons.view fontSize="small" />}
        onClick={form.openComponents}
      >
        View Components
      </LoadingButton>
    </div>
  </section>
));
DocumentStep.displayName = "DocumentStep";

export const ReviewStep = React.memo<StepProps>(({ form }) => (
  <section className="flex flex-col gap-[18px]">
    <SectionHeading icon={<Icons.checklist />} title="Review & Submit" />
    <p className="text-[13px] text-slate-500">
      Review the summary on the right. Click any section to jump back and edit, then submit the
      purchase order.
    </p>
    <div className="grid grid-cols-2 gap-[12px]">
      {[
        ["Taxable", money(form.totals.taxable)],
        ["CGST", money(form.totals.cgst)],
        ["SGST", money(form.totals.sgst)],
        ["IGST", money(form.totals.igst)],
      ].map(([k, v]) => (
        <div key={k} className="rounded-md border border-neutral-200 p-[12px]">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">{k}</div>
          <div className="text-[15px] font-semibold tabular-nums text-slate-800">{v}</div>
        </div>
      ))}
      <div className="col-span-2 rounded-md border border-slate-300 bg-slate-50 p-[12px]">
        <div className="text-[11px] uppercase tracking-wide text-slate-500">Grand Total</div>
        <div className="text-[18px] font-bold tabular-nums text-slate-900">
          {money(form.grandTotal)}
        </div>
      </div>
    </div>
    {form.incompleteCount > 0 && (
      <div className="flex items-center gap-[8px] rounded-md bg-amber-50 px-[12px] py-[10px] text-[12.5px] text-amber-700">
        <Icons.outlineinfo fontSize="small" />
        {form.incompleteCount} component{form.incompleteCount === 1 ? "" : "s"} still missing qty /
        rate / HSN code.
        <Button size="small" onClick={form.openComponents}>
          Fix now
        </Button>
      </div>
    )}

    {!form.canSubmit && form.incompleteCount === 0 && (
      <div className="flex items-center gap-[8px] rounded-md bg-amber-50 px-[12px] py-[10px] text-[12.5px] text-amber-700">
        <Icons.outlineinfo fontSize="small" />
        Fill in the vendor, address, currency and due date to enable <b>Submit PO</b>.
      </div>
    )}
  </section>
));
ReviewStep.displayName = "ReviewStep";
