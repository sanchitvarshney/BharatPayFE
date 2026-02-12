import { Input } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useReduxHook";
import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { getPOComponentDetail } from "@/features/procurement/poSlices";

interface PartCodeChallanCellRendererProps {
  props: any;
  customFunction: () => void;
}

const PartCodeChallanCellRenderer: React.FC<PartCodeChallanCellRendererProps> = ({
  props,
  customFunction,
}) => {
  const { value, colDef, data, api, column } = props;
  const dispatch = useAppDispatch();

  useEffect(() => {
    customFunction();
  }, [value]);

  const updateAndRefresh = (field: string, newValue: unknown) => {
    data[field] = newValue;
    api.refreshCells({
      rowNodes: [props.node],
      columns: [column, "partComponent", "qty", "rate", "remarks"],
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
                columns: [column, "partComponent", "qty", "rate", "remarks", "uom"],
              });
              customFunction();
            }}
            onChange={(selectedValue: { label?: string; value?: string } | null) => {
              if (selectedValue?.value) {
                dispatch(getPOComponentDetail(selectedValue.value));
              }
              data[colDef.field] = selectedValue;
              api.refreshCells({
                rowNodes: [props.node],
                columns: [column, "partComponent", "qty", "rate", "remarks"],
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
      default:
        return <span>{value != null ? String(value) : ""}</span>;
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value != null ? String(value) : ""}</span>;
};

export default React.memo(PartCodeChallanCellRenderer);
