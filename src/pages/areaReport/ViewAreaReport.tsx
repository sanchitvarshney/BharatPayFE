import React, { useEffect, useMemo, useState } from "react";
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as XLSX from "xlsx";

import { DatePicker } from "antd";
import { rangePresets } from "@/utils/rangePresets";
import dayjs from "dayjs";
import { PlaceType } from "@/features/areaSlice/areaType";
import { Edit } from "@mui/icons-material";
import EditWorkerDataModal from "./EditWorkerDataModal";
const { RangePicker } = DatePicker;
const CustomLoadingCellRenderer: React.FC = () => {
  return (
    <div className="loading-cell">
      <Skeleton className="h-[20px] w-full" />
    </div>
  );
};

const ViewAreaReport: React.FC = () => {
  const dispatch: any = useDispatch();
  const [updateData, setUpdateData] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const {
    placeList,
    placeLoading,
    departmentList,
    departmentLoading,
    workingData,
    workingDataLoading,
  } = useSelector((state: any) => state.placeMaster);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "#",
        field: "ID",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 100,
        cellRenderer: (params: any) => params.node.rowIndex + 1,
      },
      {
        headerName: "Full Name",
        field: "name",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
      {
        headerName: "Code",
        field: "code",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
      {
        headerName: "Place",
        field: "place",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
      {
        headerName: "Department",
        field: "department",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
      {
        headerName: "Insert Date",
        field: "date",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
       {
        headerName: "Date",
        field: "punchDate",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
      {
        headerName: "Start Time",
        field: "startTime",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
      {
        headerName: "End Time",
        field: "endTime",
        sortable: true,
        filter: true,
        minWidth: 200,
      },
      {
        headerName: "Action",
        field: "",
        sortable: true,
        filter: true,
        minWidth: 200,
        headerClass: "last-column ag-header-cell-center",
        cellStyle: { display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" },
        cellRenderer: (params: any) => (
          <IconButton
            onClick={() => {
              setUpdateData(params?.data ?? null);
              setEditModalOpen(true);
            }}
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      floatingFilter: true,
      cellStyle: { textAlign: "center" },
      headerClass: "ag-header-cell-center",
    };
  }, []);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    getValues,
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

  const isDownloadDisabled = workingDataLoading || !workingData?.length;

  const handleDownloadExcel = () => {
    if (isDownloadDisabled) return;
    const headers = [
      "#",
      "Full Name",
      "Code",
      "Place",
      "Department",
      "Insert Date",
      "Date",
      "Start Time",
      "End Time",
    ];
    const exportData = (workingData ?? []).map((row: any, index: number) => ({
      "#": index + 1,
      "Full Name": row?.name ?? "",
      "Code": row?.code ?? "",
      "Place": row?.place ?? "",
      "Department": row?.department ?? "",
      "Insert Date": row?.date ?? "",
      "Date": row?.punchDate ?? "",
      "Start Time": row?.startTime ?? "",
      "End Time": row?.endTime ?? "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Area Report");
    XLSX.writeFile(
      workbook,
      `AreaReport_${dayjs().format("DD-MM-YYYY_HH-mm")}.xlsx`
    );
    toast({
      description: "Report downloaded successfully",
      variant: "success",
      className: "font-[500]",
      duration: 1500,
    });
  };

  useEffect(() => {
    if (placeList.length === 0) {
      dispatch(getMasterPlace());
    }
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

  return (
    <div className="grid  w-full grid-cols-[1fr_2fr]  bg-white">
      <div className="w-full border-r border-neutral-300">
        <form onSubmit={handleSubmit(onSubmit)} className="p-[20px]">
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
              onClick={handleDownloadExcel}
              disabled={isDownloadDisabled}
              variant="contained"
              sx={{
                background: "white",
                color: "green",
                "&.Mui-disabled": { background: "#f5f5f5", color: "#9e9e9e" },
              }}
            >
              Download
            </Button>
            <Button
              onClick={() => reset()}
              variant="contained"
              sx={{ background: "white", color: "red" }}
            >
              Reset
            </Button>
            <LoadingButton
              loadingPosition="start"
              type="submit"
              variant="contained"
              loading={workingDataLoading}
            >
              Search
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

      <EditWorkerDataModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setUpdateData(null);
        }}
        data={updateData}
        onSuccess={() => {
          const values = getValues();
          if (values?.date?.[0] && values?.date?.[1] && values?.areaId && values?.departmentId) {
            dispatch(
              //@ts-ignore
              getWorkingData({
                from: dayjs(values.date[0]).format("DD-MM-YYYY"),
                to: dayjs(values.date[1]).format("DD-MM-YYYY"),
                place: values.areaId,
                department: values.departmentId,
              })
            );
          }
        }}
      />
    </div>
  );
};

export default ViewAreaReport;
