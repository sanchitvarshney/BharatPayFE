import { Input } from "antd";
import React from "react";
import AntPartCodeSelect from "@/components/reusable/antSelecters/AntPartCodeSelect";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const FixIssueTabelCellRenderer: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {
  const { value, colDef, data, api, column } = props;

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // Update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "selectedPart", "quantity", "remarks", "isChecked", "UOM"] });
  };

  // Render content based on the column field
  const renderContent = () => {
    switch (colDef.field) {
      case "selectedPart":
        return (
          <AntPartCodeSelect
            getUom={(value) => {
              data.UOM = value;
              api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
              customFunction();
            }}
            onChange={(selectedValue) => {
              const newValue = selectedValue;
              data[colDef.field] = newValue; // update the data

              api.refreshCells({ rowNodes: [props.node], columns: [column, "selectedPart", "quantity", "remarks", "isChecked", "UOM"] });
            }}
            value={value}
          />
        );
      case "quantity":
        return (
          <div className="flex items-center h-full">
            <Input
              onChange={(e) => {
                if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                  if (Number(e.target.value) >= 0) {
                    handleInputChange(e);
                  }
                }
              }}
              value={value}
              type="text"
              placeholder={"00"}
              className="w-[100%] custom-input"
              suffix={data?.UOM}
            />
          </div>
        );
      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={"--"} className="w-[100%] custom-input" />;
      default:
        return <span>{value}</span>;
    }
  };
  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default FixIssueTabelCellRenderer;
