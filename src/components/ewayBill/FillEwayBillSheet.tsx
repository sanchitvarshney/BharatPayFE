import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RowData {
  txnId: string;
  sku: string;
  skuName: string;
  dispatchDate: string;
  dispatchQty: number;
  inserby: string;
  dispatchId: string;
}

interface EwayBillSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: RowData | null;
  onSubmit: () => void;
}

const FillEwayBillSheet: React.FC<EwayBillSheetProps> = ({
  open,
  onOpenChange,
  selectedRow,
  onSubmit,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Fillout Eway Bill Data - {selectedRow?.txnId}</SheetTitle>
        </SheetHeader>
        <div className="ag-theme-quartz h-[calc(100vh-200px)] grid grid-cols-4 gap-4">
          <div className="col-span-1 max-h-[calc(100vh-210px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-4 p-4">
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Dispatch Details
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <div className="grid grid-cols-[1fr_150px]">
                  <div>
                    <h3 className="font-[600]">SKU</h3>
                  </div>
                  <div>
                    <p className="text-[14px]">{selectedRow?.sku || "--"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_150px]">
                  <div>
                    <h3 className="font-[600]">SKU Name</h3>
                  </div>
                  <div>
                    <p className="text-[14px]">
                      {selectedRow?.skuName || "--"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_150px]">
                  <div>
                    <h3 className="font-[600]">Dispatch Date</h3>
                  </div>
                  <div>
                    <p className="text-[14px]">
                      {selectedRow?.dispatchDate || "--"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_150px]">
                  <div>
                    <h3 className="font-[600]">Quantity</h3>
                  </div>
                  <div>
                    <p className="text-[14px]">
                      {selectedRow?.dispatchQty || "--"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-3">
            {/* Add your form or additional content here */}
          </div>
        </div>
        <div className="bg-white border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px] text-white"
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
