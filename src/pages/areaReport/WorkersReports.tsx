import CustomLoadingOverlay from '@/components/reusable/CustomLoadingOverlay';
import { OverlayNoRowsTemplate } from '@/components/reusable/OverlayNoRowsTemplate';
import { toast } from '@/components/ui/use-toast';
import { getWorkerReport } from '@/features/areaSlice/areaSlice';
import { rangePresets } from '@/utils/rangePresets';
import { LoadingButton, Skeleton } from '@mui/lab';
import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, {  useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const { RangePicker } = DatePicker;

const CustomLoadingCellRenderer: React.FC = () => {
  return (
    <div className="loading-cell">
      <Skeleton className="h-[20px] w-full" />
    </div>
  );
};

const columnDefs: any[] = [
  {
    headerName: "Date",
    field: "date",
    minWidth: 200,
  
    flex: 1,
  },
  {
    headerName: "Swipe (Production / Sales) Cost",
     children: [
      {
        headerName: "P12",
        field: "swipe_p12",
      
      }, {
        headerName: "P10",
        field: "swipe_p10"
      }, {
        headerName: "G2 4G",
        field: "swipe_g24g"
      }, {
        headerName: "Ingenico",
        field: "swipe_ingenico"
      }, {
        headerName: "Assembly",
        field: "swipe_assembly"
      }, {
        headerName: "Store + Admin",
        field: "swipe_storeAdmin"
      },
      {
        headerName: "Cost",
        field: "swipe_cost"
      }, {
        headerName: "Profit / Loss",
        field: "swipe_profitLoss"
      }
    ],
   
 
    minWidth: 200,
  },
  {
    headerName: "Sound Box (Production / Sales) Cost",
      children: [
      {
        headerName: "Production",
        field: "soundbox_production"
      },  {
        headerName: "Assembly / Cost",
        field: "soundbox_assemblycost"
      },{
        headerName: "TRC",
        field: "soundbox_trc"
      }, {
        headerName: "Store + Admin",
        field: "soundbox_storeAdmin"
      },
      {
        headerName: "Total Cost",
        field: "soundbox_totalcost"
      }, {
        headerName: "Profit / Loss",
        field: "soundbox_profitLoss"
      }
    ],
    field: "",
 
    minWidth: 200,
  },
  {
    headerName: "Cleaning Production",
     children: [
      {
        headerName: "Production",
        field: "cleaning_production"
      }, 
      {
        headerName: "Cost",
        field: "cleaning_cost"
      }, {
        headerName: "Profit / Loss",
        field: "cleaning_profitLoss"
      }
    ],
    field: "",
 
    minWidth: 200,
  },
  {
    headerName: "Pre QC Sound Box",
    children: [
      {
        headerName: "Production",
        field: "preqc_production"
      }, 
      {
        headerName: "Cost",
        field: "preqc_cost"
      }, {
        headerName: "Profit / Loss",
        field: "preqc_production"
      }
    ],
    field: "",
 
    minWidth: 200,
  },
  {
    headerName: "G. Total",
    children: [
      {
        headerName: "Production",
        field: "gtotal_production"
      }, 
      {
        headerName: "Cost",
        field: "gtotal_cost"
      },   {
        headerName: "Contribution Cost",
        field: "gtotal_contribution"
      },{
        headerName: "Difference",
        field: "gtotal_difference"
      }
    ],
    field: "",
 
    minWidth: 200,
  },
  {
    headerName: "Contribution Cost",
    children: [
      {
        headerName: "Staff Cost",
        field: "contribution_staff"
      }, 
      {
        headerName: "Depreciation",
        field: "contribution_depreciation"
      }, {
        headerName: "Consumable",
        field: "contribution_consumable"
      }, {
        headerName: "Other",
        field: "contribution_other"
      }, {
        headerName: "Total",
        field: "contribution_total"
      }
    ],
    field: "",
 
    minWidth: 200,
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
        return params.value === null || params.value === undefined ? 0 : params.value;
      },
      cellStyle: { textAlign: 'center' },
    };
  }, []);
  //   const sideBar = useMemo(() => {
  //   return {
  //     toolPanels: ["columns", "filters"],
  //     defaultToolPanel: "columns",
  //   };
  // }, []);

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
              <label className="text-[14px] font-[500] text-slate-600 ">Select Date Range</label>
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
             
              disabled={isReportLoading }

            >
              Search
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          rowData={workerReports ?? []}
          loading={isReportLoading}
           sideBar={"columns"}
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
  )
}

export default WorkersReports