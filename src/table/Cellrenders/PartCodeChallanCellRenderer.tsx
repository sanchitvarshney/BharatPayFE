import { Input, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { getPOComponentDetail } from "@/features/procurement/poSlices";
import { getAvailbleQty } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { LocationType } from "@/components/reusable/SelectLocationAcordingModule";
import { showToast } from "@/utils/toasterContext";
import AntLocationSelectAcordinttoModule from "@/components/reusable/antSelecters/AntLocationSelectAcordinttoModule";

interface PartCodeChallanCellRendererProps {
  props: any;
  customFunction: () => void;
  pickLocation?: LocationType | null;
  gstType?: string; // "Inter State" | "Intra State"
}


const COLUMNS_TO_REFRESH = [
  "partComponent",
  "pickLocation",
  "hsn",
  "qty",
  "rate",
  "remarks",
  "stock",
  "gstType",
  "gstRate",
  "cgst",
  "sgst",
  "igst",
  "taxableAmount",
  "totalAmount",
];

const getRowLocationCode = (
  rowPickLocation?: { label?: string; value?: string } | null,
  headerPickLocation?: LocationType | null
): string => {
  if (rowPickLocation?.value) return rowPickLocation.value;
  if (headerPickLocation) return headerPickLocation.code ?? headerPickLocation.sku ?? "";
  return "";
};

const findMatchingStockItem = (
  availbleQtyData: { Stock: number; location: string; item: string }[] | null | undefined,
  itemCode: string,
  locationCode: string
) => {
  if (!availbleQtyData || !itemCode || !locationCode) return null;
  return (
    availbleQtyData.find((item) => item.location === locationCode && item.item === itemCode) ?? null
  );
};

/**
 * Recomputes CGST, SGST, IGST, Taxable Amount and Total Amount
 * directly on the data object and returns void.
 */
const recomputeGstValues = (data: any, gstType: string) => {
  const qty = Number(data.qty) || 0;
  const rate = Number(data.rate) || 0;
  const gstRate = Number(data.gstRate) || 0;
  const taxableAmount = qty * rate;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (gstType === "Intra State") {
    cgst = (taxableAmount * (gstRate / 2)) / 100;
    sgst = (taxableAmount * (gstRate / 2)) / 100;
  } else if (gstType === "Inter State") {
    igst = (taxableAmount * gstRate) / 100;
  }

  data.taxableAmount = taxableAmount;
  data.cgst = cgst;
  data.sgst = sgst;
  data.igst = igst;
  data.totalAmount = taxableAmount + cgst + sgst + igst;
};

const PartCodeChallanCellRenderer: React.FC<PartCodeChallanCellRendererProps> = ({
  props,
  customFunction,
  pickLocation = null,
  gstType = "",
}) => {
  const { value, colDef, data, api, column } = props;
  const dispatch = useAppDispatch();
  const { availbleQtyData } = useAppSelector((state) => state.materialRequestWithoutBom);
  const [stockDisplay, setStockDisplay] = useState("--");
  const isStockLoading = Boolean(data?._stockLoading);

  useEffect(() => {
    customFunction();
  }, [value]);

  useEffect(() => {
    const itemCode = data?.partComponent?.value ?? "";
    const locationCode = getRowLocationCode(data?.pickLocation, pickLocation);
    const matchingItem = findMatchingStockItem(availbleQtyData, itemCode, locationCode);
    setStockDisplay(matchingItem != null ? String(matchingItem.Stock) : "--");
    api.refreshCells({
      rowNodes: [props.node],
      columns: ["stock", "qty"],
    });
  }, [availbleQtyData, data?.partComponent?.value, data?.pickLocation?.value, pickLocation, props.node, api]);

  const updateAndRefresh = (field: string, newValue: unknown) => {
    data[field] = newValue;
    // Recompute GST after any relevant field changes
    if (["qty", "rate", "gstRate"].includes(field)) {
      recomputeGstValues(data, gstType);
    }
    api.refreshCells({
      rowNodes: [props.node],
      columns: [column, ...COLUMNS_TO_REFRESH],
    });
    customFunction();
  };

  const refreshStockState = () => {
    api.refreshCells({
      rowNodes: [props.node],
      columns: ["pickLocation", "stock", "qty"],
    });
  };

  const fetchAvailableQty = (
    itemCode: string,
    location: { label?: string; value?: string } | string | null | undefined
  ) => {
    if (!itemCode || !location) return Promise.resolve();
    data._stockLoading = true;
    refreshStockState();
    return dispatch(
      getAvailbleQty({
        type: "RM",
        itemCode,
        location,
      })
    ).finally(() => {
      data._stockLoading = false;
      refreshStockState();
    });
  };

  const getStockForRow = (): number | null => {
    const itemCode = data?.partComponent?.value ?? "";
    const locationCode = getRowLocationCode(data?.pickLocation, pickLocation);
    const matchingItem = findMatchingStockItem(availbleQtyData, itemCode, locationCode);
    if (matchingItem == null) return null;
    const stock = Number(matchingItem.Stock);
    return Number.isFinite(stock) ? stock : null;
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "partComponent":
        return (
          <AntCompSelect
            getUom={(uomValue: string) => {
              data.uom = uomValue;
              api.refreshCells({
                rowNodes: [props.node],
                columns: [column, "partComponent", "hsn", "qty", "rate", "remarks", "uom", "stock"],
              });
              customFunction();
            }}
            onChange={(selectedValue: { label?: string; value?: string } | null) => {
              if (selectedValue?.value) {
                dispatch(getPOComponentDetail(selectedValue.value)).then((response: any) => {
                  const res = response?.payload?.data;
                  const itemData = res?.data;

                  // Auto-fill HSN
                  if (itemData?.hsn != null) {
                    data.hsn = itemData.hsn;
                  }
                  // Auto-fill Item Rate
                  if (itemData?.itemRate != null && itemData?.itemRate !== "") {
                    data.rate = String(itemData.itemRate);
                  }
                  // Auto-fill GST Rate
                  if (itemData?.gst_rate != null && itemData?.gst_rate !== "") {
                    data.gstRate = String(itemData.gst_rate);
                  } else if (itemData?.gst_rate != null && itemData?.gst_rate !== "") {
                    data.gstRate = String(itemData.gst_rate);
                  }
                  // Recompute GST values with the newly set rate + gstRate
                  recomputeGstValues(data, gstType);

                  api.refreshCells({
                    rowNodes: [props.node],
                    columns: [column, ...COLUMNS_TO_REFRESH],
                  });
                  customFunction();
                });
                if (data?.pickLocation) {
                  fetchAvailableQty(selectedValue.value, data.pickLocation);
                } else if (pickLocation) {
                  fetchAvailableQty(
                    selectedValue.value,
                    pickLocation.code ?? pickLocation.sku ?? ""
                  );
                }
              }
              data[colDef.field] = selectedValue;
              api.refreshCells({
                rowNodes: [props.node],
                columns: [column, ...COLUMNS_TO_REFRESH],
              });
              customFunction();
            }}
            value={
              value
                ? {
                    ...value,
                    label: value?.label || value?.text || value?.lable,
                  }
                : null
            }
          />
        );

      case "pickLocation":
        return (
          <AntLocationSelectAcordinttoModule
            endpoint="/req/without-bom/pick-location"
            loading={isStockLoading}
            onChange={(value: { label?: string; value?: string } | null) => {
              data.pickLocation = value;
              api.refreshCells({
                rowNodes: [props.node],
                columns: [column, ...COLUMNS_TO_REFRESH],
              });
              customFunction();
              void fetchAvailableQty(data?.partComponent?.value || "", value);
            }}
            value={value ? {
              ...value,
              label: value?.label || value?.text || value?.lable,
            } : null}
          />
        );

      case "qty": {
        const maxStock = getStockForRow();
        return (
          <Input
            suffix={data.uom}
            onChange={(e) => {
              const raw = e.target.value;
              if (!/^-?\d*\.?\d*$/.test(raw)) return;
              const numVal = raw === "" || raw === "-" ? null : Number(raw);
              if (maxStock != null && numVal != null && numVal > maxStock) {
                showToast(`Qty cannot exceed stock (${maxStock})`, "error");
                updateAndRefresh("qty", String(maxStock));
                return;
              }
              updateAndRefresh("qty", raw);
            }}
            value={value}
            placeholder={maxStock != null ? `Max ${maxStock}` : colDef.headerName}
            className="w-[100%] custom-input"
          />
        );
      }

      case "rate":
        return (
          <Input
            min={0}
            onChange={(e) => {
              if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                updateAndRefresh("rate", e.target.value);
              }
            }}
            value={value}
            placeholder={colDef.headerName}
            className="w-[100%] custom-input"
          />
        );

      case "remarks":
        return (
          <Input
            onChange={(e) => updateAndRefresh("remarks", e.target.value)}
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] custom-input"
          />
        );

      case "stock":
        return (
          <span className="flex items-center h-full">
            {isStockLoading ? <Spin size="small" /> : stockDisplay}
          </span>
        );

      case "hsn":
        return (
          <Input
            onChange={(e) => updateAndRefresh("hsn", e.target.value)}
            value={value ?? ""}
            type="text"
            placeholder="HSN (editable)"
            className="w-[100%] custom-input"
          />
        );

      case "gstType":
        // Auto-determined from addresses – read-only display
        return (
          <span className="flex items-center h-full text-[13px] font-medium">
            {gstType || "--"}
          </span>
        );

      case "gstRate":
        return (
          <Input
            min={0}
            onChange={(e) => {
              if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                updateAndRefresh("gstRate", e.target.value);
              }
            }}
            value={value ?? ""}
            placeholder="GST %"
            className="w-[100%] custom-input"
            suffix="%"
          />
        );

      case "taxableAmount":
        return (
          <span className="flex items-center h-full text-[13px]">
            {data.taxableAmount != null ? Number(data.taxableAmount).toFixed(2) : "0.00"}
          </span>
        );

      case "cgst":
        return (
          <span className="flex items-center h-full text-[13px]">
            {data.cgst != null ? Number(data.cgst).toFixed(2) : "0.00"}
          </span>
        );

      case "sgst":
        return (
          <span className="flex items-center h-full text-[13px]">
            {data.sgst != null ? Number(data.sgst).toFixed(2) : "0.00"}
          </span>
        );

      case "igst":
        return (
          <span className="flex items-center h-full text-[13px]">
            {data.igst != null ? Number(data.igst).toFixed(2) : "0.00"}
          </span>
        );

      case "totalAmount":
        return (
          <span className="flex items-center h-full text-[13px] font-semibold">
            {data.totalAmount != null ? Number(data.totalAmount).toFixed(2) : "0.00"}
          </span>
        );

      default:
        return <span>{value != null ? String(value) : ""}</span>;
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  // Non-editable rows – still render editable special fields
  if (colDef.field === "stock") {
    return (
      <span className="flex items-center h-full">
        {isStockLoading ? <Spin size="small" /> : stockDisplay}
      </span>
    );
  }
  if (colDef.field === "hsn") {
    return (
      <Input
        onChange={(e) => {
          data.hsn = e.target.value;
          api.refreshCells({
            rowNodes: [props.node],
            columns: [column, ...COLUMNS_TO_REFRESH],
          });
          customFunction();
        }}
        value={value ?? ""}
        type="text"
        placeholder="HSN (editable)"
        className="w-[100%] custom-input"
      />
    );
  }
  if (colDef.field === "gstRate") {
    return (
      <Input
        min={0}
        onChange={(e) => {
          if (/^-?\d*\.?\d*$/.test(e.target.value)) {
            updateAndRefresh("gstRate", e.target.value);
          }
        }}
        value={value ?? ""}
        placeholder="GST %"
        className="w-[100%] custom-input"
        suffix="%"
      />
    );
  }
  if (colDef.field === "gstType") {
    return (
      <span className="flex items-center h-full text-[13px] font-medium">
        {gstType || "--"}
      </span>
    );
  }
  if (colDef.field === "taxableAmount") {
    return (
      <span className="flex items-center h-full text-[13px]">
        {data.taxableAmount != null ? Number(data.taxableAmount).toFixed(2) : "0.00"}
      </span>
    );
  }
  if (colDef.field === "cgst") {
    return (
      <span className="flex items-center h-full text-[13px]">
        {data.cgst != null ? Number(data.cgst).toFixed(2) : "0.00"}
      </span>
    );
  }
  if (colDef.field === "sgst") {
    return (
      <span className="flex items-center h-full text-[13px]">
        {data.sgst != null ? Number(data.sgst).toFixed(2) : "0.00"}
      </span>
    );
  }
  if (colDef.field === "igst") {
    return (
      <span className="flex items-center h-full text-[13px]">
        {data.igst != null ? Number(data.igst).toFixed(2) : "0.00"}
      </span>
    );
  }
  if (colDef.field === "totalAmount") {
    return (
      <span className="flex items-center h-full text-[13px] font-semibold">
        {data.totalAmount != null ? Number(data.totalAmount).toFixed(2) : "0.00"}
      </span>
    );
  }

  return <span>{value != null ? String(value) : ""}</span>;
};

export default React.memo(PartCodeChallanCellRenderer);
