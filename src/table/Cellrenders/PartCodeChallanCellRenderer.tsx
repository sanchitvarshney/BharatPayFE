import { Input } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { getPOComponentDetail } from "@/features/procurement/poSlices";
import { getAvailbleQty } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { LocationType } from "@/components/reusable/SelectLocationAcordingModule";

interface PartCodeChallanCellRendererProps {
  props: any;
  customFunction: () => void;
  pickLocation?: LocationType | null;
}

const COLUMNS_TO_REFRESH = ["partComponent", "qty", "rate", "remarks", "stock"];

const PartCodeChallanCellRenderer: React.FC<PartCodeChallanCellRendererProps> = ({
  props,
  customFunction,
  pickLocation = null,
}) => {
  const { value, colDef, data, api, column } = props;
  const dispatch = useAppDispatch();
  const { availbleQtyData } = useAppSelector((state) => state.materialRequestWithoutBom);

  useEffect(() => {
    customFunction();
  }, [value]);

  const updateAndRefresh = (field: string, newValue: unknown) => {
    data[field] = newValue;
    api.refreshCells({
      rowNodes: [props.node],
      columns: [column, ...COLUMNS_TO_REFRESH],
    });
    customFunction();
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
                columns: [column, "partComponent", "qty", "rate", "remarks", "uom", "stock"],
              });
              customFunction();
            }}
            onChange={(selectedValue: { label?: string; value?: string } | null) => {
              if (selectedValue?.value) {
                dispatch(getPOComponentDetail(selectedValue.value));
                if (pickLocation) {
                  const locationCode = pickLocation.code ?? pickLocation.sku ?? "";
                  dispatch(
                    getAvailbleQty({
                      type: "RM",
                      itemCode: selectedValue.value,
                      location: locationCode,
                    })
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
      case "qty":
        return (
          <Input
            suffix={data.uom}
            onChange={(e) => {
              if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                updateAndRefresh("qty", e.target.value);
              }
            }}
            value={value}
            placeholder={colDef.headerName}
            className="w-[100%] custom-input"
          />
        );
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
      case "stock": {
        const locationCode = pickLocation?.code ?? pickLocation?.sku ?? "";
        const itemCode = data?.partComponent?.value ?? "";
        const matchingItem = availbleQtyData?.find(
          (item) => item.location === locationCode && item.item === itemCode
        );
        const stockDisplay = matchingItem != null ? String(matchingItem.Stock) : "--";
        return <span className="flex items-center h-full">{stockDisplay}</span>;
      }
      default:
        return <span>{value != null ? String(value) : ""}</span>;
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  if (colDef.field === "stock") {
    const locationCode = pickLocation?.code ?? pickLocation?.sku ?? "";
    const itemCode = data?.partComponent?.value ?? "";
    const matchingItem = availbleQtyData?.find(
      (item) => item.location === locationCode && item.item === itemCode
    );
    const stockDisplay = matchingItem != null ? String(matchingItem.Stock) : "--";
    return <span className="flex items-center h-full">{stockDisplay}</span>;
  }

  return <span>{value != null ? String(value) : ""}</span>;
};

export default React.memo(PartCodeChallanCellRenderer);
