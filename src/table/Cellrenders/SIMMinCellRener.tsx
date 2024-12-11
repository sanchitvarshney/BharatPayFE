import { Input } from "antd";
import React from "react";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const SIMMinCellRener: React.FC<MaterialInvardCellRendererProps> = ({ props }) => {
  const { value, colDef, data, api, column } = props;

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "isNew", "remark"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "remark":
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
