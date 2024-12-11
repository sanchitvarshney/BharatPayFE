
import { Input } from "@/components/ui/input";
import { Select } from "antd";
import React from "react";


interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const SIMMinCellRener: React.FC<MaterialInvardCellRendererProps> = ({ props }) => {
  const { value, colDef, data, api, column } = props;
  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "isNew", "action", "simAvailability", "serialno", "remarks", "id", "IMEI", "model"] });
  };
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "isNew", "action", "simAvailability", "serialno", "remarks", "id", "IMEI", "model"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "serialno":
        return <Input disabled onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%] custom-input" />;
      case "simAvailability":
        return (
          <Select
            className="w-full custom-select"
            value={value}
            defaultValue={value}
            onChange={(value) => handleChange(value)}
            options={[
              { value: "Y", label: "Yes" },
              { value: "N", label: "No" },
            ]}
          />
        );
      case "IMEI":
        return data?.isAvailble ? <span>{value}</span> : <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%]  custom-input" />;
      case "model":
        return data?.isAvailble ? <span>{value}</span> : <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] custom-input" />;
      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%]  custom-input" />;
       default:
          return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%]  custom-input" />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default SIMMinCellRener;
