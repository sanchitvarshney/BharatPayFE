import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { AgGridReact } from "ag-grid-react";
import { columnDefs } from "@/constants/FilloutEwayBillDataColumns";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import EwayBillCellRenderer from "@/components/ewayBill/EwayBillCellRenderer";
import { fillEwayBillData } from "@/features/Dispatch/DispatchSlice";

interface RowData {
  txnId: string;
  sku: string;
  skuName: string;
  dispatchDate: string;
  dispatchQty: number;
  inserby: string;
  dispatchId: string;
  localValue: number;
  cgst:number;
  sgst:number;
  igst:number;
}

interface EwayBillSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: RowData | any;
}

const FillEwayBillSheet: React.FC<EwayBillSheetProps> = ({
  open,
  onOpenChange,
  selectedRow,
}) => {
  const { dispatchData, dispatchDataLoading } = useAppSelector(
    (state) => state.dispatch
  );
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [taxableValue, setTaxableValue] = useState<number>(0);
  const [totalCgst, setTotalCgst] = useState<number>(0);
  const [totalSgst, setTotalSgst] = useState<number>(0);
  const [totalIgst, setTotalIgst] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  console.log(selectedRow, dispatchDataLoading);
  useEffect(() => {
    const updatedData: RowData[] = dispatchData?.data?.map((material: any) => ({
      material: material.item_name || "",
      orderQty: material.item_qty || 0,
      hsnCode: material.item_hsncode || "",
      isNew: true,
    }));
    setRowData(updatedData);
  }, [dispatchData?.data]);

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <EwayBillCellRenderer {...props} setRowData={setRowData} />
      ),
    }),
    []
  );
  const onSubmit = () => {
    console.log(rowData);
    dispatch(
      fillEwayBillData({
        txnId: selectedRow?.txnId,
        data: rowData,
      })
    );
  };
  console.log(rowData);
  useEffect(() => {
    const interval = setInterval(() => {
      const taxableValue = Number(
        rowData
          .reduce((acc, curr) => acc + (Number(curr.localValue) || 0), 0)
          .toFixed(2)
      );
      setTaxableValue(taxableValue);
      const totalCgst = Number(
        rowData
          .reduce((acc, curr) => acc + (Number(curr.cgst) || 0), 0)
          .toFixed(2)
      );
      setTotalCgst(totalCgst);
      const totalSgst = Number(
        rowData
          .reduce((acc, curr) => acc + (Number(curr.sgst) || 0), 0)
          .toFixed(2)
      );
      setTotalSgst(totalSgst);
      const totalIgst = Number(
        rowData
          .reduce((acc, curr) => acc + (Number(curr.igst) || 0), 0)
          .toFixed(2)
      );
      setTotalIgst(totalIgst);
      const totalTax = Number(
        (taxableValue + totalCgst + totalSgst + totalIgst).toFixed(2)
      );
      setTotalTax(totalTax);
    }, 5000);
    return () => clearInterval(interval);
  }, [rowData]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[95vh]">
        <SheetHeader className="pb-4">
          <SheetTitle>Fillout Eway Bill Data - {selectedRow?.txnId}</SheetTitle>
        </SheetHeader>
        <div className="ag-theme-quartz h-[calc(100vh-160px)] grid grid-cols-4 gap-4">
          <div className="col-span-1 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-4 p-4">
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Bill To Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Client</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.billTo?.legalName || "--"}
                </p>
                <h3 className="font-[600]">State</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.billTo?.location || "--"}
                </p>
                <h3 className="font-[600]">GSTIN</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.billTo?.gstin || "--"}
                </p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.billTo?.addressLine1 || ""}{" "}
                  {dispatchData?.header?.[0]?.billTo?.addressLine2 || "--"}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Ship To
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Name</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.shipTo?.legalName}
                </p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.shipTo?.addressLine1}{" "}
                  {dispatchData?.header?.[0]?.shipTo?.addressLine2}{" "}
                  {dispatchData?.header?.[0]?.shipTo?.state?.name}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {dispatchData?.header?.[0]?.shipTo?.pincode}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {dispatchData?.header?.[0]?.shipTo?.gstin}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-sm shadow-sm shadow-slate-600">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Bill From
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-500">
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.billFrom?.addressLine1 || ""}{" "}
                  {dispatchData?.header?.[0]?.billFrom?.addressLine2}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {dispatchData?.header?.[0]?.billFrom?.pincode || "--"}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {dispatchData?.header?.[0]?.billFrom?.gstin}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-600">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Dispatch From
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-500">
                <h3 className="font-[600]">Legal Name</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.dispatchFrom?.legalName || ""}
                </p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {dispatchData?.header?.[0]?.dispatchFrom?.addressLine1 || ""}{" "}
                  {dispatchData?.header?.[0]?.dispatchFrom?.addressLine2}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {dispatchData?.header?.[0]?.dispatchFrom?.pincode ||
                          "--"}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">Location</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {dispatchData?.header?.[0]?.dispatchFrom?.location}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {dispatchData?.header?.[0]?.dispatchFrom?.pincode}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-600">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Tax Details
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-500">
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">Taxable Value</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{taxableValue}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">Total CGST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{totalCgst}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">Total SGST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{totalSgst}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">Total IGST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{totalIgst}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4 gap-2">
                    <div>
                      <h3 className="font-[600]">Total Value after Taxes</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{totalTax}</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-3">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
              suppressCellFocus={true}
              components={components}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
            />
          </div>
        </div>
        <div className="bg-white border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px] text-white "
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FillEwayBillSheet;
