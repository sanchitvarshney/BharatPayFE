import { Input } from "@/components/ui/input";
import React from "react";
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
        return <span>{value}</span>;
      case "serialNo":
        return <span>{value}</span>;
      case "remark":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-full custom-input" />;
      case "IR":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-full custom-input" />;
      case "voltage":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-full custom-input" />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default AddBatteryQcCellrender;
