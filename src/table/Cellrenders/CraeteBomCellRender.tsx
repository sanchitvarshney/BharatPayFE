import { Input } from "@/components/ui/input";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {  transformPartCode } from "@/utils/transformUtills";
import { Select } from "antd";
import React from "react";
interface CraeteBomProps {
  props: any; 
  customFunction: () => void;
}

const CraeteBomCellRender: React.FC<CraeteBomProps> = ({ props, customFunction }) => {
  const { getPartCodeLoading, partCodeData, } = useAppSelector((state) => state.materialRequestWithoutBom);
  // const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);

  const dispatch = useAppDispatch();

  const { value, colDef, data, api, column } = props;
  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = newValue; 
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "qty"] });
    customFunction();
  };
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; 
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "qty"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "component":
        return (
          <Select
            showSearch
            loading={getPartCodeLoading}
            className="w-full"
            value={value}
            onSearch={(value) =>dispatch(getPertCodesync(value ? value : null)) }
            placeholder={colDef.headerName}
            onChange={(value) => handleChange(value)}
            options={transformPartCode(partCodeData)}
          />
        );

      case "qty":
        return (
          <div className="flex items-center h-full">
            <div className="flex items-center h-[35px] overflow-hidden border rounded-lg border-slate-400">
              <Input min={0} onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-none shadow-none mt-[2px] focus-visible:ring-0" />
              <div className="w-[70px] bg-zinc-200 flex justify-center h-full items-center g">{data?.unit}</div>
            </div>
          </div>
        );
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default CraeteBomCellRender;
