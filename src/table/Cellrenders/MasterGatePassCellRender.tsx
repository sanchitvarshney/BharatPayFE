import AntCompSelect from "@/components/reusable/antSelecters/AntCompSelect";
import { LocationType } from "@/components/reusable/SelectLocationAcordingModule";
import { getAvailbleQty } from "@/features/production/MaterialRequestWithoutBom/MRRequestWithoutBomSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utils/toasterContext";
import { Input } from "antd";
import React, { useEffect, useState } from "react";

interface MasterGatePassCellRenderProps {
  props: any;
  customFunction: () => void;
  locationRef: React.MutableRefObject<LocationType | null>;
}

const MasterGatePassCellRender: React.FC<MasterGatePassCellRenderProps> = ({ props, customFunction, locationRef }) => {
  const { availbleQtyData } = useAppSelector((state) => state.materialRequestWithoutBom);
  const dispatch = useAppDispatch();
  const { value, colDef, data, api, column } = props;

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue;
    api.refreshCells({
      rowNodes: [props.node],
      columns: [column, "id", "component", "availableqty", "qty", "remark"],
    });
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "component":
        return (
          <AntCompSelect
            getUom={(value) => {
              data.uom = value;
              api.refreshCells({
                rowNodes: [props.node],
                columns: [column, "component", "availableqty", "qty", "remark", "uom"],
              });
              customFunction();
            }}
            onChange={(selectedValue) => {
              data[colDef.field] = selectedValue;
              if (selectedValue) {
                if (locationRef.current?.code) {
                  dispatch(
                    getAvailbleQty({
                      itemCode: selectedValue.value || "",
                      type: "RM",
                      location: locationRef.current.code,
                    })
                  );
                } else {
                  showToast("Please select location first", "error");
                }
              }
              api.refreshCells({
                rowNodes: [props.node],
                columns: [column, "component", "availableqty", "qty", "remark", "uom"],
              });
            }}
            value={value}
          />
        );

      case "availableqty": {
        const [availbleQty, setAvailbleQty] = useState("--");

        useEffect(() => {
          if (availbleQtyData && data) {
            const matchingItem = availbleQtyData.find(
              (item) => item.location === locationRef.current?.code && item.item === data?.component?.value
            );

            if (matchingItem) {
              setAvailbleQty(matchingItem.Stock.toString() || "--");
            } else {
              setAvailbleQty("--");
            }

            api.refreshCells({
              rowNodes: [props.node],
              columns: [column, "component", "availableqty", "qty", "remark"],
            });
          }
        }, [availbleQtyData, data, props.node, api, column]);

        return availbleQty;
      }

      case "qty":
        return (
          <Input
            value={value}
            placeholder={colDef.headerName}
            className="custom-input"
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

      case "remark":
        return <Input value={value} placeholder={colDef.headerName} className="custom-input" onChange={handleInputChange} />;
    }
  };

  if (data.isNew) {
    return renderContent();
  }
  return <span>{value}</span>;
};

export default MasterGatePassCellRender;
