import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { Input } from "antd";
import React from "react";
// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const CreateProductionCellrenderer: React.FC<MaterialInvardCellRendererProps> = ({ props,customFunction }) => {
  // const dispatch = useAppDispatch();
  const { value, colDef, data, api, column } = props;

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "component", "remark", "qty", "uom"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "component":
        return (
          // <Select
          //   filterOption={false} // Disable default filtering as we are implementing a custom filter.
          //   showSearch
          //   loading={getPartCodeLoading}
          //   className="w-full"
          //   value={value}
          //   onSearch={(input) => dispatch(getPertCodesync(input ? input : null))} // Fetch data dynamically based on search input.
          //   placeholder={colDef.headerName}
          //   onChange={(newValue) => {
          //     const selectedPart = partCodeData && partCodeData?.find((item) => item.id === newValue);
          //     data[colDef.field] = newValue; // Update the data
          //     data["uom"] = selectedPart!.unit;
          //     data["qty"] = data.qty === "" ? null : "";
          //     api.refreshCells({ rowNodes: [props.node], columns: [column, "component", "remark", "qty", "uom"] });
          //   }} // Set selected value
          //   options={partCodeData?.map((item) => ({
          //     value: item.id,
          //     label: `${item.part_code}-${item.text}`, // Combines part_code and text for display.
          //   }))}
          // />
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
        return <Input className="custom-input" suffix={data.uom}  onChange={(e) => {
          if (/^-?\d*\.?\d*$/.test(e.target.value)) {
            if (Number(e.target.value) >= 0) {
              handleInputChange(e);
            }
          }
        }} value={value}  placeholder={colDef.headerName} />;
      case "remark":
        return <Input className="custom-input" onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default CreateProductionCellrenderer;
