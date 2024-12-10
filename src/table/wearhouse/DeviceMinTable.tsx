import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { StatusPanelDef } from "@ag-grid-community/core";
import DeviceMinCellRener from "../Cellrenders/DeviceMinCellRener";
import { showToast } from "@/utils/toastUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { UpdateDEviceMin } from "@/features/wearhouse/Divicemin/devaiceMinSlice";
import { UpateMINpayload } from "@/features/wearhouse/Divicemin/DeviceMinType";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { CircularProgress, IconButton } from "@mui/material";
import { Icons } from "@/components/icons";

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
      minWidth: 270,
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
      pinned: "right",
      cellRenderer: (params: any) => {
        const dispatch = useAppDispatch();
        const { data, api, column } = params;
        const { storeSerialFiles, storeDraftMinData, updateMinLoading } = useAppSelector((state) => state.divicemin);
        return (
          <div key={data.id} className="flex items-center justify-center h-full gap-[10px]">
            {
              data?.isAvailble &&   <IconButton
              color="success"
              onClick={() => {
                if (!data.simAvailability) {
                  showToast({ title: "Please Select SIM Availability", variant: "destructive" });
                } else {
                  if (storeSerialFiles && storeDraftMinData) {
                    setId(data?.id);
                    const mindata: UpateMINpayload = {
                      simExist: data.simAvailability,
                      serial: data.serialno,
                      remark: data.remarks,
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
              disabled={updateMinLoading && id === data?.id}
            >
              {updateMinLoading && id === data?.id ? <CircularProgress size={23} /> : <Icons.check />}
            </IconButton>
            }
          
            <IconButton onClick={() => setRowdata(rowData.filter((item) => item.id !== data?.id))} color="error">
              <Icons.delete />
            </IconButton>
          </div>
        );
      },
      width: 120,
    },
  ];

  return (
    <div className=" ag-theme-quartz h-[calc(100vh-220px)]">
      <AgGridReact
        ref={gridRef}
        onCellFocused={(event: any) => {
          const { rowIndex, column } = event;
          const focusedCell = document.querySelector(`.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] input `) as HTMLInputElement;
          const focusButton = document.querySelector(`.ag-row[row-index="${rowIndex}"] .ag-cell[col-id="${column.colId}"] button `) as HTMLButtonElement;

          if (focusedCell) {
            focusedCell.focus();
          }
          if (focusButton) {
            focusButton.focus();
          }
        }}
        navigateToNextCell={() => {
          return null; // Returning null prevents default focus movement
        }}
        columnDefs={columnDefs}
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
