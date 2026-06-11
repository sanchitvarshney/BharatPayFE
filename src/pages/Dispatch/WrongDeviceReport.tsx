import React, { useCallback, useRef, useState } from "react";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "@ag-grid-community/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utils/toasterContext";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { rangePresets } from "@/utils/rangePresets";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import MuiTooltip from "@/components/reusable/MuiTooltip";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { getWrongDeviceReport } from "@/features/Dispatch/DispatchSlice";
import { useSelector } from "react-redux";


dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

const R5Report: React.FC = () => {
  const [colapse, setcolapse] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { wrongDeviceList, wrongDeviceLoading } = useSelector(
     (state: any) => state.dispatch,
   );


  const [date, setDate] = useState<{ from: Dayjs | null; to: Dayjs | null }>({
    from: null,
    to: null,
  });

  const gridRef = useRef<AgGridReact<any>>(null);

  const handleDateChange = (range: [Dayjs | null, Dayjs | null] | null) => {
    if (range) {
      setDate({ from: range[0], to: range[1] });
    } else {
      setDate({ from: null, to: null });
    }
  };

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({
      sheetName: "R5 Report", // Set your desired sheet name here
    });
  }, []);




  const handleSearch = () => {

  
      if (!date.from || !date.to) {
        showToast("Please select a date", "error");
      }
        dispatch(
       getWrongDeviceReport({
         fromDate: dayjs(date.from).format("YYYY-MM-DD 00:00:00"),
         toDate: dayjs(date.to).format("YYYY-MM-DD 23:59:59"),
       })
        )

  };
   const columnDefs: any[] = [
      {
        headerName: "#",
        field: "id",
        sortable: true,
        filter: true,
        width: 100,
        valueGetter: "node.rowIndex+1",
      },
  
      { headerName: "AWB", field: "devAwb", sortable: true, filter: true, flex: 1 },
      {
        headerName: "Device Type",
        field: "devType",
        sortable: true,
        filter: true,
        flex: 1,
      },
      {
        headerName: "Partner",
        field: "devPartner",
        sortable: true,
        filter: true,
        flex: 1,
      },
  {
      headerName: "Insert Date",
        field: "create_time",
        sortable: true,
        filter: true,
        flex: 1,
        cellRenderer: (params: any) => {
          const formattedDate = dayjs(params.data?.create_time).format("DD-MM-YYYY");
          return <div>{formattedDate}</div>;
        }
  },
      {
        headerName: "Insert By",
        field: "user_name",
        sortable: true,
        filter: true,
        flex: 1,
      },
   {
  headerName: "Action",
  field: "action",
  sortable: true,
  filter: true,
  flex: 1,
  cellRenderer: (params: any) => (
    <div className="flex gap-[10px] items-center">
      <Button
        variant="secondary"
       
        onClick={() => {
          if (params.data.devVedio) {
            window.open(params.data.devVedio, "_blank", "noopener,noreferrer");
          }
        }}
      >
        <Icons.view />
        <span className="ml-1">View Video</span>
      </Button>
    </div>
  ),
}
    
   
    ]
  
  return (
  
      <div className="bg-white h-[calc(100vh-100px)] flex relative">
        <div
          className={`transition-all flex flex-col gap-[10px] h-[calc(100vh-100px)]  border-r border-neutral-300   ${
            colapse ? "min-w-0 max-w-0" : "min-w-[400px] max-w-[400px] "
          }`}
        >
          <div
            className={`transition-all ${
              colapse ? "left-0" : "left-[400px]"
            } w-[16px] p-0  h-full top-0 bottom-0 absolute rounded-none  text-slate-600 z-[10] flex items-center justify-center`}
          >
            <Button
              onClick={() => setcolapse(!colapse)}
              className={`transition-all w-[16px] p-0 py-[35px] bg-neutral-200  rounded-none hover:bg-neutral-300/50 text-slate-600 hover:h-full shadow-sm shadow-neutral-400 duration-300   `}
            >
              {colapse ? (
                <Icons.right fontSize="small" />
              ) : (
                <Icons.left fontSize="small" />
              )}
            </Button>
          </div>
          <div className="flex  gap-[20px] flex-col   p-[20px] overflow-hidden mt-[20px]">

              <RangePicker
                className="w-full h-[55px] border-2 border-neutral-300 rounded-0 "
                presets={rangePresets}
                onChange={handleDateChange}
                disabledDate={(current) => current && current > dayjs()}
                placeholder={["Start date", "End Date"]}
                value={date.from && date.to ? [date.from, date.to] : null}
                format="DD/MM/YYYY"
              />
     
            <div className="flex justify-between itesms-center">
              <div className="flex gap-[10px]">
                <LoadingButton
                  loading={wrongDeviceLoading}
                  variant="contained"
                  startIcon={<Icons.search fontSize="small" />}
                  loadingPosition="start"
                  onClick={handleSearch}
                >
                  Search
                </LoadingButton>
             
              </div>
              <MuiTooltip title="Download" placement="right">
                <LoadingButton
                  variant="contained"
                  disabled={wrongDeviceList?.length === 0 || !wrongDeviceList}
                  onClick={onBtExport}
                  color="primary"
                  style={{
                    borderRadius: "50%",
                    width: 30,
                    height: 30,
                    minWidth: 0,
                    padding: 0,
                  }}
                  size="small"
                  sx={{ zIndex: 1 }}
                >
                  <Icons.download fontSize="small" />
                </LoadingButton>
              </MuiTooltip>
            </div>
          </div>
        </div>
        <div className="w-full relative ag-theme-quartz h-[calc(100vh-105px)] ">
         <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          loading={false}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          rowData={ wrongDeviceList || []}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={100}
          enableCellTextSelection
        />
        </div>
      </div>

  );
};

export default R5Report;
