import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Input, Select } from "antd";
import React from "react";
// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";

interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const CreateProductionCellrenderer: React.FC<MaterialInvardCellRendererProps> = ({ props }) => {
  const dispatch = useAppDispatch();
  const { partCodeData, getPartCodeLoading } = useAppSelector((state) => state.materialRequestWithoutBom);
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
          <Select
            filterOption={false} // Disable default filtering as we are implementing a custom filter.
            showSearch
            loading={getPartCodeLoading}
            className="w-full"
            value={value}
            onSearch={(input) => dispatch(getPertCodesync(input ? input : null))} // Fetch data dynamically based on search input.
            placeholder={colDef.headerName}
            onChange={(newValue) => {
              const selectedPart = partCodeData && partCodeData?.find((item) => item.id === newValue);
              data[colDef.field] = newValue; // Update the data
              data["uom"] = selectedPart!.unit;
              data["qty"] = data.qty === "" ? null : "";
              api.refreshCells({ rowNodes: [props.node], columns: [column, "component", "remark", "qty", "uom"] });
            }} // Set selected value
            options={partCodeData?.map((item) => ({
              value: item.id,
              label: `${item.part_code}-${item.text}`, // Combines part_code and text for display.
            }))}
          />
        );
      case "qty":
        return <Input suffix={data.uom} onChange={handleInputChange} value={value} type="number" min={0} placeholder={colDef.headerName} />;
      case "remark":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default CreateProductionCellrenderer;
