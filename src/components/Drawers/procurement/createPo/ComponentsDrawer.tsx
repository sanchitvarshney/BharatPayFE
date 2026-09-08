import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { Icons } from "@/components/icons";
import { NumCell } from "./parts";
import { money, rowGst, rowIncomplete, rowTaxable } from "./helpers";
import { ComponentRow } from "./types";
import { CreatePoForm } from "./useCreatePoForm";

const CHUNK = 25;

type RowProps = {
  row: ComponentRow;
  index: number;
  onPatch: (index: number, patch: Partial<ComponentRow>) => void;
};

const ComponentEditorRow = React.memo<RowProps>(({ row, index, onPatch }) => {
  const gst = rowGst(row);
  const patch = useCallback((p: Partial<ComponentRow>) => onPatch(index, p), [onPatch, index]);

  return (
    <tr
      className={`border-t border-neutral-200 align-top ${
        rowIncomplete(row) ? "bg-amber-50/60" : ""
      }`}
    >
      <td className="p-[10px] text-slate-500">{index + 1}</td>
      <td className="p-[10px]">
        <span className="flex items-center gap-[6px] font-medium text-slate-700">
          {row.componentName || row.componentKey || "--"}
          {!row.enabled && (
            <Chip
              label="Inactive"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ height: 18, fontSize: 10 }}
            />
          )}
        </span>
        <span className="mt-[2px] block text-[11px] text-slate-400">
          {[
            row.partNo,
            row.lastPo && `Last PO ${row.lastPo}`,
            row.lastQty > 0 && `Qty ${row.lastQty.toLocaleString("en-IN")}`,
            row.lastOrdered,
          ]
            .filter(Boolean)
            .join("  ·  ") || "No purchase history"}
        </span>
      </td>
      <td className="p-[8px]">
        <NumCell value={row.qty} onChange={(v) => patch({ qty: v })} />
      </td>
      <td className="p-[8px]">
        <NumCell value={row.rate} onChange={(v) => patch({ rate: v })} />
      </td>
      <td className="p-[8px]">
        <NumCell value={row.hsnCode} onChange={(v) => patch({ hsnCode: v })} text />
      </td>
      <td className="p-[8px]">
        <Select
          size="small"
          value={row.gstType}
          onChange={(e) => patch({ gstType: e.target.value })}
          fullWidth
        >
          <MenuItem value="L">Local</MenuItem>
          <MenuItem value="I">Inter State</MenuItem>
        </Select>
      </td>
      <td className="p-[8px]">
        <NumCell value={row.gstRate} onChange={(v) => patch({ gstRate: v })} />
      </td>
      <td className="p-[10px] text-right tabular-nums">{money(rowTaxable(row))}</td>
      <td className="p-[10px] text-right tabular-nums">{money(gst.cgst)}</td>
      <td className="p-[10px] text-right tabular-nums">{money(gst.sgst)}</td>
      <td className="p-[10px] text-right tabular-nums">{money(gst.igst)}</td>
      <td className="p-[8px]">
        <NumCell value={row.remark} onChange={(v) => patch({ remark: v })} text />
      </td>
    </tr>
  );
});
ComponentEditorRow.displayName = "ComponentEditorRow";

const Totals: React.FC<{ totals: CreatePoForm["totals"]; grandTotal: number }> = ({
  totals,
  grandTotal,
}) => (
  <div className="flex flex-wrap items-center gap-[16px]">
    <span>
      Taxable <b className="text-slate-800">{money(totals.taxable)}</b>
    </span>
    <span>
      CGST <b className="text-slate-800">{money(totals.cgst)}</b>
    </span>
    <span>
      SGST <b className="text-slate-800">{money(totals.sgst)}</b>
    </span>
    <span>
      IGST <b className="text-slate-800">{money(totals.igst)}</b>
    </span>
    <span className="text-[13px]">
      Total <b className="text-slate-900">{money(grandTotal)}</b>
    </span>
  </div>
);

