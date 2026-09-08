import React from "react";
import { Icons } from "@/components/icons";
import { SummaryRow } from "./parts";
import { money } from "./helpers";
import { CreatePoForm } from "./useCreatePoForm";

const cardCls =
  "rounded-md border border-neutral-200 bg-white p-[12px] text-left transition hover:border-slate-300";
const headCls = "mb-[8px] flex items-center gap-[6px] text-[12px] font-semibold text-slate-500";

export const SummaryPanel = React.memo<{ form: CreatePoForm }>(({ form }) => (
  <div className="hidden flex-col overflow-y-auto bg-neutral-50 lg:flex">
    <div className="border-b border-neutral-200 px-[18px] py-[14px]">
      <h4 className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">Summary</h4>
    </div>
    <div className="flex flex-col gap-[18px] px-[18px] py-[16px]">
      <button type="button" onClick={() => form.setStep(0)} className={cardCls}>
        <div className={headCls}>
          <Icons.user fontSize="small" /> Vendor
        </div>
        <div className="flex flex-col gap-[6px]">
          <SummaryRow label="Name" value={form.vendor?.text} strong />
          <SummaryRow label="Branch" value={form.vendorBranch ? form.branchLabel : ""} />
          <SummaryRow label="Mobile" value={form.vendorMobile} />
          <SummaryRow label="GSTIN" value={form.gstin} />
        </div>
      </button>

      <button type="button" onClick={() => form.setStep(1)} className={cardCls}>
        <div className={headCls}>
          <Icons.shipping fontSize="small" /> Billing & Shipping
        </div>
        <div className="flex flex-col gap-[6px]">
          <SummaryRow label="Billing" value={form.billLabel} />
          <SummaryRow label="Shipping" value={form.shipLabel} />
        </div>
      </button>

      <button type="button" onClick={() => form.setStep(2)} className={cardCls}>
        <div className={headCls}>
          <Icons.documentDetail fontSize="small" /> Document
        </div>
        <div className="flex flex-col gap-[6px]">
          <SummaryRow label="Currency" value={form.currency?.label} />
          <SummaryRow label="Exchange" value={form.exchange} />
          <SummaryRow label="Due Date" value={form.dueDateText} />
          <SummaryRow label="Payment Terms" value={form.paymentTerms} />
          <SummaryRow label="Terms of Delivery" value={form.termsOfDelivery} />
        </div>
      </button>

      <button type="button" onClick={form.openComponents} className={cardCls}>
        <div className={headCls}>
          <Icons.checklist fontSize="small" /> Components
        </div>
        <div className="flex flex-col gap-[6px]">
          <SummaryRow label="Items" value={form.rows.length} />
          <SummaryRow label="Taxable" value={money(form.totals.taxable)} />
          <SummaryRow label="CGST" value={money(form.totals.cgst)} />
          <SummaryRow label="SGST" value={money(form.totals.sgst)} />
          <SummaryRow label="IGST" value={money(form.totals.igst)} />
          <div className="my-[2px] h-px bg-neutral-200" />
          <SummaryRow label="Grand Total" value={money(form.grandTotal)} strong />
        </div>
      </button>
    </div>
  </div>
));
SummaryPanel.displayName = "SummaryPanel";
