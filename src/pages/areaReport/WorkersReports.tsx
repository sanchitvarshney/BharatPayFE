import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import { toast } from "@/components/ui/use-toast";
import { getWorkerReport } from "@/features/areaSlice/areaSlice";
import { rangePresets } from "@/utils/rangePresets";
import { LoadingButton, Skeleton } from "@mui/lab";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const { RangePicker } = DatePicker;

const CustomLoadingCellRenderer: React.FC = () => {
  return (
    <div className="loading-cell">
      <Skeleton className="h-[20px] w-full" />
    </div>
  );
};


const WR_GROUP_0 = "wr-group-0"; 
const WR_GROUP_1 = "wr-group-1"; 
const WR_GROUP_2 = "wr-group-2"; 
const WR_GROUP_3 = "wr-group-3"; 
const WR_GROUP_4 = "wr-group-4"; 
const WR_GROUP_5 = "wr-group-5"; 
const WR_GROUP_6 = "wr-group-6"; 


const WR_LAST_0 = "wr-last-0";
const WR_LAST_1 = "wr-last-1";
const WR_LAST_2 = "wr-last-2";
const WR_LAST_3 = "wr-last-3";
const WR_LAST_4 = "wr-last-4";
const WR_LAST_5 = "wr-last-5";
const WR_LAST_6 = "wr-last-6";

