import React, { useEffect, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Skeleton } from "@/components/ui/skeleton";
import { OverlayNoRowsTemplate } from "@/components/reusable/OverlayNoRowsTemplate";
import CustomLoadingOverlay from "@/components/reusable/CustomLoadingOverlay";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepartment,
  getMasterPlace,
  getWorkingData,
} from "@/features/areaSlice/areaSlice";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import { DatePicker } from "antd";
import { rangePresets } from "@/utils/rangePresets";
import dayjs from "dayjs";
import { PlaceType } from "@/features/areaSlice/areaType";
const { RangePicker } = DatePicker;
const CustomLoadingCellRenderer: React.FC = () => {
  return (
    <div className="loading-cell">
      <Skeleton className="h-[20px] w-full" />
    </div>
  );
};

const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "ID",
    sortable: true,
    filter: true,
    flex: 1,
    cellRenderer: (params:any) => params.node.rowIndex + 1,
  },
    {
    headerName: "Code",
    field: "code",
    sortable: true,
    filter: true,
    flex: 1,
  },
  {
    headerName: "Place",
    field: "place",
    sortable: true,
    filter: true,
    flex: 1,
  },
  {
    headerName: "Department",
    field: "department",
    sortable: true,
    filter: true,
    flex: 1,
  },
  {
    headerName: "Date",
    field: "date",
    sortable: true,
    filter: true,
    flex: 1,
  },
];

const ViewAreaReport: React.FC = () => {
  const dispatch: any = useDispatch();
  const { placeList, placeLoading, departmentList, departmentLoading,workingData, workingDataLoading } =
    useSelector((state: any) => state.placeMaster);


  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      areaId: "",
      departmentId: "",
      date: null,
    },
  });

  const onSubmit = (data: any) => {
    const payload: any = {
      from: dayjs(data?.date[0]).format("DD-MM-YYYY"),
      to: dayjs(data?.date[1]).format("DD-MM-YYYY"),
      department: data?.departmentId,
      place: data?.areaId,
    };

    //@ts-ignore
    dispatch(getWorkingData(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
      

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
  const selectedAreaId = watch("areaId");

  useEffect(() => {
    dispatch(getMasterPlace());
  }, []);

  const fetchDepartments = async (areaId: string) => {
    const payload: any = {
      place: areaId,
    };
    //@ts-ignore
    dispatch(getDepartment(payload));
  };

  useEffect(() => {
    if (selectedAreaId) {
      fetchDepartments(selectedAreaId);
    }
  }, [selectedAreaId]);

  console.log("working data", workingData)

  return (
    <div className="grid  w-full grid-cols-[1fr_2fr]  bg-white">
      <div className="w-full border-r border-neutral-300">
        <form onSubmit={handleSubmit(onSubmit)} className="p-[30px]">
          <div className="py-[20px] flex flex-col gap-[30px]">
            <div>
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
            <div className="flex flex-col gap-[10px]">
              <div>
                <Controller
                  name="areaId"
                  control={control}
                  rules={{ required: "Area is required" }}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      disabled={placeLoading}
                    >
                      <InputLabel id="area-select-label">
                        Select Place
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="area-select-label"
                        label="Select Area"
                      >
                        {placeLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            <span style={{ marginLeft: 8 }}>Loading...</span>
                          </MenuItem>
                        ) : (
                          placeList?.map((item: PlaceType) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.text}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div>
                <Controller
                  name="departmentId"
                  control={control}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      disabled={!selectedAreaId || departmentLoading}
                    >
                      <InputLabel id="department-select-label">
                        Select Department
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="department-select-label"
                        label="Select Department"
                      >
                        {departmentLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            <span style={{ marginLeft: 8 }}>Loading...</span>
                          </MenuItem>
                        ) : (
                          departmentList?.map((item: any) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.text}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="h-[50px] p-0 flex items-center px-[20px] gap-[10px] justify-end">
            <Button
              startIcon={<RefreshIcon fontSize="small" />}
              onClick={() => reset()}
              variant="contained"
              sx={{ background: "white", color: "red" }}
            >
              Reset
            </Button>
            <LoadingButton
              startIcon={<SaveIcon fontSize="small" />}
              loadingPosition="start"
              type="submit"
              variant="contained"
              loading={workingDataLoading}
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingOverlayComponent={CustomLoadingOverlay}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          rowData={workingData ?? []}
          loading={workingDataLoading}
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

export default ViewAreaReport;
