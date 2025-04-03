import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";

interface EwayBillCellRendererProps {
  value: any;
  colDef: any;
  data: any;
  api: any;
  column: any;
  node: any;
  setRowData?: (callback: (prevData: any[]) => any[]) => void;
}

const EwayBillCellRenderer = (props: EwayBillCellRendererProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const { value, colDef, data, api, column, setRowData } = props;

  const handleDeleteRow = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRowIndex !== null && setRowData) {
      setRowData((prevData: any[]) =>
        prevData.filter((_: any, index: number) => index !== selectedRowIndex)
      );
      api.applyTransaction({
        remove: [api.getDisplayedRowAtIndex(selectedRowIndex).data],
      });
    }
    setShowConfirmDialog(false);
  };

  const updateData = (newData: any) => {
    api.applyTransaction({ update: [newData] });
    api.refreshCells({ rowNodes: [props.node], columns: [column] });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    data[name] = value;

    if (name === "rate" || name === "orderQty") {
      // Calculate localValue based on rate and orderQty
      data["localValue"] =
        (parseFloat(data.rate) || 0) * (parseFloat(data.orderQty) || 0);

      const gstRate = parseFloat(data.gstRate) || 0;
      let cgst = 0,
        sgst = 0,
        igst = 0;
      const calculation = (data.localValue * gstRate) / 100;

      if (data.gstType?.id === "L") {
        cgst = calculation / 2;
        sgst = calculation / 2;
        igst = 0;
      } else if (data.gstType?.id === "I") {
        igst = calculation;
        cgst = 0;
        sgst = 0;
      }

      data.cgst = cgst.toFixed(2);
      data.sgst = sgst.toFixed(2);
      data.igst = igst.toFixed(2);
    }

    api.refreshCells({ rowNodes: [props.node], columns: [column] });
    api.applyTransaction({ update: [data] });
    updateData(data);
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "delete":
        return (
          <div className="flex justify-center">
            <button
              onClick={() => handleDeleteRow(props.node.rowIndex)}
              className={
                api.getDisplayedRowCount() <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700 pt-3"
              }
              aria-label="Delete"
              disabled={api.getDisplayedRowCount() <= 1}
            >
              <FaTrash />
            </button>
            <CommonModal
              isDialogVisible={showConfirmDialog}
              handleOk={handleConfirmDelete}
              handleCancel={() => setShowConfirmDialog(false)}
              title="Reset Details"
              description="Are you sure you want to remove this entry?"
            />
          </div>
        );
      case "material":
      case "gstType":
        return (
          <Input
            readOnly
            value={value?.text}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      case "rate":
        return (
          <Input
            name={colDef.field}
            onChange={handleInputChange}
            value={value}
            type="number"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "orderQty":
        return (
          <Input
            name={colDef.field}
            onChange={handleInputChange}
            value={value}
            type="number"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "materialDescription":
      case "hsnCode":
      case "remark":
      case "localValue":
      case "cgst":
      case "sgst":
      case "igst":
      case "type":
      case "gstRate":
      case "dueDate":
        return (
          <Input
            readOnly
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%] text-slate-600 border-none shadow-none mt-[2px]"
          />
        );
      default:
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            placeholder={colDef.headerName}
            type="number"
            className="w-[100%] text-slate-600 border-slate-400 shadow-none mt-[2px]"
          />
        );
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default EwayBillCellRenderer;
