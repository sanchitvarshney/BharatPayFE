import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { fetchStockQuantity } from "@/features/materialManagement/materialManagementSlices";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Input } from "antd";
import React, { useEffect, useState } from "react";

interface MaterialManagementCellRendererProps {
  props: any;
  customFunction: () => void;
  updateRowData: (id: string, field: string, value: any) => void;
  fromLocation: { name: string; code: string } | null;
  fromCostCenter: { text: string; id: string } | null;
}

const MaterialManagementCellRenderer: React.FC<
  MaterialManagementCellRendererProps
> = ({ props, customFunction }) => {
  const { stockQuantityData } = useAppSelector(
    (state) => state.materialManagement
  );
  const dispatch = useAppDispatch();
  const { value, colDef, data, api, column } = props;
  const {fromLoc , fromCC} = useAppSelector((state) => state.materialManagement);

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({
      rowNodes: [props.node],
      columns: [
        column,
        "id",
        "component",
        "pickLocation",
        "quantity",
        "remarks",
        "unit",
        "availableqty",
      ],
    });
  };


  const renderContent = () => {
    switch (colDef.field) {
      case "component":
        return (
          <AntCompSelect
            getUom={(value) => {
              data.unit = value;
              api.refreshCells({
                rowNodes: [props.node],
                columns: [
                  column,
                  "id",
                  "component",
                  "pickLocation",
                  "quantity",
                  "remarks",
                  "unit",
                  "availableqty",
                ],
              });
              customFunction();
            }}
            onChange={(selectedValue) => {
              const newValue = selectedValue;
              data[colDef.field] = newValue; // update the data
              if (selectedValue && fromLoc && fromCC) {
                dispatch(
                  fetchStockQuantity({
                    location: fromLoc.code,
                    component: selectedValue.value || "",
                    costCenter: fromCC.id,
                  })
                );
              }
              api.refreshCells({
                rowNodes: [props.node],
                columns: [
                  column,
                  "id",
                  "component",
                  "pickLocation",
                  "quantity",
                  "remarks",
                  "unit",
                  "availableqty",
                ],
              });
            }}
            value={value}
          />
        );

      case "quantity":
        return (
          <div className="flex items-center h-full">
            <Input
              suffix={data.unit}
              min={0}
              onChange={(e) => {
                const unit = (data?.unit || "").toString().toLowerCase();
                const valueStr = e.target.value;
                const isDecimalAllowed = unit === "ltr" || unit === "kg";
                const decimalPattern = /^\d*(?:\.\d*)?$/; // allow decimals
                const integerPattern = /^\d*$/; // integers only

                // Check if quantity exceeds available quantity
                const availableQty = parseFloat(data.availableqty) || 0;
                const enteredQty = parseFloat(valueStr) || 0;
console.log(availableQty,enteredQty,"okk",data)
                if (enteredQty > availableQty) {
                  // Don't allow quantity greater than available
                  return;
                }

                if (
                  (isDecimalAllowed && decimalPattern.test(valueStr)) ||
                  (!isDecimalAllowed && integerPattern.test(valueStr))
                ) {
                  handleInputChange(e);
                }
              }}
              value={value}
              placeholder={colDef.headerName}
              className="custom-input"
            />
          </div>
        );

      case "remarks":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="custom-input"
          />
        );

      case "availableqty":
        const [availableQty, setAvailableQty] = useState("--");

        useEffect(() => {
          console.log(stockQuantityData)
          if (stockQuantityData && data) {
            // Check if the stock data matches the current row's component and from location
            if (
              stockQuantityData.component === data?.component?.value &&
              stockQuantityData.location === fromLoc?.code
            ) {
              setAvailableQty(stockQuantityData.balance.toString() || "--");
            } else {
              setAvailableQty("--");
            }

            // Refresh the AG Grid cells
            api.refreshCells({
              rowNodes: [props.node],
              columns: [
                column,
                "id",
                "component",
                "quantity",
                "remarks",
                "unit",
                "availableqty",
              ],
            });
          }
        }, [stockQuantityData, data, props.node, api, column, fromLoc]);

        return availableQty;

      default:
        return <span>{value}</span>;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default MaterialManagementCellRenderer;
