import { Input } from "@/components/ui/input";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { transformPartCode } from "@/utils/transformUtills";
import { Select } from "antd";
import React from "react";
interface CraeteBomProps {
  props: any;
  customFunction: () => void;
}

const CraeteBomCellRender: React.FC<CraeteBomProps> = ({ props, customFunction }) => {
  const { getPartCodeLoading, partCodeData } = useAppSelector((state) => state.materialRequestWithoutBom);
  // const { locationData, getLocationLoading } = useAppSelector((state) => state.divicemin);

  const dispatch = useAppDispatch();

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
           
            api.refreshCells({ rowNodes: [props.node], columns: [column,"component", "remark", "qty", "uom"] });
            customFunction();
          }} // Set selected value
          options={transformPartCode(partCodeData)}
        />
        );

      case "qty":
        return (
          <div className="flex items-center h-full">
            <div className="flex items-center h-[35px] overflow-hidden border rounded-lg border-slate-400">
              <Input min={0} onChange={handleInputChange} value={value} type="number" placeholder={colDef.headerName} className="w-[100%]  text-slate-600  border-none shadow-none mt-[2px] focus-visible:ring-0" />
              <div className="w-[70px] bg-zinc-200 flex justify-center h-full items-center g">{data?.uom}</div>
            </div>
          </div>
        );
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default CraeteBomCellRender;
