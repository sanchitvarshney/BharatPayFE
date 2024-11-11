import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { transformPartCode } from "@/utils/transformUtills";
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
            onFocus={() => {
              dispatch(getPertCodesync(null));
            }}
            filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase()) || option?.value.toString().includes(input)}
            showSearch
            loading={getPartCodeLoading}
            className="w-full"
            value={value}
            onSearch={(searchValue) => {
              // Dispatch action to fetch filtered part codes
              dispatch(getPertCodesync(searchValue || null));
            }}
            placeholder={colDef.headerName}
            onChange={(newValue) => {
              const selectedPart = partCodeData && partCodeData?.find((item) => item.id === newValue);
              data[colDef.field] = newValue; // Update the data
              data["uom"] = selectedPart!.unit;
              data["qty"] = data.qty ===""?null:"";
              api.refreshCells({ rowNodes: [props.node], columns: [column,"component", "remark", "qty", "uom"] });
            }} // Set selected value
            options={transformPartCode(partCodeData)}
          />
        );
      case "qty":
        return <Input suffix={data.uom} onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} />;
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