const Spinner: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-full flex-col items-center justify-center gap-[10px] text-slate-500">
    <CircularProgress size={26} />
    <span className="text-[13px]">{label}</span>
  </div>
);

export const ComponentsDrawer: React.FC<{ form: CreatePoForm }> = ({ form }) => {
  const { rows, updateRow, totals, grandTotal, componentsOpen, closeComponents } = form;

  // The table mounts a lot of MUI inputs. Show the drawer instantly, then paint
  // the rows a frame later (spinner meanwhile) and stream the rest in chunks.
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(CHUNK);

  useEffect(() => {
    if (!componentsOpen) {
      setReady(false);
      setVisible(CHUNK);
      return;
    }
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, [componentsOpen]);

  useEffect(() => {
    if (!ready || visible >= rows.length) return;
    const raf = requestAnimationFrame(() => setVisible((v) => Math.min(v + CHUNK, rows.length)));
    return () => cancelAnimationFrame(raf);
  }, [ready, visible, rows.length]);

  return (
    <Drawer
      anchor="right"
      open={componentsOpen}
      onClose={closeComponents}
      PaperProps={{ sx: { width: { xs: "100%", md: "82%" } } }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-neutral-200 bg-zinc-100 px-[18px]">
          <span className="flex items-center gap-[8px] font-semibold text-slate-700">
            <Icons.checklist fontSize="small" /> Component Details
            <Chip size="small" label={`${rows.length}`} />
            {ready && visible < rows.length && (
              <span className="flex items-center gap-[6px] text-[12px] font-normal text-slate-400">
                <CircularProgress size={12} /> loading {visible}/{rows.length}
              </span>
            )}
          </span>
          <IconButton size="small" onClick={closeComponents}>
            <Icons.close fontSize="small" />
          </IconButton>
        </div>

        <div className="flex-1 overflow-auto">
          {!ready ? (
            <Spinner label={`Loading ${rows.length} components…`} />
          ) : (
            <table className="w-full border-collapse text-[13px]">
              <thead className="sticky top-0 z-[1] bg-neutral-50">
                <tr className="text-left text-slate-600">
                  <th className="w-[40px] p-[10px] font-semibold">#</th>
                  <th className="p-[10px] font-semibold">Component</th>
                  <th className="w-[104px] p-[10px] font-semibold">Qty</th>
                  <th className="w-[104px] p-[10px] font-semibold">Rate</th>
                  <th className="w-[110px] p-[10px] font-semibold">HSN</th>
                  <th className="w-[116px] p-[10px] font-semibold">GST Type</th>
                  <th className="w-[86px] p-[10px] font-semibold">GST %</th>
                  <th className="w-[110px] p-[10px] text-right font-semibold">Taxable</th>
                  <th className="w-[100px] p-[10px] text-right font-semibold">CGST</th>
                  <th className="w-[100px] p-[10px] text-right font-semibold">SGST</th>
                  <th className="w-[100px] p-[10px] text-right font-semibold">IGST</th>
                  <th className="w-[160px] p-[10px] font-semibold">Remark</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, visible).map((row, index) => (
                  <ComponentEditorRow
                    key={row.componentKey}
                    row={row}
                    index={index}
                    onPatch={updateRow}
                  />
                ))}
                {visible < rows.length && (
                  <tr>
                    <td colSpan={12} className="p-[16px] text-center text-slate-400">
                      <CircularProgress size={18} />
                    </td>
                  </tr>
                )}
                {!rows.length && (
                  <tr>
                    <td colSpan={12} className="p-[24px] text-center text-slate-400">
                      No components selected
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-[16px] border-t border-neutral-300 bg-neutral-50 px-[18px] py-[10px] text-[12.5px] text-slate-600">
          <Totals totals={totals} grandTotal={grandTotal} />
          <Button variant="contained" size="small" onClick={closeComponents}>
            Done
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
