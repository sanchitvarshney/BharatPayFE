import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { Input } from "antd";
import React from "react";
interface CraeteBomProps {
  props: any;
  customFunction: () => void;
}

const CraeteBomCellRender: React.FC<CraeteBomProps> = ({ props, customFunction }) => {
  const { value, colDef, data, api, column } = props;

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue;
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "qty"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "component":
        return (
          <AntCompSelect
            getUom={(value) => {
              data.uom = value;
              api.refreshCells({ rowNodes: [props.node], columns: [column, "component", "remark", "qty", "uom"] });
              customFunction();
            }}
            onChange={(selectedValue) => {
              const newValue = selectedValue;
              data[colDef.field] = newValue;
              api.refreshCells({ rowNodes: [props.node], columns: [column, "component", "remark", "qty", "uom"] });
            }}
            value={value}
          />
        );
        

      case "qty":
        return (
          <Input
            value={value}
            placeholder={colDef.headerName}
            className="custom-input "
            suffix={data.uom}
            onChange={(e) => {
              if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                if (Number(e.target.value) >= 0) {
                  handleInputChange(e);
                }
              }
            }}
          />
        );
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default CraeteBomCellRender;
