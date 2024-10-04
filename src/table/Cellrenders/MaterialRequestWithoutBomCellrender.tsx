import { Input } from "@/components/ui/input";
import { getAvailbleQty, getPertCodesync, getSkuAsync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { getLocationAsync } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { transformGroupSelectData, transformPartCode, transformSkuCode } from "@/utils/transformUtills";
import { Select } from "antd";
import React, { useEffect, useState } from "react";
interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const MaterialRequestWithoutBomCellrender: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {
  const { getPartCodeLoading, getSkuLoading, skuCodeData, partCodeData, type,availbleQtyData } = useAppSelector((state) => state.materialRequestWithoutBom);
  const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);
  const dispatch = useAppDispatch();
  const { value, colDef, data, api, column } = props;
  const handleChange = (value: string) => {
    const newValue = value;
    if (colDef.field === "code") {
      if (type === "device") {
        data.unit = skuCodeData?.find((item) => item.id === value)?.unit;
        api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
      } else {
        data.unit = partCodeData?.find((item) => item.id === value)?.unit;
        api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
      }
    }
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
    customFunction();
  };
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "code":
        return type === "device" ? (
          <Select
            showSearch
            loading={getSkuLoading}
            className="w-full"
            value={value}
            onSearch={(value) => dispatch(getSkuAsync(value ? value : null))}
            placeholder={colDef.headerName}
            onChange={(value) => {
              handleChange(value);
              if (value && data?.pickLocation) {
                dispatch(
                  getAvailbleQty({
                    itemCode: value,
                    type: "SKU",
                    location: data?.pickLocation,
                  })
                );
              }
            }}
            options={transformSkuCode(skuCodeData)}
          />
        ) : (
          <Select
            showSearch
            loading={getPartCodeLoading}
            className="w-full"
            value={value}
            onSearch={(value) => dispatch(getPertCodesync(value ? value : null))}
            placeholder={colDef.headerName}
            onChange={(value) => {
              handleChange(value);
              if (value && data?.pickLocation) {
                dispatch(
                  getAvailbleQty({
                    itemCode: value,
                    type: "RM",
                    location: data?.pickLocation,
                  })
                );
              }
            }}
            options={transformPartCode(partCodeData)}
          />
        );

      case "pickLocation":
        return (
          <Select
            onSearch={(value) => dispatch(getLocationAsync(value ? value : null))}
            loading={getLocationLoading}
            className="w-full"
            value={value}
            defaultValue={value}
            placeholder={colDef.headerName}
            onChange={(value) => {
              handleChange(value);
              if (value && data?.code) {
                dispatch(
                  getAvailbleQty({
                    itemCode: data?.code,
                    type: type === "device" ? "SKU" : "RM",
                    location: value,
                  })
                );
              }
            }}
            options={transformGroupSelectData(locationData)}
          />
        );

      case "orderqty":
        return (
          <div className="flex items-center h-full">
            <div className="flex items-center h-[35px] overflow-hidden border rounded-lg border-slate-400">
              <Input min={0} onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-none shadow-none mt-[2px] focus-visible:ring-0" />
              <div className="w-[70px] bg-zinc-200 flex justify-center h-full items-center g">{data?.unit}</div>
            </div>
          </div>
        );
      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
      case "availableqty":
      
        const [availbleQty, setAvailbleQty] = useState("--");
        useEffect(() => {
          if (availbleQtyData) {
            setAvailbleQty(availbleQtyData.find((item) => (item.location === data?.pickLocation) && (item.item === data?.code))?.Stock.toString()|| "--");
            api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code","availableqty"] });
          }
        },[availbleQtyData]);

       return <div>{availbleQty}</div>;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default MaterialRequestWithoutBomCellrender;
