import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import AntLocationSelect from "@/components/reusable/antSelecters/AntLocationSelect";
import AntSkuSelect from "@/components/reusable/antSelecters/AntSkuSelect";
import { getAvailbleQty } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Input } from "antd";
import React, { useEffect, useState } from "react";
interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
}

const MaterialRequestWithoutBomCellrender: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction }) => {
  const { type, availbleQtyData } = useAppSelector((state) => state.materialRequestWithoutBom);
  const dispatch = useAppDispatch();
  const { value, colDef, data, api, column } = props;
  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "code":
        return type === "device" ? (
          <AntSkuSelect
            getUom={(value) => {
              data.unit = value;
              api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
              customFunction();
            }}
            onChange={(selectedValue) => {
              const newValue = selectedValue;
              data[colDef.field] = newValue; // update the data

              if (selectedValue && data?.pickLocation) {
                dispatch(
                  getAvailbleQty({
                    itemCode: selectedValue.value || "",
                    type: "RM",
                    location: data?.pickLocation,
                  })
                );
              }
              api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
            }}
            value={value}
          />
        ) : (
          // <AntCompSelect
          //   getUom={(value) => {
          //     data.unit = value;
             
          //     api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
          //     customFunction();
          //   }}
          //   onChange={(selectedValue) => {
          //     handleChange(selectedValue?.value || "");
          //     if (selectedValue && data?.pickLocation) {
          //       dispatch(
          //         getAvailbleQty({
          //           itemCode: selectedValue.value || "",
          //           type: "RM",
          //           location: data?.pickLocation,
          //         })
          //       );
          //     }
          //   }}
          //   value={value.value}
          // />
          <AntCompSelect
          getUom={(value) => {
            data.unit = value;
            api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
            customFunction();
          }}
          onChange={(selectedValue) => {
            const newValue = selectedValue;
            data[colDef.field] = newValue; // update the data

            if (selectedValue && data?.pickLocation) {
              dispatch(
                getAvailbleQty({
                  itemCode: selectedValue.value || "",
                  type: "RM",
                  location: data?.pickLocation,
                })
              );
            }
            api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
          }}
          value={value}
        />
        );

      case "pickLocation":
        return (
          <AntLocationSelect
            onChange={(value) => {
              const newValue = value;
              data[colDef.field] = newValue; // update the data
  
              
              if (value && data?.code) {
                dispatch(
                  getAvailbleQty({
                    itemCode: data?.code,
                    type: type === "device" ? "SKU" : "RM",
                    location: value.value,
                  })
                );
              }
              api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
            }}
            value={value}
          />
        );

      case "orderqty":
        return (
          <div className="flex items-center h-full">
            <Input
              suffix={data.unit}
              min={0}
              onChange={(e) => {
                if (/^-?\d*\.?\d*$/.test(e.target.value)) {
                  if (Number(e.target.value) >= 0) {
                    handleInputChange(e);
                  }
                }
              }}
              value={value}
              placeholder={colDef.headerName}
              className="custom-input"
            />
          </div>
        );
      case "remarks":
        return <Input onChange={handleInputChange} value={value} type="text" placeholder={colDef.headerName} className="custom-input" />;
      case "availableqty":
        const [availbleQty, setAvailbleQty] = useState("--");
        useEffect(() => {
          if (availbleQtyData) {
            setAvailbleQty(availbleQtyData.find((item) => item.location === data?.pickLocation && item.item === data?.code)?.Stock.toString() || "--");
            api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code", "availableqty"] });
          }
        }, [availbleQtyData]);

        return availbleQty;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default MaterialRequestWithoutBomCellrender;
