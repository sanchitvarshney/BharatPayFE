import { Input } from "@/components/ui/input";
import { Select } from "antd";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { transformPartCode } from "@/utils/transformUtills";
import { getPertCodesync } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const FixIssueTabelCellRenderer: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {
  const dispatch = useAppDispatch();
  const { partCodeData, getPartCodeLoading } = useAppSelector((state) => state.materialRequestWithoutBom);

  const { value, colDef, data, api, column } = props;
  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, , "selectedPart", "quantity", "remarks", "isChecked"] });
  };
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, , "selectedPart", "quantity", "remarks", "isChecked"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "selectedPart":
        return (
          <Select showSearch loading={getPartCodeLoading} className="w-full" value={value} onSearch={(value) => dispatch(getPertCodesync(value ? value : null))} placeholder={colDef.headerName} onChange={(value) => handleChange(value)} options={transformPartCode(partCodeData)} />
        );
      case "quantity":
        return (
          <div className="flex items-center h-full">
            <div className="flex items-center h-[35px] overflow-hidden border rounded-lg border-slate-400 ">
              <Input value={value} onChange={handleInputChange} min={0} placeholder="Qty" type="number" className="w-[100%]  text-slate-600  border-none shadow-none mt-[2px] focus-visible:ring-0" />
              <div className="w-[70px] bg-zinc-200 flex justify-center h-full items-center g"></div>
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
                data[colDef.field] = newValue; // update the data
                if (!e) {
                  data["selectedPart"] = null;
                  data["quantity"] = "";
                  data["remarks"] = "";
                }
                api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "selectedPart", "quantity", "remarks", "isChecked"] });
                customFunction();
              }}
              className="data-[state=checked]:bg-cyan-700 border-cyan-700 h-[20px] w-[20px]"
            />
            <Label htmlFor={`issue${data?.id}`} className="cursor-pointer">
              {data?.issue}
            </Label>
          </div>
        );

      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
    }
  };

  if (data.isChecked) {
    return renderContent();
  }
  if (colDef.field === "isChecked") {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default FixIssueTabelCellRenderer;
