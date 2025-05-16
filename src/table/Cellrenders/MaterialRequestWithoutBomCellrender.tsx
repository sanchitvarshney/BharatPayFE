import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import AntLocationSelectAcordinttoModule from "@/components/reusable/antSelecters/AntLocationSelectAcordinttoModule";
import AntSkuSelect from "@/components/reusable/antSelecters/AntSkuSelect";
import { getAvailbleQty, getSwipeAvailbleQty } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { Input } from "antd";
import React, { useEffect, useState } from "react";
interface MaterialInvardCellRendererProps {
  props: any;
  customFunction: () => void;
  module?: string;
}

const MaterialRequestWithoutBomCellrender: React.FC<MaterialInvardCellRendererProps> = ({ props, customFunction,module }) => {
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
                if(module =="swipe"){
                  dispatch(
                    getSwipeAvailbleQty({
                      itemCode: selectedValue.value || "",
                      type: "RM",
                      location: data?.pickLocation,
                    })
                  );
                }
                else{
                dispatch(
                  getAvailbleQty({
                    itemCode: selectedValue.value || "",
                    type: "RM",
                    location: data?.pickLocation,
                  })
                );
              }
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
                if(module =="swipe"){
                  dispatch(
                    getSwipeAvailbleQty({
                      itemCode: selectedValue.value || "",
                      type: "RM",
                      location: data?.pickLocation,
                    })
                  );
                }
                else{
                dispatch(
                  getAvailbleQty({
                    itemCode: selectedValue.value || "",
                    type: "RM",
                    location: data?.pickLocation,
                  })
                );
              }
            }
              api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code"] });
            }}
            value={value}
          />
        );

      case "pickLocation":
        return (
          <AntLocationSelectAcordinttoModule
            endpoint="/req/without-bom/pick-location"
            onChange={(value) => {
              const newValue = value;
              data[colDef.field] = newValue; // update the data

              if (value && data?.code) {
                if(module =="swipe"){
                  dispatch(
                    getSwipeAvailbleQty({
                      itemCode: data?.code?.value? data.code.value : data?.code,
                      type: type === "device" ? "SKU" : "RM",
                      location: value.value,
                    })
                  );
                }
                else{
                dispatch(
                  getAvailbleQty({
                    itemCode: data?.code?.value? data.code.value : data?.code,
                    type: type === "device" ? "SKU" : "RM",
                    location: value.value,
                  })
                );
              }
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
                  const inputValue = Number(e.target.value);
                  const availableQty =
                    availbleQtyData?.find(
                      (item) =>
                        item.location === data?.pickLocation?.value &&
                        item.item === data?.code?.value
                    )?.Stock || 0;

                  if (inputValue >= 0 && inputValue <= availableQty) {
                    handleInputChange(e);
                  } else if (inputValue > availableQty) {
                    // If input is greater than available quantity, set it to available quantity
                    const event = {
                      target: {
                        value: availableQty.toString(),
                      },
                    };
                    handleInputChange(event);
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
        // const [availbleQty, setAvailbleQty] = useState("--");
        // useEffect(() => {
        //   console.log(availbleQtyData);
        //   if (availbleQtyData) {
        //     setAvailbleQty(availbleQtyData.find((item) => console.log(item,data), (item) => item.location === data?.pickLocation?.value && item.item === data?.code?.value)?.Stock.toString() || "--");
        //     api.refreshCells({ rowNodes: [props.node], columns: [column, "id", "component", "pickLocation", "orderqty", "remarks", "unit", "code", "availableqty"] });
        //   }
        // }, [availbleQtyData]);

        // return availbleQty;
        const [availbleQty, setAvailbleQty] = useState("--");

useEffect(() => {
  if (availbleQtyData && data) {
    // Find the matching item based on location and item code
    const matchingItem = availbleQtyData.find(
      (item) =>
        item.location === data?.pickLocation?.value &&
        item.item === data?.code?.value
    );

    // If a matching item is found, set its Stock value; otherwise, set it to "--"
    if (matchingItem) {
      setAvailbleQty(matchingItem.Stock.toString() || "--");
    } else {
      setAvailbleQty("--");
    }

    // Refresh the AG Grid cells
    api.refreshCells({
      rowNodes: [props.node],
      columns: [
        column,
        "id",
        "component",
        "pickLocation",
        "orderqty",
        "remarks",
        "unit",
        "code",
        "availableqty",
      ],
    });
  }
}, [availbleQtyData, data, props.node, api, column]);

return availbleQty;

    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default MaterialRequestWithoutBomCellrender;
