import { Input } from "antd";
import React, { useEffect, useCallback } from "react";
import { useAppSelector } from "@/hooks/useReduxHook";
import AntLocationSelectAcordinttoModule from "@/components/reusable/antSelecters/AntLocationSelectAcordinttoModule";

interface POCellRendererProps {
  props: any;
  customFunction: () => void;
}

const MINFromPOTextInputCellRenderer: React.FC<POCellRendererProps> = ({
  props,
  customFunction,
}) => {
  const { value, colDef, data, api } = props;
  const { currencyData } = useAppSelector((state) => state.common);

  // Call customFunction whenever value changes
  useEffect(() => {
    if (data.isNew) {
      customFunction();
    }
  }, [value, data.isNew, customFunction]);

  const updateCellAndRefresh = useCallback(
    (newValue: any, field: string) => {
      // Update the data
      data[field] = newValue;

      // Force grid to update
      api.applyTransaction({
        update: [data],
      });

      // Call customFunction to update totals
      if (data.isNew) {
        customFunction();
      }
    },
    [data, api, customFunction]
  );

  const renderContent = () => {
    switch (colDef.field) {
      case "partComponent":
        return <span>{value}</span>;
      case "location":
        return (
          <AntLocationSelectAcordinttoModule
            endpoint="/transaction/rm-inward-location"
            onChange={(value) => {
              updateCellAndRefresh(value, colDef.field);
            }}
            value={value}
          />
        );
      case "rate":
        return (
          <div className="flex items-center gap-[5px]">
            <Input
              min={0}
              onChange={(e) => {
                if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                  const newValue = e.target.value;
                  updateCellAndRefresh(newValue, colDef.field);

                  if (
                    currencyData?.find((item) => item.id === data.currency)
                      ?.text === "₹"
                  ) {
                    updateCellAndRefresh(0, "foreignValue");
                    updateCellAndRefresh(
                      Number(data.qty) * Number(newValue),
                      "taxableValue"
                    );
                  } else if (data.currency === "0" || data.currency === "") {
                    updateCellAndRefresh(
                      Number(data.qty) * Number(newValue),
                      "taxableValue"
                    );
                  } else {
                    updateCellAndRefresh(
                      Number(data.qty) * Number(newValue),
                      "foreignValue"
                    );
                    updateCellAndRefresh(
                      Number(data.qty) *
                        Number(newValue) *
                        Number(data.excRate),
                      "taxableValue"
                    );
                  }

                  // Update GST calculations
                  const taxableValue = data.taxableValue;
                  if (data.gstType === "L") {
                    const sgst =
                      ((Number(data.gstRate) / 100) * taxableValue) / 2;
                    const cgst =
                      ((Number(data.gstRate) / 100) * taxableValue) / 2;
                    updateCellAndRefresh(sgst, "sgst");
                    updateCellAndRefresh(cgst, "cgst");
                    updateCellAndRefresh(0, "igst");
                  } else {
                    updateCellAndRefresh(0, "sgst");
                    updateCellAndRefresh(0, "cgst");
                    const igst = (Number(data.gstRate) / 100) * taxableValue;
                    updateCellAndRefresh(igst, "igst");
                  }
                }
              }}
              value={value}
              placeholder={colDef.headerName}
              className="w-[100%] custom-input"
            />
          </div>
        );
      case "qty":
        return (
          <Input
            suffix={data.uom}
            onChange={(e) => {
              if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                const newValue = e.target.value;
                updateCellAndRefresh(newValue, colDef.field);

                // Recalculate taxable value
                let taxableValue = Number(newValue) * Number(data.rate);
                if (data.excRate != 0 && data.excRate != "") {
                  taxableValue =
                    Number(newValue) * Number(data.rate) * Number(data.excRate);
                  updateCellAndRefresh(
                    Number(newValue) * Number(data.rate),
                    "foreignValue"
                  );
                }
                updateCellAndRefresh(taxableValue, "taxableValue");

                // Update GST calculations
                if (data.gstType === "L") {
                  const sgst =
                    ((Number(data.gstRate) / 100) * taxableValue) / 2;
                  const cgst =
                    ((Number(data.gstRate) / 100) * taxableValue) / 2;
                  updateCellAndRefresh(sgst, "sgst");
                  updateCellAndRefresh(cgst, "cgst");
                  updateCellAndRefresh(0, "igst");
                } else {
                  updateCellAndRefresh(0, "sgst");
                  updateCellAndRefresh(0, "cgst");
                  const igst = (Number(data.gstRate) / 100) * taxableValue;
                  updateCellAndRefresh(igst, "igst");
                }
              }
            }}
            value={value}
            placeholder={colDef.headerName}
            className="w-[100%] custom-input"
          />
        );
      case "taxableValue":
      case "foreignValue":
      case "gstRate":
      case "cgst":
      case "sgst":
      case "igst":
        return (
          <span>{value % 1 == 0 ? value : value?.toFixed(2) ?? "0.00"}</span>
        );
      case "hsnCode":
        return <span>{data.hsnCode}</span>;
      case "remarks":
      case "gstType":
        return <span>{value}</span>;
      case "orderremark":
        return (
          <Input
            onChange={(e) => {
              updateCellAndRefresh(e.target.value, colDef.field);
            }}
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] custom-input"
          />
        );
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default React.memo(MINFromPOTextInputCellRenderer);
