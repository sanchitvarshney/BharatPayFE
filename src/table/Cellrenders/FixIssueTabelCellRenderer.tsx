import { Input } from "antd";
import React from "react";

import { Checkbox, FormControlLabel } from "@mui/material";
import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const FixIssueTabelCellRenderer: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {

  const { value, colDef, data, api, column } = props;
  // useEffect(() => {
  //   customFunction();
  // }, [value]);
  // Extract partCodeData and loading state from the Redux store

  // Handle Select change

  // Handle Input change
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
          <AntCompSelect
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
              placeholder={colDef.headerName}
              className="w-[100%] custom-input"
              suffix={data?.UOM}
            />
          </div>
        );
      case "isChecked":
        return (
          <div className="flex items-center gap-[10px] h-full">
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    data[colDef.field] = newValue; // Update the data
                    if (!e) {
                      data["selectedPart"] = null;
                      data["quantity"] = "";
                      data["remarks"] = "";
                    }
                    api.refreshCells({
                      rowNodes: [props.node],
                      columns: [column, "id", "selectedPart", "quantity", "remarks", "isChecked"],
                    });
                    customFunction(); // Custom function for further actions
                  }}
                />
              }
              label={data?.issue}
            />
          </div>
        );
      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] custom-input" />;
      default:
        return <span>{value}</span>;
    }
  };

  // Conditional rendering based on whether the row is checked
  if (data.isChecked) {
    return renderContent();
  }
  if (colDef.field === "isChecked") {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default FixIssueTabelCellRenderer;