const columnDefs: any[] = [
  {
    headerName: "Date",
    field: "date",
    minWidth: 150,
    flex: 1,
    headerClass: `${WR_GROUP_0} ${WR_LAST_0}`,
    cellClass: WR_LAST_0,
  },
  {
    headerName: "Swipe (Production / Sales) Cost",
    headerClass: `${WR_GROUP_1} ${WR_LAST_1}`,
    children: [
      { headerName: "P12", field: "swipe_p12", headerClass: WR_GROUP_1, minWidth: 150 , maxWidth: 150 },
      { headerName: "P10", field: "swipe_p10", headerClass: WR_GROUP_1,  minWidth: 150 , maxWidth: 150 },
      { headerName: "G2 4G", field: "swipe_g24g", headerClass: WR_GROUP_1,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Ingenico", field: "swipe_ingenico", headerClass: WR_GROUP_1,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Assembly", field: "swipe_assembly", headerClass: WR_GROUP_1,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Store + Admin", field: "swipe_storeAdmin", headerClass: WR_GROUP_1,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Cost", field: "swipe_cost", headerClass: WR_GROUP_1,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Profit / Loss", field: "swipe_profitLoss", headerClass: `${WR_GROUP_1} ${WR_LAST_1}`, cellClass: WR_LAST_1,  minWidth: 150 , maxWidth: 150 },
    ],
 
  },
  {
    headerName: "Sound Box (Production / Sales) Cost",
    headerClass: `${WR_GROUP_2} ${WR_LAST_2}`,
    field: "",
    children: [
      { headerName: "Production", field: "soundbox_production", headerClass: WR_GROUP_2,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Assembly / Cost", field: "soundbox_assemblycost", headerClass: WR_GROUP_2,  minWidth: 150 , maxWidth: 150 },
      { headerName: "TRC", field: "soundbox_trc", headerClass: WR_GROUP_2,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Store + Admin", field: "soundbox_storeAdmin", headerClass: WR_GROUP_2 ,  minWidth: 150 , maxWidth: 150},
      { headerName: "Total Cost", field: "soundbox_totalcost", headerClass: WR_GROUP_2,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Profit / Loss", field: "soundbox_profitLoss", headerClass: `${WR_GROUP_2} ${WR_LAST_2}`, cellClass: WR_LAST_2,  minWidth: 150 , maxWidth: 150 },
    ],
 
  },
  {
    headerName: "Cleaning Production",
    headerClass: `${WR_GROUP_3} ${WR_LAST_3}`,
    field: "",
    children: [
      { headerName: "Production", field: "cleaning_production", headerClass: WR_GROUP_3,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Cost", field: "cleaning_cost", headerClass: WR_GROUP_3,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Profit / Loss", field: "cleaning_profitLoss", headerClass: `${WR_GROUP_3} ${WR_LAST_3}`, cellClass: WR_LAST_3,  minWidth: 150 , maxWidth: 150 },
    ],
  
  },
  {
    headerName: "Pre QC Sound Box",
    headerClass: `${WR_GROUP_4} ${WR_LAST_4}`,
    field: "",
    children: [
      { headerName: "Production", field: "preqc_production", headerClass: WR_GROUP_4,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Cost", field: "preqc_cost", headerClass: WR_GROUP_4,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Profit / Loss", field: "preqc_production", headerClass: `${WR_GROUP_4} ${WR_LAST_4}`, cellClass: WR_LAST_4,  minWidth: 150 , maxWidth: 150 },
    ],
   
  },
  {
    headerName: "G. Total",
    headerClass: `${WR_GROUP_5} ${WR_LAST_5}`,
    field: "",
    children: [
      { headerName: "Production", field: "gtotal_production", headerClass: WR_GROUP_5,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Cost", field: "gtotal_cost", headerClass: WR_GROUP_5,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Contribution Cost", field: "gtotal_contribution", headerClass: WR_GROUP_5 ,  minWidth: 150 , maxWidth: 150},
      { headerName: "Difference", field: "gtotal_difference", headerClass: `${WR_GROUP_5} ${WR_LAST_5}`, cellClass: WR_LAST_5,  minWidth: 150 , maxWidth: 150 },
    ],
  
  },
  {
    headerName: "Contribution Cost",
    headerClass: `${WR_GROUP_6} ${WR_LAST_6}`,
    field: "",
    children: [
      { headerName: "Staff Cost", field: "contribution_staff", headerClass: WR_GROUP_6,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Depreciation", field: "contribution_depreciation", headerClass: WR_GROUP_6,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Consumable", field: "contribution_consumable", headerClass: WR_GROUP_6 ,  minWidth: 150 , maxWidth: 150},
      { headerName: "Other", field: "contribution_other", headerClass: WR_GROUP_6,  minWidth: 150 , maxWidth: 150 },
      { headerName: "Total", field: "contribution_total", headerClass: `${WR_GROUP_6} ${WR_LAST_6}`, cellClass: WR_LAST_6 ,  minWidth: 150 , maxWidth: 150},
    ],

  },
];

const WorkersReports = () => {
  const gridRef = useRef(null);
  const dispatch: any = useDispatch();
  const {
    workerReports,

    isReportLoading,
  } = useSelector((state: any) => state.placeMaster);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,

      resizable: true,
      cellRenderer: (params: any) => {
        return params.value === null || params.value === undefined
          ? 0
          : params.value;
      },
      cellStyle: { textAlign: "center" },
    };
  }, []);
  const sideBar = useMemo(
    () => ({
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressPivotMode: true,
            suppressPivots: true,
          },
        },
      ],
      defaultToolPanel: "",
    }),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      date: null,
    },
  });

  const onSubmit = (data: any) => {
    const payload: any = {
      from: dayjs(data?.date[0]).format("DD-MM-YYYY"),
      to: dayjs(data?.date[1]).format("DD-MM-YYYY"),
    };

    //@ts-ignore
    dispatch(getWorkerReport(payload)).then((res: any) => {
      if (res.payload?.data?.status) {
        toast({
          description: res.payload.data.message,
          variant: "success",
          className: "font-[500]",
          duration: 1500,
        });
      } else {
        toast({
          description: res.payload?.data?.message || "Something went wrong",
          variant: "destructive",
          className: "font-[500]",
          duration: 1500,
        });
      }
    });
  };

  return (
    <div className="grid  w-full grid-cols-[1fr_3fr]  bg-white">
      <div className="w-full border-r border-neutral-300">
        <form onSubmit={handleSubmit(onSubmit)} className="p-[10px]">
          <div className="py-[0px] flex flex-col gap-[0px]">
            <div>
              <label className="text-[14px] font-[500] text-slate-600 ">
                Select Date Range
              </label>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: "Date range is required",
                }}
                render={({ field }) => (
                  <RangePicker
                    {...field}
                    placement="bottomRight"
                    className="w-full h-[50px]"
                    format="DD-MM-YYYY"
                    placeholder={["Start date", "End date"]}
                    value={field.value}
                    onChange={(dates) => field.onChange(dates)}
                    presets={rangePresets}
                  />
                )}
              />
              {errors.date && (
                <span className=" text-[12px] text-red-500">
                  {/* @ts-ignore */}
                  {errors.date.message}
                </span>
              )}
            </div>
          </div>
          <div className="h-[50px] p-0 flex items-center px-[20px] gap-[10px] justify-end">
            <LoadingButton
              loadingPosition="start"
              type="submit"
              variant="contained"
              disabled={isReportLoading}
            >
              Search
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="ag-theme-quartz workers-report-grid h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          suppressMenuHide={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          rowData={workerReports ?? []}
          loading={isReportLoading}
          sideBar={sideBar}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={50}
          components={{
            customLoadingCellRenderer: CustomLoadingCellRenderer,
          }}
          loadingCellRenderer="customLoadingCellRenderer"
        />
      </div>
    </div>
  );
};

export default WorkersReports;
