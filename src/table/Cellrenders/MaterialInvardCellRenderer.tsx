import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "antd";
import { IoMdCheckmark } from "react-icons/io";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CustomButton } from "@/components/reusable/CustomButton";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { transformGroupSelectData, transformPartCode } from "@/utils/transformUtills";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}
const MaterialInvardCellRenderer: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {
  const [currency, setCurrency] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { value, colDef, data, api, column } = props;
  const dispatch = useAppDispatch();
  const { getPartCodeLoading, partCodeData } = useAppSelector((state) => state.materialRequestWithoutBom);
  const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);

  useEffect(() => {
    customFunction();
  }, [value]);
  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = newValue; // update the data
    if (data.gstType === "local") {
      data["sgst"] = (Number(data.gstRate) / 100) * Number(data.taxableValue);
      data["cgst"] = (Number(data.gstRate) / 100) * Number(data.taxableValue);
      data["igst"] = 0;
    } else {
      data["sgst"] = 0;
      data["cgst"] = 0;
      data["igst"] = (Number(data.gstRate) / 100) * Number(data.taxableValue) * 2;
    }
    api.refreshCells({ rowNodes: [props.node], columns: [column, "taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate"] }); // refresh the cell to show the new value
  };
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    data["taxableValue"] = Number(data.qty) * Number(data.rate);
    if (data.gstType === "local") {
      data["sgst"] = (Number(data.gstRate) / 100) * Number(data.taxableValue);
      data["cgst"] = (Number(data.gstRate) / 100) * Number(data.taxableValue);
      data["igst"] = 0;
    } else {
      data["sgst"] = 0;
      data["cgst"] = 0;
      data["igst"] = (Number(data.gstRate) / 100) * Number(data.taxableValue) * 2;
    }
    api.refreshCells({ rowNodes: [props.node], columns: [column, "taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate"] }); // refresh the cell to show the new value
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "partComponent":
        return <Select value={value} showSearch loading={getPartCodeLoading} className="w-full" onSearch={(value) => dispatch(getPertCodesync(value ? value : null))} defaultValue="local" onChange={(value) => handleChange(value)} options={transformPartCode(partCodeData)} />;
      case "gstType":
        return (
          <Select
            value={value}
            className="w-full"
            placeholder="Select gst type"
            onChange={(value) => handleChange(value)}
            options={[
              { value: "local", label: "local" },
              { value: "interstate", label: "Inter State" },
            ]}
          />
        );
      case "location":
        return <Select onSearch={(value) => dispatch(getLocationAsync(value ? value : null))} loading={getLocationLoading} value={value} className="w-full" defaultValue="" onChange={(value) => handleChange(value)} options={transformGroupSelectData(locationData)} />;
      case "autoConsump":
        return <Select className="w-full" defaultValue="" onChange={(value) => handleChange(value)} options={[{ value: "N", label: "NO" }]} />;
      case "currency":
        return (
          <div className="flex items-center gap-[5px]">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger>
                <Button variant={"outline"}>{value}</Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-[10px] w-[300px]">
                <p className="text-slate-600 text-[14px] font-[600]">Choose Currency & Enter Currency Rate</p>
                <div className="flex items-center gap-[10px]">
                  <Select
                    className="w-[60px] h-[40px] "
                    defaultValue="₹"
                    value={value}
                    onSelect={(e) => {
                      data["currency"] = e;
                      api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency"] }); // refresh the cell to show the new value
                    }}
                    onChange={(e) => {
                      data.currency = e;
                      api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                      if (data.currency === "₹") {
                        data["foreignValue"] = 0;
                        data["taxableValue"] = Number(data.qty) * Number(data.rate);
                        api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] });
                      } else if (currency === "0" || currency === "") {
                        data["taxableValue"] = Number(data.qty) * Number(data.rate);
                        api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                      } else {
                        data["foreignValue"] = Number(data.qty) * Number(data.rate);
                        data["taxableValue"] = Number(data.qty) * Number(data.rate) * Number(currency);
                        api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                      }
                    }}
                    options={[
                      { label: "₹", value: "₹" },
                      { label: "$", value: "$" },
                      { label: "€", value: "€" },
                      { label: "£", value: "£" },
                      { label: "¥", value: "¥" },
                    ]}
                  />
                  <Input
                    value={currency}
                    className="h-[40px]"
                    type="number"
                    onChange={(e) => {
                      setCurrency(e.target.value);

                      if (data.currency === "₹") {
                        data["taxableValue"] = Number(data.qty) * Number(data.rate);
                        data["foreignValue"] = 0;
                        api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                      } else if (e.target.value === "0" || e.target.value === "") {
                        data["taxableValue"] = Number(data.qty) * Number(data.rate);
                        api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                      } else {
                        data["taxableValue"] = Number(data.qty) * Number(data.rate) * Number(e.target.value);
                        data["foreignValue"] = Number(data.qty) * Number(data.rate);
                        api.refreshCells({ rowNodes: [props.node], columns: ["taxableValue", "rate", "qty", "igst", "cgst", "sgst", "gstRate", "currency", "foreignValue"] }); // refresh the cell to show the new value
                      }
                    }}
                  />
                </div>
                <div className="mt-[10px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <p className="font-[500]">Total Cost in ₹:</p>
                    <p className="text-[14px]">{data.taxableValue}</p>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <p className="font-[500]">Total Cost in {data.currency} :</p>
                    <p className="text-[14px]">{data.currency == "₹" ? data.taxableValue : data.foreignValue}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-[10px] h-[50px] mt-[10px]">
                  <CustomButton onClick={() => setOpen(false)} icon={<IoMdCheckmark className="h-[18px] w-[18px]" />} className="bg-cyan-700 hover:bg-cyan-800">
                    Submit
                  </CustomButton>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      case "rate":
        return (
          <div className="flex items-center gap-[5px]">
            <Input onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />
          </div>
        );
      case "qty":
        return <Input onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;

      case "taxableValue":
        return <Input disabled onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "foreignValue":
        return <Input disabled onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "hsnCode":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "gstRate":
        return <Input onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "cgst":
        return <Input disabled onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "sgst":
        return <Input disabled onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "igst":
        return <Input disabled onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default MaterialInvardCellRenderer;
