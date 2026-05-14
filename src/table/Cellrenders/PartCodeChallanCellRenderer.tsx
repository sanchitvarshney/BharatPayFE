import { Input, Select, Spin } from "antd";
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
}

const COLUMNS_TO_REFRESH = [
  "partComponent",
  "pickLocation",
  "hsn",
  "qty",
  "rate",
  "remarks",
  "stock",
  "gstState",
  "gstRate",
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

const GST_TYPE_OPTIONS = [
  { code: "inter", name: "Inter State" },
  { code: "local", name: "Intra State" },
] as const;

const normalizeGstStateValue = (
  raw: { label?: string; value?: string } | string | null | undefined
): { label: string; value: string } | null => {
  if (raw == null || raw === "") return null;
  if (typeof raw === "string") {
    if (raw === "Inter State") return { label: "Inter State", value: "inter" };
    if (raw === "Intra State") return { label: "Intra State", value: "local" };
    if (raw === "inter") return { label: "Inter State", value: "inter" };
    if (raw === "local") return { label: "Intra State", value: "local" };
    return null;
  }
  const v = raw.value ?? "";
  const label = raw.label ?? "";
  if (!v && !label) return null;
  const match = GST_TYPE_OPTIONS.find((o) => o.code === v || o.name === label);
  if (match) return { label: match.name, value: match.code };
  return { label: label || v, value: v };
};

const PartCodeChallanCellRenderer: React.FC<PartCodeChallanCellRendererProps> = ({
  props,
  customFunction,
  pickLocation = null,
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
                columns: [column, "partComponent", "hsn", "qty", "rate", "remarks", "uom", "stock", "gstState", "gstRate"],
              });
              customFunction();
            }}
            onChange={(selectedValue: { label?: string; value?: string } | null) => {
              if (selectedValue?.value) {
                dispatch(getPOComponentDetail(selectedValue.value)).then((response: any) => {
                  const res = response?.payload?.data;
                  const hsn = res?.data?.hsn;
                  if (hsn != null) {
                    data.hsn = hsn;
                  }
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
      case "gstState": {
        const normalized = normalizeGstStateValue(value);
        const optionRows = GST_TYPE_OPTIONS.map((item) => ({
          value: item.code,
          label: item.name,
        }));
        const mergedOptions =
          normalized?.value &&
          !GST_TYPE_OPTIONS.some((o) => o.code === normalized.value)
            ? [{ value: normalized.value, label: normalized.label }, ...optionRows]
            : optionRows;
        return (
          <Select
            showSearch
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className="w-[100%] custom-select"
            placeholder="GST Type"
            allowClear
            value={normalized?.value}
            onChange={(selectedValue) => {
              if (selectedValue == null) {
                updateAndRefresh("gstState", null);
                return;
              }
              const item = GST_TYPE_OPTIONS.find((o) => o.code === selectedValue);
              updateAndRefresh(
                "gstState",
                item ? { value: item.code, label: item.name } : null
              );
            }}
            options={mergedOptions}
          />
        );
      }
      case "gstRate":
        return (
          <Input
            onChange={(e) => {
              if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                updateAndRefresh("gstRate", e.target.value);
              }
            }}
            value={value}
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
      default:
        return <span>{value != null ? String(value) : ""}</span>;
    }
  };

  if (data.isNew) {
    return renderContent();
  }

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
  if (colDef.field === "gstState") {
    const n = normalizeGstStateValue(value);
    return (
      <span className="flex items-center h-full">
        {n?.label ?? (typeof value === "string" ? value : "")}
      </span>
    );
  }

  return <span>{value != null ? String(value) : ""}</span>;
};

export default React.memo(PartCodeChallanCellRenderer);
