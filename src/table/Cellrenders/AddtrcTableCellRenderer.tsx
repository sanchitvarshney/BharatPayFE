import { Input } from "@/components/ui/input";
import { Select, Tooltip } from "antd";
import React from "react";
import type { SelectProps } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { getIsueeList } from "@/features/common/commonSlice";
import { transformPartCode } from "@/utils/transformUtills";
interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const AddtrcTableCellRenderer: React.FC<MaterialInvardCellRendererProps> = ({ props }) => {
  const dispatch = useAppDispatch();
  const { isueeList, isueeListLoading } = useAppSelector((state) => state.common);


 

  const { value, colDef, data, api, column } = props;
  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "IMEI", "issues", "remarks"] });
  };
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "IMEI", "issues", "remarks"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "IMEI":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;

      case "issues":
        const sharedProps: SelectProps = {
          mode: "multiple",
          style: { width: "100%" },
          placeholder: "Select Item...",
          maxTagCount: "responsive",
        };
        return (
          <Select
            loading={isueeListLoading}
            options={transformPartCode(isueeList)}
            showSearch
            onSearch={(value) => dispatch(getIsueeList(value ? value : null))}
            {...sharedProps}
            value={value}
            onChange={handleChange}
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip overlayStyle={{ pointerEvents: "none" }} title={omittedValues.map(({ label }) => label).join(", ")}>
                <span>{omittedValues?.length}+..</span>
              </Tooltip>
            )}
          />
        );

      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="w-[100%] bg-white  text-slate-600  border-slate-400 shadow-none mt-[2px]" />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default AddtrcTableCellRenderer;
