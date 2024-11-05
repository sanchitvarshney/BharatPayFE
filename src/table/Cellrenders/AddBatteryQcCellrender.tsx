import { Input } from "@/components/ui/input";
import React from "react";
// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const AddBatteryQcCellrender: React.FC<MaterialInvardCellRendererProps> = ({ props }) => {
  // const dispatch = useAppDispatch();
  const { value, colDef, data, api, column } = props;
  
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "IMEI", "issues", "remarks"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "IMEI":
        return <span>{value}</span>
        case "serialNo":
          return <span>{value}</span>
      case "remark":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
        case "IR":
          return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
          case "voltage":
            return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default AddBatteryQcCellrender;
