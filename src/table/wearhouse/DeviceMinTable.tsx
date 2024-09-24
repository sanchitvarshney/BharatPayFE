import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { StatusPanelDef } from "@ag-grid-community/core";
import DeviceMinCellRener from "../Cellrenders/DeviceMinCellRener";
import { Button } from "@/components/ui/button";
import { IoMdCheckmark } from "react-icons/io";
import { showToast } from "@/utils/toastUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { UpdateDEviceMin } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { UpateMINpayload } from "@/features/wearhouse/Divicemin/DeviceMinType";
import { CustomButton } from "@/components/reusable/CustomButton";
import { HiMiniTrash } from "react-icons/hi2";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { CgSpinner } from "react-icons/cg";

interface RowData {
  remarks: string;
  isNew?: boolean;
  id: number;
  simAvailability: string;
  IMEI: string;
  model: string;
  serialno: string;
  isAvailble: boolean;
}

type Props = {
  rowData: RowData[];
  setRowdata: React.Dispatch<React.SetStateAction<RowData[]>>;
};
const DeviceMinTable: React.FC<Props> = ({ rowData, setRowdata }) => {
  const [id, setId] = useState<string>("");
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const getAllTableData = () => {
    const allData: RowData[] = [];

    const rowCount = gridRef.current?.api.getDisplayedRowCount() ?? 0;
    for (let i = 0; i < rowCount; i++) {
      const rowNode = gridRef.current?.api.getDisplayedRowAtIndex(i);

      if (rowNode && rowNode.data) {
        allData.push(rowNode.data);
      }
    }
    setRowdata(allData);
  };

  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        { statusPanel: "agFilteredRowCountComponent", align: "right" },
        { statusPanel: "agSelectedRowCountComponent", align: "right" },
        { statusPanel: "agAggregationComponent", align: "right" },
      ],
    };
  }, []);

  const components = useMemo(
    () => ({
      textInputCellRenderer: (params: any) => <DeviceMinCellRener props={params} customFunction={getAllTableData} />,
    }),
    []
  );
  const columnDefs: ColDef[] = [
    {
      headerName: "#",
      field: "id",
      width: 60,
    },
    {
      headerName: "Serial No.",
      field: "serialno",
      minWidth: 200,
    },
    {
      headerName: "IMEI",
      field: "IMEI",
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Model",
      field: "model",
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "SIM Availability",
      field: "simAvailability",
      cellRenderer: "textInputCellRenderer",
    },
    {
      headerName: "Remarks",
      field: "remarks",
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "isAvailble",
      field: "isAvailble",
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
      hide: true,
    },
    {
      headerName: "",
      field: "isNew",
      cellRenderer: (params: any) => {
        const dispatch = useAppDispatch();
        const { value, data, api, column } = params;
        const { storeSerialFiles, storeDraftMinData, updateMinLoading } = useAppSelector((state) => state.divicemin);
        return (
          <div key={data.id} className="flex items-center justify-center h-full gap-[10px]">
            <CustomButton
              onClick={() => {
                if (!data.simAvailability) {
                  showToast({ title: "Please Select SIM Availability", variant: "destructive" });
                } else {
                  if (storeSerialFiles && storeDraftMinData) {
                    setId(data?.id);
                    const mindata: UpateMINpayload = {
                      simExist: data.simAvailability,
                      serial: data.serialno,
                      remarks: data.remarks,
                      fileReference: storeSerialFiles?.fileReference,
                      min_no: storeDraftMinData?.min_no,
                      IMEI: data.IMEI,
                      deviceModel: data.model,
                    };
                    dispatch(UpdateDEviceMin(mindata)).then((res: any) => {
                      setId("");
                      if (res.payload.data?.success) {
                        data["isNew"] = false;
                        api.refreshCells({ rowNodes: [params.node], columns: [column, "isNew", "action", "simAvailability", "serialno", "remarks", "id"] });
                        setRowdata(rowData.filter((item) => item.isNew === true));
                        api.refreshCells({ rowNodes: [params.node], columns: [column, "isNew", "action", "simAvailability", "serialno", "remarks", "id"] });
                      }
                    });
                  } else {
                    showToast({ description: "Please Complete First Step because you have lost you reference no or reference file", variant: "destructive" });
                  }
                }
              }}
              className={`w-[30px] h-[30px] bg-white text-slate-600 hover:bg-white hover:text-slate-600 p-0 ${!value ? "bg-green-500 text-white hover:bg-green-500 hover:text-white" : "text-slate-600"}`}
            >
              {updateMinLoading && id === data?.id ? <CgSpinner className="w-[20px] h-[20px] animate-spin text-slate-400" /> : <IoMdCheckmark />}
            </CustomButton>
            <Button onClick={() => setRowdata(rowData.filter((item) => item.id !== data?.id))} className="w-[30px] h-[30px] p-0 text-slate-600" variant={"outline"}>
              <HiMiniTrash className="h-[20px] w-[20px] text-red-500 cursor-pointer" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-270px)]">
      <AgGridReact
        ref={gridRef}
        suppressCellFocus={true}
        columnDefs={columnDefs}
        suppressRowClickSelection={false}
        overlayNoRowsTemplate={OverlayNoRowsTemplate}
        rowData={rowData}
        animateRows
        statusBar={statusBar}
        components={components}
        defaultColDef={{
          resizable: true,
          suppressCellFlash: true,
          editable: false,
        }}
        onCellKeyDown={(e) => e.event?.preventDefault()}
      />
    </div>
  );
};

export default DeviceMinTable;
