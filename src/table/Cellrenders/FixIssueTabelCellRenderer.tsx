import { Input } from "@/components/ui/input";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SelectPartCode from "@/components/comonAsyncSelect/SelectPartCode";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const FixIssueTabelCellRenderer: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {
  const { value, colDef, data, api, column } = props;

  // Extract partCodeData and loading state from the Rdux store

  // Handle Select change
  const handleChange = (newValue: string) => {
    data[colDef.field] = newValue; // Update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "selectedPart", "quantity", "remarks", "isChecked"] });
  };

  // Handle Input change
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // Update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "selectedPart", "quantity", "remarks", "isChecked"] });
  };

  // Render content based on the column field
  const renderContent = () => {
    switch (colDef.field) {
      case "selectedPart":
        return (
          <SelectPartCode
            value={value} // Controlled component pattern
            onChange={(value) => handleChange(value?.id || "")} // Callback when a new value is selected
          />
        );
      case "quantity":
        return (
          <div className="flex items-center h-full">
            <div className="flex items-center h-[35px] overflow-hidden border rounded-lg border-slate-400">
              <Input value={value} onChange={handleInputChange} min={0} placeholder="Qty" type="number" className="w-[100%] text-slate-600 border-none shadow-none mt-[2px] focus-visible:ring-0" />
              <div className="w-[70px] bg-zinc-200 flex justify-center h-full items-center"></div>
            </div>
          </div>
        );
      case "isChecked":
        return (
          <div className="flex items-center gap-[10px] h-full">
            <Checkbox
              id={`issue${data?.id}`}
              checked={value}
              onCheckedChange={(e) => {
                const newValue = e;
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
              className="data-[state=checked]:bg-cyan-700 border-cyan-700 h-[20px] w-[20px]"
            />
            <Label htmlFor={`issue${data?.id}`} className="cursor-pointer">
              {data?.issue}
            </Label>
          </div>
        );
      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white text-slate-600 border-slate-400 shadow-none mt-[2px]" />;
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
