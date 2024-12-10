import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "antd";
import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { LuPencilLine } from "react-icons/lu";

interface MaterialInvardCellRendererProps {
  props: any; // The params object from ag-Grid
  customFunction: () => void;
}

const DeviceMinCellRener: React.FC<MaterialInvardCellRendererProps> = ({ props }) => {
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

        return (
          <div className="flex items-center justify-center h-full gap-[10px]">
            <Button
              onClick={() => {
                data["isNew"] = false; // update the data
                api.refreshCells({ rowNodes: [props.node], columns: [column, "isNew", "action", "simAvailability", "serialno", "remarks", "id"] });
              }}
              className={`w-[30px] h-[30px] bg-white p-0 ${!value ? "bg-green-500 text-white" : "text-slate-600"}`}
            >
              <IoMdCheckmark />
            </Button>
            <Button
              onClick={() => {
                data["isNew"] = true; // update the data
                api.refreshCells({ rowNodes: [props.node], columns: [column, "isNew", "action", "simAvailability", "serialno", "remarks", "id"] });
              }}
              className="w-[30px] h-[30px] p-0 text-slate-600"
              variant={"outline"}
            >
              <LuPencilLine />
            </Button>
          </div>
        );
    }
  };

  if (data.isNew && data.isAvailble) {
    return renderContent();
  }

  if (value === "Y") {
    return "Available";
  }
  if (value === "N") {
    return "Not Available";
  }

  return <span>{value}</span>;
};

export default DeviceMinCellRener;
