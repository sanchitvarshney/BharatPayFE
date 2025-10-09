import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { fetchComponentStock } from "@/features/partCodeConversion/partCodeConversionSlices";
import { Input, message } from "antd";

interface ComponentCellRendererProps {
  props: any;
  showStockInfo?: boolean; // Optional prop to show stock info
}

const ComponentCellRenderer: React.FC<ComponentCellRendererProps> = ({
  props,
  showStockInfo = false,
}) => {
  const dispatch = useAppDispatch();
  const { stockInfo, stockLoading, pickLocation } = useAppSelector(
    (state) => state.partCodeConversion
  );

  const { data, value, colDef, api, column } = props;
  const field = colDef?.field;

  const [localValue, setLocalValue] = useState(value || "");
  const [availableStock, setAvailableStock] = useState<number>(0);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    if (showStockInfo && stockInfo && data.component?.value) {
      const newAvailableQty = `${stockInfo.balance} ${stockInfo.uom || ""}`;
      data.availableqty = newAvailableQty;
      setAvailableStock(stockInfo.balance || 0);
      api.refreshCells({
        rowNodes: [props.node],
        columns: ["availableqty"],
      });
    }
  }, [stockInfo, showStockInfo, data.component?.value, api, props.node]);

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;

    // Validate quantity for initial components
    if (field === "quantity" && showStockInfo && availableStock > 0) {
      const enteredQty = parseFloat(newValue) || 0;
      if (enteredQty > availableStock) {
        message.error(
          `Quantity cannot exceed available stock (${availableStock})`
        );
        return;
      }
    }

    data[colDef.field] = newValue;
    api.refreshCells({
      rowNodes: [props.node],
      columns: [column, "id", "component", "quantity", "availableqty", "unit"],
    });
  };

  const handleComponentChange = (selectedValue: any) => {
    const newValue = selectedValue;
    data[colDef.field] = newValue;

    // Clear previous available quantity when component changes
    if (showStockInfo) {
      data.availableqty = "--";
      setAvailableStock(0);
    }

    // Fetch stock for initial components only when showStockInfo is true
    if (selectedValue && pickLocation && showStockInfo) {
      dispatch(
        fetchComponentStock({
          component: selectedValue.value,
          location: pickLocation.value || pickLocation.code,
        })
      );
    }

    api.refreshCells({
      rowNodes: [props.node],
      columns: [column, "id", "component", "quantity", "availableqty", "unit"],
    });
  };

  const renderCellContent = () => {
    switch (field) {
      case "component":
        return (
          <AntCompSelect
            value={localValue}
            onChange={handleComponentChange}
            getUom={(value) => {
              data.unit = value;
              api.refreshCells({
                rowNodes: [props.node],
                columns: [
                  column,
                  "id",
                  "component",
                  "quantity",
                  "availableqty",
                  "unit",
                ],
              });
            }}
          />
        );

      case "quantity":
        return (
          <Input
            type="number"
            value={localValue}
            onChange={handleInputChange}
            placeholder="Enter Quantity"
            min={0}
            max={showStockInfo ? availableStock : undefined}
            status={
              showStockInfo &&
              availableStock > 0 &&
              parseFloat(localValue) > availableStock
                ? "error"
                : ""
            }
          />
        );

      case "availableqty":
        if (showStockInfo) {
          return (
            <Typography variant="body2" color="text.secondary">
              {stockLoading
                ? "Loading..."
                : stockInfo && stockInfo.balance !== undefined
                ? `${stockInfo.balance} ${stockInfo.uom || ""}`
                : "--"}
            </Typography>
          );
        }
        return <Typography variant="body2">--</Typography>;

      default:
        return <Typography variant="body2">{localValue}</Typography>;
    }
  };

  return (
    <div className="w-full h-full flex items-center px-2">
      {renderCellContent()}
    </div>
  );
};

export default ComponentCellRenderer;
