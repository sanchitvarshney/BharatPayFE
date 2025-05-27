import { Input } from "antd";
import React, { useEffect } from "react";
import {useAppSelector } from "@/hooks/useReduxHook";
import AntLocationSelectAcordinttoModule from "@/components/reusable/antSelecters/AntLocationSelectAcordinttoModule";

interface POCellRendererProps {
  props: any;
  customFunction: () => void
}
const MINFromPOTextInputCellRenderer: React.FC<POCellRendererProps> = ({ props,customFunction }) => {
  const { value, colDef, data, api, column } = props;
  const { currencyData } = useAppSelector((state) => state.common);

  useEffect(() => {
    customFunction();
  }, [value]);

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    data["taxableValue"] = Number(data.qty) * Number(data.rate);
    if (data.excRate != 0 || data.excRate != "") {
      data["taxableValue"] = Number(data.qty) * Number(data.rate) * Number(data.excRate);
      data["foreignValue"] = Number(data.qty) * Number(data.rate);
    }
    if (data.gstType === "L") {
      data["sgst"] = ((Number(data.gstRate) / 100) * Number(data.taxableValue)) / 2;
      data["cgst"] = ((Number(data.gstRate) / 100) * Number(data.taxableValue)) / 2;
      data["igst"] = 0;
    } else {
      data["sgst"] = 0;
      data["cgst"] = 0;
      data["igst"] = (Number(data.gstRate) / 100) * Number(data.taxableValue);
    }
    api.refreshCells({ rowNodes: [props.node], columns: [column, "taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "excRate"] }); // refresh the cell to show the new value
    customFunction();
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "partComponent":
        return <span>{value}</span>;
      case "location":
        return (
          <AntLocationSelectAcordinttoModule
            endpoint="/transaction/rm-inward-location"
            onChange={(value) => {
              const newValue = value;
              data[colDef.field] = newValue; // update the data
              api.refreshCells({ rowNodes: [props.node], columns: [column, "taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "excRate"] });
            }}
            value={value}
          />
        );
     
      case "rate":
        return (
          <div className="flex items-center gap-[5px] ">
            <Input
              min={0}
              onChange={(e) => {
                if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                  handleInputChange(e);
                  if (currencyData?.find((item) => item.id === data.currency)?.text === "₹") {
                    data["foreignValue"] = 0;
                    data["taxableValue"] = Number(data.qty) * Number(data.rate);
                    api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] });
                  } else if (data.currency === "0" || data.currency === "") {
                    data["taxableValue"] = Number(data.qty) * Number(data.rate);
                    api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                  } else {
                    data["foreignValue"] = Number(data.qty) * Number(data.rate);
                    data["taxableValue"] = Number(data.qty) * Number(data.rate) * Number(data.excRate);
                    api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                  }
                }
              }}
              value={value}
              placeholder={colDef.headerName}
              className="w-[100%]  custom-input"
            />
          </div>
        );
      case "qty":
        return (
          <Input
            suffix={data.uom}
            onChange={(e) => {
              if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                handleInputChange(e);
              }
            }}
            value={value}
            placeholder={colDef.headerName}
            className="w-[100%] custom-input"
          />
        );

      case "taxableValue":
        return <span>{value % 1 == 0 ? value : value?.toFixed(2) ?? "0.00"}</span>;
      case "foreignValue":
        return <span>{value % 1 == 0 ? value : value?.toFixed(2) ?? "0.00"}</span>;
        case "hsnCode":
          return <span>{data.hsnCode}</span>;
      case "gstRate":
        return <span>{value % 1 == 0 ? value : value?.toFixed(2) ?? "0.00"}</span>;
      case "cgst":
        return <span>{value % 1 == 0 ? value : value?.toFixed(2) ?? "0.00"}</span>;
      case "sgst":
        return <span>{value % 1 == 0 ? value : value?.toFixed(2) ?? "0.00"}</span>;
      case "igst":
        return <span>{value % 1 == 0 ? value : value?.toFixed(2) ?? "0.00"}</span>;
      case "remarks":
        case "gstType":
        return <span>{value}</span>;
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default MINFromPOTextInputCellRenderer;
