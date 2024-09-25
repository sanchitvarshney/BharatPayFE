import { Input } from "@/components/ui/input";
import { Select } from "antd";
import React from "react";
interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const AddtrcTableCellRenderer: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {
  const { value, colDef, data, api, column } = props;
  const handleChange = (value: string) => {
    const newValue = value;

    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit"] });
    customFunction();
  };
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "IMEI":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;

      case "part":
        return <Select
        style={{
          borderColor: "#d1d5db",
          
        }}
        className="w-full" value={value} defaultValue={value} placeholder={colDef.headerName} onChange={(value) => handleChange(value)} options={[
          { value: "cover", label: "cover" },
          { value: "Charging port", label: "Inactive" },
          { value: "Battery", label: "Battery" },
          { value: "Charger", label: "Charger" },
          { value: "Cable", label: "Cable" },
          { value: "Others", label: "Others" },

        ]} />;

      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default AddtrcTableCellRenderer;
